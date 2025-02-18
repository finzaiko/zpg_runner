export const sqlSchemaAll = (exluded?: string[]) => {
  let exl = "";
  if (typeof exluded != "undefined") {
    exl = ` and nspname like any('{${exluded}}'::text[]) is not true`;
  }
  return `select nspname as schema_name from pg_catalog.pg_namespace
            where  nspname not in ('information_schema') and nspname not like 'pg\_%' ${exl}
            order by nspname`;
};

export const sqlTableAll = (schemaName: string) => {
  return `select tbl.oid as oid, tbl.relname as table_name from pg_namespace nsp
      join pg_class tbl on nsp.oid = tbl.relnamespace
      where nsp.nspname='${schemaName}' and tbl.relkind='r'`;
};

export const sqlTableContentByOid = (oid: number) => {
  let regClass = `
      (select '"'|| nsp.nspname || '"."' || tbl.relname || '"'
      from pg_namespace nsp join pg_class tbl on nsp.oid = tbl.relnamespace
      where tbl.oid = ${oid})
    `;

  let sql = `
      WITH attrdef AS (
          SELECT
              n.nspname,
              c.relname,
              pg_catalog.array_to_string(c.reloptions || array(select 'toast.' || x from pg_catalog.unnest(tc.reloptions) x), ', ') as relopts,
              c.relpersistence,
              a.attnum,
              a.attname,
              pg_catalog.format_type(a.atttypid, a.atttypmod) as atttype,
              (SELECT substring(pg_catalog.pg_get_expr(d.adbin, d.adrelid, true) for 128) FROM pg_catalog.pg_attrdef d
                  WHERE d.adrelid = a.attrelid AND d.adnum = a.attnum AND a.atthasdef) as attdefault,
              a.attnotnull,
              (SELECT c.collname FROM pg_catalog.pg_collation c, pg_catalog.pg_type t
                  WHERE c.oid = a.attcollation AND t.oid = a.atttypid AND a.attcollation <> t.typcollation) as attcollation,
              a.attidentity,
              a.attgenerated
          FROM pg_catalog.pg_attribute a
          JOIN pg_catalog.pg_class c ON a.attrelid = c.oid
          JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
          LEFT JOIN pg_catalog.pg_class tc ON (c.reltoastrelid = tc.oid)
          WHERE a.attrelid = ${regClass}::regclass
              AND a.attnum > 0
              AND NOT a.attisdropped
          ORDER BY a.attnum
      ),
      coldef AS (
          SELECT
              attrdef.nspname,
              attrdef.relname,
              attrdef.relopts,
              attrdef.relpersistence,
              pg_catalog.format(
                  '%I %s%s%s%s%s',
                  attrdef.attname,
                  attrdef.atttype,
                  case when attrdef.attcollation is null then '' else pg_catalog.format(' COLLATE %I', attrdef.attcollation) end,
                  case when attrdef.attnotnull then ' NOT NULL' else '' end,
                  case when attrdef.attdefault is null then ''
                      else case when attrdef.attgenerated = 's' then pg_catalog.format(' GENERATED ALWAYS AS (%s) STORED', attrdef.attdefault)
                          when attrdef.attgenerated <> '' then ' GENERATED AS NOT_IMPLEMENTED'
                          else pg_catalog.format(' DEFAULT %s', attrdef.attdefault)
                      end
                  end,
                  case when attrdef.attidentity<>'' then pg_catalog.format(' GENERATED %s AS IDENTITY',
                          case attrdef.attidentity when 'd' then 'BY DEFAULT' when 'a' then 'ALWAYS' else 'NOT_IMPLEMENTED' end)
                      else '' end
              ) as col_create_sql
          FROM attrdef
          ORDER BY attrdef.attnum
      ),
      tabdef AS (
          SELECT
              coldef.nspname,
              coldef.relname,
              coldef.relopts,
              coldef.relpersistence,
              string_agg(coldef.col_create_sql, E',\n    ') as cols_create_sql
          FROM coldef
          GROUP BY
              coldef.nspname, coldef.relname, coldef.relopts, coldef.relpersistence
      )
      SELECT
          format(
              'CREATE%s TABLE %I.%I%s%s%s;',
              case tabdef.relpersistence when 't' then ' TEMP' when 'u' then ' UNLOGGED' else '' end,
              tabdef.nspname,
              tabdef.relname,
              coalesce(
                  (SELECT format(E'\n    PARTITION OF %I.%I %s\n', pn.nspname, pc.relname,
                      pg_get_expr(c.relpartbound, c.oid))
                      FROM pg_class c JOIN pg_inherits i ON c.oid = i.inhrelid
                      JOIN pg_class pc ON pc.oid = i.inhparent
                      JOIN pg_namespace pn ON pn.oid = pc.relnamespace
                      WHERE c.oid = ${regClass}::regclass),
                  format(E' (\n    %s\n)', tabdef.cols_create_sql)
              ),
              case when tabdef.relopts <> '' then format(' WITH (%s)', tabdef.relopts) else '' end,
              coalesce(E'\nPARTITION BY '||pg_get_partkeydef(${regClass}::regclass), '')
          ) as table_def
      FROM tabdef
    `;
  // console.log(`sql>>>>>>>>>>`, sql);
  return sql;
};

export const sqlIndex = (schemaName: string, tableName?: string) => {
  let whereTable = "";
  if (typeof tableName != "undefined") {
    whereTable = ` and tablename = '${tableName}'`;
  }
  return `SELECT tablename, regexp_replace(indexname, '[^[:alnum:]]+', '_', 'g') as indexname, indexdef
      FROM pg_indexes WHERE schemaname = '${schemaName}' ${whereTable}
      ORDER BY tablename, indexname`;
};

export const sqlTriggers = (schemaTableName: string) => {
  return `SELECT pt.tgrelid::regclass
        ,p.proname
          , pt.tgname
          , pg_get_triggerdef(pt.oid)
          , pg_get_functiondef(pt.tgfoid)
          , tgenabled
      FROM   pg_trigger pt
      join pg_proc p on p.oid = pt.tgfoid
      WHERE  tgrelid = '${schemaTableName}'::regclass
      and not tgisinternal`;
};

export const sqlViews = (schemaName: string) => {
  let sql = `SELECT
          n.nspname AS table_schema,
          pg_catalog.pg_get_userbyid(c.relowner) AS table_owner,
          c.relname AS viewname,
          s.n_live_tup AS row_count,
          count(a.attname) AS column_count,
          pg_catalog.obj_description(c.oid, 'pg_class') AS comments,
          CASE c.relkind
          WHEN 'v' THEN
              pg_catalog.pg_get_viewdef(c.oid, TRUE)
          ELSE
              NULL
          END AS viewdef
        FROM
          pg_catalog.pg_class c
          LEFT JOIN pg_catalog.pg_namespace n ON (n.oid = c.relnamespace)
          LEFT JOIN pg_catalog.pg_attribute a ON (c.oid = a.attrelid
                  AND a.attnum > 0
                  AND NOT a.attisdropped)
          LEFT JOIN pg_catalog.pg_stat_all_tables s ON (c.oid = s.relid)
        WHERE
          c.relkind = 'v'
          AND n.nspname NOT IN ('pg_catalog', 'information_schema')
          AND n.nspname = '${schemaName}'
        GROUP BY
          n.nspname,
          c.relowner,
          c.relkind,
          c.relname,
          s.n_live_tup,
          c.oid
        ORDER BY
          n.nspname,
          c.relname
        `;
  return sql;
};

export const sqlFuncDef = (schemaName: string) => {
  return `SELECT f.proname as func_name, pg_get_functiondef(f.oid) AS func_def
    FROM pg_catalog.pg_proc f
    INNER JOIN pg_catalog.pg_namespace n ON (f.pronamespace = n.oid)
    WHERE n.nspname = '${schemaName}' and f.prosrc<>'aggregate_dummy'`;
};
