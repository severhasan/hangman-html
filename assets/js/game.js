class Game {
    constructor(minLength, roundsLeft, movesLeft) {
        this._minLength = this._minimumWordLenght = minLength;
        this._totalRounds = this._roundsLeft = roundsLeft; // 2
        this._movesLeft = movesLeft;
        this._helper = null;

        this._score = 0;
        this._time = 0;
        this._started = false;
        this._round = 0;
        this._state = 0;
        this._scoreFactor = 10;
        this._currentWord = '';
        this._selectedLetters = [];
        this._selectedWords = [];
        this._timeCounter = null;
    }

    get round() {
        return this._round;
    }

    get time() {
        return this._time;
    }

    get selectedWords() {
        return this._selectedWords;
    }

    get currentWord() {
        return this._currentWord;
    }

    set currentWord(word) {
        this._currentWord = word;
    }

    get score() {
        return this._score;
    }
    set score(score) {
        this._score = score;
    }

    get started() {
        return this._started;
    }

    get movesLeft() {
        return this._movesLeft;
    }

    addHelper(instance) {
        this._helper = new Helper(instance);
    }

    generateWord() {
        const wordList = WORDS[`lengthOf${this._round + this._minimumWordLenght}`];
        const random = Math.floor(Math.random() * wordList.length);
        return wordList[random].toUpperCase();
    }

    start() {
        if (this._started) return;
        this.reset();
        this._started = true;
        this.startRound();
        this._helper.prepareGame();
    }

    reset() {
        this._minimumWordLenght = this._minLength;
        this._roundsLeft = this._totalRounds; // 2
        this._score = 0;
        this._time = 0;
        this._started = false;
        this._round = 0;
        this._state = 0;
        this._currentWord = '';
        this._selectedLetters = [];
        this._selectedWords = [];
    }

    startRound() {
        const newWord = this.generateWord();
        this._currentWord = newWord;
        this._selectedWords.push(newWord);
        this._round++;
        this._helper.updateImage(`pepega.jpg`);
        this._helper.printWord(newWord);
        this._helper.updateRound(this._round);
        this._timeCounter = setInterval(() => {
            this._time += 100;
            this._helper.updateTimeElapsed(Math.floor(this._time / 1000));
        }, 100)
    }

    endRound() {
        clearInterval(this._timeCounter);
        // this._timeCounter = null;

        const roundScore = this.calculateRoundScore();
        this._score += roundScore;
        this._helper.updateScore(this._score);
        this._helper.revealWord(this._currentWord, this.getMissedLetters());
        this._state = 0;
        this._movesLeft = 7;
        this._selectedLetters = [];
        this._roundsLeft--;
        if (this._roundsLeft === 0) {
            this.end();
        }
        this._helper.endRound();
    }

    end() {
        this._started = false;
        this._helper.endGame();
    }

    selectLetter(letter) {
        this._selectedLetters.push(letter);
        this._helper.deactivateLetter(letter);
        // find the indices of the letters and send it to
        const indices = [];
        for (const idx in this._currentWord) {
            if (this._currentWord[idx] === letter) {
                indices.push(Number(idx));
            }
        }
        
        if (!indices.length) {
            this._movesLeft--;
            this._state++;
            this._helper.updateImage(`Hangman-${this._state}.png`);
        } else {
            fillWord(letter, indices);
        }

        this.checkRoundOver();
    }

    checkRoundOver() {
        if (this._movesLeft === 0 || this.checkLevelComplete()) {
            this.endRound();
            return true;
        }
        return false;

    }

    checkLevelComplete() {
        let levelComplete = true;
        for (const l of this._currentWord) {
            if (!this._selectedLetters.includes(l)) levelComplete = false;
        }
        return levelComplete;
    }

    getMissedLetters() {
        return this._currentWord.split('').filter(l => !this._selectedLetters.includes(l));
    }

    displayMovesLeft() {
        this._helper.displayMovesLeft();
    }

    displayTimeElapsed() {
        this._helper.displayTimeElapsed();
    }

    displayScore() {
        this._helper.displayScore();
    }

    displayNextRoundBtn() {
        this._helper.displayNextRoundBtn();
    }

    hideNextRoundBtn() {
        this._helper.hideNextRoundBtn();
    }

    calculateRoundScore() {
        if (this.checkLevelComplete()) {
            const incorrectLetters = this._selectedLetters.filter(l => !this._currentWord.includes(l));
            const maxScore = (this._currentWord.length * this._scoreFactor) * 2;
            console.log(incorrectLetters, maxScore, (maxScore - (incorrectLetters.length * this._scoreFactor)));
            
            return maxScore - (incorrectLetters.length * this._scoreFactor);
        }

        let score = 0;
        for (const l of this._currentWord) {
            if (this._selectedLetters.includes(l)) {
                score += this._scoreFactor;
            }
        }
        return score;
    }

    print(message) {
        console.log(message);
    }

}


const gameTest = new Game(6, 7, 7);
gameTest.addHelper(gameTest);
gameTest.displayTimeElapsed();
gameTest.displayScore();

