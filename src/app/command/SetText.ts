import { CommandImpl, Undoable } from 'interacto';
import { TextData } from '../model/TextData';

export class SetText extends CommandImpl implements Undoable {
    private memento: string;

    public constructor(private textdata: TextData, private newText?: string) {
        super();
    }

    protected createMemento(): void {
        this.memento = this.textdata.text;
    }

    protected doCmdBody(): void {
        this.textdata.text = this.newText as string;
    }

    public canDo(): boolean {
        return this.newText !== undefined;
    }

    public set text(txt: string) {
        this.newText = txt;
    }

    public undo(): void {
        this.textdata.text = this.memento;
    }

    public redo(): void {
        this.doCmdBody();
    }

    public getUndoName(): string {
        return 'Set text';
    }
}
