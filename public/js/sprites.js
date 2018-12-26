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

export function loadBackgroundSprites() {
    return loadImage('./img/tiles.png')
    .then((image) => {        
        const sprites = new SpriteSheet(image, 16, 16);
        sprites.defineTile("ground", 0, 0);
        sprites.defineTile("sky", 3, 23);
        return sprites;
}); 

}