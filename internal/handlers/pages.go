package handlers

import (
	"BicycleShop/internal/config"
	"BicycleShop/internal/context"
	"BicycleShop/internal/utils"
	"github.com/gofiber/fiber/v2"
)

func Render(c *fiber.Ctx, template string, data fiber.Map, cfg *config.Config) error {
	if data == nil {
		data = fiber.Map{}
	}

	tokenString := c.Cookies("token")
	_, err := utils.ParseAndValidateJWT(tokenString, cfg)

	data["isAuthenticated"] = err == nil

	return c.Render(template, data)
}

func IndexPage(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return Render(c, "index", fiber.Map{}, cfg)
	}
}

func AdminPage(cfg *config.Config, ctx *context.AppContext) fiber.Handler {
	return func(c *fiber.Ctx) error {

		return Render(c, "admin-panel", fiber.Map{}, cfg)
	}
}

func ProfilePage(cfg *config.Config, appContext *context.AppContext) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("userId").(uint)
		cartModuleData, err := appContext.CartService.LoadCartModuleData(c.Context(), userID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err})
		}

		user, err := appContext.UserService.GetUser(c.Context(), userID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err})
		}
		return Render(c, "profile", fiber.Map{
			"hasProcessingOrders": appContext.UserService.HasProcessingOrders(c.Context(), userID),
			"response":            cartModuleData,
			"userData":            user,
		}, cfg)
	}
}
