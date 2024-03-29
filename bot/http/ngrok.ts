import { Ngrok } from "../deps.ts";
import { ENV } from "../env/mod.ts";

/**
 * doNgrok starts ngrok and returns the public URL for the application.
 */
export async function doNgrok(): Promise<string> {
  const ngrok = await Ngrok.create({
    protocol: "http",
    port: ENV.port,
  });

  // See:
  // https://deno.com/manual/runtime/program_lifecycle
  globalThis.onunload = () => ngrok.destroy();

  // Get the host URL from Ngrok.
  const host = await new Promise((resolve, reject) => {
    ngrok.addEventListener("ready", (event) => {
      resolve(event.detail);
    });

    ngrok.addEventListener("status", (event) => {
      reject(new Error(JSON.stringify(event.detail)));
    });
  });

  // Return the valid URL.
  return `https://${host}`;
}
