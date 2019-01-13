import {loadImage} from "./loaders.js";
import SpriteSheet from "./SpriteSheet.js";

export function loadPikachuSprite() {
    return loadImage('./img/pikachu.png')
    .then(image => {
        const sprites = new SpriteSheet(image, 0, 0);
        sprites.define("idle", 5, 30, 40, 40);
        return sprites;

    });
}

