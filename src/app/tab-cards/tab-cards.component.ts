import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../service/data.service';
import {Bindings, TransferArrayItem, UndoHistory} from 'interacto';

@Component({
  selector: 'app-tab-cards',
  templateUrl: './tab-cards.component.html',
  styleUrls: ['./tab-cards.component.css']
})
export class TabCardsComponent implements OnInit, AfterViewInit {
  @ViewChild('cards1')
  public cards1: ElementRef<HTMLDivElement>;

  @ViewChild('cards2')
  public cards2: ElementRef<HTMLDivElement>;

  public mementoX: string;
  public mementoY: string;
  public mementoCSSPosition: string;
  public card: HTMLElement;
  public sourceIndex: number;

  public constructor(public dataService: DataService, public undoHistory: UndoHistory, public bindings: Bindings) {
    // With Interacto-angular you can inject in components a Bindings single-instance that allows you
    // to define binders and bindings in ngAfterViewInit.
    // The UndoHistory parameter is also injected and comes from the Bindings instance (so quite useless to inject
    // it most of the time since this.bindings.undoHistory returns the same instance).
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // This binder creates the command that allows the user to move a card from one list to another
    this.bindings.dndBinder(true)
      .on(window.document.body)
      .toProduce(() => {
        // The command is not executable until a proper target destination for the card has been selected by the user
        // The -1 index prevents makes canExecute() return false and prevents Interacto from executing the command
        return new TransferArrayItem(null, null, -1, 0, 'Drag card');
      })
      // Checks if the user picked a valid card, and a new list for the card as a destination
      .when(i => {
        // A valid card has to be selected in order to create the command
        const card = (i.src.target as Element).closest('mat-card');
        return card !== null;
      })
      .first((c, i) => {
        this.card = (i.src.target as Element).closest('mat-card') as HTMLElement;
        this.sourceIndex = Array.prototype.indexOf.call(this.card.parentNode.children, this.card);
        // Saves the initial state of the card's style to be able to restore it if the command can't be executed
        this.mementoX = this.card.style.left;
        this.mementoY = this.card.style.top;
        this.mementoCSSPosition = this.card.style.position;
        // Edits the card's style to make it movable visually
        this.card.style.width = String(this.card.clientWidth - 32) + 'px';
        this.card.style.position = 'absolute';
        this.card.style.zIndex = '999';
      })
      .then((c, i) => {
        // Retrieves the position of the mouse on the page (substract the sidebar size)
        let x = i.tgt.pageX - 220;
        let y = i.tgt.pageY;
        // Prevents parts of the card from going outside of the document
        if (i.tgt.pageX > window.innerWidth - this.card.clientWidth - 10) {
          x = x - this.card.clientWidth - 5;
        }
        if (i.tgt.pageY > window.innerHeight - this.card.clientHeight - 15) {
          y = y - this.card.clientHeight - 5;
        }

        // Moves the card visually
        this.card.style.left = String(x) + 'px';
        this.card.style.top = String(y) + 'px';

        // Checks if the target selected is valid for the current card and makes the command executable if it is
        const isCardPositionValid = (this.card.parentNode === this.cards1.nativeElement ?
          i.tgt.target === this.cards2.nativeElement : i.tgt.target === this.cards1.nativeElement);
        if (!isCardPositionValid) {
          c.srcIndex = -1;
        } else {
          c.srcIndex = this.sourceIndex;

          // Defines which array is the source and which one is the target
          const fromSrcToTgt = i.tgt.target === this.cards2.nativeElement && i.src.target !== this.cards1.nativeElement;
          if (fromSrcToTgt) {
            c.srcArray = this.dataService.cards1;
            c.tgtArray = this.dataService.cards2;
          } else {
            c.srcArray = this.dataService.cards2;
            c.tgtArray = this.dataService.cards1;
          }
        }
      })
      // Resets the position of the card if the command is invalid or cancelled
      .ifCannotExecute(() => {
        this.card.style.left = this.mementoX;
        this.card.style.top = this.mementoY;
        this.card.style.position = this.mementoCSSPosition;
      })
      .cancel(() => {
        this.card.style.left = this.mementoX;
        this.card.style.top = this.mementoY;
        this.card.style.position = this.mementoCSSPosition;
      })
      .bind();
  }
}
