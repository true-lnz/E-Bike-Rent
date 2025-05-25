package services

import "E-Bike-Rent/internal/repositories"

type BicycleService struct {
	repo repositories.BicycleRepo
}

func NewBicycleService(repo repositories.BicycleRepo) *BicycleService {
	return &BicycleService{repo: repo}
}
