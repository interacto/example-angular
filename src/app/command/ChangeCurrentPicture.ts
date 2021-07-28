import {CommandBase} from 'interacto';
import {DataService} from '../service/data.service';

/**
 * Changes
 */
export class ChangeCurrentPicture extends CommandBase {

  constructor(private dataService: DataService, private moveForward: boolean) {
    super();
  }

  protected execution(): void {
    if (this.moveForward) {
      this.dataService.currentPicture++;
    } else {
      this.dataService.currentPicture--;
    }
  }

  // If the targeted index doesn't exist in the picture collection, the command cannot execute
  canExecute(): boolean {
    if (this.moveForward) {
      return this.dataService.currentPicture < this.dataService.pictures.length - 1;
    } else {
      return this.dataService.currentPicture > 0;
    }
  }
}
