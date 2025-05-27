package handlers

import (
	"E-Bike-Rent/internal/models"
	"E-Bike-Rent/internal/services"
	"E-Bike-Rent/internal/utils"
	"github.com/gofiber/fiber/v2"
)

func GetAllBicycles(bicycleService *services.BicycleService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		all, err := bicycleService.GetAll(c.Context())

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(all)
	}
}

func GetBicycleInformation(bicycleService *services.BicycleService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		bicycleID := utils.ParseUint(c.Params("id"))
		information, err := bicycleService.GetInformation(c.Context(), bicycleID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(information)
	}
}

func CreateBicycle(bicycleService *services.BicycleService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req models.Bicycle
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}
		created, err := bicycleService.Create(c.Context(), &req)
		if err != nil {
			return err
		}
		return c.JSON(created)
	}
}

func UpdateBicycle(bicycleService *services.BicycleService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req models.Bicycle
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}

		req.ID = utils.ParseUint(c.Params("id"))
		updated, err := bicycleService.Update(c.Context(), &req)
		if err != nil {
			return err
		}
		return c.JSON(updated)
	}
}

func DeleteBicycle(bicycleService *services.BicycleService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		bicycleID := utils.ParseUint(c.Params("id"))
		err := bicycleService.Delete(c.Context(), bicycleID)
		if err != nil {
			return err
		}
		return c.SendStatus(fiber.StatusNoContent)
	}
}
