import type { Provider } from "../mod.ts";

export class Registry {
  private readonly providers: Provider[] = [];
  private readonly providerMap: Map<string, Provider> = new Map();

  constructor(
    providers: Provider[],
  ) {
    this.register(...providers);
  }

  public register(...providers: Provider[]): void {
    for (const provider of providers) {
      this.providers.push(provider);
      this.providerMap.set(provider.name, provider);
    }
  }

  public get(name: string): Provider | undefined {
    return this.providerMap.get(name);
  }

  public getAll(): Provider[] {
    return this.providers;
  }
}
