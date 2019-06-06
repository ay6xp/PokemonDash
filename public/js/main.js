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
         level.comp.draw(context, camera);
        } else{
            level.sound.stop();
        }     
       
     }
    
         timer.start();   
} 

 async function loadStartMenu(canvas, state) {
     const context = canvas.getContext('2d');
     const bgImage = await loadImage("/img/pokemondash.jpeg");  
     let sound = new Audio("/sounds/opening.mp3");
     context.drawImage(bgImage, 0, 0);

     function Button(xLeft, xRight, yTop, yBottom) {
         this.xLeft = xLeft;
         this.xRight = xRight;
         this.yTop = yTop;
         this.yBottom = yBottom;
         this.checkClicked = function(mouseX, mouseY) {
            if(this.xLeft <= mouseX && this.xRight >= mouseX && this.yTop <= mouseY && this.yBottom >= mouseY) return true;
         }
     }   
    
     let startButton = new Button(317, 407, 213, 248);
     function clickedScreen(event) {            
         let mouseX = event.pageX - canvas.offsetLeft;
         let mouseY = event.pageY - canvas.offsetTop;
         console.log(mouseX, mouseY);
         
        if(startButton.checkClicked(mouseX, mouseY)) {
            console.log("start button clicked");
            canvas.width = 256;
            canvas.height = 240; 
            game_state.state = gamestate.PLAYING;
            document.removeEventListener("click", clickedScreen);
            loadGame(canvas,state);
            if(!sound.paused) sound.pause();
           
        } else{
            if(sound.paused) {
                sound.play();            
            } else {
                sound.pause();
            }
        }
        
        
     
   
    }
    document.addEventListener("click", clickedScreen);
}
const canvas = document.getElementById('screen');
let game_state = {state : gamestate.GAMEMENU};
loadStartMenu(canvas, game_state);
   

