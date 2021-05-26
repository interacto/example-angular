import {CommandBase} from 'interacto';

export class ConsoleLog extends CommandBase {

  constructor(private readonly text: string) {
    super();
  }

  protected execution(): void {
    console.log(this.text);
  }
}
