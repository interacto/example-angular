import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TabShapesComponent} from './tab-shapes.component';
import {InteractoModule} from 'interacto-angular';

describe('TabShapesComponent', () => {
  let component: TabShapesComponent;
  let fixture: ComponentFixture<TabShapesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TabShapesComponent
      ],
      imports: [
        InteractoModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabShapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
