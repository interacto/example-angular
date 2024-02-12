import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-tab-content',
  standalone: true,
  imports: [],
  templateUrl: './tab-content.component.html',
  styleUrl: './tab-content.component.css'
})
/**
 * Component placed inside a tab that knows if the tab is currently active.
 */
export class TabContentComponent {
  @Input() tabActive: boolean;

  constructor() { }
}
