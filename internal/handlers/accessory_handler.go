package handlers

import (
	"E-Bike-Rent/internal/services"
	"github.com/gofiber/fiber/v2"
)

func GetAllAccessories(accessoryService *services.AccessoryService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		all, err := accessoryService.GetAll(c.Context())

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(all)
	}
}
