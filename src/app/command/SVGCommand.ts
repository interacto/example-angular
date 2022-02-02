import {UndoableCommand} from 'interacto';

export abstract class SVGCommand extends UndoableCommand {
  private cacheSnap: SVGElement | undefined;

  protected constructor(protected readonly svgdoc: SVGSVGElement) {
    super();
  }

  public override getVisualSnapshot(): SVGElement {
    /**
     * Angular call this method multiple times to refresh the page.
     * So caching the snapshot
     */
    if(this.cacheSnap === undefined) {
      this.cacheSnap = this.svgdoc.cloneNode(true) as SVGElement;
    }
    return this.cacheSnap;
  }
}
