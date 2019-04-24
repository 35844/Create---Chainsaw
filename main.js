"use strict";

const boxes = [];
const messageWrapper = document.getElementById("message-wrapper");
const message = document.getElementById("message");
const scoreDisplay = document.getElementById("score");

let gamePlaying = true;
let playerXTurn = true;
let xScore = 0;
let oScore = 0;

for (const tr of document.getElementsByTagName('tr')) {
    boxes.push(tr.getElementsByTagName('td'));
}

function fadeInMessage(msg) {
    if (!msg) {
        msg = message.innerHTML;
    } else {
        message.innerHTML = msg;
    }
    messageWrapper.style.zIndex = 5;
    messageWrapper.classList.add("visible");
}

function fadeOutMessage() {
    messageWrapper.classList.remove("visible");
    setTimeout(() => {
        messageWrapper.style.zIndex = -1;
    }, 500);
}

function displayWinnerBoxes(winnerBoxes) {
    for (const box of winnerBoxes) {
        box.style.color = 'rgb(255,73,73)';
    }
}

function displayWinnerMessage(char) {
    if (!char) {
        fadeInMessage(`Tie.`);
        return;
    }
    fadeInMessage(`Congratulations to "${char}" player! 🎉`);
}

function checkVertical(char) {
    if (!char) return false;
    for (let i = 0; i < 3; i++) {
        let win = true;
        const winnerBoxes = [];
        for (const boxRow of boxes) {
            winnerBoxes.push(boxRow[i]);
            win = win && boxRow[i].innerHTML == char;
        }
        if (win) return winnerBoxes;
    }
    return false;
}

function checkHorizontal(char) {
    if (!char) return false;

    for (const boxRow of boxes) {
        let win = true;
        const winnerBoxes = [];
        for (let i = 0; i < 3; i++) {
            winnerBoxes.push(boxRow[i]);
            win = win && boxRow[i].innerHTML == char;
        }
        if (win) return winnerBoxes;
    }
    return false;
}

function checkWin(char) {
    return checkVertical(char) || checkHorizontal(char) || checkDiagonal(char);
}

function checkDiagonal(char) {
    const checkBoxes = (boxes) => {
        let winnerBoxes = [];
        for (const box of boxes) {
            if (box.innerHTML == char) {
                winnerBoxes.push(box);
            }
        }
        return winnerBoxes.length == 3 ? winnerBoxes : false;
    }

    return checkBoxes([boxes[0][0], boxes[1][1], boxes[2][2]]) ||
        checkBoxes([boxes[2][2], boxes[1][1], boxes[0][0]]);
}

function checkTie() {
    for (const box of document.getElementsByTagName('td')) {
        if (box.innerHTML == "") return false;
    }
    return true;
}

function getClickedFunction(box) {
    return () => {
        if (!gamePlaying) return;
        if (box.innerHTML !== "") return;
        const char = playerXTurn ? 'X' : 'O';
        playerXTurn = !playerXTurn;

        box.innerHTML = char;

        const winnerBoxes = checkWin(char);
        if (winnerBoxes) {
            gamePlaying = false;
            displayWinnerBoxes(winnerBoxes);
            addScore(char);
            setTimeout(() => {
                displayWinnerMessage(char);
                restartGame();
            }, 500);
        } else if (checkTie()) {
            gamePlaying = false;
            addScore();
            setTimeout(() => {
                displayWinnerMessage();
                restartGame();
            }, 500);
        }
    }
}

function restartGame() {
    setTimeout(() => {
        playerXTurn = true;
        gamePlaying = true;
        for (const box of document.getElementsByTagName('td')) {
            box.innerHTML = "";
            box.style.color = "black";
        }
        fadeOutMessage();
    }, 1500);
}

function setScore(xScoreTo, oScoreTo) {
    xScore = xScoreTo;
    oScore = oScoreTo;
    scoreDisplay.innerHTML = `${xScore} - ${oScore}`;
}

function addScore(char) {
    if (char == "X") {
        return setScore(xScore + 1, oScore);
    } else if (char == "O") {
        return setScore(xScore, oScore + 1);
    }
    return setScore(xScore + 1, oScore + 1);
}

for (const box of document.getElementsByTagName('td')) {
    box.addEventListener("click", (() => getClickedFunction(box))());
}