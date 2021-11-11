import {AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ClearText} from './command/ClearText';
import {SetText} from './command/SetText';
import {DataService} from './service/data.service';
import {
  Bindings,
  LogLevel,
  PartialButtonBinder,
  PartialTextInputBinder,
  Redo,
  RedoNTimes,
  Undo,
  UndoHistory,
  UndoNTimes
} from 'interacto';
import {DisplayPreview} from './command/DisplayPreview';
import {HidePreview} from './command/HidePreview';
import {MovePreview} from './command/MovePreview';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
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

  @ViewChild('preview')
  public preview: ElementRef<HTMLDivElement>;

  @ViewChild('handle')
  public handle: ElementRef<SVGCircleElement>;

  @ViewChild('spring')
  public spring: ElementRef<SVGLineElement>;

  public constructor(public dataService: DataService, public undoHistory: UndoHistory, public bindings: Bindings) {
    // With Interacto-angular you can inject in components a Bindings single-instance that allows you
    // to define binders and bindings in ngAfterViewInit.
    // The UndoHistory parameter is also injected and comes from the Bindings instance (so quite useless to inject
    // it most of the time since this.bindings.undoHistory returns the same instance).

    // If the server address is not set to undefined, Interacto will try to send usage and error logs to the back-end
    // See an example of such a back-end at https://github.com/interacto/logger-backend
    // Here the address is configured by a proxy
    // (uncomment the following line to enable communication with the back-end)
    // this.bindings.logger.serverAddress = '';
  }

  ngAfterViewInit(): void {
    this.preview.nativeElement.style.display = 'none';

    this.spring.nativeElement.setAttribute('display', 'none');
    this.handle.nativeElement.setAttribute('display', 'none');

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

    this.bindings.keyDownBinder(true)
      .on(document.body)
      .toProduce(() => new Undo(this.undoHistory))
      .with(false, 'z')
      .when((i) => i.ctrlKey && !i.shiftKey)
      .bind();

    this.bindings.keyDownBinder(true)
      .on(document.body)
      .toProduce(() => new Redo(this.undoHistory))
      .with(false, 'Z')
      .when((i) => i.ctrlKey && i.shiftKey)
      .bind();

    this.bindings.keyDownBinder(true)
      .on(document.body)
      .toProduce(() => new Redo(this.undoHistory))
      .with(false, 'z')
      .when((i) => i.ctrlKey && i.shiftKey)
      .bind();

    this.bindings.keyDownBinder(true)
      .on(document.body)
      .toProduce(() => new Redo(this.undoHistory))
      .with(false, 'y')
      .when((i) => i.ctrlKey)
      .bind();

    this.bindings.keyDownBinder(true)
      .on(document.body)
      .toProduce(() => new Redo(this.undoHistory))
      .with(false, 'Y')
      .when((i) => i.ctrlKey)
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
      .then((c, i) => c.text = i.widget?.value ?? '')
      .bind();
  }
}
