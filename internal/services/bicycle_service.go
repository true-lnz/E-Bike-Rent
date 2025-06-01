package services

import (
	"E-Bike-Rent/internal/dto"
	"E-Bike-Rent/internal/models"
	"E-Bike-Rent/internal/repositories"
	"context"
	"fmt"
)

type BicycleService struct {
	repo     repositories.BicycleRepo
	rentRepo repositories.RentRepository
}

func NewBicycleService(repo repositories.BicycleRepo, rentRepo repositories.RentRepository) *BicycleService {
	return &BicycleService{repo: repo, rentRepo: rentRepo}
}

func (s *BicycleService) GetAll(c context.Context) (*dto.BicyclesResponse, error) {
	bicycles, err := s.repo.GetAll(c)

	if err != nil {
		return nil, fmt.Errorf("не удалось получить велосипеды: %w", err)
	}

	result := make([]dto.BicycleItem, len(bicycles))
	for i, bicycle := range bicycles {
		rentCount, err := s.rentRepo.CountInRent(c, bicycle.ID)
		if err != nil {
			return nil, fmt.Errorf("не удалось посчитать: %w", err)
		}
		result[i] = dto.BicycleItem{
			Bicycle:           bicycle,
			AvailableQuantity: bicycle.Quantity - rentCount,
		}
	}

	return &dto.BicyclesResponse{
		Items: result,
		Total: len(result),
	}, nil
}

func (s *BicycleService) GetInformation(c context.Context, id uint) (*dto.BicycleItem, error) {
	bicycle, err := s.repo.GetByID(c, id)
	if err != nil {
		return nil, fmt.Errorf("ошибка при получении: %w", err)
	}

	rentCount, err := s.rentRepo.CountInRent(c, id)
	if err != nil {
		return nil, fmt.Errorf("не удалось посчитать: %w", err)
	}
	result := dto.BicycleItem{
		Bicycle:           *bicycle,
		AvailableQuantity: bicycle.Quantity - rentCount,
	}

	return &result, nil
}

func (s *BicycleService) Create(c context.Context, data *models.Bicycle) (*models.Bicycle, error) {
	return s.repo.Create(c, data)
}

func (s *BicycleService) Update(c context.Context, data *models.Bicycle) (*models.Bicycle, error) {
	return s.repo.Update(c, data)
}

func (s *BicycleService) Delete(c context.Context, id uint) error {
	return s.repo.Delete(c, id)
}
