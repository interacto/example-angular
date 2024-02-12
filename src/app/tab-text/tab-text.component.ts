import {Component} from '@angular/core';
import {PartialButtonTypedBinder, PartialTextInputTypedBinder} from 'interacto';
import {ClearText} from '../command/ClearText';
import {SetText} from '../command/SetText';
import {DataService} from '../service/data.service';
import {InteractoModule, interactoProviders} from 'interacto-angular';
import {TabContentComponent} from '../tab-content/tab-content.component';
import {AngularSplitModule} from 'angular-split';

@Component({
  selector: 'app-tab-text',
  standalone: true,
  imports: [InteractoModule, AngularSplitModule],
  templateUrl: './tab-text.component.html',
  styleUrl: './tab-text.component.css',
  providers: [interactoProviders()]
})
export class TabTextComponent extends TabContentComponent {

  public constructor(public dataService: DataService) {
    super();
  }

  // This method is called by the Interacto directive specified in the HTML document
  // on the button used to clear the text.
  // This shows the second way, more in the spirit of Angular, for using binders directly from
  // HTML. This avoids the declaration of properties in the component class for accessing the
  // widgets.
  clearClicksBinder(binder: PartialButtonTypedBinder): void {
    binder
      .toProduce(() => new ClearText(this.dataService))
      .log('usage') // Usage logs are automatically sent to the back-end for this binding
      .bind();
  }

  writeTextBinder(binder: PartialTextInputTypedBinder): void {
    binder
      .toProduce(() => new SetText(this.dataService))
      .then((c, i) => c.text = i.widget?.value ?? '')
      .bind();
  }
}
