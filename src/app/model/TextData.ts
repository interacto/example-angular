import { Injectable } from '@angular/core';

@Injectable()
export class TextData {
    private txt: string;

    public constructor() {
        this.txt = 'foo';
    }

    public get text(): string {
        return this.txt;
    }

    public set text(newText: string) {
        this.txt = newText;
    }
}
