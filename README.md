# rtx

[![JSR][JSR badge]][JSR] [![JSR score][JSR score badge]][JSR score]
[![GitHub
Actions][GitHub Actions badge]][GitHub Actions]

Minimal HTTP router library based on the `URLPattern` API.

## Usage

```ts
import { createRouter } from "@fartlabs/rtx";

const router = createRouter()
  .get("/", () => {
    return new Response("Hello, World!");
  })
  .default(() => new Response("Not found", { status: 404 }));

Deno.serve((request) => router.fetch(request));
```

### Deno

1\. [Install Deno](https://docs.deno.com/runtime/manual).

2\. Start a new Deno project.

```sh
deno init
```

3\. Add rtx as a project dependency.

```sh
deno add @fartlabs/rtx
```

## Contribute

### Style

Run `deno fmt` to format the code.

Run `deno lint` to lint the code.

---

Developed with ❤️ by [**@EthanThatOneKid**](https://etok.codes/)

[JSR]: https://jsr.io/@fartlabs/rtx
[JSR badge]: https://jsr.io/badges/@fartlabs/rtx
[JSR score]: https://jsr.io/@fartlabs/rtx/score
[JSR score badge]: https://jsr.io/badges/@fartlabs/rtx/score
[GitHub Actions]: https://github.com/EthanThatOneKid/rtx/actions/workflows/check.yaml
[GitHub Actions badge]: https://github.com/EthanThatOneKid/rtx/actions/workflows/check.yaml/badge.svg
