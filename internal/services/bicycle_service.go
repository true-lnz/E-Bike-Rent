package services

import (
	"E-Bike-Rent/internal/models"
	"E-Bike-Rent/internal/repositories"
	"context"
)

type BicycleService struct {
	repo repositories.BicycleRepo
}

func NewBicycleService(repo repositories.BicycleRepo) *BicycleService {
	return &BicycleService{repo: repo}
}

func (s BicycleService) GetAll(c context.Context) ([]models.Bicycle, error) {
	return s.repo.GetAll(c)
}

func (s BicycleService) GetInformation(c context.Context, id uint) (*models.Bicycle, error) {
	return s.repo.GetByID(c, id)
}

func (s BicycleService) Create(c context.Context, data *models.Bicycle) (*models.Bicycle, error) {
	return s.repo.Create(c, data)
}

func (s BicycleService) Update(c context.Context, data *models.Bicycle) (*models.Bicycle, error) {
	return s.repo.Update(c, data)
}

func (s BicycleService) Delete(c context.Context, id uint) error {
	return s.repo.Delete(c, id)
}
