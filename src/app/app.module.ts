import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrowserModule } from '@angular/platform-browser';
import { AngularSplitModule } from 'angular-split';
import { InteractoModule } from 'interacto-angular';
import { AppComponent } from './app.component';
import { TabCardsComponent } from './tab-cards/tab-cards.component';
import { TabContentComponent } from './tab-content/tab-content.component';
import { TabPicturesComponent } from './tab-pictures/tab-pictures.component';
import { TabShapesComponent } from './tab-shapes/tab-shapes.component';
import { TabTextComponent } from './tab-text/tab-text.component';
import { TabComponent } from './tab/tab.component';
import { TabsComponent } from './tabs/tabs.component';

@NgModule({
  declarations: [
    AppComponent,
    TabsComponent,
    TabComponent,
    TabTextComponent,
    TabShapesComponent,
    TabCardsComponent,
    TabPicturesComponent,
    TabContentComponent
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    MatButtonModule,
    DragDropModule,
    InteractoModule,
    AngularSplitModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
