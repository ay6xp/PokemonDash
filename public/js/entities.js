import Entity from "./Entity.js";
import {loadPikachuSprite} from "./sprites.js";
import Velocity from "./traits/Velocity.js";
import Jump from "./traits/Jump.js";


export function createPikachu() {
    return loadPikachuSprite()
        .then(pikachuSprite => {
            const pikachu = new Entity();
            
            pikachu.addTrait(new Velocity());
            pikachu.addTrait(new Jump());
            pikachu.draw = function drawPikachu(context) {
                pikachuSprite.draw('idle', context, this.pos.x, this.pos.y);   
            }
           

            return pikachu;
        }); 

}