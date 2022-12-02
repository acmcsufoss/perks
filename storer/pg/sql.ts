export const SQL_TABLE_PERKS = `CREATE TABLE IF NOT EXISTS perks (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    minter VARCHAR(255) NOT NULL,
    minted_at TIMESTAMP NOT NULL DEFAULT NOW(),
    max_uses INTEGER NOT NULL,
    milliseconds INTEGER NOT NULL,
    available INTEGER NOT NULL,
    activated TIMESTAMP,
  );`;

export const SQL_QUERY_CREATE_PERK = `INSERT INTO perks (
    type,
    minter,
    max_uses,
    milliseconds,
    available,
  ) VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
  ) RETURNING *;`;

export const SQL_QUERY_UPDATE_PERK = `UPDATE perks SET
    type = $1,
    minter = $2,
    max_uses = $3,
    milliseconds = $4,
    available = $5,
    activated = $6
  WHERE id = $7
  RETURNING *;`;

export const SQL_QUERY_LIST_PERK = `SELECT * FROM perks
  WHERE
    type = $1
    AND minter = $2
    AND max_uses = $3
    AND milliseconds = $4
    AND available = $5
    AND activated = $6;`;

export const SQL_QUERY_GET_PERK = `SELECT * FROM perks
  WHERE id = $1;`;

export const SQL_QUERY_DELETE_PERK = `DELETE FROM perks
  WHERE id = $1;`;

export const SQL_QUERY_USE_PERK = `UPDATE perks SET
    available = available - 1
    activated = NOW() IF available == max_uses
  WHERE id = $1
  RETURNING *;`;
