import {AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ClearText} from './command/ClearText';
import {DrawRect} from './command/DrawRect';
import {SetText} from './command/SetText';
import {DataService} from './service/data.service';
import {Bindings, PartialButtonBinder, PartialTextInputBinder, UndoHistory, TransferArrayItem} from 'interacto';
import {DeleteElt} from './command/DeleteElt';
import {ChangeColor} from './command/ChangeColor';
import {DeleteAll} from './command/DeleteAll';
import {HistoryGoBack} from './command/HistoryGoBack';
import {HistoryGoForward} from './command/HistoryGoForward';
import {HistoryBackToStart} from './command/HistoryBackToStart';
import {DisplayPreview} from './command/DisplayPreview';
import {HidePreview} from './command/HidePreview';
import {MovePreview} from './command/MovePreview';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas')
  private canvas: ElementRef<SVGSVGElement>;

  @ViewChildren('undobuttons')
  public undoButtons: QueryList<ElementRef<HTMLButtonElement>>;

  @ViewChild('undoButtonContainer')
  public undoButtonContainer: ElementRef<HTMLElement>;

  @ViewChildren('redobuttons')
  public redoButtons: QueryList<ElementRef<HTMLButtonElement>>;

  @ViewChild('redoButtonContainer')
  public redoButtonContainer: ElementRef<HTMLElement>;

  @ViewChild('baseStateButton')
  public baseStateButton: HTMLButtonElement;

  @ViewChild('cards1')
  public cards1: ElementRef<HTMLDivElement>;

  @ViewChild('cards2')
  public cards2: ElementRef<HTMLDivElement>;

  @ViewChild('preview')
  public preview: ElementRef<HTMLDivElement>;

  // For the card drag-and-drop
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

  ngAfterViewInit(): void {
    const drawrect = new DrawRect(this.canvas.nativeElement);
    drawrect.setCoords(10, 10, 300, 300);
    drawrect.execute();

    this.preview.nativeElement.style.display = 'none';

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
        // Retrieves the position of the mouse on the page
        let x = i.tgt.pageX;
        let y = i.tgt.pageY;
        // Prevents parts of the card from going outside of the document
        if (i.tgt.pageX > window.document.body.clientWidth - this.card.clientWidth) {
          x = x - this.card.clientWidth - 5;
        }
        if (i.tgt.pageY > window.document.body.clientHeight - this.card.clientHeight) {
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

    this.bindings.longTouchBinder(2000)
      .toProduce(i => new DeleteElt(this.canvas.nativeElement, i.currentTarget as SVGElement))
      .onDynamic(this.canvas)
      .when(i => i.currentTarget !== this.canvas.nativeElement && i.currentTarget instanceof SVGElement)
      // Prevents the context menu to pop-up
      .preventDefault()
      // Consumes the events before the multi-touch interaction and co use them
      .stopImmediatePropagation()
      .bind();

    this.bindings.tapBinder(3)
      .toProduce(i => new ChangeColor(i.taps[0].currentTarget as SVGElement))
      .onDynamic(this.canvas)
      .when(i => i.taps[0].currentTarget !== this.canvas.nativeElement
        && i.taps[0].currentTarget instanceof SVGElement)
      // Does not continue to run if the first targeted node is not an SVG element
      .strictStart()
      .bind();

    const boundary = this.canvas.nativeElement.getBoundingClientRect();

    this.bindings.multiTouchBinder(2)
      .toProduce(() => new DrawRect(this.canvas.nativeElement as SVGSVGElement))
      .on(this.canvas)
      .then((c, i) => {
        c.setCoords(Math.min(...i.touches.map(touch => touch.tgt.clientX)) - boundary.x,
          Math.min(...i.touches.map(touch => touch.tgt.clientY)) - boundary.y,
          Math.max(...i.touches.map(touch => touch.tgt.clientX)) - boundary.x,
          Math.max(...i.touches.map(touch => touch.tgt.clientY)) - boundary.y);
      })
      .continuousExecution()
      .preventDefault()
      .bind();

    this.bindings.swipeBinder(true, 300, 500, 50)
      .toProduce(() => new DeleteAll(this.canvas.nativeElement))
      .on(this.canvas)
      .when(i => i.src.currentTarget === this.canvas.nativeElement)
      .preventDefault()
      .bind();

    this.bindings.buttonBinder()
      .on(this.baseStateButton)
      .toProduce(() => new HistoryBackToStart(this.undoHistory))
      .bind();

    this.bindings.buttonBinder()
      .onDynamic(this.undoButtonContainer)
      // The native elements have to be retrieved from the child list since this list contains ElementRefs
      .toProduce(i => new HistoryGoBack(this.undoButtons.toArray().map(elt => elt.nativeElement).indexOf(i.widget), this.undoHistory))
      // .then((i, c) => console.log('hey'))
      .bind();

    this.bindings.buttonBinder()
      .onDynamic(this.redoButtonContainer)
      .toProduce(i => new HistoryGoForward(this.redoButtons.toArray().map(elt => elt.nativeElement).indexOf(i.widget), this.undoHistory))
      .bind();

    // Command previews

    // Displays command previews for undo buttons
    this.bindings.mouseoverBinder(false)
      .onDynamic(this.undoButtonContainer)
      .toProduce(i => new DisplayPreview(
        this.undoHistory.getUndo()[this.undoButtons.toArray().map(elt => elt.nativeElement).indexOf(i.target as HTMLButtonElement)],
        this.preview.nativeElement))
      .bind();

    // Displays command previews for redo buttons
    this.bindings.mouseoverBinder(false)
      .onDynamic(this.redoButtonContainer)
      .toProduce(i => new DisplayPreview(
        this.undoHistory.getRedo()[
          this.undoHistory.getRedo().length
          - this.redoButtons.toArray().map(elt => elt.nativeElement).indexOf(i.target as HTMLButtonElement)
          - 1],
        this.preview.nativeElement))
      .bind();

    // Hides command previews for undo and redo buttons
    this.bindings.mouseoutBinder(false)
      .onDynamic(this.undoButtonContainer)
      .onDynamic(this.redoButtonContainer)
      .toProduce(() => new HidePreview(this.preview.nativeElement))
      .bind();

    // Moves command previews to the mouse's position for undo and redo buttons
    this.bindings.mousemoveBinder()
      .onDynamic(this.undoButtonContainer)
      .onDynamic(this.redoButtonContainer)
      .toProduce(i => new MovePreview(this.preview.nativeElement, i.pageX, i.pageY))
      .bind();
  }

  // This method is called by the Interacto directive specified in the HTML document
  // on the button used to clear the text.
  // This shows the second way, more in the spirit of Angular, for using binders directly from
  // HTML. This avoids the declaration of properties in the component class for accessing the
  // widgets.
  clearClicksBinder(binder: PartialButtonBinder): void {
    binder
      .toProduce(() => new ClearText(this.dataService))
      .bind();
  }

  writeTextBinder(binder: PartialTextInputBinder): void {
    binder
      .toProduce(() => new SetText(this.dataService))
      .then((c, i) => c.text = i.widget.value)
      .bind();
  }
}
