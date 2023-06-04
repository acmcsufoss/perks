import type { APIInteraction } from "../../deps.ts";
import {
  InteractionResponseType,
  InteractionType,
  isChatInputApplicationCommandInteraction,
  nacl,
} from "../../deps.ts";
import type { EngineInterface } from "./../../../perks/engine/mod.ts";
import type { HandlerInterface } from "./handler_interface.ts";
import { handle } from "./handle.ts";

/**
 * DefaultHandler is the default handler for incoming requests. It verifies
 * whether the request is coming from Discord and then handles the request
 * accordingly.
 */
export class Handler implements HandlerInterface {
  constructor(
    private readonly engine: EngineInterface,
    private readonly publicKey: string,
  ) {}

  public async handle(req: Request): Promise<Response> {
    const { error, body } = await verify(req, this.publicKey);
    if (error !== null) {
      return error;
    }

    // Parse the incoming request as JSON.
    const request = await JSON.parse(body) as APIInteraction;
    switch (request.type) {
      case InteractionType.Ping: {
        return Response.json({ type: InteractionResponseType.Pong });
      }

      case InteractionType.ApplicationCommand: {
        if (!isChatInputApplicationCommandInteraction(request)) {
          return new Response("Invalid request", { status: 400 });
        }

        try {
          const response = await handle(this.engine, request);
          return Response.json(response);
        } catch (err) {
          console.error(err);
          return new Response("Internal Server Error", { status: 500 });
        }
      }

      default: {
        return new Response("Invalid request", { status: 400 });
      }
    }
  }
}

/** verify verifies whether the request is coming from Discord. */
async function verify(
  request: Request,
  publicKey: string,
): Promise<{ error: Response; body: null } | { error: null; body: string }> {
  if (request.method !== "POST") {
    return {
      error: new Response("Method not allowed", { status: 405 }),
      body: null,
    };
  }

  if (request.headers.get("content-type") !== "application/json") {
    return {
      error: new Response("Unsupported Media Type", { status: 415 }),
      body: null,
    };
  }

  const signature = request.headers.get("X-Signature-Ed25519");
  if (!signature) {
    return {
      error: new Response("Missing header X-Signature-Ed25519", {
        status: 401,
      }),
      body: null,
    };
  }

  const timestamp = request.headers.get("X-Signature-Timestamp");
  if (!timestamp) {
    return {
      error: new Response("Missing header X-Signature-Timestamp", {
        status: 401,
      }),
      body: null,
    };
  }

  // TweetNaCl is a cryptography library that we use to verify requests
  // from Discord.
  const body = await request.text();
  const valid = nacl.sign.detached.verify(
    new TextEncoder().encode(timestamp + body),
    hexToUint8Array(signature),
    hexToUint8Array(publicKey),
  );

  // When the request's signature is not valid, we return a 401 and this is
  // important as Discord sends invalid requests to test our verification.
  if (!valid) {
    return {
      error: new Response("Invalid request", { status: 401 }),
      body: null,
    };
  }

  return { body, error: null };
}

/** hexToUint8Array converts a hexadecimal string to Uint8Array. */
function hexToUint8Array(hex: string) {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((val) => parseInt(val, 16)));
}
