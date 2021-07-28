import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {DataService} from '../service/data.service';
import {Bindings, UndoHistory} from 'interacto';
import {ChangeCurrentPicture} from '../command/ChangeCurrentPicture';
import {TabContentComponent} from '../tab-content/tab-content.component';

@Component({
  selector: 'app-tab-pictures',
  templateUrl: './tab-pictures.component.html',
  styleUrls: ['./tab-pictures.component.css']
})
export class TabPicturesComponent extends TabContentComponent implements OnInit, AfterViewInit {
  @ViewChild('carousel')
  private carousel: ElementRef<HTMLDivElement>;

  @ViewChildren('picture')
  private pictures: QueryList<ElementRef<HTMLImageElement>>;

  // @Input() tabActive: boolean;

  constructor(public dataService: DataService, public undoHistory: UndoHistory, public bindings: Bindings) {
    super();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // Disables default behaviour for image dragging
    // this.pictures.forEach(item => this.carousel.nativeElement.ondragstart = () => false);

    this.bindings.keyPressBinder(true)
      .on(document.body)
      .toProduce(() => new ChangeCurrentPicture(this.dataService, true))
      .with('ArrowRight')
      // The user cannot navigate between pictures if the picture tab is not active
      .when(() => this.tabActive)
      .bind();

    this.bindings.keyPressBinder(true)
      .on(document.body)
      .toProduce(() => new ChangeCurrentPicture(this.dataService, false))
      .with('ArrowLeft')
      // The user cannot navigate between pictures if the picture tab is not active
      .when(() => this.tabActive)
      .bind();
  }

}
