export function addToConsole(path: string, value: any) {
    let parts = path.split(".");
    let obj = window as any;
    for (let i = 0; i < parts.length - 1; i++) {
        if (obj[parts[i]] === undefined) {
            obj[parts[i]] = {};
        }
        obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
}

export function removeFromConsole(path: string) {
    let parts = path.split(".");
    let obj = window as any;
    for (let i = 0; i < parts.length - 1; i++) {
        if (obj[parts[i]] === undefined) {
            return;
        }
        obj = obj[parts[i]];
    }
    delete obj[parts[parts.length - 1]];
}

export function debug(group: string, ...args: any[]) {
    if ((window as any).debug) {
        console.group(group)
        console.log(...args);
        console.groupEnd();
    }
}
