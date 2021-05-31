import {CommandBase, Undoable} from 'interacto';

export class TransferArrayItem<T> extends CommandBase implements Undoable {
  constructor(private srcArray: Array<T>,
              private tgtArray: Array<T>,
              private srcIndex: number,
              private tgtIndex: number,
              private cmdName: string) {
    super();
  }

  protected execution(): void {
    this.redo();
  }

  public canExecute(): boolean {
    return (this.srcIndex >= 0 && this.srcIndex < this.srcArray.length) &&
      (this.tgtIndex >= 0 && this.tgtIndex <= this.tgtArray.length);
  }

  public getUndoName(): string {
    return this.cmdName;
  }

  public redo(): void {
    const elt = this.srcArray[this.srcIndex];
    this.srcArray.splice(this.srcIndex, 1);
    this.tgtArray.splice(this.tgtIndex, 0, elt);
  }

  public undo(): void {
    const elt = this.tgtArray[this.tgtIndex];
    this.tgtArray.splice(this.tgtIndex, 1);
    this.srcArray.splice(this.srcIndex, 0, elt);
  }
}
