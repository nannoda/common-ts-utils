export class Serializer {
    types: { [key: string]: any } = {};

    constructor() {
        this.types = {};
    }

    registerType(type: Object) {
        if (type instanceof Function) {
            type = type.prototype;
            this.types[type.constructor.name] = type;
        } else {
            throw new Error("Type must be a constructor");
        }
    }

    serialize(obj: Object): string {
        if (!(obj.constructor.name in this.types)) {
            console.log(obj.constructor.name)
            console.log(this.types)
            throw new Error(`Type ${obj.constructor.name} is not registered`);
        }
        let type = this.types[obj.constructor.name];
        return JSON.stringify([type, obj]);
    }

    deserialize(str: string): Object {
        let arr = JSON.parse(str);
        let type = arr[0];
        let obj = arr[1];
        console.log(type)
        if (!(type.constructor.name in this.types)) {
            console.log(type.constructor.name)
            throw new Error(`Type ${type.constructor.name} is not registered`);
        }
        let type2 = this.types[type.constructor.name];
        let obj2 = new type2();
        for (let key in obj) {
            obj2[key] = obj[key];
        }
        return obj2;
    }
}