import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabHistoryShapesComponent } from './tab-history-shapes.component';

describe('TabHistoryShapesComponent', () => {
  let component: TabHistoryShapesComponent;
  let fixture: ComponentFixture<TabHistoryShapesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabHistoryShapesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabHistoryShapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
