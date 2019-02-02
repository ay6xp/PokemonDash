import Entity from "../Entity.js";
import Jump from "../traits/Jump.js";

import Go from "../traits/Go.js";
import {loadSpriteSheet } from "../loaders.js";
import Stomper from "../traits/Stomper.js";
import Killable from "../traits/Killable.js";
import Solid from "../traits/Solid.js";
import Physics from "../traits/Physics.js";

const FAST_DRAG = 1/5000;
const SLOW_DRAG = 1/1000;

export function loadPikachu() {
    return loadSpriteSheet('pikachu')
        .then(createPikachuFactory); 
    
}

function createPikachuFactory(pikachuSprite) {
    const runAnim = pikachuSprite.animations.get('run'); 
    const jumpAnim = pikachuSprite.animations.get('jump');
        function routeFrame(pikachu) {
            if (!pikachu.jump.ready) {
                return jumpAnim(pikachu.go.distance);
            }
            if (pikachu.go.distance > 0) {               
                return runAnim(pikachu.go.distance);
            }
            return 'idle';
    }
    function setTurboState(turboOn) {
        this.go.friction = turboOn ? FAST_DRAG : SLOW_DRAG;
    }
    function drawPikachu(context) {
        pikachuSprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0);   
    }

    return function createPikachu() {
        const pikachu = new Entity();
        pikachu.size.set(40,40);
        
   
        pikachu.addTrait(new Solid());
        pikachu.addTrait(new Jump());
        
        pikachu.addTrait(new Go());
        pikachu.addTrait(new Stomper());
        pikachu.addTrait(new Killable());
        pikachu.addTrait(new Physics());
        pikachu.killable.removeAfter = 0;
        
        //pikachu.go.friction = SLOW_DRAG;
        pikachu.turbo = setTurboState;
    
        pikachu.turbo(false);
        pikachu.draw = drawPikachu;
    

        return pikachu;

}


}