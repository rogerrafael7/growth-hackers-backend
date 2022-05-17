import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export function promiseDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class TestSchemaProvider {
  constructor(
    readonly connection: Connection,
    readonly config: ConfigService,
  ) {}

  async clear() {
    const schemaName = this.config.get('database').schema;
    return this.connection.query(`
      DO $$ DECLARE
      r RECORD;
      BEGIN
          FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = '${schemaName}') LOOP
              EXECUTE 'TRUNCATE TABLE ' || '${schemaName}.' || quote_ident(r.tablename) || ' cascade';
          END LOOP;
      END $$;
      `);
  }
}
