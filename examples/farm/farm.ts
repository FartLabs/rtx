import { createRouter } from "rtx/mod.ts";

if (import.meta.main) {
  const router = createRouter()
    .with<"id">(
      { method: "GET", pattern: new URLPattern({ pathname: "/farms/:id" }) },
      ({ params }) => {
        return new Response(`Farm ID: ${params.id}`);
      },
    );

  Deno.serve(router.fetch.bind(router));
}
