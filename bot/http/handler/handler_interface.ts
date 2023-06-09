/**
 * HandlerInterface for HTTP requests.
 */
export interface HandlerInterface {
  handle: (req: Request) => Promise<Response>;
}
