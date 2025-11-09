# [@fartlabs/rtx](https://jsr.io/@fartlabs/rtx)

[![GitHub Actions][GitHub Actions badge]][GitHub Actions]
[![JSR][JSR badge]][JSR] [![JSR score][JSR score badge]][JSR score]

Library of [`@fartlabs/jsonx`](https://github.com/FartLabs/jsonx) components for
composing [`@fartlabs/rt`](https://github.com/FartLabs/rt) routers in JSX.

## Tutorial

[![Watch the video](https://img.youtube.com/vi/tQq3OK1ND1g/0.jpg)](https://www.youtube.com/watch?v=tQq3OK1ND1g)

Presented by [**@johncmanuel**](https://github.com/johncmanuel/).

## API documentation

Generated API documentation is available at <https://jsr.io/@fartlabs/rtx>.

## Getting started

### Deno

Let's learn how to get started with rtx by creating a simple router in Deno.

1\. [Install Deno](https://docs.deno.com/runtime/manual).

2\. Start a new Deno project.

```sh
deno init
```

3\. Add `@fartlabs/rtx` as a project dependency.

```sh
deno add jsr:@fartlabs/rtx
```

4\. Add the following values to your `deno.json(c)` file.

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@fartlabs/rtx"
  }
}
```

5\. Add a file ending in `.[j|t]sx` to your project. For example, `main.tsx`.

```tsx
import { Get, Router } from "@fartlabs/rtx";

const router = (
  <Router default={() => new Response("Not found", { status: 404 })}>
    <Get
      pattern="/"
      handler={() =>
        new Response("Hello, World!")}
    />
  </Router>
);

Deno.serve((request) => router.fetch(request));
```

6\. Spin up your HTTP server by running the `.[j|t]sx` file.

```sh
deno run --allow-net main.tsx
```

## Examples

### Multiple HTTP methods

```tsx
import { Delete, Get, Post, Put, Router } from "@fartlabs/rtx";

const router = (
  <Router default={() => new Response("Not found", { status: 404 })}>
    <Get
      pattern="/"
      handler={() =>
        new Response("Home")}
    />
    <Post
      pattern="/items"
      handler={async (ctx) => {
        const body = await ctx.request.json();
        return Response.json({ created: body }, { status: 201 });
      }}
    />
    <Put
      pattern="/items/:id"
      handler={async (ctx) => {
        const body = await ctx.request.json();
        const id = ctx.params?.pathname.groups.id;
        return Response.json({ updatedId: id, data: body });
      }}
    />
    <Delete
      pattern="/items/:id"
      handler={(ctx) => {
        return new Response(null, { status: 204 });
      }}
    />
  </Router>
);
```

### Route parameters and query parameters

```tsx
import { Get, Router } from "@fartlabs/rtx";

const router = (
  <Router default={() => new Response("Not found", { status: 404 })}>
    <Get
      pattern="/users/:id"
      handler={(ctx) => {
        const id = ctx.params?.pathname.groups.id;
        const url = new URL(ctx.request.url);
        const page = Number(url.searchParams.get("page") ?? 1);
        return Response.json({ id, page });
      }}
    />
  </Router>
);
```

### Middleware composition

You can wrap handlers to implement common behavior (auth, logging, headers).

```tsx
import { Get, Router } from "@fartlabs/rtx";
import type { RequestHandler } from "@fartlabs/rt";

const withJson =
  (handler: RequestHandler<unknown>): RequestHandler<unknown> =>
  async (
    ctx,
  ) => {
    try {
      const res = await handler(ctx);
      const headers = new Headers(res.headers);
      if (!headers.has("content-type")) {
        headers.set("content-type", "application/json; charset=utf-8");
      }
      return new Response(res.body, { status: res.status, headers });
    } catch (error) {
      return Response.json({ error: String(error) }, { status: 500 });
    }
  };

const router = (
  <Router default={() => new Response("Not found", { status: 404 })}>
    <Get
      pattern="/health"
      handler={withJson(() =>
        Response.json({ ok: true })
      )}
    />
  </Router>
);
```

### Nested routes

You can define multiple routes in the same Router component:

```tsx
import { Get, Router } from "@fartlabs/rtx";

const router = (
  <Router default={() => new Response("Not found", { status: 404 })}>
    <Get
      pattern="/users"
      handler={() =>
        Response.json([{ id: "1" }])}
    />
    <Get
      pattern="/users/:id"
      handler={(ctx) => Response.json({ id: ctx.params?.pathname.groups.id })}
    />
  </Router>
);
```

### Error handling

```tsx
import { Get, Router } from "@fartlabs/rtx";

const router = (
  <Router default={() => new Response("Not found", { status: 404 })}>
    <Get
      pattern="/boom"
      handler={() => {
        throw new Error("Something went wrong");
      }}
    />
  </Router>
);

// Wrap fetch to centralize error responses
const safeFetch = async (request: Request) => {
  try {
    return await router.fetch(request);
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
};

Deno.serve((request) => safeFetch(request));
```

## Contribute

### Style

Run `deno fmt` to format the code.

Run `deno lint` to lint the code.

## Related projects

- [`@fartlabs/rt`](https://github.com/FartLabs/rt): Minimal runtime router
  powering the JSX components here
- [`@fartlabs/jsonx`](https://github.com/FartLabs/jsonx): Minimal JSX runtime
  used by `rtx`

## Testing

This repo uses Deno tests.

```sh
deno test -A
```

## Migration from `rt` to `rtx`

- Replace imperative route registrations with JSX elements like `Get`, `Post`,
  etc.
- Create a top-level `Router` and pass a `default` handler for unmatched routes.
- Handlers receive a single context object with `request`, `params` (URLPattern
  match results), and other properties. Route parameters are accessed via
  `ctx.params.pathname.groups.paramName`.
- Compose cross-cutting concerns by higher-order functions that wrap route
  `handler`.

## License

See [LICENSE](LICENSE) for details.

---

Developed with ❤️ [**@FartLabs**](https://github.com/FartLabs)

[JSR]: https://jsr.io/@fartlabs/rtx
[JSR badge]: https://jsr.io/badges/@fartlabs/rtx
[JSR score]: https://jsr.io/@fartlabs/rtx/score
[JSR score badge]: https://jsr.io/badges/@fartlabs/rtx/score
[GitHub Actions]: https://github.com/FartLabs/rtx/actions/workflows/check.yaml
[GitHub Actions badge]: https://github.com/FartLabs/rtx/actions/workflows/check.yaml/badge.svg
