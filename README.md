# mcp-hackernews

Hacker News MCP — search and retrieve stories from Hacker News

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Hackernews data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
