import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TabsComponent} from './tabs/tabs.component';
import {TabComponent} from './tab/tab.component';
import {TabPicturesComponent} from './tab-pictures/tab-pictures.component';
import {TabTextComponent} from './tab-text/tab-text.component';
import {TabCardsComponent} from './tab-cards/tab-cards.component';
import {TabShapesComponent} from './tab-shapes/tab-shapes.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TabsComponent, TabComponent, TabTextComponent, TabPicturesComponent, TabCardsComponent, TabShapesComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public constructor() {
  }
}
