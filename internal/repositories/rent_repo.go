package repositories

import (
	"E-Bike-Rent/internal/models"
	"context"
	"gorm.io/gorm"
)

type rentRepository struct {
	db *gorm.DB
}

type RentRepository interface {
	GetById(c context.Context, rentID int) (*models.Rent, error)
	GetAll(c context.Context) ([]models.Rent, error)
	CountInRent(c context.Context, bicycleID uint) (int, error)
}

func NewRentRepository(db *gorm.DB) RentRepository {
	return &rentRepository{db: db}
}

func (r *rentRepository) CountInRent(c context.Context, bicycleID uint) (int, error) {
	var total int64
	err := r.db.WithContext(c).
		Where("bicycle_id = ? AND (status = ? OR status = ? OR status = ?)", bicycleID, "в обработке", "арендован", "аренда продлена").
		Model(&models.Rent{}).
		Count(&total).Error
	return int(total), err
}

func (r *rentRepository) GetAll(c context.Context) ([]models.Rent, error) {
	var rents []models.Rent
	err := r.db.WithContext(c).Find(&rents).Error
	if err != nil {
		return nil, err
	}
	return rents, nil
}

func (r *rentRepository) GetById(c context.Context, rentID int) (*models.Rent, error) {
	var rent *models.Rent
	err := r.db.WithContext(c).First(&rent, rentID).Error
	if err != nil {
		return nil, err
	}
	return rent, nil
}
