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

function createPlayerEnvironment(playerEntity) {
    const playerEnv = new Entity();
    const playerControl = new PlayerController();
    playerControl.checkpoint.set(64,64);
    playerControl.setPlayer(playerEntity);
    playerEnv.addTrait(playerControl);
    return playerEnv;
}

async function main(canvas) {
    const context = canvas.getContext('2d');
    const [entityFactory, font] = await Promise.all([loadEntities(), loadFont()]);
    const loadLevel = await createLevelLoader(entityFactory);
    const level = await loadLevel('1-1');

    const camera = new Camera();
     window.camera = camera;
     const pikachu = entityFactory.pikachu();
   
     
     const playerEnv = createPlayerEnvironment(pikachu);
     level.entities.add(playerEnv);
      
     level.comp.layers.push(createDashboardLayer(font, playerEnv));
    
     //level.comp.layers.push(createCollisionLayer(level), createCameraLayer(camera));
    
   
     const input = setupKeyboard(pikachu);    
    
 
     input.listenTo(window);
 
 
     const timer = new Timer(1/60);
 
     timer.update = function update(deltaTime) {     
         level.update(deltaTime);
         if (pikachu.pos.x > 100) {
             camera.pos.x = Math.max(0,pikachu.pos.x - 100);
         }
         level.comp.draw(context, camera);
     }
    
         timer.start();
} 

const canvas = document.getElementById('screen');
main(canvas);
   

