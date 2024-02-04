const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

var gameBoard = document.getElementById("gameBoard");

var message = document.getElementById("message");

var unit = 80;
var ratio = 1;


if(window.innerWidth <= 960){
    ratio = window.innerWidth / 960;
    unit = unit * ratio;
    canvas.width = 960 * ratio;
    canvas.height = 540 * ratio;
    gameBoard.style.width = 960 * ratio + "px";
    gameBoard.style.height = 540 * ratio + "px";
}else{
    canvas.width = 960;
    canvas.height = 540;
}


var playerImg = new Image();
playerImg.src = "./player.svg";
var groundImg = new Image();
groundImg.src = "./ground.svg";
var spikeImg1 = new Image();
spikeImg1.src = "./spike1.svg";
var spikeImg2 = new Image();
spikeImg2.src = "./spike2.svg";
var spikeImg3 = new Image();
spikeImg3.src = "./spike3.svg";
var spikeTopImg1 = new Image();
spikeTopImg1.src = "./spikeTop1.svg";
var spikeTopImg2 = new Image();
spikeTopImg2.src = "./spikeTop2.svg";
var spikeTopImg3 = new Image();
spikeTopImg3.src = "./spikeTop3.svg";

playerImg.onload = () => {
    ctx.drawImage(playerImg, unit, unit, unit, unit);
}
function drawGround(){
    ctx.drawImage(groundImg, -0.2 * unit, -0.2 * unit, unit * 16, 1.2 * unit);
    ctx.drawImage(groundImg, -0.2 * unit, canvas.height - unit, unit * 16, 1.2 * unit);
    console.log(ratio+ " " + unit);
}

const FLOOR_Y = 5.75 * unit;
const CEIL_Y = unit;

const START_X = canvas.width;
const SPEED_X = -10 * ratio;
class Obstacle {
    type;
    spikes;
    constructor(){
        this.type = Math.floor(Math.random() * 9) + 1;
        this.spikes = [];
        if(this.type <= 3){
            this.spikes.push(new Spike(this.type, -1, START_X));
        }
        else if(this.type <= 6){
            this.spikes.push(new Spike(this.type - 3, 1, START_X));
        }
        else if(this.type == 7){
            this.spikes.push(new Spike(1, -1, START_X));
            this.spikes.push(new Spike(1, 1, START_X));
        }
        else if(this.type == 8){
            this.spikes.push(new Spike(2, -1, START_X));
            this.spikes.push(new Spike(1, 1, START_X));
        }
        else if(this.type == 9){
            this.spikes.push(new Spike(1, -1, START_X));
            this.spikes.push(new Spike(2, 1, START_X));
        }
    }
    
    move(){
        for(var i = 0; i < this.spikes.length; i++){
            this.spikes[i].move();
        }
    }
    draw(){
        for(var i = 0; i < this.spikes.length; i++){
            this.spikes[i].draw();
        }
    }
    onCollision(x, y){
        for(var i = 0; i < this.spikes.length; i++){
            if(this.spikes[i].onCollision(x, y)){
                return true;
            }
        }
        return false;
    }
}

class Spike {
    height;
    dir; //1 : FLOOR | -1 : CEIL
    xPos;
    constructor(height, dir, xPos){
        this.height = height;
        this.dir = dir;
        this.xPos = xPos;
    }
    move(){
        this.xPos += SPEED_X;
    }
    onCollision(x, y){
        if(this.xPos >= x + unit || this.xPos <= 0){
            return false;
        }
        
        if(this.height == 1 && this.dir == -1){
            var vertexX = this.xPos + unit / 2;
            var vertexY = CEIL_Y + unit;
            if(x <= vertexX && x + unit >= vertexX && y <= vertexY){
                return true;
            }
        }else if(this.height == 2 && this.dir == -1){
            var vertexX = this.xPos + unit / 2;
            var vertexY = CEIL_Y + unit * 2;
            if(x <= vertexX && x + unit >= vertexX && y <= vertexY){
                return true;
            }else if(y < vertexY - unit){
                return true;
            }
        }else if(this.height == 3 && this.dir == -1){
            var vertexX = this.xPos + unit / 2;
            var vertexY = CEIL_Y + unit * 3;
            if(x <= vertexX && x + unit >= vertexX && y <= vertexY){
                return true;
            }else if(y < vertexY - unit){
                return true;
            }
        }
        else if(this.height == 1 && this.dir == 1){
            var vertexX = this.xPos + unit / 2;
            var vertexY = FLOOR_Y - unit;
            if(x <= vertexX && x + unit >= vertexX && y + unit >= vertexY){
                return true;
            }
        }else if(this.height == 2 && this.dir == 1){
            var vertexX = this.xPos + unit / 2;
            var vertexY = FLOOR_Y - unit * 2;
            if(x <= vertexX && x + unit >= vertexX && y + unit >= vertexY){
                return true;
            }else if(y - unit > vertexY){
                return true;
            }
        }else if(this.height == 3 && this.dir == 1){
            var vertexX = this.xPos + unit / 2;
            var vertexY = FLOOR_Y - unit * 3;
            if(x <= vertexX && x + unit >= vertexX && y + unit >= vertexY){
                return true;
            }else if(y - unit > vertexY){
                return true;
            }
        }

    }
    draw(){
        if(this.dir == 1){
            if(this.height == 1){
                ctx.drawImage(spikeImg1, this.xPos, FLOOR_Y - unit, unit, unit);
            }else if(this.height == 2){
                ctx.drawImage(spikeImg2, this.xPos, FLOOR_Y - 2 * unit, unit, unit * 2);
            }else{
                ctx.drawImage(spikeImg3, this.xPos, FLOOR_Y - 3 * unit, unit, unit * 3);
            }
        }
        else{
            if(this.height == 1){
                ctx.drawImage(spikeTopImg1, this.xPos, CEIL_Y, unit, unit);
            }else if(this.height == 2){
                ctx.drawImage(spikeTopImg2, this.xPos, CEIL_Y, unit, unit * 2);
            }else{
                ctx.drawImage(spikeTopImg3, this.xPos, CEIL_Y, unit, unit * 3);
            }
        }
        
        
        
        
        
        
    }
}

                            //PLAYER MOVEMENT
                            //---------------
class Player {
    yPos;
    xPos;
    Yspeed;
    dir; //1 : ⬇ | -1 : ⬆

    constructor(){
        this.xPos = unit;
        this.yPos = FLOOR_Y - unit;
        this.ySpeed = 0;
        this.dir = 1;
    }
    draw(){
        ctx.drawImage(playerImg, this.xPos, this.yPos, unit, unit);
    }
    move(){
        if(this.yPos == FLOOR_Y - unit && this.dir == 1){

        }else if(this.yPos == CEIL_Y && this.dir == -1){
            
        }else{
            this.yPos += this.ySpeed;
            this.ySpeed += this.dir;
            if(this.yPos > FLOOR_Y - unit){
                this.yPos = FLOOR_Y - unit;
                this.ySpeed = 0;
            }else if( this.yPos < CEIL_Y){
                this.yPos = CEIL_Y;
                this.ySpeed = 0;
            }
        }
        
    }
    reverse(){
        this.dir = - this.dir;
        this.ySpeed = this.dir * 3;
    }
}


var player = new Player();
var isGaming = false;
function gameStart(){
    isGaming = true;
    message.classList.add("hidden");
    message.classList.remove("visible");
    player = new Player();
    player.dir = -1;
    animate();
}
function gameOver(){
    isGaming = false;
    message.classList.remove("hidden");
    message.classList.add("visible");
}
var animateTime = 0;
var respawnTime = 0;
var keyTime = 0;
var requestId = 0;
var obstacles = [];
function respawnObstacles(){
    obstacles.push(new Obstacle());
}
function deletePassedObstacle(){
    for(var i = 0; i < obstacles.length; i++){
        if(obstacles[i].spikes[0].xPos < - unit){
            obstacles.shift();
        }
    }
}
function animate(now = 0){
    if(!isGaming) return;
    if(now - respawnTime > 1000){
        respawnObstacles();
        deletePassedObstacle();
        respawnTime = now;
    }
    if(keyPressed){
        if(now - keyTime > 90){
            player.reverse();
            keyTime = now;
        }
    }
    if(now - animateTime > 18){
        

        ctx.clearRect(0, 0, 960, 540);
        drawGround();
        player.move();
        player.draw();
        for(var o = 0; o < obstacles.length; o++){
            obstacles[o].move();
            obstacles[o].draw();
            if(obstacles[o].onCollision(player.xPos, player.yPos)){
                gameOver();
            }
        }
        animateTime = now;
    }

    requestId = requestAnimationFrame(animate);
}

gameStart();

//EVENT

var keyPressed = false;

window.addEventListener("keydown", (event) => {
    
    if(event.keyCode == 32){
        keyPressed = true;
        //player.reverse();
    }
});
window.addEventListener("keyup", (event) => {
    
    if(event.keyCode == 32){
        keyPressed = false;
        //player.reverse();
    }
});