import {UndoableCommand} from 'interacto';

export abstract class SVGCommand extends UndoableCommand {
  private cacheSnap: SVGElement | undefined;

  protected constructor(protected readonly svgdoc: SVGSVGElement) {
    super();
  }

  public getVisualSnapshot(): SVGElement {
    if(this.cacheSnap === undefined) {
      this.cacheSnap = this.svgdoc.cloneNode(true) as SVGElement;
    }
    // console.log(this.cacheSnap);
    return this.cacheSnap;
  }
}
