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
    const elt = this.svgElt.cloneNode() as SVGElement;
    elt.setAttribute('fill', this.newColor);
    elt.setAttribute('left', '0');
    elt.setAttribute('x', '0');
    elt.setAttribute('y', '0');
    return elt;
  }
}
