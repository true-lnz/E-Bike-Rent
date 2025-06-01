package repositories

import (
	"E-Bike-Rent/internal/models"
	"context"
	"gorm.io/gorm"
)

type maintenanceRepo struct {
	db *gorm.DB
}

type MaintenanceRepo interface {
	GetAll(c context.Context) ([]models.Maintenance, error)
	GetByID(c context.Context, id uint) (*models.Maintenance, error)
	Update(c context.Context, maintenance *models.Maintenance) (*models.Maintenance, error)
	Create(c context.Context, maintenance *models.Maintenance) (*models.Maintenance, error)
	GetByUserID(c context.Context, userID uint) ([]models.Maintenance, error)
}

func (r *maintenanceRepo) GetAll(c context.Context) ([]models.Maintenance, error) {
	var maintenances []models.Maintenance
	err := r.db.WithContext(c).Preload("User").Find(&maintenances).Error
	return maintenances, err
}

func (r *maintenanceRepo) GetByID(c context.Context, id uint) (*models.Maintenance, error) {
	var maintenance models.Maintenance
	err := r.db.WithContext(c).Preload("User").First(&maintenance, "id = ?", id).Error
	return &maintenance, err
}

func (r *maintenanceRepo) Update(c context.Context, maintenance *models.Maintenance) (*models.Maintenance, error) {
	err := r.db.WithContext(c).Save(maintenance).Error
	return maintenance, err
}

func (r *maintenanceRepo) Create(c context.Context, maintenance *models.Maintenance) (*models.Maintenance, error) {
	err := r.db.WithContext(c).Create(maintenance).Error
	return maintenance, err
}

func (r *maintenanceRepo) GetByUserID(c context.Context, userID uint) ([]models.Maintenance, error) {
	var maintenances []models.Maintenance
	err := r.db.WithContext(c).Where("user_id = ?", userID).Find(&maintenances).Error
	return maintenances, err
}

func NewMaintenanceRepo(db *gorm.DB) MaintenanceRepo {
	return &maintenanceRepo{db: db}
}
