import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {DataService} from '../service/data.service';
import {Bindings, UndoHistory} from 'interacto';
import {DeleteElt} from '../command/DeleteElt';
import {DrawRect} from '../command/DrawRect';
import {TabContentComponent} from '../tab-content/tab-content.component';
import {AppComponent} from '../app.component';
import {MoveRect} from '../command/MoveRect';
import {ChangeColor} from '../command/ChangeColor';
import {DeleteAll} from '../command/DeleteAll';

@Component({
  selector: 'app-tab-shapes',
  templateUrl: './tab-shapes.component.html',
  styleUrls: ['./tab-shapes.component.css']
})
export class TabShapesComponent extends TabContentComponent implements AfterViewInit {
  @ViewChild('canvas')
  private canvas: ElementRef<SVGSVGElement>;

  // Used to disable deletion on a long press when dragging a shape
  public dragging: boolean;

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
      .toProduce(i => new MoveRect(i.src.target as SVGRectElement))
      .then((c, i) => {
        c.vectorX = i.diffClientX;
        c.vectorY = i.diffClientY;
      })
      .when(i => i.tgt.currentTarget !== this.canvas.nativeElement)
      .continuousExecution()
      .bind();

    this.bindings.reciprocalTouchDnDBinder(this.appComponent.handle, this.appComponent.spring)
      .onDynamic(this.canvas)
      .toProduce(i => new MoveRect(i.src.target as SVGRectElement))
      .when(i => i.src.currentTarget !== this.canvas.nativeElement)
      .first(() => this.dragging = true)
      .then((c, i) => {
        c.vectorX = i.diffClientX;
        c.vectorY = i.diffClientY;
      })
      .endOrCancel(() => this.dragging = false)
      .continuousExecution()
      .preventDefault()
      .bind();

    this.bindings.longTouchBinder(2000)
      .toProduce(i => new DeleteElt(this.canvas.nativeElement, i.currentTarget as SVGElement))
      .onDynamic(this.canvas)
      .when(i => i.currentTarget !== this.canvas.nativeElement && i.currentTarget instanceof SVGElement)
      // Prevents the deletion from occurring when dragging the shape
      // Prevents the context menu from popping up
      .preventDefault()
      .bind();

    this.bindings.tapBinder(3)
      .toProduce(i => new ChangeColor(i.taps[0].currentTarget as SVGElement))
      .onDynamic(this.canvas)
      .when(i => i.taps[0].currentTarget !== this.canvas.nativeElement
        && i.taps[0].currentTarget instanceof SVGElement)
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
      .preventDefault()
      .bind();

    this.bindings.swipeBinder(true, 300, 500, 1, 50)
      .toProduce(() => new DeleteAll(this.canvas.nativeElement))
      .on(this.canvas)
      .when(i => i.touches.length === 1 && i.touches[0].src.currentTarget === this.canvas.nativeElement)
      // Prevents the swipe from occurring when dragging the shape
      .when(() => !this.dragging)
      .preventDefault()
      .bind();
  }
}
