import {loadLevel} from "./loaders.js";
import {createCollisionLayer} from "./layers.js";
import {createPikachu} from "./entities.js";
import {setupKeyboard} from "./input.js";
import Timer from "./Timer.js";

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');



//parallizeses promises (both run at same time)
Promise.all([
    createPikachu(),
    loadLevel('1-1'),
])
.then(([pikachu, level]) => {
   
   
    pikachu.pos.set(20,56);
    
    level.entities.add(pikachu);
    level.comp.layers.push(createCollisionLayer(level));

    const input = setupKeyboard(pikachu);
    
   

    input.listenTo(window);

    // ['mousedown','mousemove'].forEach(eventName => {
    //     canvas.addEventListener(eventName, event=> {
    //         if (event.buttons === 1) {
    //             pikachu.vel.set(0,0);
    //             pikachu.pos.set(event.offsetX, event.offsetY);
    //         }
    //     });
    // });


    const timer = new Timer(1/60);

    timer.update = function update(deltaTime) {     
        level.update(deltaTime);
        level.comp.draw(context);
    }
   
        timer.start();
});    

     

   

