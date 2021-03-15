
let blackjackGame = {
    "you" : {"div":"#user-side-box", "scoreSpan": "#user-score-span", "score": 0},
    "dealer" : {"div":"#dealer-side-box", "scoreSpan": "#dealer-score-span", "score": 0},
    "cards" : ['2', '3','4', '5', '6','7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    "cardScores" : {'2':2, '3':3,'4':4, '5':5, '6':6,'7':7, '8':8, '9':9, '10':10, 'K':10, 'J':10, 'Q':10, 'A':[1,11]},
}

let winner;

let YOU = blackjackGame['you'];
let DEALER = blackjackGame['dealer'];
let SCORES = blackjackGame['cardScores'];

document.querySelector("#hit-button").addEventListener("click", blackjackHit);

document.querySelector("#stand-button").addEventListener("click", blackjackStand);

document.querySelector("#deal-button").addEventListener("click", blackjackDeal);


let hitSound = new Audio("sounds/swish.m4a");
let winSound = new Audio("sounds/cash.mp3");
let loseSound = new Audio("sounds/aww.mp3");


function blackjackHit() {
    let currentScoreSpan = document.querySelector(YOU['scoreSpan']);

    let card = randomCard();
    if(currentScoreSpan.innerText !== "BUST") {
        showCard(YOU, card);
        hitSound.play();
    }
    
    showScore(YOU, card)
}

function blackjackStand() {
    let currentScoreSpan = document.querySelector(DEALER['scoreSpan']);
    
    while (parseInt(currentScoreSpan.textContent) < 16) {
        let card = randomCard();
        if(currentScoreSpan.innerText !== "BUST"){
            showCard(DEALER, card);
            hitSound.play();
            console.log(card)
        }
        showScore(DEALER, card);
    }

    setTimeout(computeWinner, 1500);
}

function blackjackDeal() {
    let winScore = document.querySelector("#win-score");
    
    let loseScore = document.querySelector("#loss-score");

    let drawScore = document.querySelector("#draw-score");

    if(winner==="user") {
        winScore.textContent++;
    } 
    else if (winner === "draw") {
        drawScore.textContent++;
    } else {
        loseScore.textContent++;
    }
    console.log(winner);
    resetGame();
}

function computeWinner() {
    let userFinalScore = document.querySelector(YOU['scoreSpan']).textContent;
    let dealerFinalScore = document.querySelector(DEALER['scoreSpan']).textContent;

    if(userFinalScore !== "BUST") {
        userFinalScore = parseInt(userFinalScore);
    }
    if(dealerFinalScore !== "BUST"){
        dealerFinalScore = parseInt(dealerFinalScore);
    }
    
    if ((userFinalScore == "BUST")&&(dealerFinalScore != "BUST")) {
        document.querySelector(".user-side-result").innerHTML = "User Lose!";
        document.querySelector(".dealer-side-result").innerHTML = "Dealer Wins!";
        loseSound.play();
        winner = "dealer";
        
    }

    else if ((dealerFinalScore == "BUST")&&(userFinalScore != "BUST")) {
        document.querySelector(".user-side-result").innerHTML = "User Wins!";
        document.querySelector(".dealer-side-result").innerHTML = "Dealer Lose!";
        winSound.play();
        winner = "user";
    }
    else if((dealerFinalScore === "BUST")&&(userFinalScore === "BUST")){
        document.querySelector(".user-side-result").innerHTML = "Draw";
        document.querySelector(".dealer-side-result").innerHTML = "Draw";
        winSound.play();
        winner = "draw";
    }
    else if ((userFinalScore<=21)&&(dealerFinalScore<=21)) {
        if (userFinalScore > dealerFinalScore){
            document.querySelector(".user-side-result").innerHTML = "User Wins!";
            document.querySelector(".dealer-side-result").innerHTML = "Dealer Lose!";
            winSound.play();
            winner = "user";
        } 
        else if (userFinalScore < dealerFinalScore) {
            document.querySelector(".user-side-result").innerHTML = "User Lose!";
            document.querySelector(".dealer-side-result").innerHTML = "Dealer Wins!";
            loseSound.play();
            winner = "dealer";
        }
        else {
            document.querySelector(".user-side-result").innerHTML = "Draw";
            document.querySelector(".dealer-side-result").innerHTML = "Draw";
            winSound.play();
            winner = "draw";
        }
    }
    
    return winner;
}

function showCard(activePlayer, card) {

    let cardImg = document.createElement("img");
    cardImg.src = 'images/'+ card + '.png';
    cardImg.classList.add('card-image');
    document.querySelector(activePlayer['div']).appendChild(cardImg);

}

function calculteScore(card, currentScoreSpan) {
    
    let currentScore = parseInt(currentScoreSpan.innerText);

    if(currentScore === 0) {
        if(card === 'A') {
            currentScore = SCORES[card][1];
        }
        else {
            currentScore = SCORES[card]
        }
    }
    else {
        if(card === 'A') {
            if(currentScore + 11 > 21) {
                currentScore += SCORES[card][0];
            } else{
                currentScore += SCORES[card][1];
            }
        }
        else{
            currentScore += SCORES[card];
        }
    }
    return currentScore;
}

function showScore(activePlayer, card) {
    let currentScoreSpan = document.querySelector(activePlayer['scoreSpan']);
    let currentScore = calculteScore(card, currentScoreSpan);

    if((currentScore >= 0)&&(currentScore<=21)){
        currentScoreSpan.innerText = currentScore;
    }
    else {
        currentScoreSpan.innerText = "BUST";
    }
}


function resetGame() {
    winner = "";
    document.querySelector(".user-side-result").innerHTML = 'User Score: <span id="user-score-span">0</span>';
    document.querySelector(".dealer-side-result").innerHTML = 'Dealer Score: <span id="dealer-score-span">0</span>';
    
    console.log(document.querySelector("#user-side-box").querySelectorAll(".card-image"));


}


function randomCard() {
    let randomNumber = Math.floor(Math.random()*13);
    return blackjackGame['cards'][randomNumber];
}