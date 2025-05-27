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
	CompanyService     *services.CompanyService
	AccessoryService   *services.AccessoryService
}

func InitServices(db *gorm.DB, cfg *config.Config) *AppContext {
	userRepo := repositories.NewUserRepository(db)
	userService := services.NewUserService(userRepo)

	rentRepo := repositories.NewRentRepository(db)

	bicycleRepo := repositories.NewBicycleRepo(db)
	bicycleService := services.NewBicycleService(bicycleRepo, rentRepo)

	maintenanceRepo := repositories.NewMaintenanceRepo(db)
	maintenanceService := services.NewMaintenanceService(maintenanceRepo, cfg)

	companyRepo := repositories.NewCompanyRepository(db)
	companyService := services.NewCompanyService(companyRepo)

	accessoryRepo := repositories.NewAccessoryRepository(db)
	accessoryService := services.NewAccessoryService(accessoryRepo)

	return &AppContext{
		UserService:        userService,
		BicycleService:     bicycleService,
		MaintenanceService: maintenanceService,
		CompanyService:     companyService,
		AccessoryService:   accessoryService,
	}
}
