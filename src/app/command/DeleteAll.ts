import {UndoableCommand} from 'interacto';

export class DeleteAll extends UndoableCommand {
  private mementoContent: Array<Node>;

  public constructor(private readonly svgDoc: SVGSVGElement) {
    super();
    this.mementoContent = [];
  }

  protected createMemento(): void {
    this.mementoContent = Array.from(this.svgDoc.children);
  }

  protected execution(): void {
    this.redo();
  }

  public getUndoName(): string {
    return 'Delete all the SVG elements';
  }

  public redo(): void {
    Array.from(this.svgDoc.children).forEach(node => node.remove());
  }

  public undo(): void {
    this.mementoContent.forEach(node => this.svgDoc.appendChild(node));
  }
}
