import Compositor from "./Compositor.js";
import Matrix from "./math.js";
import TileCollider from "./TileCollider.js";
import EntityCollider from "./entities/EntityCollider.js";

export default class Level {
    constructor() {
        this.gravity = 1500;
        this.totalTime = 0;
        this.comp = new Compositor();
        this.entities = new Set();
        this.entityCollider = new EntityCollider(this.entities);

        this.tileColider = null;
    }

    setCollisionGrid(matrix) {
        this.tileColider = new TileCollider(matrix);
    }

    update(deltaTime) {
        this.entities.forEach(entity => {
        entity.update(deltaTime, this);
        });
        //need to check for collision after speed has been adjusted above
        this.entities.forEach(entity => { 
            this.entityCollider.check(entity);
        });

        this.entities.forEach(entity => { 
            entity.finalize();
        });
        this.totalTime += deltaTime;
    }
}