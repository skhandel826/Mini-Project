console.log("Welcome to Tic Tac Toe");

let turn = "X";
let gameover = false;

// Function to change the turn
const changeTurn = () => {
    return turn === "X" ? "O" : "X";  // typo: you had "0" instead of "O"
};

// Function to check for a win
const checkWin = () => {
    let boxtext = document.getElementsByClassName('boxtext'); // typo: should be getElementsByClassName, not createElementsByClassName

    let wins = [
        [0, 1, 2],
        [0, 3, 6],
        [3, 4, 5],
        [6, 7, 8],
        [2, 5, 8],
        [1, 4, 7],
        [0, 4, 8],
        [2, 4, 6],
    ];

    wins.forEach(e => {
        if (
            boxtext[e[0]].innerText === boxtext[e[1]].innerText &&
            boxtext[e[1]].innerText === boxtext[e[2]].innerText &&
            boxtext[e[0]].innerText !== ""
        ) {
            document.querySelector('.info').innerText = boxtext[e[0]].innerText + " won";
            gameover = true;
        }
    });
};

// Game Logic
let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach(element => {
    let boxtext = element.querySelector('.boxtext');
    element.addEventListener('click', () => {
        if (boxtext.innerText === '' && !gameover) {  // prevent clicking after game over
            boxtext.innerText = turn;
            checkWin();
            if (!gameover) {
                turn = changeTurn();
                document.getElementsByClassName("info")[0].innerText = "Turn for " + turn;
            }
        }
    });
});
