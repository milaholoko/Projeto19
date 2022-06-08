var PLAY = 1;
var END = 0;
var gameState = PLAY;

var fairy, fairyImage;
var ground, invisibleGround, groundImage;


var obstaclesGroup, obstacle1, obstacle2;
var backgroundImg
var score=0;


var gameOver, restart;


function preload(){

  backgroundImg = loadImage("assets/floresta.webp")
 
  fairyImage = loadImage("assets/fadaNotPng.png")
  
  groundImage = loadImage("assets/Ground_(front_layer).png");
  
  
  obstacle1 = loadImage("assets/matagal1.webp");
  obstacle2 = loadImage("assets/pedra1.png");
  
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  
  fairy = createSprite(50,height-70,20,50);
  
  
  fairy.setCollider('circle',0,0,350)
  fairy.scale = 0.10
  // fairy.debug=true
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //fairy.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && fairy.y  >= height-120) {
      jumpSound.play( )
      fairy.velocityY = -10;
       touches = [];
    }
    
    fairy.velocityY = fairy.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    fairy.collide(invisibleGround);
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(fairy)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    fairy.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    
  
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}


function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = fairy.depth;
    fairy.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  fairy.changeAnimation("running",fairy_running);
  
  score = 0;
  
}
