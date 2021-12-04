import {Component} from '@angular/core';
import {Bindings, LogLevel, PartialButtonBinder, PartialTextInputBinder, UndoHistory} from 'interacto';
import {ClearText} from '../command/ClearText';
import {SetText} from '../command/SetText';
import {DataService} from '../service/data.service';
import {TabContentComponent} from '../tab-content/tab-content.component';
import {bindingsFactory, undoHistoryFactory} from 'interacto-angular';

@Component({
  selector: 'app-tab-text',
  templateUrl: './tab-text.component.html',
  styleUrls: ['./tab-text.component.css'],
  providers: [
    {provide: Bindings, useFactory: bindingsFactory},
    {provide: UndoHistory, useFactory: undoHistoryFactory, deps: [Bindings]}]
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
  clearClicksBinder(binder: PartialButtonBinder): void {
    binder
      .toProduce(() => new ClearText(this.dataService))
      .log(LogLevel.usage) // Usage logs are automatically sent to the back-end for this binding
      .bind();
  }

  writeTextBinder(binder: PartialTextInputBinder): void {
    binder
      .toProduce(() => new SetText(this.dataService))
      .then((c, i) => c.text = i.widget?.value ?? '')
      .bind();
  }
}
