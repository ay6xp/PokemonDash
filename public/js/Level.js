import Compositor from "./Compositor.js";
import Matrix from "./math.js";
import TileCollider from "./TileCollider.js";

export default class Level {
    constructor() {
        this.gravity = 1500;
        this.totalTime = 0;
        this.comp = new Compositor();
        this.entities = new Set();
       

        this.tileColider = null;
    }

    setCollisionGrid(matrix) {
        this.tileColider = new TileCollider(matrix);
    }

    update(deltaTime) {
        this.entities.forEach(entity => {
            entity.update(deltaTime);

             entity.pos.x += entity.vel.x * deltaTime;
             this.tileColider.checkX(entity);
            entity.pos.y += entity.vel.y * deltaTime;
            this.tileColider.checkY(entity);

            
           entity.vel.y += this.gravity * deltaTime;
        });
        this.totalTime += deltaTime;
    }
}