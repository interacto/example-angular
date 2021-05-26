import {CommandBase, UndoHistory} from 'interacto';

export class HistoryBackToStart extends CommandBase {

  constructor(private undoHistory: UndoHistory) {
    super();
  }

  protected execution(): void {
    while (this.undoHistory.getUndo().length > 0) {
      this.undoHistory.undo();
    }
  }
}
