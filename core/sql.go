package core

import (
	"fmt"
	"strings"
)

func SqlSchemaAll(excluded []string) string {
	var exl string
	// fmt.Printf("DEBUG-excluded=  %s\n", excluded)
	// fmt.Printf("DEBUG-excluded-length=  %d\n", len(excluded))
	if len(excluded) > 0 {
		exl = " and nspname like any(array['" + strings.Join(excluded, "','") + "']) is not true"
	}
	fmt.Printf("DEBUG-exl=  %s\n", exl)
	sql := `select nspname as schema_name from pg_catalog.pg_namespace
			where nspname not in ('information_schema') and nspname not like 'pg\_%'` + exl + `
			order by nspname`

	// fmt.Printf("DEBUG-sql=  %s\n", sql)
	return sql
}
