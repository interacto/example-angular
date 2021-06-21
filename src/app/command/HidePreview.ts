import {CommandBase} from 'interacto';

/**
 * Hides the command snapshot UI element, and removes any SVG elements left by the snapshot
 */
export class HidePreview extends CommandBase {

  constructor(private previewContainer: HTMLElement) {
    super();
  }

  protected execution(): void {
    this.previewContainer.style.display = 'none';

    this.previewContainer.children[0].textContent = '';
    while (this.previewContainer.children[1].firstChild) {
      this.previewContainer.children[1].removeChild(this.previewContainer.children[1].firstChild);
    }
  }
}
