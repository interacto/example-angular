import {AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Bindings, LogLevel, RedoNTimes, UndoHistory, UndoNTimes} from 'interacto';
import {DisplayPreview} from '../command/DisplayPreview';
import {HidePreview} from '../command/HidePreview';
import {MovePreview} from '../command/MovePreview';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements AfterViewInit {
  @ViewChild('preview')
  public preview: ElementRef<HTMLDivElement>;

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

  constructor(public undoHistory: UndoHistory, public bindings: Bindings) {
  }

  ngAfterViewInit(): void {
    this.preview.nativeElement.style.display = 'none';

    this.bindings.buttonBinder()
      .on(this.baseStateButton)
      .toProduce(() => new UndoNTimes(this.undoHistory, this.undoHistory.getUndo().length))
      .log(LogLevel.usage) // Usage logs are automatically sent to the back-end for this binding
      .bind();

    this.bindings.buttonBinder()
      .onDynamic(this.undoButtonContainer)
      .toProduce(i => new UndoNTimes(
        this.undoHistory,
        // The native elements have to be retrieved from the child list since this list contains ElementRefs
        this.undoButtons.toArray().length - this.undoButtons.toArray().map(elt => elt.nativeElement).indexOf(i.widget!) - 1))
      .bind();

    this.bindings.buttonBinder()
      .onDynamic(this.redoButtonContainer)
      .toProduce(i => new RedoNTimes(this.undoHistory, this.redoButtons.toArray().map(elt => elt.nativeElement).indexOf(i.widget!) + 1))
      .bind();

    // Command previews

    // Displays command previews for undo buttons
    this.bindings.mouseEnterBinder(false)
      .onDynamic(this.undoButtonContainer)
      .toProduce(i => new DisplayPreview(
        this.undoHistory.getUndo()[this.undoButtons.toArray().map(elt => elt.nativeElement).indexOf(i.target as HTMLButtonElement)],
        this.preview.nativeElement))
      .bind();

    // Displays command previews for redo buttons
    this.bindings.mouseEnterBinder(false)
      .onDynamic(this.redoButtonContainer)
      .toProduce(i => new DisplayPreview(
        this.undoHistory.getRedo()[
        this.undoHistory.getRedo().length
        - this.redoButtons.toArray().map(elt => elt.nativeElement).indexOf(i.target as HTMLButtonElement)
        - 1],
        this.preview.nativeElement))
      .bind();

    // Hides command previews for undo and redo buttons
    this.bindings.mouseLeaveBinder(false)
      .onDynamic(this.undoButtonContainer)
      .onDynamic(this.redoButtonContainer)
      .toProduce(() => new HidePreview(this.preview.nativeElement))
      .bind();

    // Moves command previews to the mouse's position for undo and redo buttons
    this.bindings.mouseMoveBinder()
      .onDynamic(this.undoButtonContainer)
      .onDynamic(this.redoButtonContainer)
      .toProduce(i => new MovePreview(this.preview.nativeElement, i.pageX, i.pageY))
      .bind();
  }
}
