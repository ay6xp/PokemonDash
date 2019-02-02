import { loadPikachu } from "./entities/Pikachu.js";
import { loadBulbasaur } from "./entities/Bulbasaur.js";
import { loadSquirtle } from "./entities/Squirtle.js";

export async function loadEntities() {
    const entityFactories = {};
    entityFactories['pikachu'] = await loadPikachu();
    entityFactories['bulbasaur'] = await loadBulbasaur();
    entityFactories['squirtle'] = await loadSquirtle();
    return entityFactories;
}