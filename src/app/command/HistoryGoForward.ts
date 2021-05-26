import {CommandBase, UndoHistory} from 'interacto';

export class HistoryGoForward extends CommandBase {

  constructor(private readonly index: number, private undoHistory: UndoHistory) {
    super();
  }

  protected execution(): void {
    const initialIndex = this.undoHistory.getRedo().length;
    while (this.undoHistory.getRedo().length !== initialIndex - this.index - 1) {
      this.undoHistory.redo();
    }
  }
}
