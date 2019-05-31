import {Trait, Sides} from "../Entity.js";

export default class Physics extends Trait {
    constructor() {
        super('physics');
        this.deltaTime = 0;
           
    }
    fall(me) {
       
    }
    update (entity, deltaTime, level) {
        this.deltaTime = deltaTime;
        entity.pos.x += entity.vel.x * deltaTime;        
        level.tileColider.checkX(entity);                  
        entity.pos.y += entity.vel.y * deltaTime;        
        level.tileColider.checkY(entity);          

             
        entity.vel.y += level.gravity * deltaTime;
    }
  

}