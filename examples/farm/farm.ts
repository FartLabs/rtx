import { createRouter } from "rtx/mod.ts";

if (import.meta.main) {
  const router = createRouter()
    .get<"id">("/farms/:id", (ctx) => {
      return new Response(`Farm ID: ${ctx.params.id}`);
    });

  Deno.serve((request) => router.fetch(request));
}
