import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabPicturesComponent } from './tab-pictures.component';
import {InteractoModule} from 'interacto-angular';

describe('TabPicturesComponent', () => {
  let component: TabPicturesComponent;
  let fixture: ComponentFixture<TabPicturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TabPicturesComponent
      ],
      imports: [
        InteractoModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabPicturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
