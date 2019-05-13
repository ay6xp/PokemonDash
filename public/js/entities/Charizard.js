import Entity, {Sides, Trait} from '../Entity.js';
import {loadSpriteSheet} from '../loaders.js';
import PendulumRun from '../traits/pendulum.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Flying from '../traits/Flying.js';
import { loadFlameblast } from '../moves/Flameblast.js';

export function loadCharizard() {
    return loadSpriteSheet('charizard')
    .then(createCharizardFactory);    
}
class Behavior extends Trait {
    constructor() {
        super('behavior');
        this.following = false;
        this.direction = 0;
        
    }

    direction_move(us, them) {
        us.vel.x = 0;
        if(them.pos.x > us.pos.x)  {    
            this.direction = 1;        
        } else{
            this.direction = 0;
        }
    }
    update(us, deltaTime) {
    
    }


}

async function loadMoves() {
    const moves = {};
    moves['flameblast'] = await loadFlameblast();
    return moves; 
}

async function createCharizardFactory(sprite) {
    const flyAnim = sprite.animations.get('fly');
     const moves = await loadMoves();

    function routeAnim(charizard) {
        if (charizard.killable.dead) {
            return 'dead';
        }
        return flyAnim(charizard.lifetime);
    }
    function drawCharizard(context) {
        
        sprite.draw(routeAnim(this), context, 0, 0, this.vel.x > 0 || (this.behavior.following && this.behavior.direction));        
    }

    function inView(candidate) {
        
        if(this.AIBounds.inSight(candidate.bounds) && candidate.name == "pikachu" ) {
            this.behavior.following = true;
            this.behavior.direction_move(this, candidate);
            if(this.activeMoves.length == 0 && !candidate.killable.dead) {
            this.activeMoves.push(this.moves[0]);
            this.activeMoves[0].start(this, candidate);
            }
        } else {
            this.behavior.following = false;
        }
    }

    return function createCharizard() {
        const charizard = new Entity();        
        charizard.size.set(130, 70);
        charizard.dimension.set(100, 200);
        charizard.addTrait(new Flying());
        charizard.addTrait(new Solid());
        charizard.addTrait(new PendulumRun());
        charizard.addTrait(new Behavior());
        charizard.addTrait(new Killable());
      
       
        charizard.addMove(moves.flameblast());

        charizard.draw = drawCharizard;
        charizard.inView = inView;

        return charizard;
       
    }
}