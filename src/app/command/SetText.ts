import {UndoableCommand} from 'interacto';
import {DataService} from '../service/data.service';

export class SetText extends UndoableCommand {
    private memento: string;

    public constructor(private data: DataService, private newText?: string) {
        super();
    }

    protected createMemento(): void {
        this.memento = this.data.txt;
    }

    protected execution(): void {
        this.data.txt = this.newText!;
    }

    public canExecute(): boolean {
        return this.newText !== undefined;
    }

    public set text(txt: string) {
        this.newText = txt;
    }

    public undo(): void {
        this.data.txt = this.memento;
    }

    public redo(): void {
        this.execution();
    }

    public getUndoName(): string {
        return 'Set text';
    }

    public getVisualSnapshot(): SVGElement | string | undefined {
      return this.newText;
    }
}
