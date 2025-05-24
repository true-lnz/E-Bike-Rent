package context

import (
	"E-Bike-Rent/internal/repositories"
	"E-Bike-Rent/internal/services"
	"gorm.io/gorm"
)

type AppContext struct {
	UserService *services.UserService
}

func InitServices(db *gorm.DB) *AppContext {
	userRepo := repositories.NewUserRepository(db)
	userService := services.NewUserService(userRepo)

	return &AppContext{
		UserService: userService,
	}
}
