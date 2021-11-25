import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {TabTextComponent} from './tab-text.component';
import {robot} from 'interacto-nono';

describe('TabTextComponent', () => {
  let component: TabTextComponent;
  let fixture: ComponentFixture<TabTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear the text area', fakeAsync(() => {
    const textField: HTMLTextAreaElement = fixture.debugElement.nativeElement.querySelector('textarea');
    const clearTextButton: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('.clearTextButton');
    robot(clearTextButton).click();
    tick();
    fixture.detectChanges();
    expect(component.dataService.txt).toEqual('');
    expect(textField.value).toEqual('');
  }));

  it('should edit the text area', fakeAsync(() => {
    // const textField: HTMLTextAreaElement = fixture.debugElement.query(By.css('textarea')).nativeElement;
    const textField: HTMLTextAreaElement = fixture.debugElement.nativeElement.querySelector('textarea');
    textField.value = 'some text';
    robot(textField).input();
    tick(1000);
    expect(textField.value).toEqual('some text');
    expect(component.dataService.txt).toEqual('some text');
  }));
});
