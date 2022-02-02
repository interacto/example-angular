import {SVGCommand} from './SVGCommand';

export class DeleteAll extends SVGCommand {
  private mementoContent: Array<Node>;

  public constructor(svgDoc: SVGSVGElement) {
    super(svgDoc);
    this.mementoContent = [];
  }

  protected override createMemento(): void {
    this.mementoContent = Array.from(this.svgdoc.children);
  }

  protected execution(): void {
    this.redo();
  }

  public override getUndoName(): string {
    return 'Delete all the SVG elements';
  }

  public redo(): void {
    Array.from(this.svgdoc.children).forEach(node => node.remove());
  }

  public undo(): void {
    this.mementoContent.forEach(node => this.svgdoc.appendChild(node));
  }
}
