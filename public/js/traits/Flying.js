import {Trait, Sides} from "../Entity.js";

export default class Flying extends Trait {
    constructor() {
        super('flying');
           
    }

    update (entity, deltaTime, level) {
        entity.pos.y += entity.vel.y * deltaTime;        
      
        if (!entity.behavior.following) {
            entity.pos.x += entity.vel.x * deltaTime;       
         
        } 
              
        level.tileColider.checkY(entity); 
        level.tileColider.checkX(entity);    
        if(entity.killable.dead) {     
        entity.vel.y += level.gravity * deltaTime;
        }
    }
  

}