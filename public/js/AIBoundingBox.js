export default class AIBoundingBox {
    constructor(pos, size, dimension) {
        this.pos = pos;
        this.size = size;
        this.dimension = dimension;
      
    }

    inSight(box) {
    
        return this.bottom > box.top &&
            this.top < box.bottom &&
            this.left < box.right &&
            this.right > box.left;          
                
            
    }  

    get bottom() {
        return this.pos.y + this.size.y + this.dimension.y;
    }

    set bottom(y) {
        this.pos.y = y - (this.size.y + this.dimension.y);
    }

    get top() {
        return this.pos.y - (this.dimension.y/2);
    }

    set top(y) {
        this.pos.y = y - this.dimension.y;
    }

    get left() {
        return this.pos.x - (this.dimension.x/2);
    }

    set left(x) {
        this.pos.x = x - this.dimension.x;
    }

    get right() {
        return this.pos.x + this.size.x + (this.dimension.x/2);
    }

    set right(x) {
        this.pos.x = x - (this.size.x + this.dimension.x);
    }
}
