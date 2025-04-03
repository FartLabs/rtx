// deno-lint-ignore-file no-explicit-any
import type { Method } from "@std/http/unstable-method";
import type {
  DefaultHandler,
  ErrorHandler,
  RequestHandler,
  RtRoute,
} from "@fartlabs/rt";
import { Router } from "@fartlabs/rt";

export { RouteComponent as Route, RouterComponent as Router };

/**
 * RouterProps are the props for the router component.
 */
export interface RouterProps {
  children?: Array<Router<any> | Router<any>[]>;
  default?: DefaultHandler;
  error?: ErrorHandler;
}

/**
 * RouterComponent is the router component.
 */
function RouterComponent(props: RouterProps): Router<any> {
  const router = new Router<any>();
  for (
    const child of ((props.children) ?? []).flat()
  ) {
    if (child instanceof Router) {
      router.use(child);
      continue;
    }

    throw new Error("Invalid child of Router");
  }

  if (props.default) {
    router.default(props.default);
  }

  if (props.error) {
    router.error(props.error);
  }

  return router;
}

/**
 * RouteProps are the props for a route component.
 */
export interface RouteProps {
  pattern: string;
  handler: RequestHandler<any>;
  method?: Method;
}

/**
 * RouteComponent is the route component.
 */
export function RouteComponent(props: RouteProps): Router {
  return new Router().with({
    pattern: new URLPattern({ pathname: props.pattern }),
    handler: props.handler,
    method: props.method,
  });
}

/**
 * Connect is the route component for a CONNECT route.
 */
export function Connect(props: RouteProps): Router {
  return new Router().connect(props.pattern, props.handler);
}

/**
 * Delete is the route component for a DELETE route.
 */
export function Delete(props: RouteProps): Router {
  return new Router().delete(props.pattern, props.handler);
}

/**
 * Get is the route component for a GET route.
 */
export function Get(props: RouteProps): Router {
  return new Router().get(props.pattern, props.handler);
}

/**
 * Head is the route component for a HEAD route.
 */
export function Head(props: RouteProps): Router {
  return new Router().head(props.pattern, props.handler);
}

/**
 * Options is the route component for a OPTIONS route.
 */
export function Options(props: RouteProps): Router {
  return new Router().options(props.pattern, props.handler);
}

/**
 * Patch is the route component for a PATCH route.
 */
export function Patch(props: RouteProps): Router {
  return new Router().patch(props.pattern, props.handler);
}

/**
 * Post is the route component for a POST route.
 */
export function Post(props: RouteProps): Router {
  return new Router().post(props.pattern, props.handler);
}

/**
 * Put is the route component for a PUT route.
 */
export function Put(props: RouteProps): Router {
  return new Router().put(props.pattern, props.handler);
}

/**
 * Trace is the route component for a TRACE route.
 */
export function Trace(props: RouteProps): Router {
  return new Router().trace(props.pattern, props.handler);
}
