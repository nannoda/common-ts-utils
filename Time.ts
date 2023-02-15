export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function block(ms: number) {
    let start = Date.now();
    while (Date.now() - start < ms) {
    }
}
