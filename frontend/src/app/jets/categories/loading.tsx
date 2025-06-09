import { logger } from '@/utils/logger';

// This is a server component that will run on the server
export default function Loading() {
  logger.info('Server: Loading component rendered');
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading categories...</h2>
      </div>
    </div>
  );
} 