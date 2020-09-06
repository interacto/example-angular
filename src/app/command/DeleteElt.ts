import {CommandImpl, Undoable} from 'interacto';

export class DeleteElt extends CommandImpl implements Undoable {

  public constructor(private readonly svgDoc: SVGSVGElement, private readonly svgElt: SVGElement) {
    super();
  }

  protected doCmdBody(): void {
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
