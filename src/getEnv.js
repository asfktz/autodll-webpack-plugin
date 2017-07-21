export const _getEnv = process => env => env || process.env.NODE_ENV || 'development';
export default _getEnv(process);
