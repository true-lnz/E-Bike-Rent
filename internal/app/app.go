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

	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError

			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}

			switch code {
			case fiber.StatusUnauthorized:
				return c.Status(code).Render("errors/401", fiber.Map{})
			case fiber.StatusNotFound:
				return c.Status(code).Render("errors/404", fiber.Map{})
			case fiber.StatusNotAcceptable:
				return c.Status(code).Render("errors/406", fiber.Map{})
			default:
				fmt.Println(err)
				return c.Status(code).Render("errors/500", fiber.Map{
					"error": err.Error(),
				})
			}
		},
	})

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
