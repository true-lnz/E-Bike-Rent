package main

import (
	"E-Bike-Rent/internal/app"
	"E-Bike-Rent/internal/config"
	"log"
)

func main() {

	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("get config: %v", err)
	}

	err = app.App(cfg)
	if err != nil {
		log.Fatalf("load app: %v", err)
	}
}
