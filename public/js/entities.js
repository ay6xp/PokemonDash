import Entity from "./Entity.js";
import {loadPikachuSprite} from "./sprites.js";
import Velocity from "./traits/Velocity.js";
import Jump from "./traits/Jump.js";

import Go from "./traits/Go.js";

export function createPikachu() {
    return loadPikachuSprite()
        .then(pikachuSprite => {
            const pikachu = new Entity();
            pikachu.size.set(40,40);
            
            pikachu.addTrait(new Jump());
            // pikachu.addTrait(new Velocity());
            pikachu.addTrait(new Go());
           
            pikachu.draw = function drawPikachu(context) {
                pikachuSprite.draw('idle', context, this.pos.x, this.pos.y);   
            }
           

            return pikachu;
        }); 

}