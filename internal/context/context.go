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
	RentService        *services.RentService
}

func InitServices(db *gorm.DB, cfg *config.Config) *AppContext {
	userRepo := repositories.NewUserRepository(db)
	maintenanceRepo := repositories.NewMaintenanceRepo(db)
	rentRepo := repositories.NewRentRepository(db)
	bicycleRepo := repositories.NewBicycleRepo(db)
	companyRepo := repositories.NewCompanyRepository(db)
	accessoryRepo := repositories.NewAccessoryRepository(db)

	userService := services.NewUserService(userRepo)
	maintenanceService := services.NewMaintenanceService(maintenanceRepo, cfg)
	rentService := services.NewRentService(rentRepo, bicycleRepo, accessoryRepo)
	bicycleService := services.NewBicycleService(bicycleRepo, rentRepo)
	companyService := services.NewCompanyService(companyRepo)
	accessoryService := services.NewAccessoryService(accessoryRepo)

	return &AppContext{
		UserService:        userService,
		BicycleService:     bicycleService,
		MaintenanceService: maintenanceService,
		CompanyService:     companyService,
		AccessoryService:   accessoryService,
		RentService:        rentService,
	}
}
