let counter = 0;
let minMoves = 0;
let points = 0;
let counterSpan = document.getElementById("counter-div");
const myfunction = (row, col) => {
    counter++;
    counterSpan.textContent = `${counter}`;
    let id = `${row}-${col}`;
    document.getElementById(id).classList.toggle("active-cell");

    let left = false, right = false, top = false, bottom = false;

    if (col != 1) left = true;
    if (col != 5) right = true;
    if (row != 1) top = true;
    if (row != 5) bottom = true;

    if (left) {
        let newId = `${row}-${col - 1}`;
        document.getElementById(newId).classList.toggle("active-cell");
    }
    if (top) {
        let newId = `${row - 1}-${col}`;
        document.getElementById(newId).classList.toggle("active-cell");
    }
    if (right) {
        let newId = `${row}-${col + 1}`;
        document.getElementById(newId).classList.toggle("active-cell");
    }
    if (bottom) {
        let newId = `${row + 1}-${col}`;
        document.getElementById(newId).classList.toggle("active-cell");
    }

    if (gameWon()) {
        document.querySelector(".container").style.display = "none";
        document.querySelector(".loader").style.display = "flex";

        calcPoints(counter, minMoves);
        // console.log(`you won in ${counter} moves. Where as the minimum moves required to finish the game was ${minMoves}.`);
        // console.log(`points earned - ${points}`);

        const url = "/gamewon";
        const user = {
            counter,
            points
        }
        axios({
            method: 'post',
            url,
            data: {
                user
            }
        })
            .then(function (response) {
                if (response.data.redirect == '/youwon') {
                    window.location = `/youwon?points=${response.data.points}&moves=${response.data.moves}`;
                } else if (response.data.redirect == '/login') {
                    window.location = "/login"
                }
            })
            .catch(function (error) {
                window.location = "/login"
            })

        points = 0;
        counter = 0;
    }
}

let storage = [
    {
        pat: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [1, 0, 1, 0, 1], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
        minMoves: 6
    },
    {
        pat: [[1, 0, 1, 0, 1], [1, 0, 1, 0, 1], [0, 0, 0, 0, 0], [1, 0, 1, 0, 1], [1, 0, 1, 0, 1]],
        minMoves: 6
    },
    {
        pat: [[0, 1, 0, 1, 0], [1, 1, 0, 1, 1], [1, 1, 0, 1, 1], [1, 1, 0, 1, 1], [0, 1, 0, 1, 0]],
        minMoves: 6
    },
    {
        pat: [[0, 0, 0, 0, 0], [1, 1, 0, 1, 1], [0, 0, 0, 0, 0], [1, 0, 0, 0, 1], [1, 1, 0, 1, 1]],
        minMoves: 6
    },
    {
        pat: [[1, 1, 1, 1, 0], [1, 1, 1, 0, 1], [1, 1, 1, 0, 1], [0, 0, 0, 1, 1], [1, 1, 0, 1, 1]],
        minMoves: 6
    },
    {
        pat: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [1, 0, 1, 0, 1], [1, 0, 1, 0, 1], [0, 1, 1, 1, 0]],
        minMoves: 7
    },
    {
        pat: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [1, 0, 1, 0, 1], [1, 0, 1, 0, 1], [0, 1, 1, 1, 0]],
        minMoves: 7
    },
    {
        pat: [[1, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 0]],
        minMoves: 7
    },
    {
        pat: [[0, 0, 0, 0, 0], [0, 0, 1, 0, 0], [0, 1, 0, 1, 0], [1, 0, 1, 0, 1], [0, 1, 0, 1, 0]],
        minMoves: 7
    },
    {
        pat: [[0, 1, 0, 1, 0], [1, 1, 1, 1, 1], [0, 1, 1, 1, 0], [0, 1, 0, 1, 1], [1, 1, 1, 0, 0]],
        minMoves: 7
    },
    {
        pat: [[0, 1, 1, 1, 0], [0, 1, 1, 1, 0], [0, 1, 1, 1, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
        minMoves: 7
    },
    {
        pat: [[1, 0, 1, 0, 1], [1, 0, 1, 0, 1], [1, 0, 1, 0, 1], [1, 0, 1, 0, 1], [0, 1, 1, 1, 0]],
        minMoves: 8
    },
    {
        pat: [[1, 1, 1, 1, 1], [0, 1, 0, 1, 0], [1, 1, 0, 1, 1], [0, 1, 1, 1, 0], [0, 1, 0, 1, 0]],
        minMoves: 8
    },
    {
        pat: [[0, 0, 0, 1, 0], [0, 0, 1, 0, 1], [0, 1, 0, 1, 0], [1, 0, 1, 0, 0], [0, 1, 0, 0, 0]],
        minMoves: 8
    },
    {
        pat: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 1, 0, 0, 0], [0, 1, 0, 0, 0]],
        minMoves: 8
    },
    {
        pat: [[0, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 0, 0, 0]],
        minMoves: 8
    },
    {
        pat: [[1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1]],
        minMoves: 9
    },
    {
        pat: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 1, 0, 0], [0, 1, 1, 1, 0], [1, 1, 1, 1, 1]],
        minMoves: 9
    },
    {
        pat: [[0, 0, 1, 0, 0], [0, 1, 0, 1, 0], [1, 0, 1, 0, 1], [0, 1, 0, 1, 0], [0, 0, 1, 0, 0]],
        minMoves: 9
    },
    {
        pat: [[1, 0, 1, 0, 1], [0, 0, 0, 0, 0], [1, 0, 1, 0, 1], [0, 0, 0, 0, 0], [1, 0, 1, 0, 1]],
        minMoves: 9
    },
    {
        pat: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [1, 0, 0, 0, 1], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
        minMoves: 9
    },
    {
        pat: [[0, 1, 1, 1, 1], [0, 1, 0, 0, 0], [0, 1, 1, 1, 0], [0, 1, 0, 0, 0], [0, 1, 0, 0, 0]],
        minMoves: 10
    },
    {
        pat: [[0, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 1, 1, 0]],
        minMoves: 10
    },
    {
        pat: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 1, 1, 1], [0, 0, 1, 1, 0], [0, 0, 1, 0, 0]],
        minMoves: 10
    },
    {
        pat: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1], [0, 1, 0, 0, 1]],
        minMoves: 10
    },
    {
        pat: [[1, 0, 0, 0, 0], [1, 1, 0, 0, 0], [1, 1, 1, 0, 0], [1, 1, 1, 1, 0], [0, 1, 1, 1, 1]],
        minMoves: 10
    },
    {
        pat: [[1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1]],
        minMoves: 11
    },
    {
        pat: [[0, 0, 1, 0, 0], [0, 1, 1, 1, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]],
        minMoves: 11
    },
    {
        pat: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 1, 1, 1], [0, 0, 1, 1, 1], [0, 0, 1, 1, 1]],
        minMoves: 11
    },
    {
        pat: [[0, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
        minMoves: 11
    },
    {
        pat: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
        minMoves: 11
    },
    {
        pat: [[1, 0, 0, 0, 1], [1, 1, 0, 0, 1], [1, 0, 1, 0, 1], [1, 0, 0, 1, 1], [1, 0, 0, 0, 1]],
        minMoves: 12
    },
    {
        pat: [[1, 1, 1, 1, 1], [0, 0, 0, 1, 0], [0, 0, 1, 0, 0], [0, 1, 0, 0, 0], [1, 1, 1, 1, 1]],
        minMoves: 12
    },
    {
        pat: [[0, 0, 0, 1, 0], [0, 0, 0, 1, 0], [1, 0, 1, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 1, 1]],
        minMoves: 12
    },
    {
        pat: [[0, 0, 1, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 1, 0, 1], [0, 1, 1, 1, 1]],
        minMoves: 12
    },
    {
        pat: [[0, 0, 0, 1, 1], [0, 1, 0, 1, 0], [1, 0, 0, 0, 1], [1, 0, 1, 0, 1], [0, 0, 0, 0, 0]],
        minMoves: 12
    },
    {
        pat: [[0, 0, 1, 0, 0], [0, 1, 0, 1, 0], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1], [1, 0, 0, 0, 1]],
        minMoves: 13
    },
    {
        pat: [[0, 0, 0, 0, 0], [0, 1, 1, 1, 0], [0, 1, 1, 1, 0], [0, 1, 1, 1, 0], [0, 0, 0, 0, 0]],
        minMoves: 13
    },
    {
        pat: [[1, 0, 1, 0, 1], [0, 1, 0, 1, 0], [1, 0, 1, 0, 1], [0, 1, 0, 1, 0], [1, 0, 1, 0, 1]],
        minMoves: 13
    },
    {
        pat: [[0, 1, 0, 1, 0], [1, 0, 0, 0, 0], [1, 1, 0, 0, 0], [0, 0, 1, 1, 0], [0, 1, 0, 1, 0]],
        minMoves: 13
    },
    {
        pat: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 1, 0, 1, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
        minMoves: 13
    },
    {
        pat: [[1, 0, 0, 0, 1], [0, 1, 0, 1, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]],
        minMoves: 14
    },
    {
        pat: [[1, 1, 1, 0, 0], [1, 0, 0, 1, 0], [1, 1, 1, 0, 0], [1, 0, 0, 1, 0], [1, 1, 1, 0, 0]],
        minMoves: 14
    },
    {
        pat: [[1, 0, 0, 0, 1], [1, 1, 0, 1, 0], [1, 1, 1, 0, 0], [0, 1, 0, 0, 0], [0, 1, 1, 1, 0]],
        minMoves: 14
    },
    {
        pat: [[0, 0, 0, 0, 0], [1, 1, 0, 1, 1], [1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 1, 1, 1, 0]],
        minMoves: 14
    },
    {
        pat: [[0, 1, 1, 1, 0], [1, 0, 1, 0, 0], [0, 0, 1, 1, 1], [1, 1, 1, 1, 0], [1, 0, 1, 0, 1]],
        minMoves: 14
    },
    {
        pat: [[0, 0, 1, 0, 0], [0, 1, 1, 1, 0], [1, 1, 1, 1, 1], [0, 1, 1, 1, 0], [0, 0, 1, 0, 0]],
        minMoves: 15
    },
    {
        pat: [[0, 0, 1, 0, 0], [1, 1, 1, 1, 1], [1, 0, 1, 0, 0], [0, 1, 0, 0, 1], [0, 0, 0, 0, 1]],
        minMoves: 15
    },
    {
        pat: [[0, 0, 0, 0, 0], [1, 0, 0, 0, 1], [0, 0, 1, 0, 0], [1, 0, 0, 0, 1], [0, 0, 0, 0, 0]],
        minMoves: 15
    },
    {
        pat: [[1, 0, 0, 0, 1], [0, 1, 0, 1, 0], [0, 0, 1, 0, 0], [0, 1, 0, 1, 0], [1, 0, 0, 0, 1]],
        minMoves: 15
    },
    {
        pat: [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]],
        minMoves: 15
    },
    {
        pat: [[1, 1, 0, 1, 1], [0, 0, 0, 0, 0], [1, 1, 0, 1, 1], [0, 0, 0, 0, 0], [1, 1, 0, 1, 1]],
        minMoves: 6
    },
    {
        pat: [[1, 1, 0, 1, 1], [0, 0, 0, 0, 0], [1, 1, 0, 1, 1], [0, 0, 0, 0, 0], [1, 1, 0, 1, 1]],
        minMoves: 6
    },
    {
        pat: [[1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 1, 0, 0], [1, 1, 1, 1, 1]],
        minMoves: 6
    },
    {
        pat: [[1, 1, 1, 1, 1], [0, 1, 0, 1, 0], [0, 0, 1, 0, 0], [0, 1, 0, 1, 0], [1, 1, 1, 1, 1]],
        minMoves: 6
    },
    {
        pat: [[0, 1, 0, 1, 0], [1, 0, 0, 0, 1], [0, 0, 0, 0, 0], [1, 1, 0, 1, 1], [1, 0, 0, 0, 1]],
        minMoves: 6
    },
    {
        pat: [[0, 0, 1, 0, 0], [0, 1, 1, 0, 0], [1, 1, 0, 1, 1], [0, 0, 1, 1, 0], [0, 0, 1, 0, 0]],
        minMoves: 6
    },
    {
        pat: [[0, 1, 0, 1, 0], [1, 1, 1, 1, 1], [1, 0, 1, 0, 1], [1, 1, 1, 1, 1], [0, 1, 0, 1, 0]],
        minMoves: 7
    },
    {
        pat: [[1, 0, 1, 0, 1], [1, 0, 0, 0, 1], [1, 1, 0, 1, 1], [1, 0, 0, 0, 1], [1, 0, 1, 0, 1]],
        minMoves: 7
    },
    {
        pat: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 1, 1, 1, 0], [0, 1, 0, 0, 0], [0, 0, 0, 0, 0]],
        minMoves: 7
    },
    {
        pat: [[0, 0, 0, 0, 1], [0, 0, 0, 1, 0], [0, 0, 1, 0, 0], [0, 1, 1, 0, 0], [1, 0, 1, 0, 0]],
        minMoves: 11
    },
    {
        pat: [[0, 0, 0, 0, 0], [1, 0, 1, 0, 1], [1, 0, 0, 0, 1], [1, 0, 1, 0, 1], [1, 0, 0, 0, 1]],
        minMoves: 7
    }
];

window.onload = () => {

    counter = 0;
    minMoves = 0;
    points = 0;
    let setNo = Math.floor(Math.random() * 60);
    minMoves = storage[setNo].minMoves;

    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= 5; j++) {
            let ele = document.getElementById(`${i}-${j}`);
            if (storage[setNo].pat[i - 1][j - 1] == 1) ele.classList.add("active-cell");
        }
    }
}

const gameWon = () => {

    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= 5; j++) {
            let ele = document.getElementById(`${i}-${j}`);
            if (ele.classList.contains("active-cell")) {
                return false;
            }
        }
    }

    return true;
}

const calcPoints = (ctr, moves) => {
    let base = Math.floor(ctr / moves);
    if (base >= 10) points = 1;
    else {
        points = 11 - base;
    }
}

const restartGame = () => {
    counter = 0;
    minMoves = 0;
    points = 0;
    counterSpan.textContent = `${counter}`;
    let setNo = Math.floor(Math.random() * 60);
    minMoves = storage[setNo].minMoves;

    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= 5; j++) {
            let ele = document.getElementById(`${i}-${j}`);
            if (storage[setNo].pat[i - 1][j - 1] == 1) ele.classList.add("active-cell");
            else {
                ele.classList.remove("active-cell")
            }
        }
    }
}