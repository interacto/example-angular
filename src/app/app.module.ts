import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {InteractoModule} from 'interacto-angular';
import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tab/tab.component';
import { TabTextComponent } from './tab-text/tab-text.component';
import { TabShapesComponent } from './tab-shapes/tab-shapes.component';
import { TabCardsComponent } from './tab-cards/tab-cards.component';

@NgModule({
  declarations: [
    AppComponent,
    TabsComponent,
    TabComponent,
    TabTextComponent,
    TabShapesComponent,
    TabCardsComponent
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    MatButtonModule,
    DragDropModule,
    InteractoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
