import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TabShapesComponent} from './tab-shapes.component';
import {InteractoModule} from 'interacto-angular';
import { AngularSplitModule } from 'angular-split';
import { DataService } from '../service/data.service';
import { MockProvider } from 'ng-mocks';
import { DwellSpringComponent } from '../dwell-spring/dwell-spring.component';

describe('TabShapesComponent', () => {
  let component: TabShapesComponent;
  let fixture: ComponentFixture<TabShapesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TabShapesComponent,
        DwellSpringComponent
      ],
      imports: [
        InteractoModule,
        AngularSplitModule
      ],
      providers: [
        MockProvider(DataService),
        DwellSpringComponent
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
