import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Bindings, RedoNTimes, Undoable, UndoHistory, UndoNTimes} from 'interacto';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements AfterViewInit {
  @ViewChild('undoButtonContainer')
  public undoButtonContainer: ElementRef<HTMLElement>;

  @ViewChild('redoButtonContainer')
  public redoButtonContainer: ElementRef<HTMLElement>;

  // @ViewChild('baseStateButton')
  // public baseStateButton: HTMLButtonElement;


  public constructor(public undoHistory: UndoHistory, public bindings: Bindings) {
  }


  public ngAfterViewInit(): void {
    // this.bindings.buttonBinder()
    //   .on(this.baseStateButton)
    //   .toProduce(() => new UndoNTimes(this.undoHistory, this.undoHistory.getUndo().length))
    //   .log(LogLevel.usage) // Usage logs are automatically sent to the back-end for this binding
    //   .bind();

    this.bindings.buttonBinder()
      .onDynamic(this.undoButtonContainer)
      .toProduce(i => new UndoNTimes(
        this.undoHistory,
        parseInt(i.widget?.getAttribute("data-index") ?? "-1", 0)))
      .bind();

    this.bindings.buttonBinder()
      .onDynamic(this.redoButtonContainer)
      .toProduce(i => new RedoNTimes(
        this.undoHistory,
        parseInt(i.widget?.getAttribute("data-index") ?? "-1", 0)))
      .bind();
  }


  public undoButtonSnapshot(command: Undoable, button: HTMLButtonElement): any {
    const snapshot = command.getVisualSnapshot();
    // console.log(snapshot);
    if(snapshot === undefined) {
      return command.getUndoName();
    }

    if (typeof snapshot === 'string') {
      return `${command.getUndoName()}: ${snapshot}`;
    }

    if (snapshot instanceof SVGElement) {
      button.querySelectorAll('div')[0]?.remove();

      const div = document.createElement("div");
      div.appendChild(snapshot);
      div.style.width = "50px";
      div.style.height = "50px";
      snapshot.setAttribute("viewBox", "0 0 2000 1200");
      snapshot.setAttribute("width", "50px");
      snapshot.setAttribute("height", "50px");
      button.querySelectorAll('div')[0]?.remove();
      button.appendChild(div);
      return command.getUndoName();
    }

    return command.getUndoName();
  }
}
