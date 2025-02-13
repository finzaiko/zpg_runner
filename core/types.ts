export interface Config {
  name: string;
  path: string;
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  schema_exclude: string[];
  git_access_token: string;
}

export interface TableDefinition {
  oid: number;
  table_name: string;
}

export interface TableContent {
  table_def: string;
}

export interface IndexDef {
  indexname: string;
  indexdef: Uint8Array;
}

export interface ViewDefinition {
  viewname: string;
  viewdef: string;
}
