# mcp-hackernews

Hacker News MCP — search and retrieve stories from Hacker News

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_hn` | Full-text search Hacker News via Algolia. Pass query plus optional tags filter (story, comment, ask_hn, show_hn; default: story). Returns title, URL, score, author, comment count, and timestamp. |
| `get_top_stories` | Fetch the current live top-ranked Hacker News stories from the Firebase API. Returns up to `count` stories (default 10) with title, URL, score, author, comment count, and Unix timestamp. |
| `get_stories` | Fetch Hacker News stories of a given TYPE: top (default), new (newest), best, ask (Ask HN), show (Show HN), or job (jobs/hiring). PREFER for "newest HN stories", "top Ask HN posts", "Show HN", "HN job postings / who is hiring". Returns title, URL (or self-text for Ask/Show), score, author, comment count, and timestamp. |
| `get_item` | Fetch a Hacker News story or comment by ID (e.g., "42153809"). Returns full text, score, author, timestamp, and child replies. |
| `get_hn_comments` | Fetch the discussion (top-level comments, actual text) on a Hacker News story by its item ID. PREFER OVER WEB SEARCH for "what are people saying about <HN story>", "HN discussion / developer sentiment on X". get_item returns only comment IDs; this resolves them to text. Find a story ID via get_top_stories or search_hn. Returns each top comment author, text, time, and reply count. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "hackernews": {
      "url": "https://gateway.pipeworx.io/hackernews/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/hackernews/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Hackernews data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
