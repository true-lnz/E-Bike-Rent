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

	authGroup := api.Group("/auth")
	authGroup.Post("/logout", requireAuth, handlers.Logout())
	authGroup.Post("/send-code", handlers.SendVerificationCode(ctx.UserService, cfg))
	authGroup.Post("/verify-code", handlers.VerifyCode(ctx.UserService, cfg))
	authGroup.Post("/complete-registration", handlers.CompleteRegistration(ctx.UserService, cfg))
	authGroup.Get("/me", requireAuth, handlers.GetUser())

	//app.Patch("/api/auth/profile", requireAuth, handlers.ChangeCredentials(ctx.UserService))
	//app.Patch("/api/auth/change-password", middlewares.RequireAuth(cfg, false), handlers.ChangePassword(ctx.UserService))
	//app.Patch("/api/auth/change-credentials", middlewares.RequireAuth(cfg, false), handlers.ChangeCredentials(ctx.UserService))
	//app.Delete("/api/auth/delete-account", middlewares.RequireAuth(cfg, false), handlers.DeleteAccount(ctx.UserService))

	companyGroup := api.Group("/company")
	companyGroup.Get("/", handlers.GetAllCompanies(ctx.CompanyService))

	accessoryGroup := api.Group("/accessory").Use(requireUser)
	accessoryGroup.Get("/", handlers.GetAllAccessories(ctx.AccessoryService))

	bicyclesGroup := api.Group("/bicycle").Use(requireUser)
	bicyclesGroup.Get("/", handlers.GetAllBicycles(ctx.BicycleService))
	bicyclesGroup.Get("/:id", handlers.GetBicycleInformation(ctx.BicycleService))

	adminBicycleGroup := admin.Group("/bicycle")
	adminBicycleGroup.Post("/", handlers.CreateBicycle(ctx.BicycleService))
	adminBicycleGroup.Put("/:id", handlers.UpdateBicycle(ctx.BicycleService))
	adminBicycleGroup.Delete("/:id", handlers.DeleteBicycle(ctx.BicycleService))

	maintenanceGroup := api.Group("/maintenance").Use(requireAuth)
	maintenanceGroup.Post("/", handlers.CreateMaintenance(ctx.MaintenanceService))
	maintenanceGroup.Get("/:id", handlers.GetUsersMaintenanceInfo(ctx.MaintenanceService))
	maintenanceGroup.Get("/", handlers.GetUsersMaintenances(ctx.MaintenanceService))

	adminMaintenanceGroup := admin.Group("/maintenance")
	adminMaintenanceGroup.Put("/:id", handlers.UpdateMaintenance(ctx.MaintenanceService))
	adminMaintenanceGroup.Get("/", handlers.GetAllMaintenances(ctx.MaintenanceService))

	app.Static("/", "./web/dist")
	app.Get("*", func(c *fiber.Ctx) error {
		return c.SendFile("./web/dist/index.html")
	})

}
