import { postgres } from "./deps.ts";

import type { Award, MintedPerk } from "../../perks/mod.ts";

import type {
  AwardCreateRequest,
  AwardUpdateRequest,
  PerkCreateRequest,
  PerkListRequest,
  PerkUpdateRequest,
  StoredAward,
  StoredPerk,
  Storer,
} from "../mod.ts";

import {
  SQL_QUERY_CREATE_PERK,
  SQL_QUERY_DELETE_PERK,
  SQL_QUERY_GET_PERK,
  SQL_QUERY_LIST_PERK,
  SQL_QUERY_UPDATE_PERK,
  SQL_QUERY_USE_PERK,
  SQL_TABLE_PERKS,
} from "./sql.ts";

export class PgStorer implements Storer {
  constructor(
    private readonly pool: postgres.Pool,
  ) {}

  public async createPerk(r: PerkCreateRequest): Promise<StoredPerk> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<StoredPerk>(
        SQL_QUERY_CREATE_PERK,
        [
          r.type,
          r.minter,
          r.max_uses,
          r.milliseconds,
          r.max_uses,
        ],
      );
      const row = result.rows[0];
      console.log("TODO: DELETE ME", { row });
      return row;
    } finally {
      client.release();
    }
  }

  public async updatePerk(r: PerkUpdateRequest): Promise<StoredPerk> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<StoredPerk>(
        SQL_QUERY_UPDATE_PERK,
        [
          r.type,
          r.minter,
          r.max_uses,
          r.milliseconds,
          r.available,
          r.activated,
          r.id,
        ],
      );
      const row = result.rows[0];
      console.log("TODO: DELETE ME", { row });
      return row;
    } finally {
      client.release();
    }
  }

  public async getPerk(id: string): Promise<StoredPerk> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<StoredPerk>(SQL_QUERY_GET_PERK, [
        id,
      ]);
      const row = result.rows[0];
      console.log("TODO: DELETE ME", { row });
      return row;
    } finally {
      client.release();
    }
  }

  public async getPerkList(r: PerkListRequest): Promise<StoredPerk[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<StoredPerk>(SQL_QUERY_LIST_PERK, [
        r.type,
        r.minter,
        r.max_uses,
        r.milliseconds,
        r.available,
        r.activated,
      ]);
      const rows = result.rows;
      console.log("TODO: DELETE ME", { rows });
      return rows;
    } finally {
      client.release();
    }
  }

  createAward(r: AwardCreateRequest): Promise<Award> {
    throw new Error("Method not implemented.");
  }
  updateAward(r: AwardUpdateRequest): Promise<Award> {
    throw new Error("Method not implemented.");
  }
  getAward(id: string): Promise<Award> {
    throw new Error("Method not implemented.");
  }
  getAwardList(r: Partial<MintedPerk>): Promise<Award[]> {
    throw new Error("Method not implemented.");
  }

  public async createTables() {
    const client = await this.pool.connect();
    try {
      // Create the table
      const result = await client.queryObject(TABLE_PERKS);
      console.log("TODO: DELETE ME", { result });
    } finally {
      // Release the connection back into the pool
      client.release();
    }
  }
}
