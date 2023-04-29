import {
  SQL_CREATE_TABLES,
  SQL_DROP_TABLES,
  SQL_QUERY_AWARD,
  SQL_QUERY_DIAGNOSIS,
  SQL_QUERY_LIST,
  SQL_QUERY_MINT,
  SQL_QUERY_PREUSE,
  SQL_QUERY_REVOKE,
  SQL_QUERY_UNMINT,
  SQL_QUERY_USE,
} from "../mod.ts";

import type {
  AwardQuery,
  Diagnosis,
  ListQuery,
  MintQuery,
  PreuseQuery,
  RevokeQuery,
  StoredAward,
  StoredPerk,
  StoredSummary,
  Storer,
  UnmintQuery,
  UseQuery,
} from "../mod.ts";

import type { Pooler } from "./pooler.ts";

export class PgStorer implements Storer {
  constructor(private readonly pool: Pooler) {}

  public async doMintQuery(q: MintQuery): Promise<StoredPerk> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryArray<StoredPerk>`INSERT INTO perks (
  type,
  minter,
  max_uses,
  milliseconds,
  available,
  minted_at,
  activated
) VALUES (
  ${JSON.stringify(q.type)},
  ${JSON.stringify(q.minter)},
  ${q.max_uses},
  ${q.milliseconds},
  NOW(),
  NOW(),
  NULL
) RETURNING *;`;
      const row = result.rows[0];
      console.log("TODO: DELETE ME", { row });
      return row;
    } finally {
      client.release();
    }
  }

  public async doUnmintQuery(q: UnmintQuery): Promise<StoredPerk> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryArray<StoredPerk>`DELETE FROM perks
      WHERE id = ${q.id}
        RETURNING *;`;
      const row = result.rows[0];
      console.log("TODO: DELETE ME", { row });
      return row;
    } finally {
      client.release();
    }
  }

  public async doAwardQuery(q: AwardQuery): Promise<StoredAward> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryArray<StoredAward>();
      const row = result.rows[0];
      console.log("TODO: DELETE ME", { row });
      return row;
    } finally {
      client.release();
    }
  }

  public async doRevokeQuery(q: RevokeQuery): Promise<StoredAward> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<StoredAward>(
        SQL_QUERY_REVOKE(q),
      );
      const row = result.rows[0];
      console.log("TODO: DELETE ME", { row });
      return row;
    } finally {
      client.release();
    }
  }

  public async doListQuery(q: ListQuery): Promise<StoredSummary[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<StoredSummary>(
        SQL_QUERY_LIST(q),
      );
      const rows = result.rows;
      console.log("TODO: DELETE ME", { rows });
      return rows;
    } finally {
      client.release();
    }
  }

  public async doPreuseQuery(q: PreuseQuery): Promise<StoredSummary> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<StoredSummary>(
        SQL_QUERY_PREUSE(q),
      );
      const row = result.rows[0];
      console.log("TODO: DELETE ME", { row });
      return row;
    } finally {
      client.release();
    }
  }

  public async doUseQuery(q: UseQuery): Promise<StoredPerk> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<StoredPerk>(
        SQL_QUERY_USE(q),
      );
      const row = result.rows[0];
      console.log("TODO: DELETE ME", { row });
      return row;
    } finally {
      client.release();
    }
  }

  public async createTables(): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.queryObject(SQL_CREATE_TABLES);
    } finally {
      client.release();
    }
  }

  public async dropTables(): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.queryObject(SQL_DROP_TABLES);
    } finally {
      client.release();
    }
  }

  public async diagnoseTables(): Promise<Diagnosis> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<Diagnosis>(SQL_QUERY_DIAGNOSIS);
      const row = result.rows[0];
      console.log("TODO: DELETE ME", { row });
      return row;
    } finally {
      client.release();
    }
  }
}
