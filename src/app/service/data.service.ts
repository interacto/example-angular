import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  txt: string;
  readonly cards1: Array<CardData>;
  readonly cards2: Array<CardData>;
  pictures = [
    {src: 'https://picsum.photos/seed/1/600'},
    {src: 'https://picsum.photos/seed/2/600'},
    {src: 'https://picsum.photos/seed/3/600'},
    {src: 'https://picsum.photos/seed/4/600'}
  ];
  currentPicture = 0;

  public constructor() {
    this.txt = 'foo';
    this.cards1 = [];
    this.cards2 = [];

    this.cards1.push({
      id: 1,
      title: 'card 1',
      subTitle: 'The card 1',
      text: 'Some text for card 1'
    });

    this.cards1.push({
      id: 2,
      title: 'card 2',
      subTitle: 'The card 2',
      text: 'Some text for card 2'
    });

    this.cards2.push({
      id: 3,
      title: 'card 3',
      subTitle: 'The card 3',
      text: 'Some text for card 3'
    });
  }
}

export interface CardData {
  id: number;
  title: string;
  subTitle: string;
  text: string;
}
