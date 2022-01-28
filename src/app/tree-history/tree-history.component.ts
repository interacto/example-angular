import {AfterViewInit, Component, HostBinding, Input} from '@angular/core';
import {Binding, PartialPointBinder, TreeUndoHistory, UndoableTreeNode} from 'interacto';

@Component({
  selector: 'app-tree-history',
  templateUrl: './tree-history.component.html',
  styleUrls: ['./tree-history.component.css']
})
export class TreeHistoryComponent implements AfterViewInit {
  @Input()
  public width?: string;

  @Input()
  public svgViewportWidth: number = 50;

  @Input()
  public svgViewportHeight: number = 50;

  @Input()
  public svgIconSize: number = 50;

  @HostBinding('style.width')
  widthcss: string;

  public constructor(public history: TreeUndoHistory) {
  }

  public ngAfterViewInit(): void {
    // if(this.width !== undefined) {
    //   this.widthcss = this.width ?? "";
    //   this.widthcss = 2;
    // }
  }

  public depth(undoableNode: UndoableTreeNode | undefined): number {
    let depth = 0;
    let n = undoableNode;

    while(n !== undefined) {
      depth++;
      n = n.parent;
    }

    return depth;
  }

  public undoButtonSnapshot(node: UndoableTreeNode | undefined, div: HTMLDivElement): any {
    if(node === undefined) {
      return undefined;
    }
    const cmd = node.undoable;
    const snapshot = node.visualSnapshot;
    if(snapshot === undefined) {
      return cmd.getUndoName();
    }

    if (typeof snapshot === 'string') {
      return `${cmd.getUndoName()}: ${snapshot}`;
    }

    if (snapshot instanceof SVGElement) {
      div.querySelectorAll('div')[0]?.remove();

      const size = `${this.svgIconSize}px`;
      const divpic = document.createElement("div");
      divpic.appendChild(snapshot);
      divpic.style.width = size;
      divpic.style.height = size;
      snapshot.setAttribute("viewBox", `0 0 ${this.svgViewportWidth} ${this.svgViewportHeight}`);
      snapshot.setAttribute("width", size);
      snapshot.setAttribute("height", size);
      div.querySelectorAll('div')[0]?.remove();
      div.appendChild(divpic);
      return cmd.getUndoName();
    }

    return cmd.getUndoName();
  }

  public goTo(binder: PartialPointBinder, position: number): Array<Binding<any, any, any>> {
    return [
      binder
        .toProduceAnon(() => {
          this.history.goTo(position);
        })
        .when(i => i.button === 0)
        .bind(),
      binder
        .toProduceAnon(() => {
          this.history.delete(position);
        })
        .when(i => i.button === 2)
        .bind()
    ];
  }
}
