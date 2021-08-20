import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tab-content',
  templateUrl: './tab-content.component.html',
  styleUrls: ['./tab-content.component.css']
})
/**
 * Component placed inside a tab that knows if the tab is currently active.
 */
export class TabContentComponent implements OnInit {
  @Input() tabActive: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}