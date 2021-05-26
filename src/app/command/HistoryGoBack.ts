import {CommandBase, UndoHistory} from 'interacto';

export class HistoryGoBack extends CommandBase {

  constructor(private readonly index: number, private undoHistory: UndoHistory) {
    super();
  }

  protected execution(): void {
    while (this.undoHistory.getUndo().length !== this.index + 1) {
      this.undoHistory.undo();
    }
  }
}
