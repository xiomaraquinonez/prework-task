// var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0

// global constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [];
var length = 12;
var progress = 0; //tracks how far along the game the player is
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var strikes = 0;

function startGame(){
    //initialize game variables
    progress = 0;
    gamePlaying = true;
    strikes = 0;
  
    //pattern for the loop with random numbers
    pattern = [];
    var i;
  
    for (i = 0; i < length; i++){
        pattern.push(randomPattern(6));
    }
  
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    playClueSequence();
}

function stopGame(){
    progress = 0;
    gamePlaying = false;
  
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 320,
  3: 397,
  4: 466.2,
  5: 310.5,
  6: 450
}

// plays a tone for the amount of time specified
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}

// continues playing sound until stopTone is called
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}

function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

// loops to repeat code once for each clue we want to play
function playClueSequence(){
  guessCounter = 0;
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You won.");
}

// has a parameter representing which button was pressed
function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  // game logic based on flow chart
  if(pattern[guessCounter] == btn){
  //Guess was correct!
  if(guessCounter == progress){
    if(progress == pattern.length - 1){
      //GAME OVER: WIN!
      winGame();
    }else{
      //Pattern correct. Add next segment
      progress++;
      playClueSequence();
    }
  }else{
    //so far so good... check the next guess
    guessCounter++;
  }
 }else{
  //Guess was incorrect
  //GAME OVER: LOSE!
    if (strikes < 2){
       strikes++;
    }
    else{
      loseGame();
    }
  }
}

//function to generate a random pattern
function randomPattern(max) {
  return Math.floor(Math.random() * Math.floor(max) + 1);
}