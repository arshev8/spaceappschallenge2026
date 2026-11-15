// jsdom has no canvas; the starfield and games treat a null context as "don't draw".
HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;
