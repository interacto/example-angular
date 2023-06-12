import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabCardsComponent } from './tab-cards.component';
import {InteractoModule} from 'interacto-angular';
import { AngularSplitModule } from 'angular-split';
import { MatCardModule } from '@angular/material/card';

describe('TabCardsComponent', () => {
  let component: TabCardsComponent;
  let fixture: ComponentFixture<TabCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabCardsComponent ],
      imports: [
        InteractoModule,
        AngularSplitModule,
        MatCardModule
      ],
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
