import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabCardsComponent } from './tab-cards.component';

describe('TabCardsComponent', () => {
  let component: TabCardsComponent;
  let fixture: ComponentFixture<TabCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
