import {Component} from '@angular/core';
import {TabPicturesComponent} from './tab-pictures/tab-pictures.component';
import {TabTextComponent} from './tab-text/tab-text.component';
import {TabCardsComponent} from './tab-cards/tab-cards.component';
import {TabShapesComponent} from './tab-shapes/tab-shapes.component';
import {TabHistoryShapesComponent} from './tab-history-shapes/tab-history-shapes.component';
import {MatTab, MatTabContent, MatTabGroup} from '@angular/material/tabs';
import {NgComponentOutlet} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TabTextComponent, TabPicturesComponent, TabCardsComponent,
    TabShapesComponent, TabHistoryShapesComponent, MatTabGroup, MatTab, MatTabContent, NgComponentOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
}
