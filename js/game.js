import { imageList } from "/js/game-data.js";


let cards = [];
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let layout = "";

/**
 * espalahar as cartas no tabuleiro
 */
function spreadCards(qnty) {    
    
    const cardModel = `
        <div class="card untapped" data-card={{dataCard}}>
            <img src="{{path}}" alt="{{alt}}" class="card-face">
            <img src="{{pathBack}}" alt="{{altBack}}" class="card-back">
        </div>`

    let images = selectImages(qnty);

    changeLayout()
    
    for(let i = 0; i <= 1; i++){
        images.forEach(card => {
            let newCardHTML = cardModel;
            
            newCardHTML = newCardHTML.replace(`{{dataCard}}`, card.dataCard);
            newCardHTML = newCardHTML.replace(`{{path}}`, card.path);
            newCardHTML = newCardHTML.replace(`{{alt}}`, card.alt);
            newCardHTML = newCardHTML.replace('{{pathBack}}', imageList.global.pathBack);
            newCardHTML = newCardHTML.replace('{{altBack}}', imageList.global.altBack);
            
            document.querySelector('.board').insertAdjacentHTML('beforeend',newCardHTML);
            
        });
    }
    
    cards =  document.querySelectorAll('.card');
    addEventClickCard()
    shuffle();
    
}

function changeLayout () {

    const classLayout = new RegExp(/layout-[a-z\-]*/)
    const board = document.querySelector('.board');
    
    if(board.className.match(classLayout)){
        board.classList.remove(board.className.match(classLayout)[0]);
    }

    board.classList.add(layout);    
}

function shuffle() {
    cards.forEach(card => {
        let randomPosition = Math.floor(Math.random() * 12);
        card.style.order = randomPosition;
    })
    
}

function addEventClickCard () {
    cards.forEach((card) => {
        card.addEventListener('click', flipCard);
    })
}

function flipCard () {

    if(lockBoard) return; //se o tabluleiro estiver bloqueado retorna sem fazer nada
    if(this === firstCard) return; //se ao clicar na mesma carta pela segunda vez retorna sem faze nada

    this.classList.add('flip');
    if(!hasFlippedCard){
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    hasFlippedCard = false;
    checkForMatch();
}

function checkForMatch() {
        
    if(firstCard.dataset.card === secondCard.dataset.card) {
        firstCard.classList.remove('untapped');
        secondCard.classList.remove('untapped');
        if (document.querySelectorAll('.untapped').length === 0) {
            document.querySelector("#popup").style.display = "flex";
        }
        disableCards();
        return
    }

    unflipCards();

}

function disableCards () {
    firstCard.removeEventListener ('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard()
}

function resetBoard () {
    [hasFlippedCard,lockBoard] = [false,false];
    firstCard, secondCard = [null, null];

}


function unflipCards () {

    lockBoard = true;
    
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard()
    },1000);


}


function selectImages (qnty) {

    let subList = []
    for (let index = 0; index < qnty; index++) {

        let card = imageList.cards[Math.floor(Math.random() * imageList.cards.length )];

        if(subList.includes(card)){
            index--;
        }else{
            subList.push(card);
        }
    }

    return subList;

}

function clearBoard() {
    document.querySelectorAll('.card').forEach((card) => {
        card.remove()
    })
}

document.querySelectorAll('.btn-board-type').forEach(btn => {
    btn.addEventListener('click', () => {
        layout = btn.dataset.classBoard;
        clearBoard()
        spreadCards(parseInt(btn.dataset.qnty));
        document.getElementById('popup').style.display = "none";
    })
})