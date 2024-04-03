# rtx

[![JSR][JSR badge]][JSR] [![JSR score][JSR score badge]][JSR score]
[![GitHub Actions][GitHub Actions badge]][GitHub Actions]

Library of [`@fartlabs/jsonx`](https://github.com/FartLabs/jsonx) components for
composing [`@fartlabs/rt`](https://github.com/FartLabs/rt) routers in JSX.

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

3\. Add `@fartlabs/jsonx` and `@fartlabs/rtx` as project dependencies.

```sh
deno add @fartlabs/jsonx @fartlabs/rtx
```

4\. Add the following values to your `deno.json(c)` file.

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@fartlabs/jsonx"
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
      handle={() =>
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

## Contribute

### Style

Run `deno fmt` to format the code.

Run `deno lint` to lint the code.

---

Developed with ❤️ [**@FartLabs**](https://github.com/FartLabs)

[JSR]: https://jsr.io/@fartlabs/rtx
[JSR badge]: https://jsr.io/badges/@fartlabs/rtx
[JSR score]: https://jsr.io/@fartlabs/rtx/score
[JSR score badge]: https://jsr.io/badges/@fartlabs/rtx/score
[GitHub Actions]: https://github.com/FartLabs/rtx/actions/workflows/check.yaml
[GitHub Actions badge]: https://github.com/FartLabs/rtx/actions/workflows/check.yaml/badge.svg
