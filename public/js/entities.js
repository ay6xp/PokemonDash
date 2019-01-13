import Entity from "./Entity.js";
import Jump from "./traits/Jump.js";

import Go from "./traits/Go.js";
import { loadSpriteSheet } from "./loaders.js";
import {createAnim} from "./Animation.js";

const FAST_DRAG = 1/5000;
const SLOW_DRAG = 1/1000;

export function createPikachu() {
    return loadSpriteSheet('pikachu')
        .then(pikachuSprite => {
            const pikachu = new Entity();
            pikachu.size.set(40,40);
            
            pikachu.addTrait(new Jump());
            
            pikachu.addTrait(new Go());
            //pikachu.go.friction = SLOW_DRAG;
            pikachu.turbo = function setTurboState(turboOn) {
                this.go.friction = turboOn ? FAST_DRAG : SLOW_DRAG;
            }
            const runAnim = createAnim(['run-1', 'run-2', 'run-3', 'run-4'],10);
            const jumpAnim = createAnim(['jump-1', 'jump-2', 'jump-3', 'jump-4'], 10);
            function routeFrame(pikachu) {
                if (!pikachu.jump.ready) {
                    return jumpAnim(pikachu.go.distance);
                }
                if (pikachu.go.distance > 0) {               
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