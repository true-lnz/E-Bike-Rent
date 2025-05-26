package app

import (
	"E-Bike-Rent/internal/config"
	"E-Bike-Rent/internal/context"
	"E-Bike-Rent/internal/database"
	"E-Bike-Rent/internal/routes"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func App(cfg *config.Config) error {
	db, err := database.GetConnection(cfg.Database)
	if err != nil {
		return fmt.Errorf("get database connection: %w", err)
	}

	ctx := context.InitServices(db, cfg)

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOriginsFunc: func(origin string) bool {
			allowedOrigins := map[string]bool{
				"http://localhost:5173": true,
				"http://localhost:8080": true,
			}
			return allowedOrigins[origin]
		},
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	}))

	routes.SetupRoutes(app, cfg, ctx)

	err = app.Listen(":" + cfg.Port)
	if err != nil {
		return fmt.Errorf("app listen: %w", err)
	}
	return nil
}
