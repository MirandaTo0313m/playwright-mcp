/**
 * playwright-mcp - Model Context Protocol server for Playwright browser automation
 * Fork of microsoft/playwright-mcp
 *
 * This is the main entry point for the MCP server that exposes Playwright
 * browser automation capabilities through the Model Context Protocol.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { chromium, Browser, BrowserContext, Page } from 'playwright';

import { getTools } from './tools/index.js';
import { BrowserSession } from './session.js';

/** Global browser session shared across tool calls */
let session: BrowserSession | null = null;

/**
 * Get or create the browser session.
 * Lazily initializes the browser on first use.
 */
async function getSession(): Promise<BrowserSession> {
  if (!session) {
    const browser = await chromium.launch({
      headless: process.env.PLAYWRIGHT_HEADLESS !== 'false',
    });
    session = new BrowserSession(browser);
  }
  return session;
}

/**
 * Create and configure the MCP server instance.
 */
function createServer(): Server {
  const server = new Server(
    {
      name: 'playwright-mcp',
      version: process.env.npm_package_version ?? '0.0.1',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  const tools = getTools();

  // Register the list tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map((tool) => tool.schema),
  }));

  // Register the call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    const tool = tools.find((t) => t.schema.name === name);
    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    const browserSession = await getSession();
    return tool.handle(browserSession, args ?? {});
  });

  return server;
}

/**
 * Main entry point — starts the MCP server over stdio transport.
 */
async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();

  // Graceful shutdown on process signals
  const cleanup = async () => {
    if (session) {
      await session.close();
      session = null;
    }
    await server.close();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  await server.connect(transport);
  console.error('playwright-mcp server started');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
