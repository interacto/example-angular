import {UndoableCommand} from 'interacto';

export class DrawRect extends UndoableCommand {
  private rec: SVGRectElement;
  private minX: number;
  private minY: number;
  private maxX: number;
  private maxY: number;

  constructor(private readonly svgdoc: SVGSVGElement) {
    super();
  }

  protected execution(): void {
    if (this.rec === undefined) {
      this.rec = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      this.svgdoc.appendChild(this.rec);
    }
    this.rec.setAttribute('x', this.minX.toString());
    this.rec.setAttribute('y', this.minY.toString());
    this.rec.setAttribute('height', (this.maxY - this.minY).toString());
    this.rec.setAttribute('width', (this.maxX - this.minX).toString());
  }

  public setCoords(minX: number, minY: number, maxX: number, maxY: number): void {
    this.maxY = maxY;
    this.minY = minY;
    this.maxX = maxX;
    this.minX = minX;
  }

  public undo(): void {
    this.svgdoc.removeChild(this.rec);
  }

  public redo(): void {
    this.svgdoc.appendChild(this.rec);
  }

  public getUndoName(): string {
    return 'Draw Rectangle';
  }

  public getVisualSnapshot(): SVGElement | string | undefined {
    return this.rec;
  }
}
