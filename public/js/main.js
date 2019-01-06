import {loadLevel} from "./loaders.js";
import {createCollisionLayer} from "./layers.js";
import {createPikachu} from "./entities.js";
import {setupKeyboard} from "./input.js";
import Timer from "./Timer.js";
import Camera from "./Camera.js";
import {setupMouseControl} from "./debug.js";
const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');



//parallizeses promises (both run at same time)
Promise.all([
    createPikachu(),
    loadLevel('1-1'),
])
.then(([pikachu, level]) => {
   const camera = new Camera();
   window.camera = camera;
   
    pikachu.pos.set(20,56);
    
    level.entities.add(pikachu);
    level.comp.layers.push(createCollisionLayer(level));
    setupMouseControl(canvas, pikachu, camera);
    const input = setupKeyboard(pikachu);    
   

    input.listenTo(window);


    const timer = new Timer(1/60);

    timer.update = function update(deltaTime) {     
        level.update(deltaTime);
        level.comp.draw(context, camera);
    }
   
        timer.start();
});    

     

   

