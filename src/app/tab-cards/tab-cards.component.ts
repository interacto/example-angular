import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {CardData, DataService} from '../service/data.service';
import {Bindings, TransferArrayItem, UndoHistory} from 'interacto';
import {TabContentComponent} from '../tab-content/tab-content.component';
import {bindingsFactory, undoHistoryFactory} from 'interacto-angular';

@Component({
  selector: 'app-tab-cards',
  templateUrl: './tab-cards.component.html',
  styleUrls: ['./tab-cards.component.css'],
  providers: [
    {provide: Bindings, useFactory: bindingsFactory},
    {provide: UndoHistory, useFactory: undoHistoryFactory, deps: [Bindings]}]
})
export class TabCardsComponent extends TabContentComponent implements AfterViewInit {
  @ViewChild('cards1')
  public cards1: ElementRef<HTMLDivElement>;

  @ViewChild('cards2')
  public cards2: ElementRef<HTMLDivElement>;

  public mementoX: string;
  public mementoY: string;
  public mementoCSSPosition: string;
  public card: HTMLElement | null;
  public sourceIndex: number;

  public constructor(public dataService: DataService, public bindings: Bindings) {
    super();
    // With Interacto-angular you can inject in components a Bindings single-instance that allows you
    // to define binders and bindings in ngAfterViewInit.
    // The UndoHistory parameter is also injected and comes from the Bindings instance (so quite useless to inject
    // it most of the time since this.bindings.undoHistory returns the same instance).
  }

  public ngAfterViewInit(): void {
    // This binder creates the command that allows the user to move a card from one list to another
    this.bindings.dndBinder(true)
      .on(window.document.body)
      .toProduce(() => {
        // The command is not executable until a proper target destination for the card has been selected by the user
        // The -1 index prevents makes canExecute() return false and prevents Interacto from executing the command
        return new TransferArrayItem<CardData>([], [], -1, 0, 'Drag card');
      })
      // Checks if the user picked a valid card, and a new list for the card as a destination
      .when(i => (i.src.target as Element).classList.contains('mat-card'))
      .first((_, i) => {
        this.card = (i.src.target as HTMLElement);
        this.sourceIndex = Array.prototype.indexOf.call(this.card!.parentNode?.children ?? [], this.card);
        // Saves the initial state of the card's style to be able to restore it if the command can't be executed
        this.mementoX = this.card.style.left;
        this.mementoY = this.card.style.top;
        this.mementoCSSPosition = this.card.style.position;

        this.card.style.position = 'relative';
        this.card.style.zIndex = '999';

      })
      .then((c, i) => {
        this.card!.style.left = `${i.diffClientX}px`;
        this.card!.style.top = `${i.diffClientY}px`;
        c.srcIndex = this.sourceIndex;

        if (this.insideRectangle(this.cards2.nativeElement.getBoundingClientRect(), i.tgt.clientX, i.tgt.clientY) &&
          !this.insideRectangle(this.cards2.nativeElement.getBoundingClientRect(), i.src.clientX, i.src.clientY)) {
          c.srcArray = this.dataService.cards1;
          c.tgtArray = this.dataService.cards2;
        } else {
          if (this.insideRectangle(this.cards1.nativeElement.getBoundingClientRect(), i.tgt.clientX, i.tgt.clientY) &&
          !this.insideRectangle(this.cards1.nativeElement.getBoundingClientRect(), i.src.clientX, i.src.clientY)) {
            c.srcArray = this.dataService.cards2;
            c.tgtArray = this.dataService.cards1;
          } else {
            c.srcIndex = -1;
          }
        }
      })
      // Resets the position of the card if the command is invalid or cancelled
      .ifCannotExecute(() => {
        this.card!.style.left = this.mementoX;
        this.card!.style.top = this.mementoY;
        this.card!.style.position = this.mementoCSSPosition;
      })
      .cancel(() => {
        this.card!.style.left = this.mementoX;
        this.card!.style.top = this.mementoY;
        this.card!.style.position = this.mementoCSSPosition;
      })
      .bind();
  }

  private insideRectangle(rec: DOMRect, x: number, y: number): boolean {
    return x >= rec.x && y >= rec.y && x <= (rec.x + rec.width) && y <= (rec.y + rec.height);
  }
}
