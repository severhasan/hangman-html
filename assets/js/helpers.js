class Helper {
    constructor(game){
        this._game = game;
        activateStartButton(game);
    }

    
    displayTimeElapsed() {
        displayTimeElapsed();
    }
    
    displayScore() {
        displayScore();
    }

    prepareGame() {
        updateScore(this._game.score);

        document.querySelector('#info-text').classList.add('no-display');
        document.querySelector('#round').classList.remove('no-display');
    }
    
    displayNextRoundBtn() {
        displayNextRoundBtn();
    }
    hideNextRoundBtn() {
        hideNextRoundBtn();
    }

    printWord(word) {
        printWord(word);
        activateLetters(this._game);
    }
    
    revealWord(word, missedLetters) {
        revealWord(word, missedLetters);
    }

    deactivateLetter(letter) {
        deactivateLetter(letter);
    }
    endRound() {
        endRound(this._game);
    }

    fillWord(indices) {
        fillWord(indices);
    }

    updateRound(round) {
        updateRound(round);
    }

    updateImage(src) {
        updateImage(src);
    }

    updateTimeElapsed(time) {
        updateTimeElapsed(time);
    }

    updateScore(score) {
        updateScore(score);
    }

    endGame() {
        endGame(this._game);
    }

    printMessage(message) {
        console.log(message);
    }
}

const testWordLength = (obj) => {
    for(key in obj) {
        console.log(key, WORDS[key].length);
        const length = Number(key.match(/\d+/)[0]);
        for (const word of WORDS[key]) {
            if (word.length !== length) {
                console.log(word, length);
            }
        }
    }
}

function generateConsonants() {
    let consonants = [], i = 'a'.charCodeAt(), j = 'z'.charCodeAt();
    for (; i <= j; ++i) {
        if (!VOWELS.includes(String.fromCharCode(i))) {
            consonants.push(String.fromCharCode(i));
        }
    }
    return consonants;
}

const initiate = () => {
    const consonants = generateConsonants();
    printLetters(VOWELS, 'vowels');
    printLetters(consonants, 'consonants');
}

const displayTimeElapsed = () => {
    document.querySelector('#elapsed').classList.remove('no-display');
}

const displayScore = () => {
    document.querySelector('#score').classList.remove('no-display');
}

const displayNextRoundBtn = () => {
    document.querySelector('#next-round').classList.remove('no-display');
}
const hideNextRoundBtn = () => {
    document.querySelector('#next-round').classList.add('no-display');
}


const activateStartButton = game => {
    const startBtn = document.querySelector('#start-game');
    startBtn.onclick = e => {
        game.start();
        deactivateElement(startBtn);
        document.querySelector('#game-info')?.remove();
    }
}

const deactivateElement = el => {
    if (!el.classList.contains('no-display')) {
        el.classList.add('no-display');
    }
}

const activateLetters = game => {
    const letters = document.querySelectorAll('.letter');
    letters.forEach(l => {
        l.classList.remove('btn-secondary');
        l.classList.remove('opacity-5');
        l.classList.add('btn-primary');
        l.onclick = e => game.selectLetter(l.textContent);
    })
}

const deactivateLetter = letter => {
    const el = document.querySelector(`#letter-${letter.toUpperCase()}`);
    el.classList.remove('btn-primary');
    el.classList.add('btn-secondary');
    el.classList.add('opacity-5')
    el.title = 'You have used this letter in this round.';
    el.onclick = null;
};

const endRound = game => {
    const nextRoundBtn = document.querySelector('#next-round');
    
    if (game.started) {
        nextRoundBtn.classList.remove('no-display');
        nextRoundBtn.onclick = e => {
            game.startRound();
            nextRoundBtn.classList.add('no-display');
            nextRoundBtn.onclick = null;
        }
    }

    const allLetters = document.querySelectorAll('#letters .letter');
    allLetters.forEach(el => {
        if (!el.classList.contains('correct-letter')) {
            el.classList.remove('btn-primary');
            el.classList.add('btn-secondary');
            el.classList.add('opacity-5');
            el.title = 'The round is over.'
            el.onclick = null;
        }
    });
}

const fillWord = (letter, indices) => {
    const matchedLetters = document.querySelectorAll('#letter-boxes .letter-box');
    const matchedElements = [];

    matchedLetters.forEach((element, idx) => {
        if (indices.includes(idx)) {
            matchedElements.push(element);
        }
    });
    
    const offset = document.querySelector('#letter-' + letter).getBoundingClientRect();
    const divisor = 60;
    const refreshRate = 6;
    matchedElements.forEach(element => {
        const destination = element.getBoundingClientRect();
        const el = createLetter(letter, true);
        moveLetter(el, indices, offset, destination, divisor, refreshRate);
    });
    
    setTimeout(() => {
        for (const idx of indices) {
            const targetEl = document.querySelector('#letter-box-' + idx);
            targetEl.setAttribute('class', 'letter mr-2 mb-2 border rounded text-white text-center align-self-center btn-success');
            targetEl.textContent = letter;
        }
    }, divisor * refreshRate);
}

const moveLetter = (el, indices, offset, destination, divisor, refreshRate) => {
    el.classList.add('adjust-size');
    el.style.position = 'absolute';
    el.style.left = `${offset.left}px`;
    el.style.top = `${offset.top}px`;
    document.querySelector('body').appendChild(el);

    let locX = offset.left;
    let locY = offset.top;
    let destX = destination.left;
    let destY = destination.top - 42;

    const speedY = (destY - locY) / divisor;
    const speedX = (destX - locX) / divisor;

    const animationX = setInterval(() => {
        locX += speedX;
        if (Math.abs(locX - destX) < 2) {
            locX = destX;
            el.style.left = `${locX}px`;
            el.remove();
            clearInterval(animationX);
        }
        el.style.left = `${locX}px`;
    }, refreshRate);

    const animationY = setInterval(() => {
        locY += speedY;
        if (Math.abs(locY - destY) < 2) {
            locY = destY;
            el.style.top = `${locY}px`;
            clearInterval(animationY);
        }
        el.style.top = `${locY}px`;
    }, refreshRate);

}

const updateRound = round => {
    document.querySelector('#current-round').textContent = round;
};

const updateImage = src => {
    document.querySelector('#hangman-img').src = BASE_IMG_SRC + src;
}

const updateScore = score => {
    document.querySelector('#score-points').textContent = score;
}

const updateTimeElapsed = time => {
    document.querySelector('#elapsed-seconds').textContent = time + ' s';
}

const printWord = word => {
    const hangmanLetters = document.querySelectorAll('#selectedLetters .letter');
    hangmanLetters.forEach(el => {
        el.remove();
    })

    document.querySelectorAll('.letter-box').forEach(el => {el.remove()});

    const wordContainer = document.querySelector('#letter-boxes');
    const selectedLetters = document.querySelector('#selectedLetters');
    word.split('').forEach((letter, idx) => {
        const el = createLetterBox();
        const el2 = createLetterBox();
        // el.classList.add('h-40');
        el2.classList.add('opacity-0');
        el2.setAttribute('id', 'letter-box-'+ idx);
        wordContainer.appendChild(el);
        selectedLetters.appendChild(el2);
    });

}

const revealWord = (word, missedLetters) => {
    // const letterBoxes = document.querySelectorAll('.letter-box');
    
    for (const idx in word) {
        const letter = word[idx];
        if (missedLetters.includes(letter)) {
            const letterbox = document.querySelector('#letter-box-' + idx)
            letterbox.setAttribute('class', 'letter mr-2 mb-2 border rounded text-white text-center align-self-center btn-danger opacity-5');
            letterbox.textContent = letter;
        }

    }
}

const printLetters = (list, id) => {
    const container = document.getElementById(id);
    for (const letter of list) {
        const el = createLetter(letter);

        container.appendChild(el);
    }
}

const createLetter = (letter, correctLetter = null) => {
    const el = document.createElement('div');
    el.setAttribute('class', 'letter mr-2 mb-2 border rounded text-white text-center align-self-center');
    if (correctLetter) {
        el.setAttribute('id', `a-${letter.toUpperCase()}`);
        el.classList.add('correct-letter');
        el.classList.add('btn-success');
    } else {
        el.setAttribute('id', `letter-${letter.toUpperCase()}`);
        el.classList.add('btn-secondary');
        el.classList.add('opacity-5');
    }
    el.textContent = letter.toUpperCase();
    return el;
}

const createLetterBox = () => {
    const el = document.createElement('div');
    el.setAttribute('class', 'letter-box border-bottom-dark mr-2');
    return el;
}

const endGame = (game) => {
    document.querySelector('#start-game').classList.remove('no-display');
    // document.querySelector('#info-text').classList.remove('no-display');

    const info = document.querySelector('#info');
    const gameInfo = document.createElement('div');
    gameInfo.setAttribute('id', 'game-info');
    gameInfo.setAttribute('class', 'my-2');

    const table = document.createElement('table');
    table.setAttribute('class', 'table');
    const thead = document.createElement('thead');
    thead.setAttribute('class', 'thead-light')


    const trHead = document.createElement('tr');

    const thHead = document.createElement('th');
    thHead.textContent = 'Game Stats';
    thHead.setAttribute('colspan', '2');
    thHead.setAttribute('class', 'text-center');
    trHead.appendChild(thHead);
    thead.appendChild(trHead);

    const tBody = document.createElement('tbody');

    const tr1 = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.textContent = 'Score';

    const td2 = document.createElement('td');
    td2.textContent = game.score;
    tr1.appendChild(td1);
    tr1.appendChild(td2);

    const tr2 = document.createElement('tr');
    const td3 = document.createElement('td');
    td3.textContent = 'Total Time Spent';

    const td4 = document.createElement('td');
    td4.textContent = game.time / 1000 + ' seconds';
    tr2.appendChild(td3);
    tr2.appendChild(td4);

    const tr3 = document.createElement('tr');
    const td5 = document.createElement('td');
    td5.textContent = 'Words';

    const td6 = document.createElement('td');
    td6.textContent = game.selectedWords.join(', ');
    tr3.appendChild(td5);
    tr3.appendChild(td6);

    tBody.appendChild(tr1);
    tBody.appendChild(tr2);
    tBody.appendChild(tr3);

    table.appendChild(thead);
    table.appendChild(tBody);
    gameInfo.appendChild(table);

    info.appendChild(gameInfo);
}