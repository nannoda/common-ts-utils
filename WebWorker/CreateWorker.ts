export function createWorkerFromFunction(workerFunction: () => void): Worker {
    checkCompatibility();
    const blob = new Blob(['(' + workerFunction.toString() + ')()'], {type: 'application/javascript'});
    return new Worker(URL.createObjectURL(blob));
}

function checkCompatibility() {
    if (window.Worker === undefined) {
        throw new Error("Your browser does not support Web Workers.");
    }
}
