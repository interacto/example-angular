import {SVGCommand} from './SVGCommand';

export class ChangeColor extends SVGCommand {
  private mementoColor: string | null;
  private newColor: string;

  constructor(private readonly svgElt: SVGElement, svgdoc: SVGSVGElement) {
    super(svgdoc);
  }

  protected override createMemento(): void {
    this.mementoColor = this.svgElt.getAttribute('fill');
  }

  protected execution(): void {
    // tslint:disable-next-line:no-bitwise
    this.newColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    this.redo();
  }

  public undo(): void {
    if (this.mementoColor === null) {
      this.svgElt.removeAttribute('fill');
    }else {
      this.svgElt.setAttribute('fill', this.mementoColor);
    }
  }

  public redo(): void {
    this.svgElt.setAttribute('fill', this.newColor);
  }

  public override getUndoName(): string {
    return 'Change color';
  }
}
