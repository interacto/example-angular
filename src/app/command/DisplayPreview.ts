import {CommandBase, Undoable} from 'interacto';

/**
 * Displays the visual snapshot for a given command using the provided UI element.
 */
export class DisplayPreview extends CommandBase {

  constructor(private readonly command: Undoable, private previewContainer: HTMLElement) {
    super();
  }

  protected execution(): void {
    const snapshot = this.command.getVisualSnapshot();
    if (snapshot !== undefined) {
      this.previewContainer.style.display = 'block';
      const text = this.previewContainer.children[0] as HTMLElement;
      const svg = this.previewContainer.children[1] as HTMLElement;

      if (typeof snapshot === 'string') {
        // Hide canvas and display the snapshot text
        svg.style.display = 'none';
        text.style.display = 'block';
        text.textContent = this.command.getUndoName() + ':\n\n' + snapshot;
      } else if (snapshot instanceof SVGElement) {
        // Display the command's name and the snapshot SVG
        text.textContent = this.command.getUndoName() + ':';
        svg.style.display = 'block';
        svg.appendChild(snapshot);
        // Resize the canvas
        const bbox = snapshot.getBoundingClientRect();
        svg.style.width = bbox.width + 'px';
        svg.style.height = bbox.height + 'px';
      }
    }
  }
}
