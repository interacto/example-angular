import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {
  @Input() tabTitle: string;
  public active: boolean;

  constructor() { }

  ngOnInit(): void {
    this.active = false;
  }

}
