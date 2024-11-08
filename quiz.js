// Charger les kana cochés depuis localStorage
function loadCheckedKana() {
    const checkedKana = JSON.parse(localStorage.getItem('checkedKana'));
    if (checkedKana) {
        return Object.keys(checkedKana).filter(kana => checkedKana[kana]);
    }
    return [];
}

// Fonction pour convertir kana en romaji
function convertKanaToRomaji(kana) {
    const romajiMapping = {
        'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
        'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
        'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
        'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
        'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
        'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
        'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
        'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
        'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
        'わ': 'wa', 'を': 'wo', 'ん': 'n',
        'ア': 'A', 'イ': 'I', 'ウ': 'U', 'エ': 'E', 'オ': 'O',
        'カ': 'KA', 'キ': 'KI', 'ク': 'KU', 'ケ': 'KE', 'コ': 'KO',
        'サ': 'SA', 'シ': 'SHI', 'ス': 'SU', 'セ': 'SE', 'ソ': 'SO',
        'タ': 'TA', 'チ': 'CHI', 'ツ': 'TSU', 'テ': 'TE', 'ト': 'TO',
        'ナ': 'NA', 'ニ': 'NI', 'ヌ': 'NU', 'ネ': 'NE', 'ノ': 'NO',
        'ハ': 'HA', 'ヒ': 'HI', 'フ': 'FU', 'ヘ': 'HE', 'ホ': 'HO',
        'マ': 'MA', 'ミ': 'MI', 'ム': 'MU', 'メ': 'ME', 'モ': 'MO',
        'ヤ': 'YA', 'ユ': 'YU', 'ヨ': 'YO',
        'ラ': 'RA', 'リ': 'RI', 'ル': 'RU', 'レ': 'RE', 'ロ': 'RO',
        'ワ': 'WA', 'ヲ': 'WO', 'ン': 'N'
    };
    return romajiMapping[kana] || '';
}

// Initialiser les éléments de la page
const kanaDisplay = document.getElementById('kanaDisplay');
const romajiInput = document.getElementById('romajiInput');
const feedback = document.getElementById('feedback');
const submitAnswer = document.getElementById('submitAnswer');
const startEvaluation = document.getElementById('startEvaluation');
const countdownElement = document.getElementById('countdown');
const evaluationTimer = document.getElementById('evaluationTimer');
const resultContainer = document.getElementById('resultContainer');
const resultMessage = document.getElementById('resultMessage');

// Charger les kana cochés
const checkedKana = loadCheckedKana();
let currentKana = '';
let mistakes = {}; // Stocker les erreurs
let evaluationActive = false; // Indiquer si l'évaluation est en cours
let timer = null;
let countdownTimer = null;

// Fonction pour afficher un kana aléatoire
function displayRandomKana() {
    if (checkedKana.length === 0) {
        kanaDisplay.textContent = 'Aucun kana sélectionné !';
        return;
    }
    const randomIndex = Math.floor(Math.random() * checkedKana.length);
    currentKana = checkedKana[randomIndex];
    kanaDisplay.textContent = currentKana;
}

// Afficher un premier kana
displayRandomKana();

// Fonction pour soumettre la réponse et gérer le feedback
function submitRomaji() {
    const userAnswer = romajiInput.value.trim();
    const correctAnswer = convertKanaToRomaji(currentKana);

    if (userAnswer === correctAnswer) {
        feedback.textContent = 'Correct !';
    } else {
        feedback.textContent = `Incorrect. La bonne réponse est : ${correctAnswer}`;
        // Ajouter l'erreur dans le tableau des erreurs si en évaluation
        if (evaluationActive) {
            mistakes[currentKana] = (mistakes[currentKana] || 0) + 1;
        }
    }

    // Réinitialiser le champ de saisie pour la prochaine réponse
    romajiInput.value = '';

    // Afficher un autre kana
    displayRandomKana();
}

// Événement pour soumettre la réponse en cliquant sur le bouton "Soumettre"
submitAnswer.addEventListener('click', submitRomaji);

// Événement pour soumettre la réponse lorsque la touche "Entrée" est appuyée
romajiInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        submitRomaji();
    }
});

// Fonction d'évaluation : lance une session de 2 minutes après le compte à rebours de 5 secondes
function evaluation() {
    mistakes = {};
    evaluationActive = true;
    feedback.textContent = '';
    resultContainer.style.display = 'none';
    evaluationTimer.textContent = '02:00';
    evaluationTimer.style.display = 'block';

    let timeRemaining = 120; // 2 minutes en secondes
    timer = setInterval(() => {
        timeRemaining--;
        let minutes = Math.floor(timeRemaining / 60);
        let seconds = timeRemaining % 60;
        evaluationTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeRemaining <= 0) {
            clearInterval(timer);
            endEvaluation();
        }
    }, 1000);
}

// Fonction pour afficher les résultats à la fin de l'évaluation
function endEvaluation() {
    evaluationActive = false;
    evaluationTimer.style.display = 'none';

    // Afficher les kana pour lesquels des erreurs ont été faites
    if (Object.keys(mistakes).length > 0) {
        let kanaToReview = Object.keys(mistakes).join(', ');
        resultMessage.textContent = `Vous avez fait des erreurs sur les kana suivants : ${kanaToReview}`;
    } else {
        resultMessage.textContent = 'Félicitations ! Vous n\'avez fait aucune erreur.';
    }
    resultContainer.style.display = 'block';
}

// Fonction pour lancer le compte à rebours de 5 secondes avant l'évaluation
function startCountdown() {
    let countdown = 5;
    countdownElement.textContent = `L'évaluation commence dans ${countdown} secondes...`;
    countdownElement.style.display = 'block';

    countdownTimer = setInterval(() => {
        countdown--;
        countdownElement.textContent = `L'évaluation commence dans ${countdown} secondes...`;

        if (countdown <= 0) {
            clearInterval(countdownTimer);
            countdownElement.style.display = 'none';
            evaluation(); // Lancer l'évaluation après le compte à rebours
        }
    }, 1000);
}

// Gérer le clic sur le bouton "Lancer l'évaluation"
startEvaluation.addEventListener('click', () => {
    if (confirm('Êtes-vous sûr de vouloir démarrer une évaluation de 2 minutes ?')) {
        startCountdown();
    }
});

// Gérer le clic pour revenir à la page principale
document.getElementById('backToMain').addEventListener('click', () => {
    window.location.href = 'index.html';
});
