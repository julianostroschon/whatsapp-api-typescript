import { parentLogger } from "../infra/logger";

const logger = parentLogger.child({ module: 'shutdown' })

export function setupGracefulShutdown(closeFns: Array<() => Promise<void> | void>): void {
  const shutdown = async (signal: string) => {
    logger.warn(`🚧 Received ${signal}, shutting down gracefully...`);
    for (const fn of closeFns) {
      try {
        await fn();
      } catch (err) {
        if (err instanceof Error) {
          logger.error('Error during shutdown:', err.message);
        }
      }
      process.exit(0);
    }
  }
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}
