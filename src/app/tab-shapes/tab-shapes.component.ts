import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {DataService} from '../service/data.service';
import {Bindings, UndoHistory} from 'interacto';
import {DrawRect} from '../command/DrawRect';
import {TabContentComponent} from '../tab-content/tab-content.component';
import {MoveRect} from '../command/MoveRect';
import {ChangeColor} from '../command/ChangeColor';
import {DeleteElt} from '../command/DeleteElt';
import {DeleteAll} from '../command/DeleteAll';
import {AppComponent} from '../app.component';
import {bindingsFactory, undoHistoryFactory} from 'interacto-angular';

@Component({
  selector: 'app-tab-shapes',
  templateUrl: './tab-shapes.component.html',
  styleUrls: ['./tab-shapes.component.css'],
  // This providers is optional. It permits to have a specific Bindings and thus a specific UndoHistory for this
  // component. Useful when you want to have different undo histories.
  providers: [
    {provide: Bindings, useFactory: bindingsFactory},
    {provide: UndoHistory, useFactory: undoHistoryFactory, deps: [Bindings]}]
})
export class TabShapesComponent extends TabContentComponent implements AfterViewInit {
  @ViewChild('canvas')
  private canvas: ElementRef<SVGSVGElement>;

  public constructor(public dataService: DataService, public undoHistory: UndoHistory, public bindings: Bindings,
                     private appComponent: AppComponent) {
    super();
    // With Interacto-angular you can inject in components a Bindings single-instance that allows you
    // to define binders and bindings in ngAfterViewInit.
    // The UndoHistory parameter is also injected and comes from the Bindings instance (so quite useless to inject
    // it most of the time since this.bindings.undoHistory returns the same instance).
  }

  ngAfterViewInit(): void {
    const drawrect = new DrawRect(this.canvas.nativeElement);
    drawrect.setCoords(10, 10, 300, 300);
    drawrect.execute();

    this.bindings.reciprocalDndBinder(this.appComponent.handle, this.appComponent.spring)
      .onDynamic(this.canvas)
      .toProduce(i => new MoveRect(i.src.target as SVGRectElement, this.canvas.nativeElement))
      .then((c, i) => {
        c.vectorX = i.diffClientX;
        c.vectorY = i.diffClientY;
      })
      .when(i => i.tgt.currentTarget !== this.canvas.nativeElement)
      .continuousExecution()
      .bind();

    this.bindings.reciprocalTouchDnDBinder(this.appComponent.handle, this.appComponent.spring)
      .onDynamic(this.canvas)
      .toProduce(i => new MoveRect(i.src.target as SVGRectElement, this.canvas.nativeElement))
      .then((c, i) => {
        c.vectorX = i.diffClientX;
        c.vectorY = i.diffClientY;
      })
      .continuousExecution()
      .bind();

    this.bindings.longTouchBinder(2000)
      .toProduce(i => new DeleteElt(this.canvas.nativeElement, i.currentTarget as SVGElement))
      .onDynamic(this.canvas)
      .when(i => i.target !== this.canvas.nativeElement)
      // Prevents the deletion from occurring when dragging the shape
      // Prevents the context menu from popping up
      .preventDefault()
      .bind();

    this.bindings.tapBinder(3)
      .toProduce(i => new ChangeColor(i.taps[0].currentTarget as SVGElement, this.canvas.nativeElement))
      .onDynamic(this.canvas)
      .when(i => i.taps[0].target !== this.canvas.nativeElement)
      // Does not continue to run if the first targeted node is not an SVG element
      .strictStart()
      .bind();

    this.bindings.multiTouchBinder(2)
      .toProduce(() => new DrawRect(this.canvas.nativeElement as SVGSVGElement))
      .on(this.canvas)
      .then((c, i) => {
        const boundary = this.canvas.nativeElement.getBoundingClientRect();
        c.setCoords(Math.min(...i.touches.map(touch => touch.tgt.clientX)) - boundary.x,
          Math.min(...i.touches.map(touch => touch.tgt.clientY)) - boundary.y,
          Math.max(...i.touches.map(touch => touch.tgt.clientX)) - boundary.x,
          Math.max(...i.touches.map(touch => touch.tgt.clientY)) - boundary.y);
      })
      .continuousExecution()
      .bind();

    this.bindings.swipeBinder(true, 300, 500, 1, 50)
      .toProduce(() => new DeleteAll(this.canvas.nativeElement))
      .on(this.canvas)
      .when(i => i.touches[0].src.target === this.canvas.nativeElement)
      .continuousExecution()
      .bind();
  }
}
