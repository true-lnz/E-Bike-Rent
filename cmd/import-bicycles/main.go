package main

import (
	"E-Bike-Rent/internal/config"
	"E-Bike-Rent/internal/database"
	"E-Bike-Rent/internal/database/scripts"
	"log"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Не удалось загрузить конфиг: %v", err)
	}
	db, err := database.GetConnection(cfg.Database)
	if err != nil {
		log.Fatal(err)
	}

	if err := scripts.ImportBicycles(db); err != nil {
		log.Fatal(err)
	}
}
