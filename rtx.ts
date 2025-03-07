import type {
  HandleDefault,
  HandleError,
  HandleRequest,
  Route,
} from "@fartlabs/rt";
import { Router } from "@fartlabs/rt";

export type { RouteComponent as Route, RouterComponent as Router };

/**
 * RouterProps are the props for the router component.
 */
export interface RouterProps {
  children?: unknown[];
  default?: HandleDefault;
  error?: HandleError;
}

/**
 * RouterComponent is the router component.
 */
function RouterComponent(props: RouterProps): Router {
  const router = new Router();
  ((props.children) as Router[])
    ?.forEach((child) => {
      if (child instanceof Router) {
        router.use(child);
        return;
      }

      throw new Error("Invalid child of Router");
    });

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
  handle: HandleRequest;
}

/**
 * RouteComponent is the route component.
 */
export function RouteComponent(props: Route): Router {
  return new Router().with(props);
}

/**
 * Connect is the route component for a CONNECT route.
 */
export function Connect(props: RouteProps): Router {
  return new Router().connect(props.pattern, props.handle);
}

/**
 * Delete is the route component for a DELETE route.
 */
export function Delete(props: RouteProps): Router {
  return new Router().delete(props.pattern, props.handle);
}

/**
 * Get is the route component for a GET route.
 */
export function Get(props: RouteProps): Router {
  return new Router().get(props.pattern, props.handle);
}

/**
 * Head is the route component for a HEAD route.
 */
export function Head(props: RouteProps): Router {
  return new Router().head(props.pattern, props.handle);
}

/**
 * Options is the route component for a OPTIONS route.
 */
export function Options(props: RouteProps): Router {
  return new Router().options(props.pattern, props.handle);
}

/**
 * Patch is the route component for a PATCH route.
 */
export function Patch(props: RouteProps): Router {
  return new Router().patch(props.pattern, props.handle);
}

/**
 * Post is the route component for a POST route.
 */
export function Post(props: RouteProps): Router {
  return new Router().post(props.pattern, props.handle);
}

/**
 * Put is the route component for a PUT route.
 */
export function Put(props: RouteProps): Router {
  return new Router().put(props.pattern, props.handle);
}

/**
 * Trace is the route component for a TRACE route.
 */
export function Trace(props: RouteProps): Router {
  return new Router().trace(props.pattern, props.handle);
}
