import { perceive } from '@/lib/claude';
import { createApiHandler } from '@/lib/api-handler';
import { perceiveParamsSchema } from '@/lib/schemas';

export const POST = createApiHandler({
  schema: perceiveParamsSchema,
  handler: async (body) => {
    return await perceive(body);
  },
});
