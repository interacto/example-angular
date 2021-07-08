import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabShapesComponent } from './tab-shapes.component';

describe('TabShapesComponent', () => {
  let component: TabShapesComponent;
  let fixture: ComponentFixture<TabShapesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabShapesComponent ]
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
