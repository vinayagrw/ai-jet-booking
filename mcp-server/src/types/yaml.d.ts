declare module 'yaml' {
  export function parse(text: string): any;
  export function stringify(obj: any): string;
} 