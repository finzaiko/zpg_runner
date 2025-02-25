package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"test_two/core"

	"github.com/jackc/pgx/v4/pgxpool"
)

type Config struct {
	Name           string   `json:"name"`
	Path           string   `json:"path"`
	Host           string   `json:"host"`
	Port           int      `json:"port"`
	Database       string   `json:"database"`
	User           string   `json:"user"`
	Password       string   `json:"password"`
	SchemaExclude  []string `json:"schema_exclude"`
	GitAccessToken string   `json:"git_access_token"`
}

func main() {
	file, err := os.Open("zpgr_config.json")
	if err != nil {
		log.Fatalf("Failed to open config file: %v", err)
	}
	defer file.Close()

	byteValue, err := io.ReadAll(file)
	if err != nil {
		log.Fatalf("Failed to read config file: %v", err)
	}

	var configs []Config
	if err := json.Unmarshal(byteValue, &configs); err != nil {
		log.Fatalf("Failed to unmarshal config file: %v", err)
	}

	for _, config := range configs {
		connStr := fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=disable",
			config.User,
			config.Password,
			config.Host,
			config.Port,
			config.Database,
		)

		dbPool, err := pgxpool.Connect(context.Background(), connStr)
		if err != nil {
			log.Fatalf("Unable to connect to database: %v", err)
		}
		defer dbPool.Close()

		err = core.WriteSchemas(dbPool, config.SchemaExclude, config.Path)
		if err != nil {
			log.Fatalf("Failed to write schemas: %v", err)
		}
	}
}
