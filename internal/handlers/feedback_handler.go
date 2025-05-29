package handlers

import (
	"E-Bike-Rent/internal/config"
	"E-Bike-Rent/internal/dto"
	"E-Bike-Rent/internal/services"
	"github.com/gofiber/fiber/v2"
	"log"
)

func SendFeedback(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var input dto.FeedbackRequest
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
		}
		go func() {
			err := services.SendFeedbackLetter(input, cfg)
			if err != nil {
				log.Println("Ошибка отправки письма:", err)
			}
		}()

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Сообщение отправлено",
		})
	}
}
