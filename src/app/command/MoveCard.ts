import {CommandBase} from 'interacto';

export class MoveCard extends CommandBase {
  public x: string;
  public y: string;
  public mementoX: string;
  public mementoY: string;
  public mementoPosition: string;
  public card: HTMLElement;
  public mementoCardCount;

  constructor(card: HTMLElement) {
    super();
    this.card = card;
    this.mementoX = this.card.style.left;
    this.mementoY = this.card.style.top;
    this.mementoPosition = this.card.style.position;

    const width = this.card.clientWidth - 32;
    this.card.style.width = String(width) + 'px';
    this.card.style.position = 'absolute';
    this.card.style.zIndex = '999';
  }

  protected execution(): void {
    this.card.style.left = this.x;
    this.card.style.top = this.y;
  }

  public setX(newX: string) {
    this.x = newX;
  }

  public setY(newY: string) {
    this.y = newY;
  }

  public resetPosition() {
    this.card.style.left = this.mementoX;
    this.card.style.top = this.mementoY;
    this.card.style.position = this.mementoPosition;
  }
}
