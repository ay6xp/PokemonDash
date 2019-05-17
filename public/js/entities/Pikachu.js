import Entity, {Trait} from "../Entity.js";
import Jump from "../traits/Jump.js";

import Go from "../traits/Go.js";
import {loadSpriteSheet } from "../loaders.js";
import Stomper from "../traits/Stomper.js";
import Killable from "../traits/Killable.js";
import Solid from "../traits/Solid.js";
import Physics from "../traits/Physics.js";
import Basher from "../moves/Basher.js";
import { loadThunder } from "../moves/Thunderbolt.js";

const FAST_DRAG = 1/5000;
const SLOW_DRAG = 1/1000;

export function loadPikachu() {
    return loadSpriteSheet('pikachu')
        .then(createPikachuFactory); 
    
}
class Behavior extends Trait {
    constructor() {
        super('behavior');  
        this.direction = 0;
            
    }
    collides(us, candidate) {       
        if (candidate.name === 'pokeball') {
           this.updateScore();
        }
        if (candidate.name === 'potion') {
            us.health.increaseHealth(10);
        }
        if (candidate.name === "thunderstone") {
            console.log("PIKACHU EVOLVING");
        }
    }

    updateScore() {

    }

    update(us, deltaTime) {
      
       if(us.health.getHealth() <= 0) {
           us.killable.kill();           
       }
       this.direction = us.go.heading;

    }
}

class Health extends Trait {
    constructor(health) {
        super('health');
        this.health = health;
        this.damageTime = 0.5;
        this.engageTime = 0;
        this.animationTime = 0;
        this.damageOffset = 50;
        this.takingDamage = false;
        this.direction = 0;
    }
    getHealth() {
        return this.health;
    }
    setHealth(health) {
        this.health = health;
    }
    increaseHealth(amount) {
        this.health += amount;
    }
    damage(hitFactor, direction) {
        this.takingDamage = true;
        this.health -= hitFactor;
        this.engageTime = this.damageTime;
        this.direction = direction;
    }
    update(entity, deltaTime, level) {
        if(this.engageTime > 0) {           
            this.animationTime += deltaTime;
            this.engageTime -= deltaTime;
            if(this.direction) {
                entity.pos.x -= this.damageOffset * deltaTime;
            } else {
                entity.pos.x += this.damageOffset * deltaTime;
            }
            
        } else {
            this.animationTime = 0;            
            this.takingDamage = false;
        }
        
    }

}

async function loadMoves() {
    const moves = {};
    moves['thunderbolt'] = await loadThunder();
    return moves;
}

function createPikachuFactory(pikachuSprite) {
    const runAnim = pikachuSprite.animations.get('run'); 
    const jumpAnim = pikachuSprite.animations.get('jump');
    const bashAnim = pikachuSprite.animations.get('bash');
    const thunderAnim = pikachuSprite.animations.get('thunderbolt-pose');
    const damageAnim = pikachuSprite.animations.get("damage");  
    const deadAnim = pikachuSprite.animations.get('dead'); 

    function routeFrame(pikachu) {
            if (!pikachu.jump.ready) {               
                return jumpAnim(pikachu.go.distance);
            }
            if (pikachu.bash.ready) {
                return bashAnim(pikachu.go.distance);
            }
            if (pikachu.health.takingDamage) {
                return damageAnim(pikachu.health.animationTime);
            }
            if (pikachu.killable.dead) {
                return "dead";
            }
            if (pikachu.activeMoves.length > 0) {
                return thunderAnim(pikachu.go.distance);
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
    
    
    return async function createPikachu() {
        const pikachu = new Entity("pikachu");
        
        pikachu.size.set(40,40);
        pikachu.dimension.set(40,40);
        
   
        pikachu.addTrait(new Solid());
        pikachu.addTrait(new Jump());
        
        pikachu.addTrait(new Go());
        pikachu.addTrait(new Stomper());
        pikachu.addTrait(new Killable());
        pikachu.addTrait(new Physics());   
        pikachu.addTrait(new Behavior()); 
        pikachu.addTrait(new Health(100));
       
        const moves = await loadMoves();
        pikachu.addMove(moves.thunderbolt());
        pikachu.addTrait(new Basher());     
      
        //pikachu.go.friction = SLOW_DRAG;
        pikachu.turbo = setTurboState;      
        pikachu.turbo(false);
        pikachu.draw = drawPikachu;

        
        //pikachu.chanceBlockCollision = chance;

        return pikachu;

}



}