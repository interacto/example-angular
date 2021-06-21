import {CommandBase} from 'interacto';

/**
 * Moves the snapshot UI element to the cursor's coordinates.
 */
export class MovePreview extends CommandBase {

  constructor(private previewContainer: HTMLElement, private x: number, private y: number) {
    super();
  }

  protected execution(): void {
    this.previewContainer.style.left = this.x + 10 + 'px';
    this.previewContainer.style.top = this.y + 10 + 'px';
  }
}
