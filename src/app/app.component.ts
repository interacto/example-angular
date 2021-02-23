import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {ClearText} from './command/ClearText';
import {DrawRect} from './command/DrawRect';
import {DeleteElt} from './command/DeleteElt';
import {ChangeColor} from './command/ChangeColor';
import {DeleteAll} from './command/DeleteAll';
import {SetText} from './command/SetText';
import {DataService} from './service/data.service';
import {buttonBinder, longTouchBinder, multiTouchBinder, Redo, swipeBinder, tapBinder, textInputBinder, Undo, UndoHistory} from 'interacto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('clearbutton')
  private clearButton: ElementRef<HTMLButtonElement>;

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

  public constructor(public dataService: DataService) {
  }

  public getUndoRedo(): UndoHistory {
    return UndoHistory.getInstance();
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


    buttonBinder()
      .on(this.clearButton)
      .toProduce(() => new ClearText(this.dataService))
      .bind();

    textInputBinder()
      .toProduce(() => new SetText(this.dataService))
      .then((c, i) => c.text = i.getWidget().value)
      .on(this.textarea)
      .bind();

    buttonBinder()
      .toProduce(() => new Undo())
      .on(this.undoButton)
      .bind();

    buttonBinder()
      .toProduce(() => new Redo())
      .on(this.redoButton)
      .bind();

    longTouchBinder(2000)
      .toProduce(i => new DeleteElt(this.canvas.nativeElement, i.getSrcObject() as SVGElement))
      .onDynamic(this.canvas)
      .when(i => i.getSrcObject() !== this.canvas.nativeElement && i.getSrcObject() instanceof SVGElement)
      // Prevents the context menu to pop-up
      .preventDefault()
      // Consumes the events before the multi-touch interaction and co use them
      .stopImmediatePropagation()
      .bind();

    tapBinder(3)
      .toProduce(i => new ChangeColor(i.getTapData()[0].getSrcObject() as SVGElement))
      .onDynamic(this.canvas)
      .when(i => i.getTapData()[0].getSrcObject() !== this.canvas.nativeElement
        && i.getTapData()[0].getSrcObject() instanceof SVGElement)
      // Does not continue to run if the first targeted node is not an SVG element
      .strictStart()
      .bind();

    const boundary = this.canvas.nativeElement.getBoundingClientRect();

    multiTouchBinder(2)
      .toProduce(i => new DrawRect(this.canvas.nativeElement as SVGSVGElement))
      .on(this.canvas)
      .then((c, i) => {
        c.setCoords(Math.min(...i.getTouchData().map(touch => touch.getTgtClientX())) - boundary.x,
          Math.min(...i.getTouchData().map(touch => touch.getTgtClientY())) - boundary.y,
          Math.max(...i.getTouchData().map(touch => touch.getTgtClientX())) - boundary.x,
          Math.max(...i.getTouchData().map(touch => touch.getTgtClientY())) - boundary.y);
      })
      .continuousExecution()
      .preventDefault()
      .bind();

    swipeBinder(true, 300, 500, 50)
      .toProduce(i => new DeleteAll(this.canvas.nativeElement))
      .on(this.canvas)
      .when(i => i.getSrcObject() === this.canvas.nativeElement)
      .preventDefault()
      .bind();
  }
}
