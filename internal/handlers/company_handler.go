package handlers

import (
	"E-Bike-Rent/internal/services"
	"github.com/gofiber/fiber/v2"
)

func GetAllCompanies(companyService *services.CompanyService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		all, err := companyService.GetAll(c.Context())
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"companies": all})
	}
}
