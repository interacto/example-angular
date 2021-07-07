import {UndoableCommand} from 'interacto';

export class MoveRect extends UndoableCommand {
  constructor(private readonly rec: SVGRectElement) {
    super();
  }

  private mementoX: number;
  private mementoY: number;
  public vectorX: number;
  public vectorY: number;

  protected createMemento() {
    this.mementoX = this.rec.x.baseVal.value;
    this.mementoY = this.rec.y.baseVal.value;
  }

  protected execution(): void {
    this.rec.setAttribute('x', String(this.mementoX + this.vectorX));
    this.rec.setAttribute('y', String(this.mementoY + this.vectorY));
  }

  redo(): void {
    this.execution();
  }

  undo(): void {
    this.rec.setAttribute('x', String(this.mementoX));
    this.rec.setAttribute('y', String(this.mementoY));
  }

  hadEffect(): boolean {
    return true;
  }
}
