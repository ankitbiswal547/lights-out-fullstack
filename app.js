if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const flash = require("connect-flash");
const session = require("express-session");
const MongoDBStore = require('connect-mongo')(session);
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/lightsout';
// 
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
    })
    .catch(e => {
        console.log(e);
    })


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '/views'));

const store = new MongoDBStore({
    url: dbUrl,
    secret: "keyboard dog",
    touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
    console.log(e);
})

const sessionConfig = {
    store,
    secret: 'keyboard dog',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.messages = req.flash("info");
    next();
})

app.get('/', (req, res) => {
    res.render("home.ejs");
})

app.get('/playground', (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('info', "You must be signed in to play!!!");
        return res.redirect('/login');
    }
    res.render("playground");
})

app.get('/login', (req, res) => {
    res.render("login");
})

app.get('/signup', (req, res) => {
    res.render("signup");
})

app.post('/signup', async (req, res) => {
    try {
        const { username, fullname, password, email } = req.body;
        const images = ["https://res.cloudinary.com/ankitcloudinary/image/upload/v1647787217/lights%20out/avatar2_xk8ikz.webp", "https://res.cloudinary.com/ankitcloudinary/image/upload/v1647787217/lights%20out/avatar_unmgy1.webp", "https://res.cloudinary.com/ankitcloudinary/image/upload/v1647787217/lights%20out/avatar3_stqbsw.webp", "https://res.cloudinary.com/ankitcloudinary/image/upload/v1647787217/lights%20out/avatar1_axkkg5.webp", "https://res.cloudinary.com/ankitcloudinary/image/upload/v1647787217/lights%20out/avatar4_dkrgtc.webp"]

        const user = new User({
            email,
            username,
            fullname,
            level: "Newbie",
            totalPoints: 0,
            matchesCompleted: 0,
            averagePoints: 0,
            image: images[Math.floor(Math.random() * 5)]
        })

        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                // req.flash('info', "You must be signed in to play");
                return res.redirect('/');
            }
        })
        return res.redirect('/');
    } catch (e) {
        req.flash('info', e.message);
        return res.redirect('/signup');
    }
})

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async (req, res) => {
    req.flash('info', "Welcome Back!!!");
    res.redirect('/');
})

app.get('/logout', (req, res) => {
    req.logout();
    req.flash('info', "Successfully logged out!!");
    res.redirect('/');
})

app.get("/youwon", (req, res) => {
    res.render("youwon");
})

app.post("/gamewon", async (req, res) => {
    if (!req.isAuthenticated()) {
        const redir = { redirect: "/login" };
        return res.json(redir);
    }
    const { counter, points } = req.body.user;
    const user = await User.findById(req.user._id);
    user.totalPoints += points;
    user.matchesCompleted += 1;
    user.averagePoints = (user.totalPoints / user.matchesCompleted).toFixed(2);

    if (user.totalPoints <= 100) user.level = "Newbie";
    else if (user.totalPoints > 100 && user.totalPoints <= 300) user.level = "Skillful";
    else if (user.totalPoints > 300 && user.totalPoints <= 500) user.level = "Proficient";
    else if (user.totalPoints > 500 && user.totalPoints <= 700) user.level = "Experienced";
    else if (user.totalPoints > 700 && user.totalPoints <= 900) user.level = "Advanced";
    else if (user.totalPoints > 900) user.level = "Expert";

    const savedUser = await user.save();
    const redir = { redirect: "/youwon" };
    return res.json(redir);
})

app.get('/all-players', async (req, res) => {
    try {
        const users = await User.find({});
        res.render("allplayers", { users });
    } catch (e) {
        res.redirect('/');
    }
})

app.get('/guest-user', (req, res) => {
    res.render("guestlogin");
})

app.use((req, res, next) => {
    res.render("pagenotfound");
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`App started at port ${port}`);
})
