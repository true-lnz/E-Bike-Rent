package handlers

import (
	"E-Bike-Rent/internal/models"
	"E-Bike-Rent/internal/services"
	"E-Bike-Rent/internal/utils"
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

func DeleteAccessory(accessoryService *services.AccessoryService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		accessoryID := utils.ParseUint(c.Params("id"))
		err := accessoryService.Delete(c.Context(), accessoryID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.SendStatus(fiber.StatusNoContent)
	}
}

func UpdateAccessory(accessoryService *services.AccessoryService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req models.Accessory
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}
		accessoryID := utils.ParseUint(c.Params("id"))
		req.ID = accessoryID
		updated, err := accessoryService.Update(c.Context(), &req)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.JSON(updated)
	}
}

func CreateAccessory(accessoryService *services.AccessoryService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req models.Accessory
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}
		created, err := accessoryService.Create(c.Context(), &req)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.JSON(created)
	}
}
