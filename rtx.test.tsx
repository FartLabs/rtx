import { assertEquals } from "@std/assert";
import type { RequestHandler } from "@fartlabs/rt";
import { Delete, Get, Post, Put, Router } from "./rtx.ts";

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

Deno.test("Creates router endpoint with nested router", async () => {
  const router = (
    <Router>
      {[
        // deno-lint-ignore jsx-key
        <Get
          pattern="/"
          handler={() => {
            return new Response(exampleString);
          }}
        />,
      ]}
    </Router>
  );
  const response = await router.fetch(new Request("http://localhost:8000/"));
  assertEquals(await response.text(), exampleString);
});

Deno.test("Handler receives context object with request", async () => {
  const router = (
    <Router>
      <Get
        pattern="/test"
        handler={(ctx) => {
          assertEquals(ctx.request instanceof Request, true);
          assertEquals(ctx.request.url, "http://localhost:8000/test");
          return new Response("OK");
        }}
      />
    </Router>
  );
  const response = await router.fetch(
    new Request("http://localhost:8000/test"),
  );
  assertEquals(await response.text(), "OK");
});

Deno.test("Route parameters are accessible via ctx.params.pathname.groups", async () => {
  const router = (
    <Router>
      <Get
        pattern="/users/:id"
        handler={(ctx) => {
          const id = ctx.params?.pathname.groups.id;
          return Response.json({ id });
        }}
      />
    </Router>
  );
  const response = await router.fetch(
    new Request("http://localhost:8000/users/123"),
  );
  const data = await response.json();
  assertEquals(data.id, "123");
});

Deno.test("Query parameters are accessible via ctx.request.url", async () => {
  const router = (
    <Router>
      <Get
        pattern="/search"
        handler={(ctx) => {
          const url = new URL(ctx.request.url);
          const query = url.searchParams.get("q");
          return Response.json({ query });
        }}
      />
    </Router>
  );
  const response = await router.fetch(
    new Request("http://localhost:8000/search?q=test"),
  );
  const data = await response.json();
  assertEquals(data.query, "test");
});

Deno.test("Route and query parameters work together", async () => {
  const router = (
    <Router>
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
  const response = await router.fetch(
    new Request("http://localhost:8000/users/456?page=2"),
  );
  const data = await response.json();
  assertEquals(data.id, "456");
  assertEquals(data.page, 2);
});

Deno.test("POST method with request body", async () => {
  const router = (
    <Router>
      <Post
        pattern="/items"
        handler={async (ctx) => {
          const body = await ctx.request.json();
          return Response.json({ created: body }, { status: 201 });
        }}
      />
    </Router>
  );
  const response = await router.fetch(
    new Request("http://localhost:8000/items", {
      method: "POST",
      body: JSON.stringify({ name: "test" }),
      headers: { "Content-Type": "application/json" },
    }),
  );
  const data = await response.json();
  assertEquals(data.created, { name: "test" });
  assertEquals(response.status, 201);
});

Deno.test("PUT method with route parameter and body", async () => {
  const router = (
    <Router>
      <Put
        pattern="/items/:id"
        handler={async (ctx) => {
          const body = await ctx.request.json();
          const id = ctx.params?.pathname.groups.id;
          return Response.json({ updatedId: id, data: body });
        }}
      />
    </Router>
  );
  const response = await router.fetch(
    new Request("http://localhost:8000/items/789", {
      method: "PUT",
      body: JSON.stringify({ name: "updated" }),
      headers: { "Content-Type": "application/json" },
    }),
  );
  const data = await response.json();
  assertEquals(data.updatedId, "789");
  assertEquals(data.data, { name: "updated" });
});

Deno.test("DELETE method with route parameter", async () => {
  const router = (
    <Router>
      <Delete
        pattern="/items/:id"
        handler={(_ctx) => {
          return new Response(null, { status: 204 });
        }}
      />
    </Router>
  );
  const response = await router.fetch(
    new Request("http://localhost:8000/items/999", { method: "DELETE" }),
  );
  assertEquals(response.status, 204);
  assertEquals(await response.text(), "");
});

Deno.test("Nested routes work correctly", async () => {
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

  const listResponse = await router.fetch(
    new Request("http://localhost:8000/users"),
  );
  const listData = await listResponse.json();
  assertEquals(listData, [{ id: "1" }]);

  const detailResponse = await router.fetch(
    new Request("http://localhost:8000/users/42"),
  );
  const detailData = await detailResponse.json();
  assertEquals(detailData.id, "42");
});

Deno.test("Middleware composition works", async () => {
  const withJson =
    (handler: RequestHandler<unknown>): RequestHandler<unknown> =>
    async (ctx) => {
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

  const response = await router.fetch(
    new Request("http://localhost:8000/health"),
  );
  // Response.json() already sets content-type, so middleware adds charset
  const contentType = response.headers.get("content-type");
  assertEquals(contentType?.startsWith("application/json"), true);
  const data = await response.json();
  assertEquals(data.ok, true);
});

Deno.test("Default handler is called for unmatched routes", async () => {
  const router = (
    <Router default={() => new Response("Not found", { status: 404 })}>
      <Get
        pattern="/exists"
        handler={() =>
          new Response("Found")}
      />
    </Router>
  );

  const foundResponse = await router.fetch(
    new Request("http://localhost:8000/exists"),
  );
  assertEquals(await foundResponse.text(), "Found");

  const notFoundResponse = await router.fetch(
    new Request("http://localhost:8000/notfound"),
  );
  assertEquals(await notFoundResponse.text(), "Not found");
  assertEquals(notFoundResponse.status, 404);
});
