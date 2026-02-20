import { think } from '@/lib/claude';
import { createApiHandler } from '@/lib/api-handler';
import { thinkParamsSchema } from '@/lib/schemas';

export const POST = createApiHandler({
  schema: thinkParamsSchema,
  handler: async (body) => {
    return await think(body);
  },
});
