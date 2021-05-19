import { WebPlugin } from '@capacitor/core';
import { IonCovidPlugin } from './definitions';

export class IonCovidWeb extends WebPlugin implements IonCovidPlugin {
  constructor() {
    super({
      name: 'IonCovid',
      platforms: ['web']
    });
  }

  async echo(options: { value: string }): Promise<{value: string}> {
    console.log('ECHO', options);
    return options;
  }
}

const IonCovid = new IonCovidWeb();

export { IonCovid };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(IonCovid);
