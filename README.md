# mcp-hackernews

Hacker News MCP — search and retrieve stories from Hacker News

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `get_top_stories` | Get the current top stories from Hacker News. |
| `get_item` | Get a single Hacker News item (story or comment) by its numeric ID. |

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

Or use the CLI:

```bash
npx pipeworx use hackernews
```

## License

MIT
