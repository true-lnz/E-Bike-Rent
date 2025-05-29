package services

import (
	"E-Bike-Rent/internal/dto"
	"E-Bike-Rent/internal/models"
	"E-Bike-Rent/internal/repositories"
	"E-Bike-Rent/internal/utils"
	"context"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"os"
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

func (s *AccessoryService) Delete(c context.Context, accessoryID uint) error {
	return s.repo.Delete(c, accessoryID)
}

func (s *AccessoryService) Create(c context.Context, accessory *models.Accessory) (*models.Accessory, error) {
	return s.repo.Create(c, accessory)
}
func (s *AccessoryService) Update(ctx *fiber.Ctx, request *dto.CreateUpdateAccessoryRequest, accessoryID uint) (*models.Accessory, error) {
	existing, err := s.repo.GetByID(ctx.Context(), accessoryID)
	if err != nil {
		return nil, fmt.Errorf("аксессуар не найден: %w", err)
	}

	file, err := ctx.FormFile("image")
	var filename string

	if err == nil && file != nil {
		if existing.ImageURL != "" {
			_ = os.Remove("./public/uploads/" + existing.ImageURL)
		}

		filename, err = utils.SaveImage(ctx, file)
		if err != nil {
			return nil, fmt.Errorf("ошибка при сохранении изображения: %w", err)
		}
	} else {
		filename = existing.ImageURL
	}

	newAccessory := &models.Accessory{
		ID:       accessoryID,
		ImageURL: filename,
	}
	if request.Name != nil {
		newAccessory.Name = *request.Name
	}
	if request.Quantity != nil {
		newAccessory.Quantity = *request.Quantity
	}
	if request.Price != nil {
		newAccessory.Price = *request.Price
	}

	updated, err := s.repo.Update(ctx.Context(), newAccessory)
	if err != nil {
		if updated.ImageURL != "" {
			_ = os.Remove("./public/uploads/" + existing.ImageURL)
		}
		return nil, fmt.Errorf("ошибка сохранении записи: %w", err)
	}

	return updated, nil
}
