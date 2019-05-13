
import { loadMoves } from "../loaders.js";
import { AttackMove } from "../Entity.js";

  
export async function loadThunder() {
    const sprite = await loadMoves("thunder");

    const thunder = sprite.animations.get('thunderbolt-attack');
    function drawThunder(context) {
        sprite.draw(routeAnim(this), context, 0, 0, 1);
    }

    function routeAnim(thunderEntity) {
        return thunder(thunderEntity.animationTime);
    }
    
    return function thunderEntity() {
        const thunderShock = new Thunderbolt('thunderbolt');
        thunderShock.size.set(30,256);
        thunderShock.pos.set(100,100);
        thunderShock.draw = drawThunder;

        return thunderShock;
    }

}

class Thunderbolt extends AttackMove {

    constructor(name) {
        super(name);
        this.ready = false;
        this.duration = 0.65;
        this.engageTime = 0;
        this.animationTime = 0;
        this.amountDamage = 50;
        //need to redo pictures for thunderbolt
    }
    start() {
        this.engageTime = this.duration;
        this.ready = true;
    }
    update(entity, deltaTime)
    {
    
        if(this.engageTime > 0) {
            if(this.ready) {
                let xpos = entity.facing == 1 ? entity.pos.x + 75 : entity.pos.x - 75; 
               
                this.pos.set(xpos, entity.pos.y);
                this.ready = false;
            }
            this.engageTime -= deltaTime;
            this.animationTime += deltaTime;
        } else{
            entity.activeMoves = [];
            this.animationTime = 0;
        }
        
    }  
    collides(entity, candidate) {
        if (candidate.killable) {
            if(!candidate.killable.dead) {
                candidate.killable.kill();
                candidate.pendulumRun.speed = 0;
                }
        }
       
      
    }
   
}

    


