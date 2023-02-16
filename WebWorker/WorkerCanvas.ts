import {createWorkerFromFunction} from "./CreateWorker";

export function workerCode() {
    function error(msg: string) {
        console.log("Worker Error: " + msg);
    }

    function async(op: () => void) {
        setTimeout(op, 0);
    }

    // function postImageBitmap(){
    //     let img = canvas.transferToImageBitmap();
    //     postMessage(img);
    //     (ctx as OffscreenCanvasRenderingContext2D).drawImage(img, 0, 0);
    // }

    let canvas: OffscreenCanvas;
    let ctx: OffscreenRenderingContext;
    let initialized = false;
    onmessage = function (e) {
        if (!e.data.key) {
            error("No key in message");
            return;
        }
        let data = e.data as CanvasWorkerEvent;

        if (!initialized && data.key !== "init") {
            error("Canvas Worker not initialized");
            return;
        }

        switch (data.key) {
            case "init":
                canvas = data.args[0] as OffscreenCanvas;
                let ctxId = data.args[1];
                try {
                    ctx = canvas.getContext(ctxId) as OffscreenRenderingContext;
                    initialized = true;
                } catch (e) {
                    error("Error in getContext");
                    console.error(e)
                }
                break;
            case "canvasOp":
                let canvasMethod = data.args[0];
                let canvasArgs = data.args[1] as any[];
                if (!(canvasMethod in canvas))
                    error("Unknown canvas method: " + canvasMethod);
                try {
                    (canvas as any)[canvasMethod](...canvasArgs);
                } catch (e) {
                    error("Error in canvas method: " + canvasMethod);
                    console.error(e)
                }
                break;
            case "ctxOp":
                let ctxMethod = data.args[0];
                let ctxArgs = data.args[1] as any[];
                if (!(ctxMethod in ctx))
                    error("Unknown ctx method: " + ctxMethod);
                try {
                    // async(() => {
                    //     (ctx as any)[ctxMethod](...ctxArgs);
                    // });
                    (ctx as any)[ctxMethod](...ctxArgs);

                    // postMessage(canvas.height);
                    // postImageBitmap();
                } catch (e) {
                    error("Error in ctx method: " + ctxMethod);
                    console.error(e)
                }
                break;
            case "canvasVar":
                let canvasVar = data.args[0];
                let canvasVarValue = data.args[1];
                if (!(canvasVar in canvas))
                    error("Unknown canvas var: " + canvasVar);
                (canvas as any)[canvasVar] = canvasVarValue;
                break;
            case "ctxVar":
                let ctxVar = data.args[0];
                let ctxVarValue = data.args[1];
                if (!(ctxVar in ctx))
                    error("Unknown ctx var: " + ctxVar);
                (ctx as any)[ctxVar] = ctxVarValue;
                break;
            default:
                console.log("Unknown event key: " + data.key);
        }
    }
}

type CanvasWorkerEventKey = "init" | "canvasOp" | "ctxOp" | "canvasVar" | "ctxVar";

export interface CanvasWorkerEvent {
    key: CanvasWorkerEventKey;
    args: any[];
}

export class WorkerCanvas {
    protected _canvas: HTMLCanvasElement;
    protected _worker: Worker;

    protected _width: number;
    protected _height: number;

    protected onResponse(e: MessageEvent) {

    }


    sendCommand(key: CanvasWorkerEventKey, args: any) {
        // (
        //     async () => {
        //         this._worker.postMessage({
        //             key: key,
        //             args: args,
        //         })
        //     }
        // )()

        this._worker.postMessage({
            key: key,
            args: args,
        })
    }

    // protected postMessage(e: CanvasWorkerEvent, transfer?: Transferable[]) {
    //     if (transfer !== undefined) {
    //         (async () => {
    //             this._worker.postMessage(e, transfer);
    //         })()
    //         return;
    //     }
    //     (async () => {
    //         this._worker.postMessage(e);
    //     })()
    // }

    constructor(width: number, height: number, ctxId: string) {
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        let worker = createWorkerFromFunction(workerCode);
        worker.onmessage = (e) => {
            this.onResponse(e);
        }
        let workerCanvas = canvas.transferControlToOffscreen();
        worker.postMessage(
            {
                key: "init",
                args: [workerCanvas, ctxId]
            },
            [workerCanvas]
        )
        this._canvas = canvas;
        this._worker = worker;

        this._width = width;
        this._height = height;
    }
}
