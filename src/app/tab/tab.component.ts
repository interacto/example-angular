import {Component, ContentChild, Input, OnInit} from '@angular/core';
import {TabPicturesComponent} from '../tab-pictures/tab-pictures.component';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {
  @Input() tabTitle: string;

  @ContentChild(TabPicturesComponent) content: TabPicturesComponent;

  private isActive: boolean;
  set active(value: boolean) {
    this.isActive = value;
    // Signal to the content component that the tab is active
    if (this.content !== undefined) {
      this.content.tabActive = value;
    }
  }
  get active() {
    return this.isActive;
  }

  constructor() { }

  ngOnInit(): void {
    this.isActive = false;
  }
}
