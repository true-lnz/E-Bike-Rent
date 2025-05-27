package services

import (
	"E-Bike-Rent/internal/config"
	"E-Bike-Rent/internal/dto"
	"E-Bike-Rent/internal/models"
	"E-Bike-Rent/internal/repositories"
	"context"
	"errors"
	"fmt"
	"gorm.io/gorm"
	"time"
)

type MaintenanceService struct {
	repo repositories.MaintenanceRepo
	cfg  *config.Config
}

func NewMaintenanceService(repo repositories.MaintenanceRepo, cfg *config.Config) *MaintenanceService {
	return &MaintenanceService{repo: repo, cfg: cfg}
}

func (s *MaintenanceService) CreateMaintenance(c context.Context, req dto.CreateMaintenanceRequest, userID uint) (*models.Maintenance, error) {
	maintenance := &models.Maintenance{
		UserID:      userID,
		BicycleName: req.BicycleName,
		Details:     req.Details,
		CreatedAt:   time.Now(),
	}
	created, err := s.repo.Create(c, maintenance)
	if err != nil {
		return nil, fmt.Errorf("ошибка сохранения записи: %w", err)
	}
	return created, nil
}

func (s *MaintenanceService) GetMaintenance(c context.Context, maintenanceID uint) (*models.Maintenance, error) {
	maintenance, err := s.repo.GetByID(c, maintenanceID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("запись не найдена: %w", err)
		}
		return nil, fmt.Errorf("ошибка при получении записи: %w", err)
	}
	return maintenance, nil
}

func (s *MaintenanceService) GetUsersMaintenances(c context.Context, userID uint) ([]models.Maintenance, error) {
	maintenance, err := s.repo.GetByUserID(c, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("записи не найдены: %w", err)
		}
		return nil, fmt.Errorf("ошибка при получении записей: %w", err)
	}
	return maintenance, nil
}

func (s *MaintenanceService) UpdateMaintenance(c context.Context, request *dto.UpdateMaintenanceRequest, maintenanceID uint) (*models.Maintenance, error) {
	existingMaintenance, err := s.repo.GetByID(c, maintenanceID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("запись не найдена: %w", err)
		}
		return nil, fmt.Errorf("ошибка при получении записи: %w", err)
	}

	t, err := time.Parse("2006-01-02", request.EstimatedTime)

	lastStatus := existingMaintenance.Status

	existingMaintenance.Status = request.Status
	existingMaintenance.EstimatedTime = t
	existingMaintenance.BicycleName = request.BicycleName
	existingMaintenance.AdminMessage = request.AdminMessage
	existingMaintenance.Price = request.Price
	updatedMaintenance, err := s.repo.Update(c, existingMaintenance)
	if err != nil {
		return nil, fmt.Errorf("не удалось обновить запись: %w", err)
	}

	if lastStatus != request.Status {
		err = SendMaintenanceStatusUpdate(existingMaintenance.User.Email, existingMaintenance.BicycleName, request.Status, s.cfg)
		if err != nil {
			return nil, fmt.Errorf("ошибка при отправке уведомления: %w", err)
		}
	}

	return updatedMaintenance, nil
}

func (s *MaintenanceService) GetAllMaintenances(c context.Context) ([]models.Maintenance, error) {
	return s.repo.GetAll(c)
}
