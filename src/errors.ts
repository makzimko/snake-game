export class CollisionError extends Error {
    #collisionIndex: number;
    constructor(collisionIndex: number) {
        super('Collision detected');
        this.#collisionIndex = collisionIndex;
    }

    get collisionIndex() {
        return this.#collisionIndex;
    }
}