import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {InteractoModule} from 'interacto-angular';
import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tab/tab.component';

@NgModule({
  declarations: [
    AppComponent,
    TabsComponent,
    TabComponent
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
