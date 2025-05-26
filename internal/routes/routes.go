package routes

import (
	"E-Bike-Rent/internal/config"
	"E-Bike-Rent/internal/context"
	"E-Bike-Rent/internal/handlers"
	"E-Bike-Rent/internal/middlewares"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, cfg *config.Config, ctx *context.AppContext) {
	app.Static("/uploads", "./public/uploads")

	app.Use(func(c *fiber.Ctx) error {
		c.Set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
		c.Set("Pragma", "no-cache")
		c.Set("Expires", "0")
		return c.Next()
	})

	requireAuth := func() fiber.Handler {
		return middlewares.RequireAuth(cfg, ctx.UserService, false)
	}()
	requireUser := func() fiber.Handler {
		return middlewares.RequireAuth(cfg, ctx.UserService, true)
	}()

	//Роуты для апи
	api := app.Group("/api")
	admin := api.Group("/admin")
	admin.Use(requireAuth, middlewares.RequireAdmin())

	auth := api.Group("/auth")
	auth.Get("/logout", requireAuth, handlers.Logout())
	auth.Post("/send-code", handlers.SendVerificationCode(ctx.UserService, cfg))
	auth.Post("/verify-code", handlers.VerifyCode(ctx.UserService, cfg))
	auth.Post("/complete-registration", handlers.CompleteRegistration(ctx.UserService, cfg))

	//app.Patch("/api/auth/profile", requireAuth, handlers.ChangeCredentials(ctx.UserService))
	//app.Patch("/api/auth/change-password", middlewares.RequireAuth(cfg, false), handlers.ChangePassword(ctx.UserService))
	//app.Patch("/api/auth/change-credentials", middlewares.RequireAuth(cfg, false), handlers.ChangeCredentials(ctx.UserService))
	//app.Delete("/api/auth/delete-account", middlewares.RequireAuth(cfg, false), handlers.DeleteAccount(ctx.UserService))

	bicyclesGroup := api.Group("/bicycle")
	bicyclesGroup.Get("/", requireUser, handlers.GetAllBicycles(ctx.BicycleService))
	bicyclesGroup.Get("/:id", requireUser, handlers.GetBicycleInformation(ctx.BicycleService))

	adminBicycleGroup := admin.Group("/bicycle")
	adminBicycleGroup.Post("/", handlers.CreateBicycle(ctx.BicycleService))
	adminBicycleGroup.Put("/:id", handlers.UpdateBicycle(ctx.BicycleService))
	adminBicycleGroup.Delete("/:id", handlers.DeleteBicycle(ctx.BicycleService))

	app.Static("/", "./web/dist")
	app.Get("*", func(c *fiber.Ctx) error {
		return c.SendFile("./web/dist/index.html")
	})

}
