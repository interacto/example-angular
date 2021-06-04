import {fakeAsync, TestBed, tick, waitForAsync} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {BrowserModule, By} from '@angular/platform-browser';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {InteractoModule} from 'interacto-angular';
import {robot} from './StubEvents';

let app: AppComponent;
let fixture;

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        MatCardModule,
        MatButtonModule,
        DragDropModule,
        InteractoModule
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  // Text area
  it('should clear the text area', () => {
    const textField: HTMLTextAreaElement = fixture.debugElement.query(By.css('textArea')).nativeElement;
    const clearTextButton: HTMLButtonElement = fixture.debugElement.query(By.css('.clearTextButton')).nativeElement;
    robot(clearTextButton).click();
    fixture.detectChanges(); // Updates the page so that the new text is displayed
    expect(app.dataService.txt).toEqual('');
    expect(textField.value).toEqual('');
  });

  it('should edit the text area', fakeAsync(() => {
    const textField: HTMLTextAreaElement = fixture.debugElement.query(By.css('textArea')).nativeElement;
    textField.value = 'some text';
    robot(textField).input();
    tick(1000);
    expect(textField.value ).toEqual('some text');
    expect(app.dataService.txt).toEqual('some text');
  }));
});
