package context

import (
	"E-Bike-Rent/internal/config"
	"E-Bike-Rent/internal/repositories"
	"E-Bike-Rent/internal/services"
	"gorm.io/gorm"
)

type AppContext struct {
	UserService        *services.UserService
	BicycleService     *services.BicycleService
	MaintenanceService *services.MaintenanceService
}

func InitServices(db *gorm.DB, cfg *config.Config) *AppContext {
	userRepo := repositories.NewUserRepository(db)
	userService := services.NewUserService(userRepo)

	bicycleRepo := repositories.NewBicycleRepo(db)
	bicycleService := services.NewBicycleService(bicycleRepo)

	maintenanceRepo := repositories.NewMaintenanceRepo(db)
	maintenanceService := services.NewMaintenanceService(maintenanceRepo, cfg)

	return &AppContext{
		UserService:        userService,
		BicycleService:     bicycleService,
		MaintenanceService: maintenanceService,
	}
}
