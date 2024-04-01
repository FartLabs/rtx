/**
 * @module
 *
 * @example
 *
 * ```tsx
 * if (import.meta.main) {
 *   const router = (
 *     <Router>
 *       <Get
 *         pattern="/favicon.ico"
 *         handle={() =>
 *           new Response(null, {
 *             status: 302,
 *             headers: { Location: "https://deno.com/favicon.ico" },
 *          })}
 *       />
 *       <Get pattern="/" handle={() => new Response("Hello, World!")} />
 *       <Get pattern="/foo" handle={() => new Response("foo")} />
 *       <Get pattern="/bar" handle={() => new Response("bar")} />
 *       <Get pattern="/baz" handle={() => new Response("baz")} />
 *     </Router>
 *   );
 *
 *   Deno.serve((request) => router.fetch(request));
 * }
 * ```
 */

import type {
  Handle as IHandle,
  Method as IMethod,
  Route as IRoute,
} from "rtx/mod.ts";
import { createRouter, Router as CRouter } from "rtx/mod.ts";

// deno run -A components/components.tsx
//
if (import.meta.main) {
  const router = (
    <Router>
      <Get
        pattern="/favicon.ico"
        handle={() =>
          new Response(null, {
            status: 302,
            headers: { Location: "https://deno.com/favicon.ico" },
          })}
      />
      <Get pattern="/" handle={() => new Response("Hello, World!")} />
      <Get pattern="/foo" handle={() => new Response("foo")} />
      <Get pattern="/bar" handle={() => new Response("bar")} />
      <Get pattern="/baz" handle={() => new Response("baz")} />
    </Router>
  );

  Deno.serve((request) => router.fetch(request));
}

/**
 * ComponentsInterface is the interface for the components.
 */
export type ComponentsInterface = Record<
  Capitalize<Lowercase<IMethod>>,
  (props: RouteProps) => CRouter
>;

/**
 * RouteProps are the props for a route component.
 */
export interface RouteProps {
  pattern: string;
  handle: IHandle;
}

/**
 * Router is the router component.
 */
export function Router(props: { children?: unknown[] }): CRouter {
  const router = createRouter();
  ((props.children) as CRouter[])
    ?.forEach((child) => {
      if (child instanceof CRouter) {
        router.use(child);
        return;
      }

      throw new Error("Invalid child of Router");
    });

  return router;
}

/**
 * Route is the route component.
 */
export function Route(props: IRoute): CRouter {
  return createRouter().with(props);
}

/**
 * Connect is the route component for a CONNECT route.
 */
export function Connect(props: RouteProps): CRouter {
  return createRouter().connect(props.pattern, props.handle);
}

/**
 * Delete is the route component for a DELETE route.
 */
export function Delete(props: RouteProps): CRouter {
  return createRouter().delete(props.pattern, props.handle);
}

/**
 * Get is the route component for a GET route.
 */
export function Get(props: RouteProps): CRouter {
  return createRouter().get(props.pattern, props.handle);
}

/**
 * Head is the route component for a HEAD route.
 */
export function Head(props: RouteProps): CRouter {
  return createRouter().head(props.pattern, props.handle);
}

/**
 * Options is the route component for a OPTIONS route.
 */
export function Options(props: RouteProps): CRouter {
  return createRouter().options(props.pattern, props.handle);
}

/**
 * Patch is the route component for a PATCH route.
 */
export function Patch(props: RouteProps): CRouter {
  return createRouter().patch(props.pattern, props.handle);
}

/**
 * Post is the route component for a POST route.
 */
export function Post(props: RouteProps): CRouter {
  return createRouter().post(props.pattern, props.handle);
}

/**
 * Put is the route component for a PUT route.
 */
export function Put(props: RouteProps): CRouter {
  return createRouter().put(props.pattern, props.handle);
}

/**
 * Trace is the route component for a TRACE route.
 */
export function Trace(props: RouteProps): CRouter {
  return createRouter().trace(props.pattern, props.handle);
}
