import { CommandImpl } from 'interacto';
import { TextData } from '../model/TextData';


export class ClearText extends CommandImpl {
    private memento: string;

    public constructor(private text: TextData) {
        super();
    }

    protected createMemento(): void {
        this.memento = this.text.text;
    }

    protected doCmdBody(): void {
        this.text.text = '';
    }

    public undo(): void {
        this.text.text = this.memento;
    }

    public redo(): void {
        this.doCmdBody();
    }

    public getUndoName(): string {
        return 'Clear text';
    }
}
