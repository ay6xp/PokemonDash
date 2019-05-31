import Entity, {Trait, Sides, AttackMove, AttackModes} from "../Entity.js";

export default class Basher extends Trait {
    constructor() {
        super('bash');
        this.ready = false;
        this.duration = 0.5;
        this.velocity = 150;
        this.engageTime = 0;
        this.requestTime = 0;
        this.gracePeriod = 0.1;
        this.speedBoost = 0.3;
        this.recovery = 0;
    }

    start() {
        this.ready = true;
        this.requestTime = this.gracePeriod; 
        this.recovery = 1;         
    }

    cancel() {
        this.engageTime = 0;
        this.requestTime = 0;
       
         
    }
    
    update(entity, deltaTime) {
       
        if(this.requestTime > 0) {
            if (this.ready) {
               this.engageTime = this.duration;
               this.requestTime = 0;
               entity.state = AttackModes.ATTACKING;
            }

            this.requestTime -= deltaTime;
       }
       
      if (this.engageTime > 0) {
          let speed = Math.abs(entity.vel.x) + this.velocity * this.speedBoost;
          entity.vel.x = entity.facing ? speed : -1 * speed;
          this.engageTime -= deltaTime;
          
      }
      if (this.engageTime < 0) {
        this.ready = false;
        
      }
  
      
    }

    collides(entity, candidate) {
        // if candidate is a squirtle
       
        if (candidate.state === AttackModes.DEFENSIVE) {
            //  candidate can not be hurt by bash
        } else if (candidate.state === AttackModes.ATTACKING) {
            // depends 
        } else if (candidate.state === AttackModes.DEFAULT && entity.state === AttackModes.ATTACKING) {            
            candidate.killable.kill();
        }

        //if candidate is a bulbasaur

        // if candidate is charizard etc
    }
}