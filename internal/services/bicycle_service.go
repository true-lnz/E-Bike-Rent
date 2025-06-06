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

func (s *BicycleService) Create(ctx *fiber.Ctx, data *models.Bicycle) (*models.Bicycle, error) {
	file, err := ctx.FormFile("image")
	var filename string
	if err == nil && file != nil {
		filename, err = utils.SaveImage(ctx, file)
		if err != nil {
			return nil, err
		}
	}
	data.ImageURL = filename

	return s.repo.Create(ctx.Context(), data)
}

func (s *BicycleService) Update(ctx *fiber.Ctx, req *dto.UpdateBicycleRequest, id uint) (*models.Bicycle, error) {
	// Получаем существующую запись
	bicycle, err := s.repo.GetByID(ctx.Context(), id)
	if err != nil {
		return nil, err
	}

	// Обновляем только непустые поля
	if req.Name != nil {
		bicycle.Name = *req.Name
	}
	if req.Weight != nil {
		bicycle.Weight = *req.Weight
	}
	if req.MaxSpeed != nil {
		bicycle.MaxSpeed = *req.MaxSpeed
	}
	if req.MaxRange != nil {
		bicycle.MaxRange = *req.MaxRange
	}
	if req.MaxLoad != nil {
		bicycle.MaxLoad = *req.MaxLoad
	}
	if req.Power != nil {
		bicycle.Power = *req.Power
	}
	if req.ChargeTimeHours != nil {
		bicycle.ChargeTimeHours = *req.ChargeTimeHours
	}
	if req.Battery != nil {
		bicycle.Battery = *req.Battery
	}
	if req.Suspension != nil {
		bicycle.Suspension = *req.Suspension
	}
	if req.Brakes != nil {
		bicycle.Brakes = *req.Brakes
	}
	if req.Frame != nil {
		bicycle.Frame = *req.Frame
	}
	if req.WheelSize != nil {
		bicycle.WheelSize = *req.WheelSize
	}
	if req.WheelType != nil {
		bicycle.WheelType = *req.WheelType
	}
	if req.Drive != nil {
		bicycle.Drive = *req.Drive
	}
	if req.BrakeSystem != nil {
		bicycle.BrakeSystem = *req.BrakeSystem
	}
	if req.DayPrice != nil {
		bicycle.DayPrice = *req.DayPrice
	}
	if req.Quantity != nil {
		bicycle.Quantity = *req.Quantity
	}

	file, err := ctx.FormFile("image")
	if err == nil && file != nil {
		if bicycle.ImageURL != "" {
			_ = os.Remove("./public/uploads/" + bicycle.ImageURL)
		}
		filename, err := utils.SaveImage(ctx, file)
		if err != nil {
			return nil, fmt.Errorf("ошибка при сохранении изображения: %w", err)
		}
		bicycle.ImageURL = filename
	}

	// Сохраняем изменения
	return s.repo.Update(ctx.Context(), bicycle)
}

func (s *BicycleService) Delete(c context.Context, id uint) error {
	return s.repo.Delete(c, id)
}
