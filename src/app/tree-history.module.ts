import { NgModule } from '@angular/core';
import {interactoTreeUndoProviders} from 'interacto-angular';

@NgModule({
  // This provider is optional. It permits to have a specific Bindings and thus a specific UndoHistory for this
  // component. Useful when you want to have different undo histories.
  providers: [interactoTreeUndoProviders()]
})
export class TreeHistoryModule {
}
