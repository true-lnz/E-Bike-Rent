package handlers

import (
	"E-Bike-Rent/internal/dto"
	"E-Bike-Rent/internal/models"
	"E-Bike-Rent/internal/services"
	"E-Bike-Rent/internal/utils"
	"github.com/gofiber/fiber/v2"
)

func CreateMaintenance(maintenanceService *services.MaintenanceService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req dto.CreateMaintenanceRequest
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Неверный формат данных")
		}
		user := c.Locals("user").(*models.User)
		maintenance, err := maintenanceService.CreateMaintenance(c.Context(), req, user.ID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"maintenance": maintenance})
	}
}

func GetUsersMaintenanceInfo(maintenanceService *services.MaintenanceService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		maintenanceID := utils.ParseUint(c.Params("id"))
		maintenance, err := maintenanceService.GetMaintenance(c.Context(), maintenanceID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"maintenance": maintenance})
	}
}

func GetUsersMaintenances(maintenanceService *services.MaintenanceService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user").(*models.User).ID
		maintenances, err := maintenanceService.GetUsersMaintenances(c.Context(), userID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"maintenances": maintenances})
	}
}

func UpdateMaintenance(maintenanceService *services.MaintenanceService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req dto.UpdateMaintenanceRequest
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Неверный формат данных")
		}
		maintenanceID := utils.ParseUint(c.Params("id"))
		maintenance, err := maintenanceService.UpdateMaintenance(c.Context(), &req, maintenanceID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"maintenance": maintenance})
	}
}

func GetAllMaintenances(maintenanceService *services.MaintenanceService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		maintenances, err := maintenanceService.GetAllMaintenances(c.Context())
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"maintenances": maintenances})
	}
}
