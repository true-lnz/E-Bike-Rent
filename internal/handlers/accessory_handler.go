package handlers

import (
	"E-Bike-Rent/internal/dto"
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
		accessoryID := utils.ParseUint(c.Params("id"))
		var req dto.CreateUpdateAccessoryRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}
		updated, err := accessoryService.Update(c, &req, accessoryID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"accessory": updated})

	}
}

func CreateAccessory(accessoryService *services.AccessoryService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req dto.CreateUpdateAccessoryRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}

		newAccessory := &models.Accessory{}
		if req.Name != nil {
			newAccessory.Name = *req.Name
		}
		if req.Quantity != nil {
			newAccessory.Quantity = *req.Quantity
		}
		if req.Price != nil {
			newAccessory.Price = *req.Price
		}
		created, err := accessoryService.Create(c, newAccessory)

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.JSON(created)
	}
}
