import {DataService} from '../service/data.service';
import {CommandBase, Undoable} from 'interacto';


export class ClearText extends CommandBase implements Undoable {
    private memento: string;

    public constructor(private data: DataService) {
        super();
    }

    protected createMemento(): void {
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

    public getUndoName(): string {
        return 'Clear text';
    }
}
