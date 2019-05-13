import {Vec2} from "./math.js"; 
import BoundingBox from "./BoundingBox.js";
import AIBoundingBox from "./AIBoundingBox.js";
export const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
    LEFT: Symbol('left'),
    LEFT: Symbol('right')

}

export const AttackModes = {
    DEFENSIVE : Symbol('defense'),
    ATTACKING : Symbol('attacking'),
    HIDING    : Symbol('hiding'),
    PANIC     : Symbol('panic'),
    FLYING     : Symbol('flying'),
    OBJECT  : Symbol('object'),
    DEFAULT : Symbol('default')

}


export class Trait {
    constructor(name) {
        this.NAME = name;
        this.tasks = [];
    }

    finalize() {
        this.tasks.forEach(task => {
            task();
        });
        this.tasks.length = 0;
    }

    queue(task) {
        this.tasks.push(task);
    }

    obstruct(side) {
         
    }
    collides(us, them) {

    }
    update() {
        
    }
}

export class AttackMove {
    constructor(name) {
        this.NAME = name;
        this.tasks = [];
        this.pos = new Vec2(0,0);
        this.size = new Vec2(0,0);
        this.vel = new Vec2(0,0);
        this.active = false;
        this.facing = 1;
        this.offset = new Vec2(0,0);
        this.bounds = new BoundingBox(this.pos, this.size, this.offset);
       
    }

    start() {
      
    }

    cancel() {
        
    }
    

    collides(us, them) {

    }

    finalize() {

    }

    draw() {

    }
  
}

export default class Entity {
    constructor(name = "NPC") {
        this.name = name;
        this.canCollide = true;
        this.pos = new Vec2(0,0);
        this.vel = new Vec2(0,0);
        this.size = new Vec2(0,0);
        this.facing = 1;       
        this.lifetime = 0;
        this.offset = new Vec2(0,0);
        this.dimension = new Vec2(0,0);
        this.bounds = new BoundingBox(this.pos, this.size, this.offset);
        this.AIBounds = new AIBoundingBox(this.pos, this.size, this.dimension);
        this.traits = [];
        this.moves = [];
        this.activeMoves = [];
        this.state = AttackModes.DEFAULT;
        this.env = null;
        this.level = null;
           
    }

    addTrait(trait) {
        this.traits.push(trait);
        this[trait.NAME] = trait;        

    }

    addMove(move) {
        this.moves.push(move);
        this[move.NAME] = move;
    }

    collides(candidate) {
        this.traits.forEach(trait => {
            trait.collides(this, candidate);          
        });        
    }
    obstruct(side, match) {
        this.traits.forEach(trait => {
            trait.obstruct(this, side, match);
        });
    }
    draw() {

    }
    inView(candidate) {

    }  

    setEnvironment(env) {
        this.env = env;
    }
    finalize() {
        this.traits.forEach(trait => {
            trait.finalize();
        });
  
    }    

    setLevel(level) {
        this.level = level;
    }

    update(deltaTime, level) {
        this.traits.forEach(trait => {
            trait.update(this, deltaTime, level);
        });

        this.moves.forEach(move => {
           
            move.update(this, deltaTime, level);
        });

        this.lifetime+= deltaTime;
    }

    

}