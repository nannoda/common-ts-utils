export interface IRandom {
    nextInt(max: number, min: number): number;

    nextFloat(max: number, min: number): number;

    set seed(seed: number);
}

export abstract class AbstractRandom implements IRandom {

    abstract set seed(seed: number);

    abstract nextFloat(max: number, min: number): number;

    nextInt(max: number, min: number = 0): number {
        return Math.floor(this.nextFloat(max, min));
    }
}

function sinRandom(seed: number): number {
    let tmp = Math.sin(seed) * 10000;
    return tmp - Math.floor(tmp);

}

export class SinRandom extends AbstractRandom {
    constructor(seed: number) {
        super();
        this._seed = seed;
    }

    private _seed: number;

    get seed() {
        return this._seed;
    }

    set seed(seed: number) {
        this._seed = seed;
    }

    nextFloat(max: number, min: number = 0): number {
        this._seed = Math.sin(this._seed) * 10000;
        return min + (this._seed - Math.floor(this._seed)) * (max - min);
    }
}

export class SimpleFastCounterRandom extends AbstractRandom {

    private _a: number = 0;
    private _b: number = 0;
    private _c: number = 0;
    private _d: number = 0;

    constructor(seed: number = 0) {
        super();
        this.seed = seed;
    }

    get seed() {
        return this._a;
    }

    set seed(seed: number) {
        this._a = seed;
        this._b = seed + sinRandom(seed);
        this._c = seed + sinRandom(seed + 1);
        this._d = seed + sinRandom(seed + 2);
    }

    nextFloat(max: number, min: number = 0): number {
        let t = this._a ^ (this._a << 11);
        this._a = this._b;
        this._b = this._c;
        this._c = this._d;
        this._d = (this._d ^ (this._d >>> 19)) ^ (t ^ (t >>> 8));
        return min + (this._d >>> 0) * (max - min) / 4294967296;
    }
}

export const Random = SimpleFastCounterRandom;
