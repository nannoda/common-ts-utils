import {createWorkerFromFunction} from "./CreateWorker";

export function workerCode() {
    function error(msg: string) {
        console.log("Worker Error: " + msg);
    }

    function async(op: () => void) {
        setTimeout(op, 0);
    }

    function replyState(code: number) {
        postMessage(code);
    }

    let canvas: OffscreenCanvas;
    let ctx: OffscreenRenderingContext;
    let initialized = false;

    function canvasOp(op: string, args: any[]) {
        if (!(op in canvas)) {
            error("Unknown canvas method: " + op);
            return;
        }
        (canvas as any)[op](...args);
    }

    function ctxOp(op: string, args: any[]) {
        if (!(op in ctx)) {
            error("Unknown ctx method: " + op);
            return;
        }
        (ctx as any)[op](...args);
    }

    function canvasVar(name: string, value: any) {
        (canvas as any)[name] = value;
    }

    function ctxVar(name: string, value: any) {
        (ctx as any)[name] = value;
    }

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
                    replyState(0);
                    // console.log("Called canvas method: " + canvasMethod)
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
                    (ctx as any)[ctxMethod](...ctxArgs);
                    replyState(0);
                    // console.log("Called ctx method: " + ctxMethod)
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
                // console.log("Set canvas var: " + canvasVar + " to " + canvasVarValue)
                replyState(0);
                break;
            case "ctxVar":
                let ctxVar = data.args[0];
                let ctxVarValue = data.args[1];
                if (!(ctxVar in ctx))
                    error("Unknown ctx var: " + ctxVar);
                (ctx as any)[ctxVar] = ctxVarValue;
                // console.log("Set ctx var: " + ctxVar + " to " + ctxVarValue)
                replyState(0);
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

    protected requestQueue: CanvasWorkerEvent[] = [];

    constructor(width: number, height: number, ctxId: string) {
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        let worker = createWorkerFromFunction(workerCode);
        worker.onmessage = (e) => {
            this.onResponse(e);
        }
        let workerCanvas = canvas.transferControlToOffscreen();

        this._canvas = canvas;
        this._worker = worker;

        this._width = width;
        this._height = height;

        this.postMessage(
            {
                key: "init",
                args: [workerCanvas, ctxId]
            },
            [workerCanvas]
        )

    }

    sendCommand(key: CanvasWorkerEventKey, args: any) {
        this.requestQueue.push({
            key: key,
            args: args,
        });
        if (this.requestQueue.length === 1) {
            this.postMessage(this.requestQueue[0]);
        } else {
            // console.log("Request queue length: " + this.requestQueue.length)
        }
    }

    postMessage(e: CanvasWorkerEvent, transfer: Transferable[] = []) {
        // console.log("Post message: " + e.key);
        (async () => {
            this._worker.postMessage(e, transfer);
        })();

    }

    protected onResponse(e: MessageEvent) {
        if (e.data === 0) {
            this.requestQueue.shift();
            if (this.requestQueue.length > 0) {
                this._worker.postMessage(this.requestQueue[0]);
            }
        }
    }
}
