import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Bindings, TreeUndoHistory } from 'interacto';
import { DwellSpringComponent, interactoTreeUndoProviders, TreeHistoryComponent } from 'interacto-angular';
import { ChangeColor } from '../command/ChangeColor';
import { DeleteAll } from '../command/DeleteAll';
import { DeleteElt } from '../command/DeleteElt';
import { DrawRect } from '../command/DrawRect';
import { MoveRect } from '../command/MoveRect';
import { DataService } from '../service/data.service';
import { TabContentComponent } from '../tab-content/tab-content.component';

@Component({
  selector: 'app-tab-shapes',
  templateUrl: './tab-shapes.component.html',
  styleUrls: ['./tab-shapes.component.css'],
  // This provider is optional. It permits to have a specific Bindings and thus a specific UndoHistory for this
  // component. Useful when you want to have different undo histories.
  providers: [interactoTreeUndoProviders()]
})
export class TabShapesComponent extends TabContentComponent implements AfterViewInit {
  @ViewChild('canvas')
  private canvas: ElementRef<SVGSVGElement>;

  @ViewChild('treeComp')
  private treeComp: TreeHistoryComponent;

  @ViewChild('dwell')
  private dwellSpring: DwellSpringComponent;

  public widthHistory: string = '20%';

  public constructor(public dataService: DataService, public undoHistory: TreeUndoHistory, public bindings: Bindings<TreeUndoHistory>) {
    super();
    // With Interacto-angular you can inject in components a Bindings single-instance that allows you
    // to define binders and bindings in ngAfterViewInit.
    // The UndoHistory parameter is also injected and comes from the Bindings instance (so quite useless to inject
    // it most of the time since this.bindings.undoHistory returns the same instance).
  }

  public ngAfterViewInit(): void {
    // Removing the context menu
    this.canvas.nativeElement.addEventListener("touchstart", evt => {
      evt.preventDefault();
    });

    this.treeComp.svgViewportWidth = this.canvas.nativeElement.clientWidth;
    this.treeComp.svgViewportHeight = this.canvas.nativeElement.clientHeight;

    const drawrect = new DrawRect(this.canvas.nativeElement);
    drawrect.setCoords(10, 10, 300, 300);
    drawrect.execute();

    this.bindings.reciprocalDndBinder(this.dwellSpring.handle, this.dwellSpring.spring)
      .onDynamic(this.canvas)
      .toProduce(i => new MoveRect(i.src.target as SVGRectElement, this.canvas.nativeElement))
      .first((_, i) => {
        (i.src.target as HTMLElement).style.cursor = 'pointer';
      })
      .then((c, i) => {
        c.vectorX = i.diffClientX;
        c.vectorY = i.diffClientY;
      })
      .endOrCancel(i => {
        (i.src.target as HTMLElement).style.cursor = 'default';
      })
      // Must stop immediately if the touch does not concern a rectangle
      .when(i => !("button" in i.tgt) || i.tgt.button === 0)
      .continuousExecution()
      .bind();

    this.bindings.touchDnDBinder(true)
      .onDynamic(this.canvas)
      .toProduce(i => new MoveRect(i.src.target as SVGRectElement, this.canvas.nativeElement))
      .then((c, i) => {
        c.vectorX = i.diffClientX;
        c.vectorY = i.diffClientY;
      })
      // // Cannot start if multi points are used (ie if more than one point is currently used)
      // .when(i => i.src.allTouches.length == 1, 'strictStart')
      // // Cannot ends if multi points are used (ie if it remains more than 0 point)
      // .when(i => i.tgt.allTouches.length == 0, 'end')
      // // Cannot continue if multi points are used (ie if more than one point is currently used)
      // .when(i => i.tgt.allTouches.length == 1, 'strictThen')
      .continuousExecution()
      .bind();

    this.bindings.longpressOrTouchBinder(2000)
      .toProduce(i => new DeleteElt(this.canvas.nativeElement, i.currentTarget as SVGElement))
      .onDynamic(this.canvas)
      .when(i => i.target !== this.canvas.nativeElement)
      // Prevents the context menu from popping up
      .preventDefault()
      .bind();

    this.bindings.tapsOrClicksBinder(3)
      .toProduce(i => new ChangeColor(i.points[0].currentTarget as SVGElement, this.canvas.nativeElement))
      .onDynamic(this.canvas)
      // Does not continue to run if the first targeted node is not an SVG element
      .when(i => i.points[0].target !== this.canvas.nativeElement, 'strictStart')
      .bind();

    this.bindings.twoTouchBinder()
      .toProduce(() => new DrawRect(this.canvas.nativeElement as SVGSVGElement))
      .on(this.canvas)
      .then((c, i) => {
        const boundary = this.canvas.nativeElement.getBoundingClientRect();
        c.setCoords(Math.min(...i.touches.map(touch => touch.tgt.clientX)) - boundary.x,
          Math.min(...i.touches.map(touch => touch.tgt.clientY)) - boundary.y,
          Math.max(...i.touches.map(touch => touch.tgt.clientX)) - boundary.x,
          Math.max(...i.touches.map(touch => touch.tgt.clientY)) - boundary.y);
      })
      .when(i => i.touches[0].src.target === this.canvas.nativeElement &&
        i.touches[1].src.target === this.canvas.nativeElement, 'strictStart')
      .continuousExecution()
      .bind();

    this.bindings.panHorizontalBinder(50, false, 500, 300)
      .toProduce(() => new DeleteAll(this.canvas.nativeElement))
      .on(this.canvas)
      .when(i => i.src.target === this.canvas.nativeElement)
      .bind();
  }

  public moveSplitPane(pane: HTMLElement): void {
    this.widthHistory = `${pane.clientWidth}px`;
  }
}
