import {Trait, Sides} from "../Entity.js";
import { Vec2 } from "../math.js";


export default class PlayerController extends Trait {


    constructor() {
        super('playerController');
        this.checkpoint = new Vec2(0,0);
        this.player = null;
        this.score = 0;
        this.time = 200; 
        this.level = null;   
                     
    }
   

    setPlayer(entity) {
       this.player = entity;       
       this.player.stomper.onStomp = () => {
           this.score +=50;
       }
        this.player.behavior.updateScore = () => {
            this.score += 25;
        }
     
    }
    setLevel(level) {
        this.level = level;
    }  
    
    update(entity, deltaTime, level) {
       if (!level.entities.has(this.player)) {
        this.player.killable.revive();
        this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
        level.entities.add(this.player); 
        this.player.health.setHealth(100);
        
       } 
    //    else if (this.time <= 0 && this.state.PLAYING) {       
    //         this.state = gamestate.GAMEOVER;
    //         this.player.killable.kill();       
    //    }
       else {
           this.time -= deltaTime * 2;
       }

       

      
    }


}
