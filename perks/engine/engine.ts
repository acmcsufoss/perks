import type { Storer } from "../../storer/mod.ts";
import { Registry } from "../provider/registry/mod.ts";
import { parseIsAvailable } from "../perk.ts";
import type {
  AwardRequest,
  AwardResponse,
  EngineInterface,
  ListRequest,
  ListResponse,
  MintRequest,
  MintResponse,
  RevokeRequest,
  RevokeResponse,
  UnmintRequest,
  UnmintResponse,
  UseRequest,
  UseResponse,
} from "./engine_interface.ts";

export class Engine implements EngineInterface {
  constructor(
    public readonly storer: Storer,
    public readonly registry: Registry,
  ) {}

  public async mint(r: MintRequest): Promise<MintResponse> {
    const minted = await this.storer.doMintQuery({
      type: r.type,
      minter_id: r.minter_id,
      // TODO: Get default max_uses and/or milliseconds [if-needed] from existing perks.
      max_uses: r.max_uses ?? 10,
      milliseconds: r.milliseconds ?? 3.6e6,
    });
    return {
      id: minted.id,
      type: minted.type,
      minter_id: minted.minter_id,
      minted_at: minted.minted_at,
      max_uses: minted.max_uses,
      milliseconds: minted.milliseconds,
      available: minted.available,
    };
  }

  public async unmint(r: UnmintRequest): Promise<UnmintResponse> {
    const unminted = await this.storer.doUnmintQuery({ id: r.id });
    return {
      id: unminted.id,
      type: unminted.type,
      minter_id: unminted.minter_id,
      minted_at: unminted.minted_at,
      max_uses: unminted.max_uses,
      milliseconds: unminted.milliseconds,
      available: unminted.available,
      activated: unminted.activated,
    };
  }

  public async award(r: AwardRequest): Promise<AwardResponse> {
    const awarded = await this.storer.doAwardQuery({
      awarder_id: r.awarder_id,
      awardee_id: r.awardee_id,
      mint_id: r.mint_id,
    });
    return {
      id: awarded.id,
      awarder_id: awarded.awarder_id,
      awardee_id: awarded.awardee_id,
      mint_id: awarded.mint_id,
      awarded_at: awarded.awarded_at,
    };
  }

  public async list(r: ListRequest): Promise<ListResponse> {
    const awards = await this.storer.doListQuery({ awardee_id: r.awardee_id });
    return {
      awards: awards.map((a) => ({
        perk: {
          id: a.perk.id,
          type: a.perk.type,
          minter_id: a.perk.minter_id,
          minted_at: a.perk.minted_at,
          max_uses: a.perk.max_uses,
          milliseconds: a.perk.milliseconds,
          available: a.perk.available,
          activated: a.perk.activated,
        },
        award: {
          id: a.award.id,
          awarder_id: a.award.awarder_id,
          awardee_id: a.award.awardee_id,
          mint_id: a.award.mint_id,
          awarded_at: a.award.awarded_at,
        },
      })),
    };
  }

  public async revoke(r: RevokeRequest): Promise<RevokeResponse> {
    const revoked = await this.storer.doRevokeQuery({ id: r.award_id });
    return {
      id: revoked.id,
      awarder_id: revoked.awarder_id,
      awardee_id: revoked.awardee_id,
      mint_id: revoked.mint_id,
      awarded_at: revoked.awarded_at,
    };
  }

  public async use(r: UseRequest): Promise<UseResponse> {
    const preused = await this.storer.doPreuseQuery({ award_id: r.award_id });
    const isAvailable = parseIsAvailable(preused.perk);
    if (isAvailable) {
      console.log({ preused }); // TODO: Remove this line.
      throw new Error("Perk is no longer available");
    }

    const provider = this.registry.get(preused.perk.type);
    if (!provider) {
      throw new Error("Perk provider not found");
    }

    const response = await provider.use({ ...preused });
    if (!response) {
      throw new Error("Perk not used");
    }

    await this.storer.doUseQuery({ award_id: preused.award.id });
    return { data: response };
  }
}
