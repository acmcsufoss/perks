import { InteractionResponseType, InteractionType } from "../../../deps.ts";

import type { Storer } from "../../../../storer/mod.ts";
import type { Handler } from "../mod.ts";

import { json, nacl, validateRequest } from "./deps.ts";
import { handle } from "./handle.ts";

// Discord performs Ping interactions to test our application.
const RES_PONG = json({ type: InteractionResponseType.Pong });

// When the request's signature is not valid, we return a 401 and this is
// important as Discord sends invalid requests to test our verification.
const RES_INVALID = json({ error: "Invalid request" }, { status: 401 });

export class DefaultHandler implements Handler {
  constructor(
    // TODO: Use store to persist data.
    private readonly store: Storer,
    private readonly publicKey: string,
  ) {}

  public async handle(req: Request): Promise<Response> {
    const { err, body } = await verify(req, this.publicKey);
    if (err !== null) {
      return err;
    }

    // Parse the incoming request as JSON.
    const { type = 0, data = { options: [] } } = JSON.parse(body);

    switch (type) {
      case InteractionType.Ping: {
        return RES_PONG;
      }

      case InteractionType.ApplicationCommand: {
        return await handle(data);
      }

      default: {
        return RES_INVALID;
      }
    }
  }
}

/** verify verifies whether the request is coming from Discord. */
async function verify(
  request: Request,
  publicKey: string,
): Promise<{ err: Response | null; body: string }> {
  // validateRequest() ensures that a request is of POST method and
  // has the following headers.
  const { error } = await validateRequest(request, {
    POST: {
      headers: ["X-Signature-Ed25519", "X-Signature-Timestamp"],
    },
  });
  if (error) {
    return {
      err: json({ error: error.message }, { status: error.status }),
      body: "",
    };
  }

  // Discord sends these headers with every request.
  const signature = request.headers.get("X-Signature-Ed25519")!;
  const timestamp = request.headers.get("X-Signature-Timestamp")!;
  const body = await request.text();
  const valid = nacl.sign.detached.verify(
    new TextEncoder().encode(timestamp + body),
    hexToUint8Array(signature),
    hexToUint8Array(publicKey),
  );

  // When the request's signature is not valid, we return a 401 and this is
  // important as Discord sends invalid requests to test our verification.
  if (!valid) {
    return { err: RES_INVALID, body: "" };
  }

  return { err: null, body };
}

/** Converts a hexadecimal string to Uint8Array. */
function hexToUint8Array(hex: string) {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((val) => parseInt(val, 16)));
}
