/**
 * METHODS is the list of HTTP methods.
 */
export const METHODS = [
  "CONNECT",
  "DELETE",
  "GET",
  "HEAD",
  "OPTIONS",
  "PATCH",
  "POST",
  "PUT",
  "TRACE",
] as const;

/**
 * Method is a type which represents an HTTP method.
 */
export type Method = typeof METHODS[number];

/**
 * Match is a type which matches a Request object.
 */
export type Match =
  | ((detail: { request: Request; url: URL }) => Promise<boolean>)
  | {
    /**
     * pattern is the URL pattern to match on.
     */
    pattern?: URLPattern;

    /**
     * method is the HTTP method to match on.
     */
    method?: Method;
  };

/**
 * Handle is a function which handles a request.
 */
export interface Handle<T extends string> {
  (r: HandlerRequest<T>): Promise<Response> | Response;
}

/**
 * Handler represents a function which can handle a request.
 */
export interface Handler<T extends string> {
  /**
   * handle is called to handle a request.
   */
  handle: Handle<T>;

  /**
   * match is called to match a request.
   */
  match?: Match;
}

/**
 * Handlers is a collection of handlers.
 */
export type Handlers<T extends string = string> = Handler<T>[];

/**
 * HandlerRequest is the input to a handler.
 */
export interface HandlerRequest<T extends string> {
  /**
   * request is the original request object.
   */
  request: Request;

  /**
   * url is the parsed fully qualified URL of the request.
   */
  url: URL;

  /**
   * params is a map of matched parameters from the URL pattern.
   */
  params: { [key in T]: string };

  /**
   * next executes the next handler in the chain. If no more handlers are
   * available, the fallback response is returned.
   */
  next: () => Promise<Response>;
}

/**
 * createRouter creates a new router.
 */
export function createRouter(): Router {
  return new Router();
}

/**
 * RouterInterface is the interface for a router.
 */
type RouterInterface = Record<
  Lowercase<Method>,
  ((p: URLPattern, r: Handle<string>) => Router)
>;

/**
 * Router is a collection of routes.
 */
export class Router implements RouterInterface {
  public handlers: Handlers = [];
  public fallbackResponse: Response | undefined;

  /**
   * fetch invokes the router for the given request.
   */
  public async fetch(request: Request, i = 0): Promise<Response> {
    const url = new URL(request.url);
    while (i < this.handlers.length) {
      const handler = this.handlers[i];
      const matchedFn = typeof handler.match === "function" &&
        await handler.match({ request, url });
      const matchedMethod = handler.match !== undefined &&
        typeof handler.match !== "function" &&
        (handler.match.method === undefined ||
          handler.match.method === request.method);
      const matchedPattern = handler.match !== undefined &&
        typeof handler.match !== "function" &&
        handler.match.pattern !== undefined &&
        handler.match.pattern.exec(request.url);
      let params: Record<string, string> = {};
      if (matchedPattern) {
        params = matchedPattern?.pathname
          ? Object.entries(matchedPattern.pathname.groups)
            .reduce(
              (groups, [key, value]) => {
                if (value !== undefined) {
                  groups[key] = value;
                }

                return groups;
              },
              {} as { [key: string]: string },
            )
          : {};
      }

      // If the handler matches, call it and return the response.
      if ((matchedFn || matchedMethod || matchedPattern)) {
        return await handler.handle({
          request,
          url,
          params,
          next: () => this.fetch(request, i),
        });
      }

      i++;
    }

    if (this.fallbackResponse !== undefined) {
      return this.fallbackResponse;
    }

    throw new Error("Not found");
  }

  /**
   * with appends a handler to the router.
   */
  public with<T extends string>(
    handle: Handle<T>,
  ): this;
  public with<T extends string>(
    match: Match,
    handle: Handle<T>,
  ): this;
  public with<T extends string>(
    matchOrHandler: Match | Handler<T>["handle"],
    handle?: Handle<T>,
  ): this {
    if (typeof matchOrHandler === "function" && handle === undefined) {
      this.handlers.push({ handle: matchOrHandler as Handle<T> });
      return this;
    }

    this.handlers.push({
      handle: handle!,
      match: matchOrHandler as Match,
    });
    return this;
  }

  /**
   * extend appends additional handlers to the router.
   */
  public use(data: Handlers | Router): this {
    if (data instanceof Router) {
      this.handlers.push(...data.handlers);
    } else {
      this.handlers.push(...data);
    }

    return this;
  }

  /**
   * fallback sets the fallback response for the router.
   */
  public fallback(response: Response | undefined): this {
    this.fallbackResponse = response;
    return this;
  }

  /**
   * connect appends a handler for the CONNECT method to the router.
   */
  public connect<T extends string>(
    pattern: URLPattern,
    handle: Handle<T>,
  ): this {
    return this.with({ method: "CONNECT", pattern }, handle);
  }

  /**
   * delete appends a handler for the DELETE method to the router.
   */
  public delete<T extends string>(
    pattern: URLPattern,
    handle: Handle<T>,
  ): this {
    return this.with({ method: "DELETE", pattern }, handle);
  }

  /**
   * get appends a handler for the GET method to the router.
   */
  public get<T extends string>(
    pattern: URLPattern,
    handle: Handle<T>,
  ): this {
    return this.with({ method: "GET", pattern }, handle);
  }

  /**
   * head appends a handler for the HEAD method to the router.
   */
  public head<T extends string>(
    pattern: URLPattern,
    handle: Handle<T>,
  ): this {
    return this.with({ method: "HEAD", pattern }, handle);
  }

  /**
   * options appends a handler for the OPTIONS method to the router.
   */
  public options<T extends string>(
    pattern: URLPattern,
    handle: Handle<T>,
  ): this {
    return this.with({ method: "OPTIONS", pattern }, handle);
  }

  /**
   * patch appends a handler for the PATCH method to the router.
   */
  public patch<T extends string>(
    pattern: URLPattern,
    handle: Handle<T>,
  ): this {
    return this.with({ method: "PATCH", pattern }, handle);
  }

  /**
   * post appends a handler for the POST method to the router.
   */
  public post<T extends string>(
    pattern: URLPattern,
    handle: Handle<T>,
  ): this {
    return this.with({ method: "POST", pattern }, handle);
  }

  /**
   * put appends a handler for the PUT method to the router.
   */
  public put<T extends string>(
    pattern: URLPattern,
    handle: Handle<T>,
  ): this {
    return this.with({ method: "PUT", pattern }, handle);
  }

  /**
   * trace appends a handler for the TRACE method to the router.
   */
  public trace<T extends string>(
    pattern: URLPattern,
    handle: Handle<T>,
  ): this {
    return this.with({ method: "TRACE", pattern }, handle);
  }
}
