import {UndoableCommand} from 'interacto';

export class DeleteElt extends UndoableCommand {

  public constructor(private readonly svgDoc: SVGSVGElement, private readonly svgElt: SVGElement) {
    super();
  }

  protected execution(): void {
    this.redo();
  }

  public getUndoName(): string {
    return 'Delete SVG element';
  }

  public redo(): void {
    this.svgDoc.removeChild(this.svgElt);
  }

  public undo(): void {
    this.svgDoc.appendChild(this.svgElt);
  }
}
