type TCanvasLineJoin = 'bevel' | 'round' | 'miter';
type TCanvasLineCap = 'butt' | 'round' | 'square';
type TCanvasTextBaseLine = 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';
type TCanvasTextAlign = 'left' | 'right' | 'center' | 'start' | 'end';
type TCanvasPatternRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
type TCanvasGradient = any;
type TCanvasPattern = any;
type TCanvasImageSource = IMiniProgramCanvasContext_v1 | CanvasImageElement;

interface IMiniProgramCanvasContextImageInfo {
  id: string | number | -1;
  width: number;
  height: number;
  url: string;
}

function preloadCanvasImage(url: string, callback: (data: IMiniProgramCanvasContextImageInfo) => void) {
  (my as any).preloadCanvasImage({
    urls: [url],
    complete(res: any) {
      if (res && res.loaded) {
        const img = res.loaded[url];
        if (img.url == url && img.id !== -1) {
          callback(img);
          return;
        }
      }
      callback(null);
    }
  })
}

interface IMiniProgramCanvasContext_v1 {
  set fillStyle(value: string | TCanvasGradient | null | TCanvasPattern);
  set font(value: string);
  get font(): string;
  set fontSize(value: any);
  set strokeStyle(value: string | TCanvasGradient | null | TCanvasPattern);
  set globalAlpha(value: number);
  set lineWidth(value: number);
  set lineCap(value: TCanvasLineCap);
  set lineJoin(value: TCanvasLineJoin);
  set miterLimit(value: number);
  set textBaseline(value: TCanvasTextBaseLine);
  set lineDashOffset(value: number);
  set textAlign(value: TCanvasTextAlign);
  set globalCompositeOperation(value: string);

  setFillStyle(color: string | TCanvasGradient | null | TCanvasPattern): void;
  fillRect(x: number, y: number, width: number, height: number): void;
  strokeRect(x: number, y: number, width: number, height: number): void;
  beginPath(): void;
  arc(x: number, y: number, radius: number, startDeg: number, endDeg: number, anticlockwise?: boolean): void;
  fill(): void;
  clip(): void;
  rect(x: number, y: number, width: number, height: number): void;
  stroke(): void;
  scale(x: number, y: number): void;
  rotate(angle: number): void;
  translate(x: number, y: number): void;
  save(): void;
  restore(): void;
  clearRect(x: number, y: number, width: number, height: number): void;
  fillText(text: string, x: number, y: number, maxWidth?: number): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
  transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
  closePath(): void;
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
  setLineDash(gaps: number[]): void;
  strokeText(text: string, x: number, y: number, maxWidth?: number): void;
  setStrokeStyle(color: string | TCanvasGradient | null | TCanvasPattern): void;
  setGlobalAlpha(alpha: number): void;
  setLineWidth(width: number): void;
  setLineCap(lineCap: TCanvasLineCap): void;
  setLineJoin(lineJoin: TCanvasLineJoin): void;
  setMiterLimit(limit: number): void;
  setTextBaseline(baseline: TCanvasTextBaseLine): void;
  setLineDashOffset(offset: number): void;
  setTextAlign(align: TCanvasTextAlign): void;
  setGlobalCompositeOperation(op: string): void;
  setShadow(offsetX?: number, offsetY?: number, blur?: number, color?: string): void;
  setFontSize(size: number): void;
  setFont(font: string): void;
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): TCanvasGradient;
  createCircularGradient(x: number, y: number, r: number): TCanvasGradient;
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): TCanvasGradient;
  drawImage(
    imageOrContext: TCanvasImageSource,
    sx: number,
    sy: number,
    sWidth?: number,
    sHeight?: number,
    dx?: number,
    dy?: number,
    dWidth?: number,
    dHeight?: number
  ): void;
  draw(reserve?: boolean): void;
  createPattern(image: TCanvasImageSource, repeat: TCanvasPatternRepeat): TCanvasPattern;
}

export function createCanvasAdapter(canvasContext: any) {
  const context = new SimulatedCanvasContext(canvasContext);
  const addCallIdAction = context.addCallIdActions.bind(context);

  const element = new CanvasElement(canvasContext, addCallIdAction);
  context.canvas = element;

  return {
    element,
    context,
    // debugger for unimplemented property/method
    // element: new Proxy(element, {
    //   get(target, p, receiver) {
    //     const descriptor = Object.getOwnPropertyDescriptor(target, p);
    //     const descriptor2 = Object.getOwnPropertyDescriptor((target as any).__proto__, p);
    //     if (!descriptor && !descriptor2) {
    //       debugger;
    //     }
    //     return Reflect.get(target, p, receiver);
    //   }
    // }),
    // context: new Proxy(context, {
    //   get(target, p, receiver) {
    //     const descriptor = Object.getOwnPropertyDescriptor(target, p);
    //     const descriptor2 = Object.getOwnPropertyDescriptor((target as any).__proto__, p);
    //     if (!descriptor && !descriptor2) {
    //       debugger;
    //     }
    //     return Reflect.get(target, p, receiver);
    //   }
    // })
  }
}
function bindDrawRunnable(fn: any, canvasContext: IMiniProgramCanvasContext_v1, addCallIdAction: () => void) {
  return function (this: any, ...args: unknown[]) {
    try {
      fn.apply(this, args);
    } finally {
      canvasContext.draw(true);
      addCallIdAction();
    }
  }
}
class CanvasImageElement {
  private _onload?: undefined | (() => void);
  private _onerror?: undefined | (() => void);
  private _invoked: boolean = false;
  private _rawImgObj?: IMiniProgramCanvasContextImageInfo | {} = undefined;
  public static toImageSource(imageOrContext: any): TCanvasImageSource | null {
    let target = null;
    if (imageOrContext instanceof CanvasImageElement) {
      target = imageOrContext._rawImgObj;
    } else if (typeof imageOrContext === 'string') {
      target = imageOrContext;
    }

    return target;
  }
  constructor(public url: string, private _context: IMiniProgramCanvasContext_v1, private _addCallIdAction: () => void) {
    preloadCanvasImage(url, (img) => {
      this._rawImgObj = img || {};
      this._complete(this._rawImgObj);
    });
  }
  private _complete(img: Partial<IMiniProgramCanvasContextImageInfo>) {
    if (!img || this._invoked) {
      return;
    }
    if (img.url == this.url && img.id !== -1) {
      if (this._onload) {
        bindDrawRunnable(this._onload, this._context, this._addCallIdAction)();
        this._invoked = true;
      }
    } else {
      if (this._onerror) {
        bindDrawRunnable(this._onerror, this._context, this._addCallIdAction)();
        this._invoked = true;
      }
    }
  }
  set onload(fn: () => void) {
    this._onload = fn;
    this._complete(this._rawImgObj);
  }
  set onerror(fn: () => void) {
    this._onerror = fn;
    this._complete(this._rawImgObj);
  }
}

class CanvasElement {
  constructor(
    private canvasContext: IMiniProgramCanvasContext_v1,
    private _addCallIdAction: () => void
  ) {

  }
  createImage(url: string) {
    return new CanvasImageElement(url, this.canvasContext, this._addCallIdAction);
  }
  requestAnimationFrame(fn: any) {
    const frameFn = bindDrawRunnable(fn, this.canvasContext, this._addCallIdAction);
    return setTimeout(function () {
      frameFn(Date.now());
    }, 16);
  }
  cancelAnimationFrame(tid: any) {
    return clearTimeout(tid);
  }
}
class SimulatedCanvasContext {
  public canvas: CanvasElement;
  private _callIdCache: Record<string, Array<TCanvasGradient | TCanvasPattern>>;
  private _enableCacheCallId: boolean;

  constructor(
    private ctx: IMiniProgramCanvasContext_v1
  ) {
    this._enableCacheCallId = true;
    this._callIdCache = {
      linearGradient: [],
      radialGradient: []
    };
  }

  private _fillStyle: string | TCanvasGradient | null | TCanvasPattern;
  set fillStyle(value: string | TCanvasGradient | null | TCanvasPattern) { this._fillStyle = this.ctx.fillStyle = value; }
  get fillStyle(): string | TCanvasGradient | null | TCanvasPattern { return this._fillStyle; }

  // WontFIX: filter

  set font(value: string) { this.ctx.font = value; }
  get font(): string { return this.ctx.font; }
  set fontSize(value: any) {
    this.ctx.fontSize = value;
  }

  private _globalAlpha = 1;
  set globalAlpha(value: number) { this._globalAlpha = this.ctx.globalAlpha = value; }
  get globalAlpha() { return this._globalAlpha; }

  private _globalCompositeOperation: string;
  set globalCompositeOperation(value: string) { this._globalCompositeOperation = this.ctx.globalCompositeOperation = value; }
  get globalCompositeOperation() { return this._globalCompositeOperation; }

  // WontFIX: imageSmoothingEnabled

  private _lineCap: TCanvasLineCap;
  set lineCap(value: TCanvasLineCap) { this._lineCap = this.ctx.lineCap = value; }
  get lineCap() { return this._lineCap; }

  private _lineDashOffset: number;
  set lineDashOffset(value: number) { this._lineDashOffset = this.ctx.lineDashOffset = value; }
  get lineDashOffset() { return this._lineDashOffset; }

  private _lineJoin: TCanvasLineJoin;
  set lineJoin(value: TCanvasLineJoin) { this._lineJoin = this.ctx.lineJoin = value; }
  get lineJoin() { return this._lineJoin; }

  private _lineWidth: number;
  set lineWidth(value: number) { this.ctx.lineWidth = value; }
  get lineWidth() { return this._lineWidth; }

  private _miterLimit: number;
  set miterLimit(value: number) { this._miterLimit = this.ctx.miterLimit = value; }
  get miterLimit() { return this._miterLimit; }

  // WontFIX: shadowBlur
  // WontFIX: shadowColor
  // WontFIX: shadowOffsetX
  // WontFIX: shadowOffsetY

  private _strokeStyle: string | TCanvasGradient | null | TCanvasPattern;
  set strokeStyle(value: string | TCanvasGradient | null | TCanvasPattern) { this._strokeStyle = this.ctx.strokeStyle = value; }
  get strokeStyle() { return this._strokeStyle; }

  private _textAlign: TCanvasTextAlign;
  set textAlign(value: TCanvasTextAlign) { this._textAlign = this.ctx.textAlign = value; }
  get textAlign() { return this._textAlign; }

  private _textBaseline: TCanvasTextBaseLine;
  set textBaseline(value: TCanvasTextBaseLine) { this._textBaseline = this.ctx.textBaseline = value; }
  get textBaseline() { return this._textBaseline; }

  public arc(x: number, y: number, radius: number, startDeg: number, endDeg: number, anticlockwise?: boolean): void {
    if (anticlockwise === undefined) {
      return this.ctx.arc(x, y, radius, startDeg, endDeg);
    }
    return this.ctx.arc(x, y, radius, startDeg, endDeg, anticlockwise);
  }
  public arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
    return this.ctx.arcTo(x1, y1, x2, y2, radius);
  }
  public beginPath(): void {
    return this.ctx.beginPath();
  }
  public bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
    return this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
  }
  public clearRect(x: number, y: number, width: number, height: number): void {
    return this.ctx.clearRect(x, y, width, height);
  }
  public clip(): void {
    return this.ctx.clip();
  }
  public closePath(): void {
    return this.ctx.closePath();
  }
  // WontFIX: createImageData
  public addCallIdActions(): void {
    const { linearGradient, radialGradient } = this._callIdCache;
    this._enableCacheCallId = false;
    for (const item of linearGradient ) {
      const gradient = this.ctx.createLinearGradient(0, 0, 0, 0);
      Object.assign(gradient, item);
    }
    for (const item of radialGradient ) {
      const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 0);
      Object.assign(gradient, item);
    }
    this._enableCacheCallId = true;
  }
  public createLinearGradient(x0: number, y0: number, x1: number, y1: number): TCanvasGradient {
    const gradient = this.ctx.createLinearGradient(x0, y0, x1, y1);
    if (this._enableCacheCallId) {
      this._callIdCache.linearGradient.push(gradient);
    }
    return gradient;
  }
  public createPattern(image: TCanvasImageSource, repeat: TCanvasPatternRepeat): TCanvasPattern {
    const target = CanvasImageElement.toImageSource(image);
    return this.ctx.createPattern(target, repeat);
  }
  public createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): TCanvasGradient {
    const gradient = this.ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    if (this._enableCacheCallId) {
      this._callIdCache.radialGradient.push(gradient);
    }
    return gradient;
  }
  // WontFIX: createPath2D
  drawImage(
    imageOrContext: TCanvasImageSource,
    sx: number,
    sy: number,
    sWidth: number,
    sHeight: number,
    dx: number,
    dy: number,
    dWidth: number,
    dHeight: number
  ): void {
    const target = CanvasImageElement.toImageSource(imageOrContext);
    if (!target) {
      return;
    }
    if (sWidth === undefined) {
      this.ctx.drawImage(target, sx, sy);
    } else if (dx === undefined) {
      this.ctx.drawImage(target, sx, sy, sWidth, sHeight);
    } else {
      this.ctx.drawImage(target, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
  }
  public ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
    this.save();
    this.translate(x, y);
    this.rotate(rotation);
    this.scale(radiusX, radiusY);
    this.arc(0, 0, 1, startAngle, endAngle, anticlockwise);
    this.restore();
  }
  public fill(): void {
    return this.ctx.fill();
  }
  public fillRect(x: number, y: number, width: number, height: number): void {
    return this.ctx.fillRect(x, y, width, height);
  }
  public fillText(text: string, x: number, y: number, maxWidth?: number): void {
    if (maxWidth === undefined) {
      return this.ctx.fillText(text, x, y);
    }
    return this.ctx.fillText(text, x, y, maxWidth);
  }
  // WontFIX: getImageData
  // WontFIX: getLineDash
  // WontFIX: getTransform
  // Only For Offscreen: isPointInPath
  // WontFIX: isPointInStroke
  public lineTo(x: number, y: number): void {
    return this.ctx.lineTo(x, y);
  }
  // Only For Offscreen: measureText
  public moveTo(x: number, y: number): void {
    return this.ctx.moveTo(x, y);
  }
  // WontFIX: putImageData
  public quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    return this.ctx.quadraticCurveTo(cpx, cpy, x, y);
  }
  public rect(x: number, y: number, width: number, height: number): void {
    return this.ctx.rect(x, y, width, height);
  }
  public resetTransform() {
    return this.setTransform(1, 0, 0, 1, 0, 0);
  }
  public restore(): void {
    return this.ctx.restore();
  }
  public rotate(angle: number): void {
    return this.ctx.rotate(angle);
  }
  // WontFIX: roundRect
  public save(): void {
    return this.ctx.save();
  }
  public scale(x: number, y: number): void {
    return this.ctx.scale(x, y);
  }
  public setLineDash(gaps: number[]): void {
    return this.ctx.setLineDash(gaps);
  }
  public setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    return this.ctx.setTransform(a, b, c, d, e, f);
  }
  public stroke(): void {
    return this.ctx.stroke();
  }
  public strokeRect(x: number, y: number, width: number, height: number): void {
    return this.ctx.fillRect(x, y, width, height);
  }
  public strokeText(text: string, x: number, y: number, maxWidth?: number): void {
    if (maxWidth === undefined) {
      this.ctx.strokeText(text, x, y);
    }
    return this.ctx.strokeText(text, x, y, maxWidth);
  }
  public transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    return this.ctx.transform(a, b, c, d, e, f);
  }
  public translate(x: number, y: number): void {
    return this.ctx.translate(x, y);
  }

}