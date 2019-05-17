import { loadPikachu } from "./entities/Pikachu.js";
import { loadBulbasaur } from "./entities/Bulbasaur.js";
import { loadSquirtle } from "./entities/Squirtle.js";
import { loadCharizard } from "./entities/Charizard.js";
import { loadChanceblock } from "./BGObjects/Chanceblock.js";
import { loadPokeball, loadPotion, loadObjects } from "./BGObjects/chanceitems.js";
import { loadObject } from "./loaders.js";




export async function loadEntities() {
    const entityFactories = {};
    entityFactories['pikachu'] = await loadPikachu();
    entityFactories['bulbasaur'] = await loadBulbasaur();
    entityFactories['squirtle'] = await loadSquirtle();   
    entityFactories['charizard'] = await loadCharizard();
    return entityFactories;
}

 export async function getBgEntityFactory(sheet) {
    const bgFactory = {};
    bgFactory['chance-block'] = await loadChanceblock(sheet(true, 'chance-block'));
    return bgFactory;

}

export async function getChanceBlockEntities() {
  const chanceFactory = {}; 
  const [pokeball, potion, thunderstone] = await loadObjects();
  chanceFactory['pokeball'] = pokeball;
  chanceFactory['potion'] = potion;
  chanceFactory['thunderstone'] = thunderstone;
  return chanceFactory;

}