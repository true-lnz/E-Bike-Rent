package app

import (
	"E-Bike-Rent/internal/config"
	"E-Bike-Rent/internal/context"
	"E-Bike-Rent/internal/database"
	"E-Bike-Rent/internal/routes"
	"fmt"
	"github.com/gofiber/fiber/v2"
)

func App(cfg *config.Config) error {
	db, err := database.GetConnection(cfg.Database)
	if err != nil {
		return fmt.Errorf("get database connection: %w", err)
	}

	ctx := context.InitServices(db)

	app := fiber.New()

	app.Static("/", "./web/dist")
	app.Get("*", func(c *fiber.Ctx) error {
		return c.SendFile("./web/dist/index.html")
	})

	routes.SetupRoutes(app, cfg, ctx)
	err = app.Listen(":" + cfg.Port)
	if err != nil {
		return fmt.Errorf("app listen: %w", err)
	}
	return nil
}
