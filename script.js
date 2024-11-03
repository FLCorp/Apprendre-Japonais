const kanaList = {
    hiragana: [
        'あ', 'い', 'う', 'え', 'お',
        'か', 'き', 'く', 'け', 'こ',
        'さ', 'し', 'す', 'せ', 'そ',
        'た', 'ち', 'つ', 'て', 'と',
        'な', 'に', 'ぬ', 'ね', 'の',
        'は', 'ひ', 'ふ', 'へ', 'ほ',
        'ま', 'み', 'む', 'め', 'も',
        'や', 'ゆ', 'よ',
        'ら', 'り', 'る', 'れ', 'ろ',
        'わ', 'を', 'ん'
    ],
    katakana: [
        'ア', 'イ', 'ウ', 'エ', 'オ',
        'カ', 'キ', 'ク', 'ケ', 'コ',
        'サ', 'シ', 'ス', 'セ', 'ソ',
        'タ', 'チ', 'ツ', 'テ', 'ト',
        'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
        'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
        'マ', 'ミ', 'ム', 'メ', 'モ',
        'ヤ', 'ユ', 'ヨ',
        'ラ', 'リ', 'ル', 'レ', 'ロ',
        'ワ', 'ヲ', 'ン'
    ]
};

// Fonction pour enregistrer l'état des cases à cocher dans localStorage
function saveCheckedKana() {
    const checkedKana = {};
    document.querySelectorAll('.kana').forEach(kanaCheckbox => {
        checkedKana[kanaCheckbox.value] = kanaCheckbox.checked;
    });
    localStorage.setItem('checkedKana', JSON.stringify(checkedKana));
}

// Fonction pour charger l'état des cases à cocher depuis localStorage
function loadCheckedKana() {
    const checkedKana = JSON.parse(localStorage.getItem('checkedKana'));
    if (checkedKana) {
        Object.keys(checkedKana).forEach(kana => {
            const checkbox = document.querySelector(`.kana[value="${kana}"]`);
            if (checkbox) {
                checkbox.checked = checkedKana[kana];
            }
        });
    }
}

// Appeler la fonction pour charger les cases à cocher au démarrage
loadCheckedKana();

// Événement pour enregistrer les cases à cocher lorsqu'elles sont modifiées
document.querySelectorAll('.kana').forEach(checkbox => {
    checkbox.addEventListener('change', saveCheckedKana);
});

document.getElementById('generatePhrase').addEventListener('click', () => {
    const checkedKana = Array.from(document.querySelectorAll('.kana:checked')).map(cb => cb.value);
    const randomKana = [];

    for (let i = 0; i < 5; i++) { // Générer une phrase de 5 kana
        if (checkedKana.length > 0) {
            const randomIndex = Math.floor(Math.random() * checkedKana.length);
            randomKana.push(checkedKana[randomIndex]);
        }
    }

    document.getElementById('generatedPhrase').textContent = randomKana.join('');

    // Effacer la réponse de l'utilisateur à chaque nouvelle phrase
    document.getElementById('romajiInput').value = '';
    document.getElementById('feedback').textContent = ''; // Effacer les retours précédents
});

document.getElementById('checkRomaji').addEventListener('click', () => {
    const generatedPhrase = document.getElementById('generatedPhrase').textContent;
    const userInput = document.getElementById('romajiInput').value.trim();

    // Exemple simple de vérification
    const correctRomaji = convertKanaToRomaji(generatedPhrase);
    if (userInput === correctRomaji) {
        document.getElementById('feedback').textContent = "Correct !";
    } else {
        document.getElementById('feedback').textContent = `Incorrect. La bonne réponse est : ${correctRomaji}`;
    }
});

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
    return kana.split('').map(k => romajiMapping[k] || '').join('');
}
