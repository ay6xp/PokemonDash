import {loadLevel} from "./loaders.js";
import Compositor from "./Compositor.js";
import {createPikachu} from "./entities.js";
import Timer from "./Timer.js";
import {createBackgroundLayer, createSpriteLayer} from "./layer.js";
import {loadBackgroundSprites} from "./sprites.js";
import KeyboardState from "./KeyboardState.js";
const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');



//parallizeses promises (both run at same time)
Promise.all([
    createPikachu(),
    loadBackgroundSprites(),
    loadLevel('1-1'),
])
.then(([pikachu, backgroundSprites, level]) => {
    const comp = new Compositor();
    const gravity = 1000;
    pikachu.pos.set(64,180);
   
    const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
    comp.layers.push(backgroundLayer);

    const SPACE = 32;
    const input = new KeyboardState();
    input.addMapping(SPACE, keyState => {
        if (keyState) {
            pikachu.jump.start();
        } else {
            pikachu.jump.cancel();
        }
    });
    input.listenTo(window);

const spriteLayer = createSpriteLayer(pikachu);
    comp.layers.push(spriteLayer);
    const timer = new Timer(1/60);

    timer.update = function update(deltaTime) {     
        pikachu.update(deltaTime);
        comp.draw(context);
        pikachu.vel.y += gravity * deltaTime;
    }
   
        timer.start();
});    

     

   

