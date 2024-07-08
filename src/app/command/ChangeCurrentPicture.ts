import {CommandBase} from 'interacto';
import {DataService} from '../service/data.service';

/**
 * Changes the current picture
 */
export class ChangeCurrentPicture extends CommandBase {
  constructor(private dataService: DataService, private moveForward: boolean) {
    super();
  }

  protected execution(): void {
    if (this.moveForward) {
      this.dataService.currentPicture.set(this.dataService.currentPicture() + 1);
    } else {
      this.dataService.currentPicture.set(this.dataService.currentPicture() - 1);
    }
  }

  // If the targeted index doesn't exist in the picture collection, the command cannot execute
  override canExecute(): boolean {
    if (this.moveForward) {
      return this.dataService.currentPicture() < this.dataService.pictures.length - 1;
    }
    return this.dataService.currentPicture() > 0;
  }
}
