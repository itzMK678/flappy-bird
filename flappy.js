let board;
let boardheight =  600;
let boardwidth = 360;
let context;  // Declare context here

// bird properties
let birdWidth = 34;
let birdheight = 24;
let birdX = boardwidth / 8;
let birdY = boardheight / 2;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdheight,
    birdImage: null
};

// pipes
let pipearray = [];
let pipeHeight = 512;
let pipeWidth = 64;  // Adjusted to fit the board width
let pipeX = boardwidth;
let pipeY = 0;


let topPipeImg;
let bottomPipeImg;

// physics
let velocityX = -6; // pipe moving leftward
let velocityY = 0; // for bird jumping
let gravity = 0.4;
let gameover = false;
let score = 0 ;


window.onload = function() {
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");

    // Load bird image
    bird.birdImage = new Image();
    bird.birdImage.src = "./images/flappybird.png";
    bird.birdImage.onload = function() {
        // Draw the bird image once it has loaded
        context.clearRect(bird.x, bird.y, bird.width, bird.height); // Clear the placeholder
        context.drawImage(bird.birdImage, bird.x, bird.y, bird.width, bird.height);
    };

    // Load pipe images
    topPipeImg = new Image();
    topPipeImg.src = "./images/toppipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./images/bottompipe.png";

    // Start the animation loop
    requestAnimationFrame(update);
    setInterval(placepipes, 1500); // Create a new pipe every 1500ms
    document.addEventListener("keydown", moveBird);
};

function update() {
    requestAnimationFrame(update);
    if (gameover){
        return ;
    }
    // Clear the entire board
    context.clearRect(0, 0, boardwidth, boardheight);
 
   velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY , 0 ); // apply garvity,limit bird y to top

    // Draw the bird image if it has loaded
    if (bird.birdImage) 
        context.drawImage(bird.birdImage, bird.x, bird.y, bird.width, bird.height);
  
 if (bird.y + bird.height > boardheight){
    gameover = true ;
 }

    // Move and draw each pipe in the pipearray
    for (let i = 0; i < pipearray.length; i++) {
        let pipe = pipearray[i];
        pipe.x += velocityX; // Move the pipe to the left
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x + bird.width > pipe.x + pipe.width) {
        score += 50;
        pipe.passed = true; // Mark this pipe pair as passed
    }

    

        if (detectCollision(bird,pipe)){
            gameover = true ;
        }

        if(gameover){
            context.fillText("GAME OVER",5,90)
        }
    }

    // Remove pipes that have moved off the screen
    pipearray = pipearray.filter(pipe => pipe.x + pipe.width > 0);
    //actually it is continously making a new pipearray 

    //score
context.fillStyle = "white";
context.font ="45px sans-serif ";
context. fillText(score, 5 ,  45); // here the (text,x-position,y-position)




}




function placepipes() {

    if (gameover){
        return;
    }
    let randomPipeY = pipeY - pipeHeight/4 - Math.random() * (pipeHeight/2);
    let openingSpace = board.height / 4;
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipearray.push(topPipe);

    let bottonPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipearray.push(bottonPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        velocityY = -6;

        //reset 
        if(gameover){
            bird.y = birdY;
            pipearray = [];
            score= 0 ;
            gameover = false
        }
    }
}
 function detectCollision(a,b){
    return  a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height >b.y ;
}