import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {CardData, DataService} from '../service/data.service';
import {Bindings, TransferArrayItem, UndoHistoryBase} from 'interacto';
import {InteractoModule, interactoProviders} from 'interacto-angular';
import {MatCardModule} from '@angular/material/card';
import {AngularSplitModule} from 'angular-split';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-tab-cards',
  standalone: true,
  imports: [MatCardModule, InteractoModule, AngularSplitModule, CommonModule],
  templateUrl: './tab-cards.component.html',
  styleUrl: './tab-cards.component.css',
  providers: [interactoProviders()]
})
export class TabCardsComponent implements AfterViewInit {
  @ViewChild('cardsPane')
  protected pane: ElementRef<HTMLDivElement>;

  @ViewChild('cards1')
  protected cards1: ElementRef<HTMLDivElement>;

  @ViewChild('cards2')
  protected cards2: ElementRef<HTMLDivElement>;

  public constructor(protected dataService: DataService, private bindings: Bindings<UndoHistoryBase>) {
    // With Interacto-angular you can inject in components a Bindings single-instance that allows you
    // to define binders and bindings in ngAfterViewInit.
    // The UndoHistory parameter is also injected and comes from the Bindings instance (so quite useless to inject
    // it most of the time since this.bindings.undoHistory returns the same instance).
  }

  public ngAfterViewInit(): void {
    // This binder creates the command that allows the user to move a card from one list to another
    // Its uses an accumulator: data used in and shared between the routines. Reinit after each interaction execution
    this.bindings.dndBinder(true, {
      "mementoX": "",
      "mementoY": "",
      "mementoCSSPosition": ""
    })
      .on(this.pane)
      .toProduce(() =>
        // The command is not executable until a proper target destination for the card has been selected by the user
        // The -1 index prevents makes canExecute() return false and prevents Interacto from executing the command
        new TransferArrayItem<CardData>([], [], -1, 0, 'Drag card')
      )
      // Checks if the user picked a valid card, and a new list for the card as a destination
      .when(i => (i.src.target as Element).classList.contains('cards'))
      .first((c, i, acc) => {
        const card = i.src.target as HTMLElement;
        c.srcIndex = Array.prototype.indexOf.call(card.parentNode?.children ?? [], card);
        acc.mementoX = card.style.left;
        acc.mementoY = card.style.top;
        acc.mementoCSSPosition = card.style.position;
        card.style.position = 'relative';
        card.style.zIndex = '999';
      })
      .then((c, i) => {
        const card = i.src.target as HTMLElement;
        card.style.left = `${i.diffClientX}px`;
        card.style.top = `${i.diffClientY}px`;

        if (this.insideRectangle(this.cards2.nativeElement.getBoundingClientRect(), i.tgt.clientX, i.tgt.clientY) &&
          !this.insideRectangle(this.cards2.nativeElement.getBoundingClientRect(), i.src.clientX, i.src.clientY)) {
          c.srcArray = this.dataService.cards1();
          c.tgtArray = this.dataService.cards2();
        } else {
          if (this.insideRectangle(this.cards1.nativeElement.getBoundingClientRect(), i.tgt.clientX, i.tgt.clientY) &&
          !this.insideRectangle(this.cards1.nativeElement.getBoundingClientRect(), i.src.clientX, i.src.clientY)) {
            c.srcArray = this.dataService.cards2();
            c.tgtArray = this.dataService.cards1();
          }
          else {
            c.srcArray = [];
            c.tgtArray = [];
          }
        }
      })
      // Resets the position of the card if the command is invalid or cancelled
      .ifCannotExecute((_, i, acc) => {
        const card = i.src.target as HTMLElement;
        card.style.left = acc.mementoX;
        card.style.top = acc.mementoY;
        card.style.position = acc.mementoCSSPosition;
      })
      .cancel((i, acc) => {
        const card = i.src.target as HTMLElement;
        card.style.left = acc.mementoX;
        card.style.top = acc.mementoY;
        card.style.position = acc.mementoCSSPosition;
      })
      .bind();
  }

  private insideRectangle(rec: DOMRect, x: number, y: number): boolean {
    return x >= rec.x && y >= rec.y && x <= (rec.x + rec.width) && y <= (rec.y + rec.height);
  }
}
