declare module 'swagger-ui-express' {
  import { RequestHandler } from 'express';
  
  export function serve(): RequestHandler[];
  export function setup(swaggerDoc: any, options?: any): RequestHandler;
} 