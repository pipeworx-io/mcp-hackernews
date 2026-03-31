# @pipeworx/mcp-hackernews

MCP server for Hacker News — search stories, get top posts, and retrieve items.

## Tools

| Tool | Description |
|------|-------------|
| `search_hn` | Search Hacker News stories via Algolia (filter by story, comment, ask_hn, show_hn) |
| `get_top_stories` | Get the current top stories from Hacker News |
| `get_item` | Get a single Hacker News item (story or comment) by ID |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "hackernews": {
      "url": "https://gateway.pipeworx.io/hackernews/mcp"
    }
  }
}
```

Or run via CLI:

```bash
npx pipeworx use hackernews
```

## License

MIT
