import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../service/data.service';
import {Bindings, UndoHistory} from 'interacto';
import {MoveRect} from '../command/MoveRect';
import {DeleteElt} from '../command/DeleteElt';
import {ChangeColor} from '../command/ChangeColor';
import {DrawRect} from '../command/DrawRect';
import {DeleteAll} from '../command/DeleteAll';
import {TabContentComponent} from '../tab-content/tab-content.component';

@Component({
  selector: 'app-tab-shapes',
  templateUrl: './tab-shapes.component.html',
  styleUrls: ['./tab-shapes.component.css']
})
export class TabShapesComponent extends TabContentComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas')
  private canvas: ElementRef<SVGSVGElement>;

  @ViewChild('handle')
  public handle: ElementRef<SVGCircleElement>;

  @ViewChild('spring')
  public spring: ElementRef<SVGLineElement>;

  public interval: any;
  public displaySpring: boolean;

  public constructor(public dataService: DataService, public undoHistory: UndoHistory, public bindings: Bindings) {
    super();
    // With Interacto-angular you can inject in components a Bindings single-instance that allows you
    // to define binders and bindings in ngAfterViewInit.
    // The UndoHistory parameter is also injected and comes from the Bindings instance (so quite useless to inject
    // it most of the time since this.bindings.undoHistory returns the same instance).
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const drawrect = new DrawRect(this.canvas.nativeElement);
    drawrect.setCoords(10, 10, 300, 300);
    drawrect.execute();

    this.spring.nativeElement.setAttribute('display', 'none');
    this.handle.nativeElement.setAttribute('display', 'none');

    this.bindings.dndBinder(true)
      .onDynamic(this.canvas)
      .toProduce(i => new MoveRect(i.src.target as SVGRectElement))
      .then((c, i) => {
        c.vectorX = i.diffClientX;
        c.vectorY = i.diffClientY;

        // Management of the dwell and spring
        // The element to use for this interaction (handle) must have the "ioDwellSpring" class
        const boundary = this.canvas.nativeElement.getBoundingClientRect();
        if (!this.displaySpring) {
          clearInterval(this.interval);
          this.interval = setInterval(() => {
            clearInterval(this.interval);
            this.displaySpring = true;
            this.spring.nativeElement.setAttribute('display', 'block');
            this.handle.nativeElement.setAttribute('display', 'block');

            this.handle.nativeElement.setAttribute('cx', String(i.tgt.clientX - boundary.x - 50));
            this.handle.nativeElement.setAttribute('cy', String(i.tgt.clientY - boundary.y));
            this.spring.nativeElement.setAttribute('x1', String(i.src.clientX - boundary.x));
            this.spring.nativeElement.setAttribute('y1', String(i.src.clientY - boundary.y));
            this.spring.nativeElement.setAttribute('x2', String(i.tgt.clientX - boundary.x - 50));
            this.spring.nativeElement.setAttribute('y2', String(i.tgt.clientY - boundary.y));
            if (i.tgt.clientX - boundary.x < 50) {
              this.handle.nativeElement.setAttribute('cx', String(i.tgt.clientX - boundary.x + 50));
              this.spring.nativeElement.setAttribute('x2', String(i.tgt.clientX - boundary.x + 50));
            }
          }, 1000);
        }
      })
      .continuousExecution()
      .endOrCancel(() => {
        clearInterval(this.interval);
        this.displaySpring = false;
        this.spring.nativeElement.setAttribute('display', 'none');
        this.handle.nativeElement.setAttribute('display', 'none');
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

    this.bindings.swipeBinder(true, 300, 500, 50)
      .toProduce(() => new DeleteAll(this.canvas.nativeElement))
      .on(this.canvas)
      .when(i => i.src.currentTarget === this.canvas.nativeElement)
      .preventDefault()
      .bind();
  }

}
