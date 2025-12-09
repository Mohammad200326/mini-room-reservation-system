export type EnvVariables = {
  JWT_SECRET: string;
  NODE_ENV: 'development' | 'production';
};
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends EnvVariables {}
  }
}
