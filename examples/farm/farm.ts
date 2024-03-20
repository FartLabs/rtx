import { createRouter } from "rtx/mod.ts";

if (import.meta.main) {
  const router = createRouter()
    .get<"id">("/animals/:id", (ctx) => {
      return new Response(`Animal ID: ${ctx.params.id}`);
    })
    .default(() => new Response("Not found", { status: 404 }));

  Deno.serve((request) => router.fetch(request));
}
