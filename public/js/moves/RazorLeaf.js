import { AttackMove } from "../Entity.js";
import { loadMoves } from "../loaders.js";

export async function loadRazorLeaf() {
    const sprite = await loadMoves("razorleaf");

    const razorLeaf = sprite.animations.get('razor-leaf-attack');

    function drawRazorLeaf(context) {
        sprite.draw(routeAnim(this), context, 0, 0, this.direction);
    }

    function routeAnim(razorEntity) {
        return razorLeaf(razorEntity.animationTime);
    }

    return function razorEntity() {
        const razorLeafAttack = new RazorLeaf("razorleaf");
        razorLeafAttack.size.set(20, 20);
        razorLeafAttack.draw = drawRazorLeaf;
        razorLeafAttack.vel.set(50, 10);

        return razorLeafAttack;
    }

}

class RazorLeaf extends AttackMove {

    constructor(name) {
        super(name);
        this.ready = false;
        this.duration = 2;
        this.engageTime = 0;
        this.animationTime = 0;
        this.amountDamage = 50; 
        this.delay = 0.2;  
    }

    start(entity, candidate) {
        this.engageTime = this.duration;
        this.ready = true;
        this.pos.set(entity.pos.x, entity.pos.y);
        if(candidate.pos.x > entity.pos.x) {
            this.pos.set(entity.pos.x + 10, entity.pos.y);
            this.direction = 1;
        }
        else {
            this.pos.set(entity.pos.x, entity.pos.y);
            this.direction = 0;
        }
    }
    
    update(entity, deltaTime) {
    if(this.delay < 0) {
        if(this.engageTime > 0) {
            if(this.direction){
                this.pos.x += this.vel.x * deltaTime;
            } else{
                this.pos.x -= this.vel.x * deltaTime;
            }
            

            this.engageTime -= deltaTime;
            this.animationTime += deltaTime;
        }
        else {
            entity.activeMoves = [];
            this.animationTime = 0;
            this.delay = 0.2;
        }

    } else {
        this.delay -= deltaTime;
    }
    }

    collides(entity, candidate)
     {
        
        if(candidate.name == "pikachu" && !candidate.killable.dead)
        {
           
            if(this.engageTime > 0){           
            candidate.health.damage(this.amountDamage,!this.direction);      
            this.engageTime = 0;
            }
        }
    }
}



