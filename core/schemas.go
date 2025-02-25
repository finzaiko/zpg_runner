package core

import (
	"context"
	"os"
	"path/filepath"

	"github.com/jackc/pgx/v4/pgxpool"
)

type SchemaRow struct {
	SchemaName string `json:"schema_name"`
}

func GetSchemas(dbPool *pgxpool.Pool, schemaExclude []string, path string) ([]SchemaRow, error) {
	ctx := context.Background()
	// fmt.Printf("DEBUG-schemaExclude=  %s\n", schemaExclude)
	// rows, err := dbPool.Query(ctx, SqlSchemaAll(schemaExclude), schemaExclude)
	rows, err := dbPool.Query(ctx, SqlSchemaAll(schemaExclude))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// fmt.Printf("DEBUG-rows=  %s\n", rows)
	var schemas []SchemaRow
	for rows.Next() {
		var schema SchemaRow
		err := rows.Scan(&schema.SchemaName)
		if err != nil {
			return nil, err
		}
		schemas = append(schemas, schema)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return schemas, nil
}

func WriteSchemas(dbPool *pgxpool.Pool, schemaExclude []string, path string) error {
	schemas, err := GetSchemas(dbPool, schemaExclude, path)

	println("DEBUG---------path=", path)
	if err != nil {
		return err
	}

	// fmt.Printf("DEBUG-1=  %s\n", schemas)

	for _, schema := range schemas {
		dir := filepath.Join(path, schema.SchemaName)
		if err := os.MkdirAll(dir, 0755); err != nil {
			return err
		}

		// Remove all contents of directory
		dirEntries, err := os.ReadDir(dir)
		if err != nil {
			return err
		}
		for _, entry := range dirEntries {
			if err := os.RemoveAll(filepath.Join(dir, entry.Name())); err != nil {
				return err
			}
		}

		// tables, err := WriteTables(dbPool, schema.SchemaName, dir)
		// if err != nil {
		// 	return err
		// }

		// fmt.Printf("DEBUG-GetTables=  %s\n", tables)

		WriteTables(dbPool, schema.SchemaName, dir)
	}
	return nil
}
