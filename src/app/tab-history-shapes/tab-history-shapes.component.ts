import {Component, inject} from '@angular/core';
import {TreeHistoryModule} from '../tree-history.module';
import {DataService} from '../service/data.service';
import {TreeHistoryComponent} from 'interacto-angular';

@Component({
  selector: 'app-tab-history-shapes',
  standalone: true,
  // The tree history is shared with another component (TabShapes).
  // So, we imported it through a module
  imports: [TreeHistoryModule, TreeHistoryComponent],
  templateUrl: './tab-history-shapes.component.html',
  styleUrl: './tab-history-shapes.component.css'
})
export class TabHistoryShapesComponent {
  protected service: DataService = inject(DataService);
}
