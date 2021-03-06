
import {Trait, Sides} from "../Entity.js";

export default class Killable extends Trait {
    constructor() {
        super('killable');
        this.dead = false;
        this.deadTime = 0;
        this.removeAfter = 2;
        this.instantKillFlag = false;
        
    }
    kill() {
        this.queue(() => this.dead = true);
    }
   
    revive() {
        this.dead = false;
        this.deadTime = 0;
    }
    update(entity, deltaTime, level) {
        if (this.dead) {         
            this.deadTime += deltaTime;
            //entity.vel.set(0,0);
           
           if (this.deadTime > this.removeAfter) {                
                this.queue(() => {                    
                    level.entities.delete(entity);
                });
               
            }
        }
    }


}
