// Create cards
class Card{
    constructor(suit, value, scoreValue){
        this.suit = suit;
        this.value = value;
        this.scoreValue = scoreValue;
    }
}

// DOM variables
let playerOneCardInfo = document.getElementById("player-one-card-details");
let playerTwoCardInfo = document.getElementById("player-two-card-details");
let winner = document.getElementById("winner-display");
let btnHit = document.getElementById("hit-btn");
let playerOneHand = document.getElementById("player-one-hand");
let virtualCard = document.getElementById("player-one-card");
let virtualCard2 = document.getElementById("player-two-card");

// Create deck of cards
const suits = ["spades", "clubs", "hearts", "diamonds"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const scoreValues = [14, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
let deck = [];
function createDeck(){
    deck = [];
    for(i = 0; i < suits.length; i++){
        for(x = 0; x < values.length; x++){
            let card = new Card(suits[i], values[x], scoreValues[x])
            deck.push(card)
        }
    }
    return deck;
}

// Shuffle deck of cards
function shuffleDeck(deck){
    let currentIndex = deck.length;
    for(i = 0; i < 11; i++){
        while (currentIndex != 0){
            let randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex --;
            [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
        }
    }
    return deck;
}

// Player Class
class Player{
    constructor(name, hand){
        this.name = name;
        this.hand = [];
    }
}

// Create Players and deal cards
let playerOne = new Player("Player One")
let playerTwo = new Player("Player Two")

// Create game 
function newGame(){
    // Enable controls
    btnHit.disabled = false;

    // Get deck of cards and suffle them
    deck = createDeck();
    shuffleDeck(deck);
    
    // Reset player hand
    playerOne.hand = [];
    playerTwo.hand = [];

    // Deal deck of cards to players
    for(i = 0; i < deck.length; i++){
        if(i % 2 == 0){
            playerOne.hand.push(deck[i])
        }
        else{
            playerTwo.hand.push(deck[i])
        }
    }
    
    // Get current player info
    let currentPlayer = playerOne.name
    document.getElementById("currentPlayer").innerHTML = currentPlayer;
    document.getElementById("player-one-hand-length").innerHTML = playerOne.hand.length;
    document.getElementById("player-two-hand-length").innerHTML = playerTwo.hand.length;
    playerOneCardInfo.innerHTML = "";
    playerTwoCardInfo.innerHTML = "";
    winner.innerHTML = ""

    // Create stack of draggable cards for the player's hand
    createVirtualHand();
}

// Create array to temporarily store winnings
let winnings = [];

// Handle drag and drop behavior of player cards

function allowDrop(ev){
    ev.preventDefault();
}

function createVirtualHand() {
    for (i = 0; i < playerOne.hand.length; i++) {
        playerOneHand.innerHTML = "<div draggable='true' class='player-one-card'></div>";
    }
}

// Handle playing cards/gameplay
function hit(){
    // Draw cards from each players hand
    let playerOneCard = playerOne.hand[0]
    let playerTwoCard = playerTwo.hand[0]
    
    // Remove "top cards" from players' hands
    playerOne.hand.shift();
    playerTwo.hand.shift();

    // Put cards into winnings array
    // let winnings = [];
    winnings.push(playerOneCard, playerTwoCard);

    // Display card info to user
    playerOneCardInfo.innerHTML = playerOneCard.value + "<br>" + playerOneCard.suit;
    playerTwoCardInfo.innerHTML = playerTwoCard.value + "<br>" + playerTwoCard.suit;

    // A Stalemate

    // A Tie
    if(playerOneCard.scoreValue == playerTwoCard.scoreValue && playerOne.hand == [] ||
        playerOneCard.scoreValue == playerTwoCard.scoreValue && playerTwo.hand == []
    ){
        winner.innerHTML = "It's a stalemate! Start a new game!"
        btnHit.disabled = true;
    }
    else if(playerOneCard.scoreValue == playerTwoCard.scoreValue){
        // Each player "draws" 3 and adds cards to the winnings array
        winnings.push(...playerOne.hand.splice(0,3), ...playerTwo.hand.splice(0,3));

        // Display it's a tie
        winner.innerHTML = "This hand is a tie. Hit to continue."
    }
    // Player One Wins
    else if(playerTwoCard.scoreValue < playerOneCard.scoreValue){
       // Put winnings at the "bottom" of player one's hand
        playerOne.hand.push(...winnings);

        // Display winner
        winner.innerHTML = playerOne.name + " wins this hand!"

        // Clear winnings
        winnings = [];
    }
    // Player Two Wins
    else if(playerOneCard.scoreValue< playerTwoCard.scoreValue){
        // Put winnings at the "bottom" of player two's hand
        playerTwo.hand.push(...winnings);

        // Display winner
        winner.innerHTML = playerTwo.name + " wins this hand!"

        // Clear winnings
        winnings = [];
    }
    virtualCard.style.animation = "p1-discard .5s linear infinite";
    virtualCard2.style.animation = "p2-discard .5s linear infinite";
    setTimeout(function(){
        clearAnimations()
        playerOneCardInfo.innerHTML = ""
    },600);
    
    document.getElementById("player-one-hand-length").innerHTML = playerOne.hand.length;
    document.getElementById("player-two-hand-length").innerHTML = playerTwo.hand.length;
   
    function clearAnimations() {
        virtualCard.style.animation = "";
        virtualCard2.style.animation = "";
        playerOneCardInfo.innerHTML = "";
        playerTwoCardInfo.innerHTML = "";
    }
}

// End game when a player's hand reaches 0
if(playerOne.hand = []){
    winner.html = playerTwo.name + " wins the war!"
    btnHit.disabled = true;
}
if(playerTwo.hand = []){
    winner.html = playerOne.name + " wins the war!"
    btnHit.disabled = true;
}

