package handlers

import (
	"E-Bike-Rent/internal/config"
	"E-Bike-Rent/internal/dto"
	"E-Bike-Rent/internal/services"
	"E-Bike-Rent/internal/utils"
	"github.com/gofiber/fiber/v2"
	"time"
)

func SendRegistrationVerificationCode(us *services.UserService, cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req struct {
			Email string `json:"email"`
		}
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Неверный формат запроса")
		}

		user, err := us.GetUserByEmail(c.Context(), req.Email)
		if err == nil && user.IsVerified {
			return fiber.NewError(fiber.StatusConflict, "Пользователь с таким email уже существует")
		}

		// Генерация и отправка кода
		code := utils.GenerateCode()

		if err = services.SendVerificationCode(req.Email, code, cfg); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Не удалось отправить код"})
		}

		// Установка или обновление кода (в том числе создание пользователя, если нужно)
		if err = us.SetVerificationCode(c.Context(), req.Email, code); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Не удалось сохранить код"})
		}

		return c.SendStatus(fiber.StatusOK)
	}
}

func SendLoginVerificationCode(us *services.UserService, cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req struct {
			Email string `json:"email"`
		}
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Неверный формат запроса")
		}

		user, err := us.GetUserByEmail(c.Context(), req.Email)
		if err != nil {
			return fiber.NewError(fiber.StatusNotFound, "Пользователь с такой почтой не найден")
		}
		if !user.IsVerified {
			return fiber.NewError(fiber.StatusConflict, "Почта не подтверждена")
		}

		// Генерация и отправка кода
		code := utils.GenerateCode()

		if err = services.SendVerificationCode(req.Email, code, cfg); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Не удалось отправить код"})
		}

		// Установка или обновление кода (в том числе создание пользователя, если нужно)
		if err = us.SetVerificationCode(c.Context(), req.Email, code); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Не удалось сохранить код"})
		}

		return c.SendStatus(fiber.StatusOK)
	}
}

func VerifyLoginCode(us *services.UserService, cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req struct {
			Email string `json:"email"`
			Code  string `json:"code"`
		}
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Неверный формат данных")
		}

		user, err := us.GetUserByEmail(c.Context(), req.Email)

		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Пользователя с таким email нет")
		}

		ok, err := us.CheckVerificationCode(c.Context(), req.Email, req.Code)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "Ошибка при проверке кода")
		}
		if !ok {
			return fiber.NewError(fiber.StatusUnauthorized, "Неверный код")
		}

		utils.SetCookie(c, user, cfg)
		return c.JSON(fiber.Map{"message": "Успешная авторизация"})
	}
}

func Logout() fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Cookie(&fiber.Cookie{
			Name:     "token",
			Value:    "",
			Expires:  time.Now().Add(-time.Hour), // Ставим просроченное время
			HTTPOnly: true,
			Secure:   true,
			SameSite: "Strict",
		})
		return c.JSON(fiber.Map{"message": "Вы успешно вышли из аккаунта"})
	}
}

func VerifyRegistrationCode(us *services.UserService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req struct {
			Email string `json:"email"`
			Code  string `json:"code"`
		}
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Неверный формат данных")
		}

		user, err := us.GetUserByEmail(c.Context(), req.Email)

		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Пользователя с таким email нет")
		}
		if user.IsVerified {
			return fiber.NewError(fiber.StatusConflict, "Пользователь уже верифицирован")
		}

		ok, err := us.CheckVerificationCode(c.Context(), req.Email, req.Code)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "Ошибка при проверке кода")
		}
		if !ok {
			return fiber.NewError(fiber.StatusUnauthorized, "Неверный код")
		}

		return c.JSON(fiber.Map{"message": "Код совпадает"})
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
			return fiber.NewError(fiber.StatusInternalServerError, "Ошибка при сохранении данных")
		}
		utils.SetCookie(c, user, cfg)
		return c.SendStatus(fiber.StatusCreated)
	}
}

func DeleteAccount(userService *services.UserService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("userId").(uint)

		if err := userService.DeleteUser(c.Context(), userID); err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "Внутренняя ошибка сервера")
		}

		c.Cookie(&fiber.Cookie{
			Name:     "token",
			Value:    "",
			Expires:  time.Now().Add(-time.Hour),
			HTTPOnly: true,
			Secure:   true,
			SameSite: "Strict",
		})
		return c.JSON(fiber.Map{"message": "Аккаунт успешно удален"})
	}
}

func ChangeCredentials(userService *services.UserService) fiber.Handler {
	return func(c *fiber.Ctx) error {

		var body dto.ChangeCredentialsRequest
		if err := c.BodyParser(&body); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Некорректный формат запроса")
		}

		if body.NewPhoneNumber == "" || body.NewLastName == "" || body.NewEmail == "" || body.NewFirstName == "" {
			return fiber.NewError(fiber.StatusBadRequest, "Обязательное поле пустое")
		}

		userID := c.Locals("userId").(uint)

		if err := userService.ChangeCredentials(c.Context(), userID, &body); err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "Не удалось обновить данные")
		}

		return c.JSON(fiber.Map{"message": "номер телефона успешно изменен"})
	}
}
