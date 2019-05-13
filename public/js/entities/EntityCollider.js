export default class EntityCollider {
    constructor(entities) {
        this.entities = entities;
    }

    check(subject) {
        this.entities.forEach(candidate => {
            if (subject === candidate) {
                return;
            }
           
                if (subject.bounds.overlaps(candidate.bounds)) {
               
                    subject.collides(candidate);             
                    candidate.collides(subject);
                }   
            
           

            if(subject.activeMoves.length > 0) {
                if(subject.activeMoves[0].bounds.overlaps(candidate.bounds)) { //leaving like this for now since all
                                                                               // pokemon really only have 1 move                  
                    subject.activeMoves[0].collides(subject, candidate);
                }
               
            }

            subject.inView(candidate);
            
           
          
        });
    }
}