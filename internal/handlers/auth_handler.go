package handlers

import (
	"E-Bike-Rent/internal/config"
	"E-Bike-Rent/internal/dto"
	"E-Bike-Rent/internal/models"
	"E-Bike-Rent/internal/services"
	"E-Bike-Rent/internal/utils"
	"errors"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"time"
)

func SendVerificationCode(us *services.UserService, cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req dto.SendVerificationCodeRequest
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Неверный формат запроса")
		}

		_, err := us.GetUserByEmail(c.Context(), req.Email)
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusConflict, "Ошибка при получении пользователя")
		}

		code := utils.GenerateCode()

		if err = services.SendVerificationCode(req.Email, code, cfg); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Не удалось отправить код: " + err.Error()})
		}

		if err = us.SetVerificationCode(c.Context(), req.Email, code); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Не удалось сохранить код: " + err.Error()})
		}

		return c.SendStatus(fiber.StatusOK)
	}
}

func VerifyCode(us *services.UserService, cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req dto.VerifyCodeRequest
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Неверный формат данных")
		}

		user, err := us.GetUserByEmail(c.Context(), req.Email)

		if err != nil && errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusBadRequest, "Пользователя с таким email нет")
		}

		ok, err := us.CheckVerificationCode(c.Context(), req.Email, req.Code)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "Ошибка при проверке кода")
		}
		if !ok {
			return fiber.NewError(fiber.StatusUnauthorized, "Неверный код")
		}
		if user.IsVerified {
			utils.SetCookie(c, user, cfg)
		}
		return c.JSON(fiber.Map{"message": "Успешная авторизация", "is_verified": user.IsVerified, "role": user.Role})
	}
}

func Logout() fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Cookie(&fiber.Cookie{
			Name:     "token",
			Value:    "",
			Expires:  time.Now().Add(-time.Hour), // Ставим просроченное время
			HTTPOnly: true,
			Secure:   false,
			SameSite: "Strict",
		})
		return c.JSON(fiber.Map{"message": "Вы успешно вышли из аккаунта"})
	}
}

func CompleteRegistration(us *services.UserService, cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req dto.CompleteRegistrationRequest
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Неверный формат данных: "+err.Error())
		}
		user, err := us.CompleteRegistration(c.Context(), req)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "Ошибка при сохранении данных: "+err.Error())
		}
		utils.SetCookie(c, user, cfg)
		return c.SendStatus(fiber.StatusCreated)
	}
}

func GetUser() fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"user": c.Locals("user").(*models.User)})
	}
}
