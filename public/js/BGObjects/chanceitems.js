import { loadObject } from "../loaders.js";
import Entity, { AttackModes, Trait } from "../Entity.js";


class Behavior extends Trait {
    constructor() {
        super('behavior');
        this.touched = false;
        this.removeAfter = 0.5;
        this.remove = 0;
    }
    collides(us, candidate) {
        if(candidate.name === "pikachu"){
            this.touched = true;              
            us.pos.y -= 2;
            // pokeball either increases score or spawns jiggly puff that puts you to sleep!
        }   
        
    }
    update(entity, deltaTime, level) {
        if(this.touched){
            if (this.remove < this.removeAfter) {
                this.remove += deltaTime;
            } else{
                level.entities.delete(entity);
            }
            
        }
    }
}



export async function loadPokeball(sheet) {
    return sheet('pokeball').then(createPokeballFactory);
}

function createPokeballFactory(sprite) {
    
    function routeFrame(pokeball) {
        if (pokeball.behavior.touched) {            
            return "pokeball-open";
        } 
        return "pokeball-1";
    }

    function drawPokeball(context) {
        sprite.draw(routeFrame(this), context, 0 ,0,0);
    }
    return function createPokeball() {
        const pokeball = new Entity('pokeball');
        pokeball.state = AttackModes.OBJECT;

        pokeball.draw = drawPokeball;       
        pokeball.addTrait(new Behavior());
        pokeball.size.set(13, 15);    
        return pokeball;


    }
}

export async function loadPotion(sheet) {
    return sheet('potion').then(createPotionFactory);
}

function createPotionFactory(sprite) {

    function routeFrame(potion) {
        // if(potion.behavior.touched) {
        //     return 'potion-open';
        // }
        return "potion-1";
    }
    function drawPotion(context) {
        sprite.draw(routeFrame(this), context, 0, 0,0);
    }

    return function createPotion() {
        const potion = new Entity('potion');
        potion.state = AttackModes.OBJECT;

        potion.draw = drawPotion;
        potion.addTrait(new Behavior());
        potion.size.set(10, 10);
        return potion;
    }
}

export async function loadThunderstone(sheet) {
    return sheet('thunderstone').then(createThunderstoneFactory);


    function createThunderstoneFactory(sprite) {
        function routeFrame(stone) {
            return 'thunderstone-1';
        }

    function drawThunderstone(context) {
         sprite.draw(routeFrame(this), context, 0, 0 ,0);
    }

    return function createThunderstone() {
        const tstone = new Entity('thunderstone');
        tstone.state = AttackModes.OBJECT;

        tstone.draw = drawThunderstone;
        tstone.addTrait(new Behavior());

        tstone.size.set(12,12);
        return tstone;

    }
    
    }
}


export async function loadObjects() {
    return loadObject().then((loadSheet) => {
        return Promise.all([loadPokeball(loadSheet), loadPotion(loadSheet), loadThunderstone(loadSheet)])
    });
}