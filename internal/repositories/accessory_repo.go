package repositories

import (
	"E-Bike-Rent/internal/models"
	"context"
	"gorm.io/gorm"
)

type accessoryRepository struct {
	db *gorm.DB
}

type AccessoryRepository interface {
	GetAll(c context.Context) ([]models.Accessory, error)
	CountInRent(c context.Context, accessoryID uint) (int, error)
}

func NewAccessoryRepository(db *gorm.DB) AccessoryRepository {
	return &accessoryRepository{db: db}
}

func (r *accessoryRepository) GetAll(c context.Context) ([]models.Accessory, error) {
	var accessories []models.Accessory
	err := r.db.WithContext(c).Find(&accessories).Error
	return accessories, err
}

func (r *accessoryRepository) CountInRent(c context.Context, accessoryID uint) (int, error) {
	var count int64
	err := r.db.WithContext(c).
		Table("rent_accessories").
		Joins("JOIN rents ON rents.id = rent_accessories.rent_id").
		Where("rent_accessories.accessory_id = ? AND rents.status IN ?", accessoryID, []string{
			"в обработке", "арендован", "аренда продлена",
		}).
		Count(&count).Error

	return int(count), err
}
