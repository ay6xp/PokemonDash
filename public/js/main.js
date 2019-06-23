import {createLevelLoader} from "./loaders/level.js";
import {createCollisionLayer} from "./layers/collisions.js";
import {loadPikachu} from "./entities/Pikachu.js";
import {setupKeyboard} from "./input.js";
import Timer from "./Timer.js";
import Camera from "./Camera.js";
import Entity from './Entity.js';

import {setupMouseControl} from "./debug.js";

import { loadEntities } from "./entities.js";
import PlayerController from "./traits/PlayerController.js";
import { loadFont } from "./loaders/font.js";
import { createDashboardLayer } from "./layers/dashboard.js";
import { loadImage } from "./loaders.js";
import {sound} from "./Sound.js";

export const gamestate = {
    PLAYING : Symbol('playing'),
    PAUSED : Symbol('paused'),
    GAMEOVER : Symbol('gameover'),
    GAMEMENU : Symbol('gamemenu')   
}

function createPlayerEnvironment(playerEntity, level) {
    const playerEnv = new Entity("playerEnv");
    const playerControl = new PlayerController();
    playerControl.checkpoint.set(64,64);
    playerControl.setPlayer(playerEntity);
    playerEnv.addTrait(playerControl);
    playerControl.setLevel(level);    
    return playerEnv;
}



async function loadGame(canvas, state) {
    const context = canvas.getContext('2d');
    const [entityFactory, font] = await Promise.all([loadEntities(), loadFont()]);
    const loadLevel = await createLevelLoader(entityFactory);
    const level = await loadLevel('1-1');

    const camera = new Camera();
     window.camera = camera;
     const pikachu = await entityFactory.pikachu();  
    
     
     const playerEnv = createPlayerEnvironment(pikachu, level);
     

    const input = setupKeyboard(pikachu, game_state); 
  
    
 
     input.listenTo(window);
     
     level.entities.add(playerEnv);
     
     level.comp.layers.push(createDashboardLayer(font, playerEnv));   
     //level.comp.layers.push(createCollisionLayer(level), createCameraLayer(camera));
     //level.comp.layers.push(createCollisionLayer(level));
    
     level.playBackgroundMusic("/sounds/01-main-theme-overworld.mp3");
      
     const timer = new Timer(1/60);
 
     timer.update = function update(deltaTime) { 
         if(game_state.state === gamestate.PLAYING){             
         if(level.sound.isPaused) {
             level.sound.play();
         }
         level.update(deltaTime);
         if (pikachu.pos.x > 100) {
             camera.pos.x = Math.max(0,pikachu.pos.x - 100);
             
         }
         if(pikachu.pos.x === 3270) {
             alert("you win! game isn't done yet, but hope you had fun!");
         }
         level.comp.draw(context, camera);
        } else{
            level.sound.stop();
        }     
       
     }
    
         timer.start();   
} 

 async function loadStartMenu(canvas, state) {
     const context = canvas.getContext('2d');
     const bgImage = await loadImage("/img/pokemondashkeys.jpg");  
     const helpImage = await loadImage("/img/howtoplay.jpeg");
     let sound = new Audio("/sounds/opening.mp3");
      drawStartMenu();

      let startButton = new Button(376, 489, 255, 289);
      let helpButton = new Button(336,539, 315, 347 );
      let backButton = new Button(25, 138, 464, 513);
      let highScoreButton = new Button(345, 546, 368, 544);
      let helpMenuVisible = false;

     function Button(xLeft, xRight, yTop, yBottom) {
         this.xLeft = xLeft;
         this.xRight = xRight;
         this.yTop = yTop;
         this.yBottom = yBottom;
         this.checkClicked = function(mouseX, mouseY) {
            if(this.xLeft <= mouseX && this.xRight >= mouseX && this.yTop <= mouseY && this.yBottom >= mouseY) return true;
         }
     }
     
     function drawStartMenu() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(bgImage, 0, 0);
     }
    

    
     function clickedScreen(event) {            
         let mouseX = event.pageX - canvas.offsetLeft;
         let mouseY = event.pageY - canvas.offsetTop;  
        
        // if(startButton.checkClicked(mouseX, mouseY)) {            
        //     canvas.width = 256;
        //     canvas.height = 240; 
        //     game_state.state = gamestate.PLAYING;
        //     document.removeEventListener("click", clickedScreen);
        //     loadGame(canvas,state);
        //     if(!sound.paused) sound.pause();
           
        // } 
        // else if(helpButton.checkClicked(mouseX, mouseY)) {           
        //     context.clearRect(0, 0, canvas.width, canvas.height);
        //     context.drawImage(helpImage, 0, 0);
        // }

        // else if (backButton.checkClicked(mouseX, mouseY)) {          
        //     drawStartMenu();
        // }  
        // else if (highScoreButton.checkClicked(mouseX, mouseY)) {
        //     alert("sorry, not available yet!");
        // }      
        //else{
            if(sound.paused) {
                sound.play();            
            } else {
                sound.pause();
            }
        //}
        
      
        
   
    }

    function pressedKey(event) {
       if(event.code === "KeyP") {
        canvas.width = 256;
        canvas.height = 240; 
        game_state.state = gamestate.PLAYING;
        document.removeEventListener("keyup", clickedScreen);
        loadGame(canvas,state);
        if(!sound.paused) sound.pause();       
       }
       else if (event.code === "KeyH") {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(helpImage, 0, 0);
        helpMenuVisible = true;
       } else if (event.code === "KeyB" && helpMenuVisible) {
           helpMenuVisible = false;
        drawStartMenu();
       }
       else if (event.code === "KeyS") {
        alert("sorry, high scores not available yet!");
       }
    }
    document.addEventListener("click", clickedScreen);
    document.addEventListener("keyup", pressedKey);
}

const canvas = document.getElementById('screen');
let game_state = {state : gamestate.GAMEMENU};
loadStartMenu(canvas, game_state);
   

