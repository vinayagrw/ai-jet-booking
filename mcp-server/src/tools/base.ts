import { z } from 'zod';

export abstract class BaseTool<TParams = any, TResult = any> {
  abstract name: string;
  abstract description: string;
  abstract parameters: z.ZodType<TParams>;

  protected abstract _handle(params: TParams): Promise<TResult>;

  async handler(params: TParams): Promise<TResult> {
    try {
      // Validate parameters
      const validatedParams = this.parameters.parse(params);
      
      // Execute handler
      const result = await this._handle(validatedParams);
      
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid parameters: ${error.message}`);
      }
      throw error;
    }
  }
} 