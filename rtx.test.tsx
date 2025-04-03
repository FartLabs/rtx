import { assertEquals } from "@std/assert";
import { Get, Router } from "./rtx.ts";

const exampleString = "Hello, world!";

Deno.test("Creates router endpoint", async () => {
  const router = (
    <Router>
      <Get
        pattern="/"
        handler={() => {
          return new Response(exampleString);
        }}
      />
    </Router>
  );
  const response = await router.fetch(new Request("http://localhost:8000/"));
  assertEquals(await response.text(), exampleString);
});
