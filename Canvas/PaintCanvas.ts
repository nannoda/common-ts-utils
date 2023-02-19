type Context2D = {
    save: () => void;
    restore: () => void;
    lineWidth: number;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    fillStyle: string | CanvasGradient | CanvasPattern;
    filter: string;
    imageSmoothingEnabled: boolean;
    beginPath: () => void;
    moveTo: (x: number, y: number) => void;
    lineTo: (x: number, y: number) => void;
    stroke: () => void;
    arc: (x: number, y: number, radius: number, startAngle: number, endAngle: number) => void;
    bezierCurveTo: (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) => void;
};

export function drawLine(ctx: Context2D, x1: number, y1: number, x2: number, y2: number) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

export function hermitPointsToBezierPoints(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, tension: number = 1 / 6) {
    // let c1 = p1.add(p2.sub(p0).scale(tension));
    // let c2 = p2.sub(p3.sub(p1).scale(tension));

    let c1: Vec2 = [p1[0] + (p2[0] - p0[0]) * tension, p1[1] + (p2[1] - p0[1]) * tension];
    let c2: Vec2 = [p2[0] - (p3[0] - p1[0]) * tension, p2[1] - (p3[1] - p1[1]) * tension];
    return [p1, c1, c2, p2];
}

export function drawHermitCurve(ctx: Context2D, p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2) {
    let bezierPoints = hermitPointsToBezierPoints(p0, p1, p2, p3);
    drawBezierCurve(ctx, bezierPoints[0], bezierPoints[1], bezierPoints[2], bezierPoints[3])

}

export function drawBezierCurve(ctx: Context2D, startPoint: Vec2, controlPoint1: Vec2, controlPoint2: Vec2, endPoint: Vec2) {
    ctx.beginPath();
    ctx.moveTo(startPoint[0], startPoint[1]);
    ctx.bezierCurveTo(controlPoint1[0], controlPoint1[1], controlPoint2[0], controlPoint2[1], endPoint[0], endPoint[1]);
    ctx.stroke();
}

export function drawPointDebug(ctx: Context2D, p: Vec2, size: number = 20, color: string = "#ff0000") {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.filter = "none";
    ctx.imageSmoothingEnabled = false;
    drawLine(ctx, p[0] - size, p[1], p[0] + size, p[1]);
    drawLine(ctx, p[0], p[1] - size, p[0], p[1] + size);
    drawCircle(ctx, p[0], p[1], size);
    ctx.restore();
}

export function drawCircle(ctx: Context2D, x: number, y: number, radius: number) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

export function clearCanvas(canvas: HTMLCanvasElement | OffscreenCanvas) {
    canvas.width = canvas.width;
}
