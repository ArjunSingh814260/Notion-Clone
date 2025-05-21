declare module 'postgres-migrate' {
  export function migrate(
    db: any,
    options: { migrationsFolder: string }
  ): Promise<void>;
}