import { Injectable, signal, type WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  readonly txt: WritableSignal<string>;
  readonly cards1: WritableSignal<Array<CardData>>;
  readonly cards2: WritableSignal<Array<CardData>>;
  readonly pictures: ReadonlyArray<string> = [
    'https://picsum.photos/seed/1/600',
    'https://picsum.photos/seed/2/600',
    'https://picsum.photos/seed/3/600',
    'https://picsum.photos/seed/4/600'
  ];
  readonly currentPicture: WritableSignal<number>;

  public constructor() {
    this.currentPicture = signal(0);
    this.txt = signal('foo');
    this.cards1 = signal([{
      id: 1,
      title: 'card 1',
      subTitle: 'The card 1',
      text: 'Some text for card 1'
    }, {
      id: 2,
      title: 'card 2',
      subTitle: 'The card 2',
      text: 'Some text for card 2'
    }]);
    this.cards2 = signal([{
      id: 3,
      title: 'card 3',
      subTitle: 'The card 3',
      text: 'Some text for card 3'
    }]);
  }
}

export interface CardData {
  id: number;
  title: string;
  subTitle: string;
  text: string;
}
