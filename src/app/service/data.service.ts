import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  txt: string;
  readonly cards1: Array<CardData>;
  readonly cards2: Array<CardData>;
  pictures = [
    {src: 'https://picsum.photos/seed/1/200'},
    {src: 'https://picsum.photos/seed/2/200'},
    {src: 'https://picsum.photos/seed/3/200'},
    {src: 'https://picsum.photos/seed/4/200'}
  ];
  currentPicture = 0;

  public constructor() {
    this.txt = 'foo';
    this.cards1 = [];
    this.cards2 = [];

    this.cards1.push({
      title: 'card 1',
      subTitle: 'The card 1',
      text: 'Some text for card 1'
    });

    this.cards1.push({
      title: 'card 2',
      subTitle: 'The card 2',
      text: 'Some text for card 2'
    });

    this.cards2.push({
      title: 'card 3',
      subTitle: 'The card 3',
      text: 'Some text for card 3'
    });
  }
}

export interface CardData {
  title: string;
  subTitle: string;
  text: string;
}
