import Entity, {Sides, Trait} from '../Entity.js';
import {loadSpriteSheet} from '../loaders.js';
import PendulumRun from '../traits/pendulum.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';

export function loadBulbasaur() {
    return loadSpriteSheet('bulbasaur')
    .then(createBulbasaurFactory);    
}
class Behavior extends Trait {
    constructor() {
        super('behavior');
    }
    collides(us, them) {
        if(us.killable.dead) {
            return;
        }
        if (them.stomper) {
            if (them.vel.y > us.vel.y) {
                us.killable.kill();
                us.pendulumRun.speed = 0;
            } else {
                them.killable.kill();
            }
           
        }
      
    }
}
function createBulbasaurFactory(sprite) {
    const runAnim = sprite.animations.get('run');

    function routeAnim(bulba) {
        if (bulba.killable.dead) {
            return 'dead';
        }
        return runAnim(bulba.lifetime);
    }
    function drawBulbasaur(context) {
        sprite.draw(routeAnim(this), context, 0, 0, this.vel.x > 0);        
    }

    return function createBulbasaur() {
        const bulba = new Entity();        
        bulba.size.set(34, 34);
        bulba.addTrait(new Physics());
        bulba.addTrait(new Solid());
        bulba.addTrait(new PendulumRun());
        bulba.addTrait(new Behavior());
        bulba.addTrait(new Killable());

        bulba.draw = drawBulbasaur;

        return bulba;
       
    }
}