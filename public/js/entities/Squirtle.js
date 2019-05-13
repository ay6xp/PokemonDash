import Entity, {Sides, Trait, AttackModes} from '../Entity.js';
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

class Behavior extends Trait {
    constructor() {
        super('behavior');
        this.hideTime = 0;
        this.hideDuration = 5;
        this.panicSpeed = 150;
        this.defaultSpeed = -30;
        this.walkSpeed = null;       
        this.following = false;
        this.direction = 0;
        this.animationTime = 0;
   
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
         if (us.state == AttackModes.ATTACKING)
         {
             them.killable.kill();
         }   
      
    }
    attack(us, them) {     
      if (us.state == AttackModes.DEFAULT){
        us.size.set(34, 20);
        us.pendulumRun.enabled = true;       
        if(them.pos.x > us.pos.x) {
            us.pendulumRun.speed = this.panicSpeed;
        } else {
            us.pendulumRun.speed = -1 * this.panicSpeed;
        }
        us.state = AttackModes.ATTACKING;  
      }    
     
    }

    defaultState(us) {
        if(us.state !== AttackModes.HIDING && us.state !== AttackModes.PANIC ) {
       
        us.behavior.following = false;
        us.state = AttackModes.DEFAULT;
        us.size.set(34,34);
        us.pendulumRun.speed = this.defaultSpeed;
        this.animationTime = 0;
        }
    }

    handleStomp(us, them) {        
        if(us.state === AttackModes.DEFAULT) {
            this.hide(us);
        } else if (us.state === AttackModes.HIDING) {            
            us.killable.kill();
            us.vel.set(100,-200);
            us.solid.obstructs = false;
        } else if (us.state === AttackModes.PANIC) {
            this.hide(us);
        }
    }
     handleNudge(us, them) {
        if (us.state === AttackModes.DEFAULT && them.state !== AttackModes.ATTACKING) {
            them.killable.kill();
        }
        if (us.state === AttackModes.HIDING){
            this.panic(us, them);
         } else if (us.state === AttackModes.PANIC) {
             const travelDir = Math.sign(us.vel.x);
             const impactDir = Math.sign(us.pos.x - them.pos.x);
             if (travelDir !== 0 && travelDir !== impactDir) {
                them.killable.kill();
             }          
         }
       
     }
    hide(us) {
        us.vel.x = 0;
        us.size.set(34,20);
        us.pendulumRun.enabled = false;
        if (this.walkSpeed === null) {
            this.walkSpeed = us.pendulumRun.speed;
        }
        this.hideTime = 0;
        us.state = AttackModes.HIDING;        
    }

    unhide(us) {
        us.size.set(34,34);
        us.pendulumRun.enabled = true;
        us.pendulumRun.speed = this.walkSpeed;
        us.state = AttackModes.DEFAULT;
    }
    panic(us,them) {
        us.pendulumRun.enabled = true;
        us.pendulumRun.speed = this.panicSpeed * Math.sign(them.vel.x);
        us.state = AttackModes.PANIC;
    }
    update(us, deltaTime) {
        if (us.state === AttackModes.HIDING || us.state === AttackModes.PANIC) {
        
            this.hideTime += deltaTime;             
            if (this.hideTime > this.hideDuration) {
                this.unhide(us);
            }
        }
        if (us.state === AttackModes.ATTACKING) {
            this.animationTime += deltaTime;
        }
        if(us.killable.dead) {            
            this.hide(us);
        }
        if(us.vel.x > 0) {
            this.direction = 1;
        } else {
            this.direction = 0;
        }
      
    }
  
}

function inView(candidate) {

    if(candidate.name == "pikachu") { 
        
        if(this.AIBounds.inSight(candidate.bounds) && !this.behavior.following
         && (
            (candidate.pos.x < this.pos.x && !this.behavior.direction) || 
            (candidate.pos.x > this.pos.x && this.behavior.direction)             
        )
        // make sure squirtle only attacks when on same plane asplayer
         && (candidate.pos.y + Math.abs(candidate.size.y - this.size.y) >= this.pos.y)           
         

        ) 
        {   
           
           this.behavior.attack(this, candidate);
           this.behavior.following = true;
        } 
        else if (!this.AIBounds.inSight(candidate.bounds) && this.behavior.following) {      
            this.behavior.defaultState(this);
        }
      
        
    }
}


function createSquirtleFactory(sprite) {
    const runAnim = sprite.animations.get('run');
    const wakeAnim = sprite.animations.get('wake');
    const spinAnim = sprite.animations.get('spin');
    function routeAnim(squirtle) {
        if (squirtle.state === AttackModes.HIDING) {
            if(squirtle.behavior.hideTime > 3) {
               
                return wakeAnim(squirtle.behavior.hideTime);
            }
            return "hiding";
        }

        if (squirtle.state === AttackModes.PANIC)  {
            return "hiding";
        }

        if (squirtle.state === AttackModes.ATTACKING) {
            return spinAnim(squirtle.behavior.animationTime);
        }
        
        return runAnim(squirtle.lifetime);
    }

    function drawSquirtle(context) {
        sprite.draw(routeAnim(this), context, 0, 0, this.vel.x > 0);        
    }

    return  function createSquirtle() {
        const squirtle = new Entity();              
        squirtle.size.set(34, 34);
        squirtle.addTrait(new Solid());
        squirtle.addTrait(new PendulumRun());
        squirtle.addTrait(new Physics()); 
        squirtle.addTrait(new Killable())
        squirtle.addTrait(new Behavior());
        squirtle.dimension.set(120,40);
        squirtle.draw = drawSquirtle;
        squirtle.inView = inView;

        return squirtle;
       
    }
}