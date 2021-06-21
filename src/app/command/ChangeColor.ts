import {UndoableCommand} from 'interacto';

export class ChangeColor extends UndoableCommand {
  private mementoColor: string | undefined;
  private newColor: string;

  constructor(private readonly svgElt: SVGElement) {
    super();
  }

  protected createMemento(): void {
    this.mementoColor = this.svgElt.getAttribute('fill');
  }

  protected execution(): void {
    // tslint:disable-next-line:no-bitwise
    this.newColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    this.redo();
  }

  public undo(): void {
    this.svgElt.setAttribute('fill', this.mementoColor);
  }

  public redo(): void {
    this.svgElt.setAttribute('fill', this.newColor);
  }

  public getUndoName(): string {
    return 'Change color';
  }

  /**
   * Returns a copy of the shape with its new color as a snapshot.
   */
  public getVisualSnapshot(): SVGElement | string | undefined {
    const rec = this.svgElt.cloneNode() as SVGElement;
    rec.setAttribute('fill', this.newColor);
    rec.setAttribute('left', '0');
    return rec;
  }
}
