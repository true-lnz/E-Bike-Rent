package handlers

import (
	"E-Bike-Rent/internal/dto"
	"E-Bike-Rent/internal/models"
	"E-Bike-Rent/internal/services"
	"E-Bike-Rent/internal/utils"
	"fmt"
	"github.com/gofiber/fiber/v2"
)

func RentBicycle(rentService *services.RentService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user").(*models.User).ID
		var req dto.CreateRentRequest
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Неверный формат данных")
		}
		rent, err := rentService.CreateRent(c.Context(), req, userID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"rent": rent})
	}
}

func GetUsersRents(rentService *services.RentService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("user").(*models.User).ID
		rents, err := rentService.GetUsersRents(c.Context(), userID)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Что-то не так при получении записей")
		}
		return c.JSON(fiber.Map{"rents": rents})
	}
}

func GetAllRents(rentService *services.RentService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		rents, err := rentService.GetAll(c.Context())
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Что-то не так при получении записей")
		}
		return c.JSON(fiber.Map{"rents": rents})
	}
}

func UpdateRent(rentService *services.RentService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		rentID := utils.ParseUint(c.Params("id"))
		var req dto.UpdateRentRequest
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, fmt.Sprintf("Неверный формат данных: %s", err.Error()))
		}
		rent, err := rentService.UpdateRent(c.Context(), req, rentID)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, fmt.Sprintf("Ошибка при обновлении данных: %s", err.Error()))
		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"rent": rent})
	}
}
