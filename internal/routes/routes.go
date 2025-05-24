package routes

import (
	"E-Bike-Rent/internal/config"
	"E-Bike-Rent/internal/context"
	"E-Bike-Rent/internal/handlers"
	"E-Bike-Rent/internal/middlewares"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, cfg *config.Config, ctx *context.AppContext) {
	app.Use(func(c *fiber.Ctx) error {
		c.Set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
		c.Set("Pragma", "no-cache")
		c.Set("Expires", "0")
		return c.Next()
	})

	//Роуты для апи
	app.Post("/api/auth/login", handlers.Login(ctx.UserService, cfg))
	app.Post("/api/auth/register", handlers.Registration(ctx.UserService, cfg))
	app.Get("/api/auth/logout", middlewares.RequireAuth(cfg, false), handlers.Logout())
	app.Patch("/api/auth/profile", middlewares.RequireAuth(cfg, false), handlers.ChangeCredentials(ctx.UserService))
	app.Patch("/api/auth/change-password", middlewares.RequireAuth(cfg, false), handlers.ChangePassword(ctx.UserService))
	app.Patch("/api/auth/change-credentials", middlewares.RequireAuth(cfg, false), handlers.ChangeCredentials(ctx.UserService))
	app.Delete("/api/auth/delete-account", middlewares.RequireAuth(cfg, false), handlers.DeleteAccount(ctx.UserService))

	//app.Get("/admin", middlewares.RequireAuth(cfg, false), middlewares.RequireAdmin(ctx.UserService), handlers.AdminPage(cfg, ctx))
	//
	//app.Get("/articles/:id", handlers.ArticlePage(cfg, ctx))
	//
	//app.Get("/cart", middlewares.RequireAuth(cfg, false), handlers.CartPage(cfg, ctx))
	//app.Get("/catalog", handlers.CatalogPage(cfg, ctx))
	//app.Get("/contact", handlers.ContactPage(cfg))
	//app.Get("/products/:id", middlewares.RequireAuth(cfg, true), handlers.ProductPage(cfg, ctx))
	//app.Get("/profile", middlewares.RequireAuth(cfg, false), handlers.ProfilePage(cfg, ctx))
	//app.Get("/blog", middlewares.RequireAuth(cfg, true), handlers.BlogPage(cfg, ctx))
}
