let userGesture = '';
let botGesture = '';
const gestures = ['pierre', 'feuille', 'ciseau'];

// Scores
let playerScore = 0;
let botScore = 0;

// Démarre une nouvelle partie
function startGame() {
    userGesture = '';
    botGesture = '';
    playerScore = 0;
    botScore = 0;
    document.getElementById('resultat').innerHTML = '';
    displayScore();
}

// Cette fonction est appelée par le bouton "Jouer"
// Elle lance un compte à rebours de 3 secondes puis exécute la partie.
function playGame() {
    let countdown = 3;
    const countdownDisplay = document.getElementById('resultat');
    const interval = setInterval(() => {
        countdownDisplay.innerHTML = `Début dans ${countdown} seconde${countdown > 1 ? 's' : ''}...`;
        countdown--;
        if (countdown < 0) {
            clearInterval(interval);
            runRound();
        }
    }, 1000);
}

function runRound() {
    if (!window.currentPredictions) {
        alert("La webcam n'est pas encore prête.");
        return;
    }
    let bestGesture = '';
    let maxProb = 0;
    // Sélectionne la prédiction (geste) ayant la plus haute probabilité
    window.currentPredictions.forEach(prediction => {
        if (prediction.probability > maxProb) {
            maxProb = prediction.probability;
            bestGesture = prediction.className;
        }
    });
    userGesture = bestGesture;
    botGesture = getBotGesture();
    determineWinner();
}

function getBotGesture() {
    const randomIndex = Math.floor(Math.random() * gestures.length);
    return gestures[randomIndex];
}

function determineWinner() {
    if (userGesture === botGesture) {
        displayResult("Match nul !");
    } else if (
        (userGesture === 'pierre' && botGesture === 'ciseau') ||
        (userGesture === 'feuille' && botGesture === 'pierre') ||
        (userGesture === 'ciseau' && botGesture === 'feuille')
    ) {
        playerScore++;
        displayResult("Vous gagnez !");
    } else {
        botScore++;
        displayResult("Le bot gagne !");
    }
    displayScore();
}

function displayResult(result) {
    document.getElementById('resultat').innerHTML = `
        Vous avez choisi : ${userGesture}<br>
        Le bot a choisi : ${botGesture}<br>
        ${result}
    `;
}

function displayScore() {
    const scoreDiv = document.getElementById('score');
    if (scoreDiv) {
        scoreDiv.innerHTML = `Score - Vous: ${playerScore} - Bot: ${botScore}`;
    }
}