var letters = document.getElementsByClassName('letter-box');
var keyboard = document.getElementsByClassName('keyboard-box');
var playAgainBtn = document.getElementById('playAgainBtn');

// Reloads the page if user clicks the play again button
playAgainBtn.addEventListener('click', () => {
    window.location.replace('/');
});

var keyboardArray = ['Enter','Backspace','e','r','t','y','u','ı','o','p','ğ','ü','a','s','d','f','g','h','j','k','l','ş','i','z','c','v','b','n','m','ö','ç'];


var currentLetterIndex = 0;
var count = 0;
var wordCount = 1;

var isWin = false;
var words = [];

var SECRET_WORD;

// color constants
const GREEN = "#538d4e";
const YELLOW = "#b59f3b";
const GRAY = "#3a3a3c";

const API_URL = "https://wordle-clone.onrender.com/api/words";

// Gets all of the words from the api and returns them in an array
const getWords = async() => {
    let words;
    await $.get(API_URL,
        (data) => {  
            words = data;
    });
    return words;
}


// Returns a random word from the words array
const getRandomWord = () => {
    return words[Math.floor((Math.random()*words.length))];
};


// Selects the word with the random word function
const selectWord = () => {
    SECRET_WORD = getRandomWord();
}


const main = async() => {
    words = await getWords();
    selectWord();

    for (let key of keyboard) {
        key.addEventListener('click', () => {
            if (!isWin) {
                if (key.className === "keyboard-box wide erase") {
                    if (currentLetterIndex == 0 || !(currentLetterIndex-1 < wordCount*5 && (wordCount-1)*5 <= currentLetterIndex-1)) return;
    
                    currentLetterIndex--;
                    count--;
                    letters[currentLetterIndex].innerHTML = "";
                    letters[currentLetterIndex].style.border = "2px solid #353537";
                    return;
                }
        
                if (key.className === "keyboard-box wide enter") {
                    let word = getWord();
                    if (word.length != 5) {
                        document.getElementById('titleText').innerHTML = "Kelime 5 harften oluşmak zorundadır.";
                        $('#popupModal').modal('toggle');
                        return;
                    }

                    if (!isValidWord(word)) {
                        document.getElementById('titleText').innerHTML = "Kelime bulunamadı.";
                        $('#popupModal').modal('toggle');
                        return;
                    }
                    
                    checkWord(SECRET_WORD);
                    if (isCorrect(word,SECRET_WORD)) {
                        document.getElementById('titleText').innerHTML = "SÜPER!";
                        $('#popupModal').modal('toggle');
                        playAgainBtn.style.display = "block";
                        isWin = true;
                    }
                    return;
                }
        
                if (count == 5) {
                    return;
                }
        
                $(letters[currentLetterIndex]).animate({width: '68px',height:'68px'}, 85);
                $(letters[currentLetterIndex]).animate({width: '58px',height:'58px'}, 85);
                letters[currentLetterIndex].innerHTML = key.innerHTML;
                letters[currentLetterIndex].style.border = "2px solid #4d4e4f";
                currentLetterIndex++;
                count++;
            }
        });
    }

    document.body.addEventListener('keydown', (event) => {
        if (!isWin) {
            let key = event.key;
            let isValidKeyboardButton = 0;
            for (let letter of keyboardArray) {
                if (letter === key) {
                    isValidKeyboardButton = 1;
                    break;
                }
            }
            if (isValidKeyboardButton == 0) {
                return;
            }
    
    
            if (key === "Backspace") {
                if (currentLetterIndex == 0 || !(currentLetterIndex-1 < wordCount*5 && (wordCount-1)*5 <= currentLetterIndex-1)) return;
    
                currentLetterIndex--;
                count--;
                letters[currentLetterIndex].innerHTML = "";
                letters[currentLetterIndex].style.border = "2px solid #353537";
                return;
            }
    
            if (key === "Enter") {
                let word = getWord();
                if (word.length != 5) {
                    document.getElementById('titleText').innerHTML = "Kelime 5 harften oluşmak zorundadır.";
                    $('#popupModal').modal('toggle');
                    return;
                }
                
                if (!isValidWord(word)) {
                    document.getElementById('titleText').innerHTML = "Kelime bulunamadı.";
                    $('#popupModal').modal('toggle');
                    return;
                }

                checkWord(SECRET_WORD);
                if (isCorrect(word,SECRET_WORD)) {
                    document.getElementById('titleText').innerHTML = "SÜPER!";
                    $('#popupModal').modal('toggle');
                    playAgainBtn.style.display = "block";
                    isWin = true;
                }
                return;
            }
            if (count == 5) {
                return;
            }
    
            $(letters[currentLetterIndex]).animate({width: '68px',height:'68px'}, 85);
            $(letters[currentLetterIndex]).animate({width: '58px',height:'58px'}, 85);
            if (key === 'i') {
                letters[currentLetterIndex].innerHTML = "İ";
            } else {
                letters[currentLetterIndex].innerHTML = key.toUpperCase();
            }
            
            letters[currentLetterIndex].style.border = "2px solid #4d4e4f";
            currentLetterIndex++;
            count++;
        }
    });

}


// Helps to handle the strings with replacing characters
String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}


// Returns true if the word is valid else false (Word is valid if exists in the database)
const isValidWord = (word) => {
    return words.indexOf(word) != -1;
}


// Checks the word and paints the blocks with the rules
const checkWord = (secretWord) => {
    let secret = secretWord;
    let colors = [0,0,0,0,0];
    for (let i = 0 ; i < 5; i++) {
        if (letters[(wordCount*5) - 5 + i].innerHTML === secret[i].toUpperCase()) {
            secret = secret.replaceAt(i, "_");
            $(letters[(wordCount*5) - 5 + i]).animate({backgroundColor: GREEN}, 700);
            $(`.${letters[(wordCount*5) - 5 + i].innerHTML}`).css("background-color", GREEN);
            colors[i] = 1;
        } 
    }
    for (let i = 0; i < 5; i++) {
        for (let j = 0 ; j < 5; j++) {
            if (letters[(wordCount*5) - 5 + i].innerHTML === secret[j].toUpperCase() && colors[i] == 0) {
                secret = secret.replaceAt(j, "_");
                $(letters[(wordCount*5) - 5 + i]).animate({backgroundColor: YELLOW}, 700);
                $(`.${letters[(wordCount*5) - 5 + i].innerHTML}`).css("background-color", YELLOW);
                colors[i] = 1;
            }
        }
    }
    for (let i = 0 ; i < 5; i++) {
        if (colors[i] == 0) {
            $(letters[(wordCount*5) - 5 + i]).animate({backgroundColor: GRAY}, 700);
            $(`.${letters[(wordCount*5) - 5 + i].innerHTML}`).css("background-color", GRAY);
        }
    }
    count = 0;
    wordCount++;

    if (wordCount > 6) {
        document.getElementById('titleText').innerHTML = `Kelime: ${SECRET_WORD}`;
        $('#popupModal').modal('toggle');
        playAgainBtn.style.display = "block";
    }
}


// Gets the word from user input
const getWord = () => {
    let input = "";
    for (let i = 0; i < 5; i++) {
        input += letters[(wordCount*5) - 5 + i].innerHTML;
    }
    return input;
}


// Returns true if the user's input is the same with the secret word
const isCorrect = (word, secretWord) => {
    return word === secretWord;
}


main();
