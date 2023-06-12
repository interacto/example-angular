import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {InteractoModule} from 'interacto-angular';
import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tab/tab.component';
import { TabTextComponent } from './tab-text/tab-text.component';
import { TabShapesComponent } from './tab-shapes/tab-shapes.component';
import { TabCardsComponent } from './tab-cards/tab-cards.component';
import { TabPicturesComponent } from './tab-pictures/tab-pictures.component';
import { TabContentComponent } from './tab-content/tab-content.component';
import { AngularSplitModule } from 'angular-split';
import { DwellSpringComponent } from './dwell-spring/dwell-spring.component';

let app: AppComponent;
let fixture: ComponentFixture<AppComponent>;

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        TabsComponent,
        TabComponent,
        TabTextComponent,
        TabShapesComponent,
        TabCardsComponent,
        TabPicturesComponent,
        TabContentComponent,
        DwellSpringComponent
      ],
      imports: [
        BrowserModule,
        MatCardModule,
        MatButtonModule,
        DragDropModule,
        InteractoModule,
        AngularSplitModule
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });
});
