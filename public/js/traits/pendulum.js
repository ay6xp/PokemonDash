
import {Trait, Sides} from "../Entity.js";

export default class PendulumRun extends Trait {
    constructor() {
        super('pendulumRun');
        this.speed = -30;
        this.enabled = true;
    }

    obstruct(entity, side) {
        if (side === Sides.LEFT || side === Sides.RIGHT) {
            this.speed = -this.speed;
        }
    }

    update(entity, deltaTime) {
            if(this.enabled) {
            entity.vel.x = this.speed;
            }
    }   

}
