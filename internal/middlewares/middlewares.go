package middlewares

import (
	"E-Bike-Rent/internal/config"
	"E-Bike-Rent/internal/models"
	"E-Bike-Rent/internal/services"
	"E-Bike-Rent/internal/utils"
	"errors"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"strings"
)

func RequireAuth(cfg *config.Config, userService *services.UserService, onlyUserId bool) fiber.Handler {
	return func(c *fiber.Ctx) error {
		tokenString := c.Cookies("token")
		if tokenString == "" && !onlyUserId {
			return fiber.NewError(fiber.StatusUnauthorized, "Missing token")
		}
		tokenString = strings.TrimPrefix(tokenString, "Bearer ")

		userID, err := utils.ParseAndValidateJWT(tokenString, cfg)
		if err != nil && !onlyUserId {
			return fiber.NewError(fiber.StatusUnauthorized, "Invalid token")
		}
		if err == nil {
			user, err := userService.GetUser(c.Context(), userID)
			if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
				return fiber.NewError(fiber.StatusUnauthorized, "Missing token")
			}
			c.Locals("user", user)
		}
		return c.Next()
	}
}

func RequireAdmin() fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user").(*models.User)
		role := user.Role
		if role != "admin" {
			return c.Status(fiber.StatusMethodNotAllowed).JSON(fiber.Map{"message": "Нет прав"})
		}
		return c.Next()
	}
}
