import {WorkerCanvas} from "./WorkerCanvas";

type CanvasWorkerEventKey = "init" | "canvasOp" | "ctxOp" | "canvasVar" | "ctxVar";
type ContextVarName =
    keyof CanvasCompositing
    | "fillStyle" | "strokeStyle"
    | keyof CanvasFilters
    | keyof CanvasImageSmoothing
    | keyof CanvasPathDrawingStyles
    | keyof CanvasShadowStyles
    | keyof CanvasTextDrawingStyles
type ContextOpName =
    keyof CanvasTransform
    | keyof CanvasFillStrokeStyles
    | keyof CanvasText
    | keyof CanvasDrawImage
    | keyof CanvasImageData
    | keyof CanvasPath
    | keyof CanvasDrawPath
    | keyof CanvasPathDrawingStyles
    | keyof CanvasRect
    | keyof CanvasState
type off = OffscreenCanvasRenderingContext2D;

export class WorkerCanvas2D extends WorkerCanvas {
    constructor(width: number, height: number) {
        super(width, height, "2d");
        this.lineCap = "round";
        this.lineJoin = "round";
        this.lineWidth = 2;
        this.strokeStyle = "#000000";
    }

    protected _lineCap: CanvasLineCap = "butt";

    get lineCap(): CanvasLineCap {
        return this._lineCap;
    }

    set lineCap(value: CanvasLineCap) {
        this._lineCap = value;
        this.setCtxVar("lineCap", value)
    }

    protected _lineJoin: CanvasLineJoin = "miter";

    get lineJoin(): CanvasLineJoin {
        return this._lineJoin;
    }

    set lineJoin(value: CanvasLineJoin) {
        this._lineJoin = value;
        this.setCtxVar("lineJoin", value)
    }

    protected _lineWidth: number = 1;

    get lineWidth(): number {
        return this._lineWidth;
    }

    set lineWidth(value: number) {
        this._lineWidth = value;
        this.setCtxVar("lineWidth", value)
    }

    protected _strokeStyle: string | CanvasGradient | CanvasPattern = "#000000";

    get strokeStyle(): string | CanvasGradient | CanvasPattern {
        return this._strokeStyle;
    }

    set strokeStyle(value: string | CanvasGradient | CanvasPattern) {
        this._strokeStyle = value;
        this.setCtxVar("strokeStyle", value)
    }

    protected _fillStyle: string | CanvasGradient | CanvasPattern = "#000000";

    get fillStyle(): string | CanvasGradient | CanvasPattern {
        return this._fillStyle;
    }

    set fillStyle(value: string | CanvasGradient | CanvasPattern) {
        this._fillStyle = value;
        this.setCtxVar("fillStyle", value)
    }

    protected _font: string = "10px sans-serif";

    get font(): string {
        return this._font;
    }

    set font(value: string) {
        this._font = value;
        this.setCtxVar("font", value);
    }

    protected _textAlign: CanvasTextAlign = "start";

    get textAlign(): CanvasTextAlign {
        return this._textAlign;
    }

    set textAlign(value: CanvasTextAlign) {
        this._textAlign = value;
        this.setCtxVar("textAlign", value);
    }

    protected _textBaseline: CanvasTextBaseline = "alphabetic";

    get textBaseline(): CanvasTextBaseline {
        return this._textBaseline;
    }

    set textBaseline(value: CanvasTextBaseline) {
        this._textBaseline = value;
        this.setCtxVar("textBaseline", value);
    }

    protected _globalAlpha: number = 1;

    get globalAlpha(): number {
        return this._globalAlpha;
    }

    set globalAlpha(value: number) {
        this._globalAlpha = value;
        this.setCtxVar("globalAlpha", value);
    }

    protected _globalCompositeOperation: GlobalCompositeOperation = "source-over";

    get globalCompositeOperation(): GlobalCompositeOperation {
        return this._globalCompositeOperation;
    }

    set globalCompositeOperation(value: GlobalCompositeOperation) {
        this._globalCompositeOperation = value;
        this.setCtxVar("globalCompositeOperation", value);
    }

    protected _shadowBlur: number = 0;

    get shadowBlur(): number {
        return this._shadowBlur;
    }

    set shadowBlur(value: number) {
        this._shadowBlur = value;
        this.setCtxVar("shadowBlur", value);
    }

    protected _shadowColor: string = "rgba(0, 0, 0, 0)";

    get shadowColor(): string {
        return this._shadowColor;
    }

    set shadowColor(value: string) {
        this._shadowColor = value;
        this.setCtxVar("shadowColor", value);
    }

    protected _shadowOffsetX: number = 0;

    get shadowOffsetX(): number {
        return this._shadowOffsetX;
    }

    set shadowOffsetX(value: number) {
        this._shadowOffsetX = value;
        this.setCtxVar("shadowOffsetX", value);
    }

    protected _shadowOffsetY: number = 0;

    get shadowOffsetY(): number {
        return this._shadowOffsetY;
    }

    set shadowOffsetY(value: number) {
        this._shadowOffsetY = value;
        this.setCtxVar("shadowOffsetY", value);
    }

    protected _imageSmoothingEnabled: boolean = true;

    get imageSmoothingEnabled(): boolean {
        return this._imageSmoothingEnabled;
    }

    set imageSmoothingEnabled(value: boolean) {
        this._imageSmoothingEnabled = value;
        this.setCtxVar("imageSmoothingEnabled", value)
    }

    protected _imageSmoothingQuality: ImageSmoothingQuality = "low";

    get imageSmoothingQuality(): ImageSmoothingQuality {
        return this._imageSmoothingQuality;
    }

    set imageSmoothingQuality(value: ImageSmoothingQuality) {
        this._imageSmoothingQuality = value;
        this.setCtxVar("imageSmoothingQuality", value);
    }

    protected _filter: string = "none";

    get filter(): string {
        return this._filter;
    }

    set filter(value: string) {
        this._filter = value;
        this.setCtxVar("filter", value);
    }

    get width(): number {
        return this._width;

    }

    set width(value: number) {
        this._width = value;
        this.setCanvasVar("width", value)
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
        this.setCanvasVar("height", value)
    }

    get content(): CanvasImageSource {
        return this._canvas;
    }

    setCtxVar(name: ContextVarName, value: any) {
        this.sendCommand("ctxVar", [name, value]);
    }

    ctxOp(name: ContextOpName, args: any[]) {
        this.sendCommand("ctxOp", [name, args]);
    }

    setCanvasVar(name: "width" | "height", value: number) {
        this.sendCommand("canvasVar", [name, value]);
    }

    moveTo(x: number, y: number) {
        this.ctxOp("moveTo", [x, y])
    }

    lineTo(x: number, y: number) {
        this.ctxOp("lineTo", [x, y])
    }

    curveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        this.ctxOp("bezierCurveTo", [x1, y1, x2, y2, x3, y3])
    }

    stroke() {
        this.ctxOp("stroke", [])
    }

    fill() {
        this.ctxOp("fill", [])
    }

    clearRect(x: number, y: number, width: number, height: number) {
        this.ctxOp("clearRect", [x, y, width, height])
    }

    fillRect(x: number, y: number, width: number, height: number) {
        this.ctxOp("fillRect", [x, y, width, height])
    }

    strokeRect(x: number, y: number, width: number, height: number) {
        this.ctxOp("strokeRect", [x, y, width, height])
    }

    beginPath() {
        this.sendCommand("ctxOp", ["beginPath", []]);
    }

    closePath() {
        this.sendCommand("ctxOp", ["closePath", []]);
    }

    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
        this.ctxOp("arc", [x, y, radius, startAngle, endAngle, anticlockwise])
    }

    save() {
        this.ctxOp("save", [])
    }

    restore() {
        this.ctxOp("restore", [])
    }

    rotate(angle: number) {
        this.ctxOp("rotate", [angle])
    }

    scale(x: number, y: number) {
        this.ctxOp("scale", [x, y])
    }

    translate(x: number, y: number) {
        this.ctxOp("translate", [x, y])
    }

    transform(a: number, b: number, c: number, d: number, e: number, f: number) {
        this.ctxOp("transform", [a, b, c, d, e, f])
    }

    setTransform(a: number, b: number, c: number, d: number, e: number, f: number) {
        this.ctxOp("setTransform", [a, b, c, d, e, f])
    }

    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
        this.ctxOp("bezierCurveTo", [cp1x, cp1y, cp2x, cp2y, x, y])
    }
}
