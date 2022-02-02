import {DataService} from '../service/data.service';
import {UndoableCommand} from 'interacto';

export class ClearText extends UndoableCommand {
    private memento: string;

    public constructor(private data: DataService) {
        super();
    }

    protected override createMemento(): void {
        this.memento = this.data.txt;
    }

    protected execution(): void {
        this.data.txt = '';
    }

    public undo(): void {
        this.data.txt = this.memento;
    }

    public redo(): void {
        this.execution();
    }

    public override getUndoName(): string {
        return 'Clear text';
    }
}
