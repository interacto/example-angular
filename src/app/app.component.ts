import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {ClearText} from './command/ClearText';
import {DrawRect} from './command/DrawRect';
import {SetText} from './command/SetText';
import {DataService} from './service/data.service';
import {Bindings, Interaction, InteractionBinder, PointData, UndoHistory} from 'interacto';
import {DeleteElt} from './command/DeleteElt';
import {ChangeColor} from './command/ChangeColor';
import {DeleteAll} from './command/DeleteAll';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('textfield')
  private textarea: ElementRef<HTMLTextAreaElement>;

  @ViewChild('undo')
  private undoButton: ElementRef<HTMLButtonElement>;

  @ViewChild('redo')
  private redoButton: ElementRef<HTMLButtonElement>;

  @ViewChild('canvas')
  private canvas: ElementRef<SVGSVGElement>;

  @ViewChild('cards1')
  private cards1: ElementRef;

  @ViewChild('cards2')
  private cards2: ElementRef;

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

    // dragLockBinder()
    //   .on(this.cards1)
    //   .on(this.cards2)
    //   .toProduce(i => {
    //     const card = (i.getSrcObject() as Element).closest('mat-card');
    //     const index = Array.prototype.indexOf.call(card.parentNode.children, card);
    //     console.log(i.getTgtClientX() + ' ' + i.getTgtClientY());
    //     const fromSrcToTgt = i.getTgtObject() === this.cards2.nativeElement && i.getSrcObject() !== this.cards1.nativeElement;
    //     if (fromSrcToTgt) {
    //       return new TransferArrayItem(this.dataService.cards1, this.dataService.cards2, index, 0);
    //     }
    //     return new TransferArrayItem(this.dataService.cards2, this.dataService.cards1, index, 0);
    //   })
    //   .when(i =>
    //     (i.getSrcObject() as Element).closest('mat-card').parentNode === this.cards1.nativeElement ?
    //     i.getTgtObject() === this.cards2.nativeElement : i.getTgtObject() === this.cards1.nativeElement)
    //   // .log(LogLevel.binding)
    //   .bind();


    this.bindings.textInputBinder()
      .toProduce(() => new SetText(this.dataService))
      .then((c, i) => c.text = i.widget.value)
      .on(this.textarea)
      .bind();

    // Shortcut for defining undo/redo bindings with buttons
    this.bindings.undoRedoBinder(this.undoButton, this.redoButton);

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
      .toProduce(i => new DrawRect(this.canvas.nativeElement as SVGSVGElement))
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
      .toProduce(i => new DeleteAll(this.canvas.nativeElement))
      .on(this.canvas)
      .when(i => i.src.currentTarget === this.canvas.nativeElement)
      .preventDefault()
      .bind();
  }

  // This method is called by the Interacto directive specified in the HTML document
  // on the button used to clear the text.
  // This shows the second way, more in the spirit of Angular, for using binders directly from
  // HTML. This avoids the declaration of properties in the component class for accessing the
  // widgets.
  clearClicksBinder(binder: InteractionBinder<Interaction<PointData>, PointData>): void {
    binder
      .toProduce(() => new ClearText(this.dataService))
      .bind();
  }
}
