import Entity from "./Entity.js";
import Jump from "./traits/Jump.js";

import Go from "./traits/Go.js";
import { loadSpriteSheet } from "./loaders.js";
import {createAnim} from "./Animation.js";


export function createPikachu() {
    return loadSpriteSheet('pikachu')
        .then(pikachuSprite => {
            const pikachu = new Entity();
            pikachu.size.set(40,40);
            
            pikachu.addTrait(new Jump());
            
            pikachu.addTrait(new Go());
            const runAnim = createAnim(['run-1', 'run-2', 'run-3', 'run-4'],10);
            function routeFrame(pikachu) {
                if (pikachu.go.dir !== 0) {               
                    return runAnim(pikachu.go.distance);
                }
                return 'idle';
            }
           
            pikachu.draw = function drawPikachu(context) {
                pikachuSprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0);   
            }
           

            return pikachu;
        }); 

}