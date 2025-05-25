package services

import (
	"E-Bike-Rent/internal/repositories"
)

type MaintenanceService struct {
	repo repositories.MaintenanceRepo
}

func NewMaintenanceService(repo repositories.MaintenanceRepo) *MaintenanceService {
	return &MaintenanceService{repo: repo}
}
