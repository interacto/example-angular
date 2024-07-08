import {UndoableCommand} from 'interacto';
import {DataService} from '../service/data.service';

export class SetText extends UndoableCommand {
    private memento: string;

    public constructor(private data: DataService, private newText?: string) {
        super();
    }

    protected override createMemento(): void {
        this.memento = this.data.txt();
    }

    protected execution(): void {
        this.data.txt.set(this.newText!);
    }

    public override canExecute(): boolean {
        return this.newText !== undefined;
    }

    public set text(txt: string) {
        this.newText = txt;
    }

    public undo(): void {
        this.data.txt.set(this.memento);
    }

    public redo(): void {
        this.execution();
    }

    public override getUndoName(): string {
        return 'Set text';
    }

    public override getVisualSnapshot(): SVGElement | string | undefined {
      return this.newText;
    }
}
