import { generateOpenApiDocument } from 'trpc-openapi';

import { appRouter } from './server';

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'Example CRUD API',
  description: 'OpenAPI compliant REST API built using tRPC with Express',
  version: '1.0.0',
  baseUrl: 'http://localhost:8080/api/posts',
  tags: ['posts'],
});
