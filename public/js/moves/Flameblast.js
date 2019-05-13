import { AttackMove } from "../Entity.js";
import { loadMoves } from "../loaders.js";
import Killable from "../traits/Killable.js";

export async function loadFlameblast() {
    const sprite = await loadMoves("flameblast");

    const flame = sprite.animations.get('flameblast-attack');
    function drawFlame(context) {
        sprite.draw(routeAnim(this), context, 0, 0, this.direction);
    }
    function routeAnim(flameEntity) {
        return flame(flameEntity.animationTime);
    }
    return function flameblastEntity() {
        const flameblast = new Flameblast('flameblast');
        flameblast.size.set(30,35);
        flameblast.pos.set(100,100);
      //  flameblast.addTrait(new Killable());
        flameblast.draw = drawFlame;
    
        return flameblast;
    }
   

}


class Flameblast extends AttackMove {
    constructor(name) {
        super(name);
        this.duration = 3;
        this.engageTime = 0;
        this.animationTime = 0;       
        this.direction = 0;      
        this.speed = 100;
        this.frameTime = 0.45;
        this.numberOfFlamesLeft = 3;
        this.collision = false;
        this.amountDamage = 50;
    }

    start(entity, candidate) {
        if (candidate.pos.x > entity.pos.x) {
            this.direction = 0; 
            this.pos.set(entity.pos.x + entity.size.x - 5, entity.pos.y + 30);         
        } else{
            this.pos.set(entity.pos.x, entity.pos.y + 30);
            this.direction = 1;
        }       
        this.engageTime = this.duration;           
        this.ready = true;     
        let dy = (candidate.pos.y - this.pos.y);
        let dx = (candidate.pos.x - this.pos.x);       
        let normalizedVector = Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));   
        this.vel.set(dx/normalizedVector * this.speed, dy/normalizedVector * this.speed);       
        
    }

    update(entity, deltaTime) {
        if(this.engageTime > 0) {         
            this.pos.y += this.vel.y * deltaTime;
            this.pos.x += this.vel.x * deltaTime;       
          
            this.engageTime -= deltaTime;
            if(this.animationTime < this.frameTime) {
                this.animationTime += deltaTime;
            }
          
        } else {                       
            entity.activeMoves = [];
            this.animationTime = 0;
        
        }
            
    }

    collides(us, them) {     
        if(them.name == "pikachu" && !them.killable.dead)
        {
            if(this.engageTime > 0){           
            them.health.damage(this.amountDamage, this.direction);      
            this.engageTime = 0;
        }
        }
     

    }

}