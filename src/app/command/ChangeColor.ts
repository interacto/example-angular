import {CommandImpl, Undoable} from 'interacto';

export class ChangeColor extends CommandImpl implements Undoable {
  private mementoColor: string | undefined;
  private newColor: string;

  constructor(private readonly svgElt: SVGElement) {
    super();
  }

  protected createMemento(): void {
    this.mementoColor = this.svgElt.getAttribute('fill');
  }

  protected doCmdBody(): void {
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
}
