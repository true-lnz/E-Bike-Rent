package services

import (
	"E-Bike-Rent/internal/dto"
	"E-Bike-Rent/internal/repositories"
	"context"
	"fmt"
)

type AccessoryService struct {
	repo     repositories.AccessoryRepository
	rentRepo repositories.RentRepository
}

func NewAccessoryService(repo repositories.AccessoryRepository) *AccessoryService {
	return &AccessoryService{repo: repo}
}

func (s *AccessoryService) GetAll(c context.Context) (*dto.AccessoryResponse, error) {
	accessories, err := s.repo.GetAll(c)

	if err != nil {
		return nil, fmt.Errorf("не удалось получить велосипеды: %w", err)
	}

	result := make([]dto.AccessoryItem, len(accessories))
	for i, accessory := range accessories {
		rentCount, err := s.repo.CountInRent(c, accessory.ID)
		if err != nil {
			return nil, fmt.Errorf("не удалось посчитать: %w", err)
		}
		result[i] = dto.AccessoryItem{
			Accessory:         accessory,
			AvailableQuantity: accessory.Quantity - rentCount,
		}
	}

	return &dto.AccessoryResponse{
		Items: result,
		Total: len(result),
	}, nil
}
