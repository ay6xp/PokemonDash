import Entity, { AttackModes, Trait } from "../Entity.js";
import BGCollision from "../traits/BGCollision.js";
import { getChanceBlockEntities } from "../entities.js";
import {sound} from "../Sound.js";
class Behavior extends Trait {

    constructor() {
        super('behavior');
        this.set = false;      
    }

   tapped(us) {
        if(!this.set) {
            this.set = true;
            us.sound();
            this.random_item(us);     
        }
        
    }
    random_item(us) {
        let random = Math.floor(Math.random() * 3) + 1;
      
        if (random === 1) {
            const pokeball = us.options.pokeball();            
          
            pokeball.pos.set(us.pos.x, us.pos.y - pokeball.size.y);
            
            us.level.entities.add(pokeball);
        }
        else if (random === 2) {
            const tstone = us.options.thunderstone();
            tstone.pos.set(us.pos.x + 1, us.pos.y - tstone.size.y - 2);
            us.level.entities.add(tstone);
        }
        else {
             const potion = us.options.potion();
             potion.pos.set(us.pos.x + 4, us.pos.y - potion.size.y -2);

             us.level.entities.add(potion);
        }
    }

    collides(us, candidate) {
        if (candidate.name === 'pikachu') {
            let right_bound = 0;
            let left_bound = 0;
            if (candidate.behavior.direction) {
            right_bound = candidate.bounds.right - 24;            
            left_bound = candidate.bounds.left + 18;
            } else{
            right_bound = candidate.bounds.right - 24;            
            left_bound = candidate.bounds.left;
            }
            
            if (candidate.bounds.top  === us.bounds.bottom && right_bound <= us.bounds.right && left_bound >= us.bounds.left) {
                                
                us.behavior.tapped(us);
                    
             }
         
        

        }
    }

    update(us, deltaTime) {

    }

}


export function loadChanceblock(chanceSprite) {
   return createChanceBlockFactory(chanceSprite);
}


 async function createChanceBlockFactory(chanceSprite) {
    const anim = chanceSprite.animations.get('chance');
    function routeFrame(chance) {
        if (chance.behavior.set) {
            return 'chance-4';
        }
        return anim(chance.lifetime);
    }
    function drawChanceblock(context) {       
        chanceSprite.draw(routeFrame(this), context, 0, 0, 0);
    }    

   const entries = await getChanceBlockEntities();   
   const chanceSound = new sound("/sounds/smb_coin.wav");
    return function createChanceblock() {
        const chance = new Entity('chance-block');
        chance.state = AttackModes.OBJECT;
        chance.addTrait(new BGCollision());
        chance.addTrait(new Behavior());
        chance.draw = drawChanceblock;
        chance.size.set(16, 16);
       
        chance.sound = function() {
            chanceSound.play();
        }

        chance.options = entries;
        return chance;
    }

}

