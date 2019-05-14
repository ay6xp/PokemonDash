import Entity, { AttackModes, Trait } from "../Entity.js";
import BGCollision from "../traits/BGCollision.js";
import { getChanceBlockEntities } from "../entities.js";

class Behavior extends Trait {

    constructor() {
        super('behavior');
        this.set = false;
    }

   tapped(us) {
        if(!this.set) {
            this.set = true;
            this.random_item(us);
            //what items to include in chance block?
            // "pokeball" to increase score
            // light ball to evolve pikachu
            // potion/some object to increase halth
        }
        
    }
    random_item(us) {
        let random = Math.floor(Math.random() * 3) + 1;
        console.log(random);
        if (random === 1) {
            const pokeball = us.options.pokeball();            
          
            pokeball.pos.set(us.pos.x, us.pos.y - pokeball.size.y);
            
            us.level.entities.add(pokeball);
        }
        else if (random === 2) {
            // light ball -> will evolve pikachu
        }
        else {
             const potion = us.options.potion();
             potion.pos.set(us.pos.x, us.pos.y - potion.size.y);

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
   
    return function createChanceblock() {
        const chance = new Entity('chance-block');
        chance.state = AttackModes.OBJECT;
        chance.addTrait(new BGCollision());
        chance.addTrait(new Behavior());
        chance.draw = drawChanceblock;
        chance.size.set(16, 16);

        chance.options = entries;
        return chance;
    }

}

