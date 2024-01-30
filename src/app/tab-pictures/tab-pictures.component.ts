import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {DataService} from '../service/data.service';
import {Bindings, UndoHistoryBase} from 'interacto';
import {ChangeCurrentPicture} from '../command/ChangeCurrentPicture';
import {TabContentComponent} from '../tab-content/tab-content.component';
import {Zoom} from '../command/Zoom';

@Component({
  selector: 'app-tab-pictures',
  templateUrl: './tab-pictures.component.html',
  styleUrls: ['./tab-pictures.component.css']
})
export class TabPicturesComponent extends TabContentComponent implements AfterViewInit {
  @ViewChild('carousel')
  private carousel: ElementRef<HTMLDivElement>;

  @ViewChild('container')
  private container: ElementRef<HTMLDivElement>;


  constructor(public dataService: DataService, public bindings: Bindings<UndoHistoryBase>) {
    super();
  }

  ngAfterViewInit(): void {
    this.container.nativeElement.style.width = '100%';
    this.container.nativeElement.style.height = '100%';

    this.bindings.keyDownBinder(true)
      .on(document.body)
      .toProduce(() => new ChangeCurrentPicture(this.dataService, true))
      .with(false, 'ArrowRight')
      // The user cannot navigate between pictures if the picture tab is not active
      .when(() => this.tabActive)
      .bind();

    this.bindings.keyDownBinder(true)
      .on(document.body)
      .toProduce(() => new ChangeCurrentPicture(this.dataService, false))
      .with(false, 'ArrowLeft')
      // The user cannot navigate between pictures if the picture tab is not active
      .when(() => this.tabActive)
      .bind();

    // this.bindings.keyDownBinder(true)
    //   .on(document.body)
    //   .toProduce(() => new AnonCmd(() => this.ctrlPressed = true))
    //   .with(false, 'Control')
    //   // The user cannot navigate between pictures if the picture tab is not active
    //   .when(() => this.tabActive)
    //   .bind();

    this.bindings.wheelBinder()
      .on(this.carousel.nativeElement)
      .toProduce((i) =>
        new Zoom(this.container.nativeElement, i.deltaY)
      )
      .when((i) => i.ctrlKey)
      // Disables browser zoom when targeting the pictures
      .preventDefault()
      .bind();
  }

}
