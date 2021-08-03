import {CommandBase} from 'interacto';

/**
 * Changes the zoom level of the image container
 */
export class Zoom extends CommandBase {
  private currentZoom = 100;
  private maxZoom = 500;
  private minZoom = 20;
  private speed = 0.1;

  constructor(private container: HTMLDivElement, private delta: number) {
    super();
    this.currentZoom = parseFloat(container.style.width);
    this.delta *= -1; // Scrolling upwards (negative y delta) should increase zoom
  }

  protected execution(): void {
    this.currentZoom += this.delta * 0.1;

    this.container.style.width = this.currentZoom + '%';
    this.container.style.height = this.currentZoom + '%';
  }

  // Allows execution if the projected zoom level doesn't exceed limits
  canExecute(): boolean {
    return (this.delta > 0 && this.currentZoom + this.delta * this.speed < this.maxZoom) ||
      (this.delta < 0 && this.currentZoom + this.delta * this.speed > this.minZoom);
  }
}
