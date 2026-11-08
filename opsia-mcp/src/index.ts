#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { getCategories } from './tools/categories.js';
import {
  insertTransactions,
  getTransactions,
  checkDuplicates,
  type Transaction,
} from './tools/transactions.js';
import { getMonthStats, getCurrentMonthStats } from './tools/stats.js';

const server = new Server(
  {
    name: 'opsia-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_categories',
        description:
          'Get all Opsia categories for the user. Returns expense and income categories with their IDs.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'insert_transactions',
        description:
          'Insert multiple transactions into Opsia. Automatically maps category names to IDs and validates data.',
        inputSchema: {
          type: 'object',
          properties: {
            transactions: {
              type: 'array',
              description: 'Array of transactions to insert',
              items: {
                type: 'object',
                properties: {
                  date: {
                    type: 'string',
                    description: 'Transaction date in YYYY-MM-DD format',
                  },
                  type: {
                    type: 'string',
                    enum: ['income', 'expense'],
                    description: 'Transaction type',
                  },
                  category: {
                    type: 'string',
                    description: 'Category name (must match existing category exactly)',
                  },
                  amount: {
                    type: 'number',
                    description: 'Transaction amount (positive number)',
                  },
                  description: {
                    type: 'string',
                    description: 'Transaction description (optional)',
                  },
                },
                required: ['date', 'type', 'category', 'amount'],
              },
            },
          },
          required: ['transactions'],
        },
      },
      {
        name: 'get_transactions',
        description:
          'Fetch transactions from Opsia with optional filters for date range and limit.',
        inputSchema: {
          type: 'object',
          properties: {
            startDate: {
              type: 'string',
              description: 'Start date in YYYY-MM-DD format (optional)',
            },
            endDate: {
              type: 'string',
              description: 'End date in YYYY-MM-DD format (optional)',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of transactions to return (optional)',
            },
          },
        },
      },
      {
        name: 'check_duplicates',
        description:
          'Check if transactions already exist in Opsia to prevent duplicate imports. Compares by date, amount, and description.',
        inputSchema: {
          type: 'object',
          properties: {
            transactions: {
              type: 'array',
              description: 'Array of transactions to check',
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string' },
                  type: { type: 'string' },
                  category: { type: 'string' },
                  amount: { type: 'number' },
                  description: { type: 'string' },
                },
                required: ['date', 'type', 'category', 'amount'],
              },
            },
          },
          required: ['transactions'],
        },
      },
      {
        name: 'get_month_stats',
        description:
          'Get financial statistics for a specific month including income, expenses, savings, and top categories.',
        inputSchema: {
          type: 'object',
          properties: {
            year: {
              type: 'number',
              description: 'Year (e.g., 2026). If omitted, uses current month.',
            },
            month: {
              type: 'number',
              description: 'Month (1-12). If omitted, uses current month.',
            },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case 'get_categories': {
        const result = await getCategories();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'insert_transactions': {
        const { transactions } = request.params.arguments as {
          transactions: Transaction[];
        };
        const result = await insertTransactions(transactions);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_transactions': {
        const params = request.params.arguments as {
          startDate?: string;
          endDate?: string;
          limit?: number;
        };
        const result = await getTransactions(params);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'check_duplicates': {
        const { transactions } = request.params.arguments as {
          transactions: Transaction[];
        };
        const result = await checkDuplicates(transactions);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_month_stats': {
        const params = request.params.arguments as {
          year?: number;
          month?: number;
        };

        const result =
          params.year && params.month
            ? await getMonthStats(params.year, params.month)
            : await getCurrentMonthStats();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Opsia MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
