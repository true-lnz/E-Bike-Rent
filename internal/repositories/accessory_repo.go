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
	GetByID(c context.Context, id uint) (*models.Accessory, error)
	GetByIDs(c context.Context, ids []uint) ([]models.Accessory, error)
	CountInRent(c context.Context, accessoryID uint) (int, error)
	Create(c context.Context, accessory *models.Accessory) (*models.Accessory, error)
	Update(c context.Context, accessory *models.Accessory) (*models.Accessory, error)
	Delete(c context.Context, accessoryID uint) error
}

func NewAccessoryRepository(db *gorm.DB) AccessoryRepository {
	return &accessoryRepository{db: db}
}

func (r *accessoryRepository) GetAll(c context.Context) ([]models.Accessory, error) {
	var accessories []models.Accessory
	err := r.db.WithContext(c).Find(&accessories).Error
	return accessories, err
}

func (r *accessoryRepository) GetByID(c context.Context, id uint) (*models.Accessory, error) {
	accessory := &models.Accessory{}
	err := r.db.WithContext(c).First(accessory, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return accessory, err
}

func (r *accessoryRepository) GetByIDs(c context.Context, ids []uint) ([]models.Accessory, error) {
	accessories := make([]models.Accessory, len(ids))
	err := r.db.WithContext(c).Where(accessories, "id IN ?", ids).Error
	if err != nil {
		return nil, err
	}
	return accessories, err
}

func (r *accessoryRepository) Create(c context.Context, accessory *models.Accessory) (*models.Accessory, error) {
	err := r.db.WithContext(c).Create(accessory).Error
	return accessory, err
}

func (r *accessoryRepository) Update(c context.Context, accessory *models.Accessory) (*models.Accessory, error) {
	err := r.db.WithContext(c).Save(accessory).Error
	return accessory, err
}

func (r *accessoryRepository) Delete(c context.Context, accessoryID uint) error {
	return r.db.WithContext(c).Delete(&models.Accessory{}, accessoryID).Error
}

func (r *accessoryRepository) DeleteByRentID(c context.Context, rentID uint) error {
	err := r.db.WithContext(c).Model(&models.Rent{ID: rentID}).Association("Accessories").Clear()
	return err
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
