/**
 * Hacker News MCP — search and retrieve stories from Hacker News
 *
 * Tools:
 * - search_hn: Search HN stories via Algolia API
 * - get_top_stories: Get current top stories via Firebase API
 * - get_item: Get a single HN item (story/comment) by ID
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const ALGOLIA_BASE = 'https://hn.algolia.com/api/v1';
const FIREBASE_BASE = 'https://hacker-news.firebaseio.com/v0';

const tools: McpToolExport['tools'] = [
  {
    name: 'search_hn',
    description:
      'Search Hacker News stories (and other content types) using the Algolia search API.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query string',
        },
        tags: {
          type: 'string',
          description:
            'Content type filter: story, comment, ask_hn, or show_hn (default: story)',
        },
        per_page: {
          type: 'number',
          description: 'Number of results to return (default: 10)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_top_stories',
    description: 'Get the current top stories from Hacker News.',
    inputSchema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Number of top stories to return (default: 10)',
        },
      },
    },
  },
  {
    name: 'get_item',
    description: 'Get a single Hacker News item (story or comment) by its numeric ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'The numeric Hacker News item ID',
        },
      },
      required: ['id'],
    },
  },
];

interface AlgoliaHit {
  objectID: string;
  title?: string;
  url?: string;
  author?: string;
  points?: number;
  num_comments?: number;
  created_at?: string;
}

interface AlgoliaResponse {
  hits: AlgoliaHit[];
}

interface HnItem {
  id: number;
  type?: string;
  title?: string;
  url?: string;
  by?: string;
  score?: number;
  descendants?: number;
  time?: number;
  text?: string;
  kids?: number[];
  parent?: number;
  dead?: boolean;
  deleted?: boolean;
}

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_hn': {
      const query = args.query as string;
      const tags = (args.tags as string) ?? 'story';
      const perPage = (args.per_page as number) ?? 10;

      const params = new URLSearchParams({
        query,
        tags,
        hitsPerPage: String(perPage),
      });

      const res = await fetch(`${ALGOLIA_BASE}/search?${params}`);
      if (!res.ok) throw new Error(`HN Algolia search error: ${res.status}`);

      const data = (await res.json()) as AlgoliaResponse;

      return {
        query,
        tags,
        count: data.hits.length,
        results: data.hits.map((hit) => ({
          objectID: hit.objectID,
          title: hit.title ?? null,
          url: hit.url ?? null,
          author: hit.author ?? null,
          points: hit.points ?? null,
          num_comments: hit.num_comments ?? null,
          created_at: hit.created_at ?? null,
        })),
      };
    }

    case 'get_top_stories': {
      const count = Math.max(1, Math.min(500, (args.count as number) ?? 10));

      const listRes = await fetch(`${FIREBASE_BASE}/topstories.json`);
      if (!listRes.ok) throw new Error(`HN top stories error: ${listRes.status}`);

      const ids = (await listRes.json()) as number[];
      const topIds = ids.slice(0, count);

      const items = await Promise.all(
        topIds.map(async (id) => {
          const res = await fetch(`${FIREBASE_BASE}/item/${id}.json`);
          if (!res.ok) throw new Error(`HN item fetch error for ${id}: ${res.status}`);
          return res.json() as Promise<HnItem>;
        }),
      );

      return {
        count: items.length,
        stories: items.map((item) => ({
          id: item.id,
          title: item.title ?? null,
          url: item.url ?? null,
          by: item.by ?? null,
          score: item.score ?? null,
          descendants: item.descendants ?? null,
          time: item.time ?? null,
        })),
      };
    }

    case 'get_item': {
      const id = args.id as number;

      const res = await fetch(`${FIREBASE_BASE}/item/${id}.json`);
      if (!res.ok) throw new Error(`HN item fetch error: ${res.status}`);

      const item = (await res.json()) as HnItem | null;
      if (!item) throw new Error(`Item ${id} not found`);

      return item;
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies McpToolExport;
