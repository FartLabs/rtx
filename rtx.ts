import type {
  HandleDefault,
  HandleError,
  HandleRequest,
  RtRoute,
} from "@fartlabs/rt";
import { Router } from "@fartlabs/rt";

type HandleRequestUnknown = HandleRequest<unknown>;
type RtRouteUnknown = RtRoute<unknown>;
type RouterUnknown = Router<unknown>;

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
function RouterComponent(props: RouterProps): RouterUnknown {
  const router = new Router();
  ((props.children) as RouterUnknown[])
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
  handle: HandleRequestUnknown;
}

/**
 * RouteComponent is the route component.
 */
export function RouteComponent(props: RtRouteUnknown): RouterUnknown {
  return new Router().with(props);
}

/**
 * Connect is the route component for a CONNECT route.
 */
export function Connect(props: RouteProps): RouterUnknown {
  return new Router().connect(props.pattern, props.handle);
}

/**
 * Delete is the route component for a DELETE route.
 */
export function Delete(props: RouteProps): RouterUnknown {
  return new Router().delete(props.pattern, props.handle);
}

/**
 * Get is the route component for a GET route.
 */
export function Get(props: RouteProps): RouterUnknown {
  return new Router().get(props.pattern, props.handle);
}

/**
 * Head is the route component for a HEAD route.
 */
export function Head(props: RouteProps): RouterUnknown {
  return new Router().head(props.pattern, props.handle);
}

/**
 * Options is the route component for a OPTIONS route.
 */
export function Options(props: RouteProps): RouterUnknown {
  return new Router().options(props.pattern, props.handle);
}

/**
 * Patch is the route component for a PATCH route.
 */
export function Patch(props: RouteProps): RouterUnknown {
  return new Router().patch(props.pattern, props.handle);
}

/**
 * Post is the route component for a POST route.
 */
export function Post(props: RouteProps): RouterUnknown {
  return new Router().post(props.pattern, props.handle);
}

/**
 * Put is the route component for a PUT route.
 */
export function Put(props: RouteProps): RouterUnknown {
  return new Router().put(props.pattern, props.handle);
}

/**
 * Trace is the route component for a TRACE route.
 */
export function Trace(props: RouteProps): RouterUnknown {
  return new Router().trace(props.pattern, props.handle);
}
