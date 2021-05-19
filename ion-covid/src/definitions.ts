declare module "@capacitor/core" {
  interface PluginRegistry {
    IonCovid: IonCovidPlugin;
  }
}

export interface IonCovidPlugin {
  echo(options: { value: string }): Promise<{value: string}>;
}
