import Entity, {Sides, Trait} from '../Entity.js';
import {loadSpriteSheet} from '../loaders.js';
import PendulumRun from '../traits/pendulum.js';
import Killable from '../traits/Killable.js';
import { loadBulbasaur } from './Bulbasaur.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';

export function loadSquirtle() {
    return loadSpriteSheet('squirtle')
    .then(createSquirtleFactory);    
}

const STATE_RUNNING = Symbol('running');
const STATE_HIDING = Symbol('hiding');
const STATE_PANIC = Symbol('panic');

class Behavior extends Trait {
    constructor() {
        super('behavior');
        this.hideTime = 0;
        this.hideDuration = 5;
        this.panicSpeed = 300;
        this.walkSpeed = null;
        this.state = STATE_RUNNING;
    }
    collides(us, them) {
        if(us.killable.dead) {
            return;
        }
        if (them.stomper) {
            if (them.vel.y > us.vel.y) {
                this.handleStomp(us, them);
            } else {
                this.handleNudge(us, them);
            }
           
        }
      
    }
    handleStomp(us, them) {
        if(this.state === STATE_RUNNING) {
            this.hide(us);
        } else if (this.state === STATE_HIDING) {
            us.killable.kill();
            us.vel.set(100,-200);
            us.solid.obstructs = false;
        } else if (this.state === STATE_PANIC) {
            this.hide(us);
        }
    }
     handleNudge(us, them) {
         if (this.state === STATE_RUNNING) {
            them.killable.kill();
         } else if (this.state === STATE_HIDING){
            this.panic(us, them);
         } else if (this.state === STATE_PANIC) {
             const travelDir = Math.sign(us.vel.x);
             const impactDir = Math.sign(us.pos.x - them.pos.x);
             if (travelDir !== 0 && travelDir !== impactDir) {
                them.killable.kill();
             }          
         }
       
     }
    hide(us) {
        us.vel.x = 0;
        us.pendulumRun.enabled = false;
        if (this.walkSpeed === null) {
            this.walkSpeed = us.pendulumRun.speed;
        }
        this.hideTime = 0;
        this.state = STATE_HIDING;
    }

    unhide(us) {
        us.pendulumRun.enabled = true;
        us.pendulumRun.speed = this.walkSpeed;
        this.state = STATE_RUNNING;
    }
    panic(us,them) {
        us.pendulumRun.enabled = true;
        us.pendulumRun.speed = this.panicSpeed * Math.sign(them.vel.x);
        this.state = STATE_PANIC;
    }
    update(us, deltaTime) {
        if (this.state === STATE_HIDING) {
            this.hideTime += deltaTime;
            
            if (this.hideTime > this.hideDuration) {
                this.unhide(us);
            }
        }
    }
}

function createSquirtleFactory(sprite) {
    const runAnim = sprite.animations.get('run');
    const wakeAnim = sprite.animations.get('wake');
    function routeAnim(squirtle) {
        if (squirtle.behavior.state === STATE_HIDING) {
            if(squirtle.behavior.hideTime > 3) {
               
                return wakeAnim(squirtle.behavior.hideTime);
            }
            return "hiding";
        }

        if (squirtle.behavior.state === STATE_PANIC) {
            return "hiding";
        }
        return runAnim(squirtle.lifetime);
    }

    function drawSquirtle(context) {
        sprite.draw(routeAnim(this), context, 0, 0, this.vel.x > 0);        
    }

    return function createSquirtle() {
        const squirtle = new Entity();              
        squirtle.size.set(34, 34);
        squirtle.addTrait(new Solid());
        squirtle.addTrait(new PendulumRun());
        squirtle.addTrait(new Physics()); 
        squirtle.addTrait(new Killable())
        squirtle.addTrait(new Behavior());
        
        squirtle.draw = drawSquirtle;

        return squirtle;
       
    }
}