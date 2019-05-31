import Entity, {Sides, Trait, AttackModes} from '../Entity.js';
import {loadSpriteSheet} from '../loaders.js';
import PendulumRun from '../traits/pendulum.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import { loadRazorLeaf } from '../moves/RazorLeaf.js';

export function loadBulbasaur() {
    return loadSpriteSheet('bulbasaur')
    .then(createBulbasaurFactory);    
}
class Behavior extends Trait {
    constructor() {
        super('behavior');
        this.behavior = false;
        this.panicTime = 0;
        this.attackTime = 0;
        this.walkSpeed = -30;
        this.attackingDuration = 0.5;
        this.panicDuration = 0.15;
        this.direction = 0;
        this.facing = -1;
        this.prevousX = 0;
    }
    collides(us, them) {
        if(us.killable.dead) {
            return;
        }
        if (them.stomper) {
            if (them.vel.y > us.vel.y) {
                us.killable.kill();
                us.pendulumRun.speed = 0;
        }
     }

        if (them.bash) {          
            if (them.bash.ready) {
                us.killable.kill();
                us.pendulumRun.speed = 0;
            }             
              
            }

    }       
  
    defaultState(us) {
        
        this.following = false;
        us.state = AttackModes.DEFAULT;
        us.pendulumRun.enabled = true;
        this.facing = -1;
       
    }

    refire() {
        this.attackTime = 0;
        this.panicTime = 0;
    }

    update(us, deltaTime) {
        if(us.killable.dead) {
            us.pendulumRun.speed = 0;
        }
       
        if(this.following) {
            us.pendulumRun.enabled= false;
          if(this.attackTime < this.attackingDuration) {
            if(this.attackTime < this.panicDuration) {              
              
                us.state = AttackModes.PANIC;
                
            } else {
             
                us.state = AttackModes.ATTACKING;             
            }          
            
            this.attackTime += deltaTime;
          }        

        
        } else {
            this.panicTime = 0;  
            this.attackTime = 0; 
            us.state = AttackModes.DEFAULT;            
                
        }
        if(us.pos.x > this.prevousX) {
            this.direction = 1;
        } 
        else if (us.pos.x == this.prevousX) {
           // do nothing
        }
        else {
            this.direction = 0;
        }

        this.prevousX = us.pos.x;
      

    }
}
async function loadMoves() {
    const moves = {};
    moves['razorleaf'] = await loadRazorLeaf();
    return moves;
}


async function createBulbasaurFactory(sprite) {
    const runAnim = sprite.animations.get('run');
    const razorAnim = sprite.animations.get('razor-leaf-pose');
    const moves = await loadMoves();
    function routeAnim(bulba) {
        if (bulba.killable.dead) {
            return 'dead';
        }
        else if(bulba.behavior.following) {           
            return razorAnim(bulba.behavior.attackTime);
       
        }
        return runAnim(bulba.lifetime);
    }
    function drawBulbasaur(context) {                  
        sprite.draw(routeAnim(this), context, 0, 0, this.vel.x > 0 && !this.behavior.following || this.behavior.following && (this.behavior.facing)) ;        
    }

    function inView(candidate) {
       
        if(this.AIBounds.inSight(candidate.bounds) && candidate.name === "pikachu" && !this.killable.dead)
        {    
            
            if(this.activeMoves.length == 0 && !candidate.killable.dead 
                && ((candidate.pos.x < this.pos.x && !this.behavior.direction) || 
                (candidate.pos.x > this.pos.x && this.behavior.direction) )            
                && (candidate.pos.y + Math.abs(candidate.size.y - this.size.y) >= this.pos.y)
                ) 
                
                {
                
               
                this.behavior.following = true;
                if(candidate.pos.x > this.pos.x) 
                {
                    this.behavior.facing = 1;
                }
                else {
                    this.behavior.facing = 0;
                }
                this.vel.x = 0;
                if(this.state === AttackModes.ATTACKING) {
                    this.activeMoves.push(this.moves[0]);
                    this.activeMoves[0].start(this, candidate);
                    this.behavior.refire();
                }
               
                
                
            }

        } else if (!this.AIBounds.inSight(candidate.bounds) && candidate.name === "pikachu" && this.behavior.following) {   
                 
           this.behavior.defaultState(this);
        }
    }


    return  function createBulbasaur() {
        const bulba = new Entity();        
        bulba.size.set(40, 40);
        bulba.dimension.set(180, 40);
        bulba.addTrait(new Physics());
        bulba.addTrait(new Solid());
        bulba.addTrait(new PendulumRun());
        bulba.addTrait(new Behavior());
        bulba.addTrait(new Killable());
        
        bulba.addMove(moves.razorleaf());
        bulba.draw = drawBulbasaur;
        bulba.inView = inView;

        return bulba;
       
    }
}