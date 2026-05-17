export const logger = {
  info(message: string) {
    console.log(`[server] ${new Date().toISOString()} ${message}`);
  },
  error(message: string, error?: unknown) {
    if (error instanceof Error) {
      console.error(`[server] ${new Date().toISOString()} ${message}`, {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      return;
    }

    console.error(`[server] ${new Date().toISOString()} ${message}`, error);
  },
};
