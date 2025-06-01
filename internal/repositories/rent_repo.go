package repositories

import (
	"E-Bike-Rent/internal/models"
	"context"
	"errors"
	"gorm.io/gorm"
)

type rentRepository struct {
	db *gorm.DB
}

type RentRepository interface {
	BeginTx(ctx context.Context) *gorm.DB
	GetById(c context.Context, rentID uint) (*models.Rent, error)
	GetAll(c context.Context) ([]models.Rent, error)
	GetAllByUserID(c context.Context, userID uint) ([]models.Rent, error)
	CountInRent(c context.Context, bicycleID uint) (int, error)
	Create(c context.Context, rent *models.Rent) (*models.Rent, error)
	UpdateAccessoriesForRent(tx *gorm.DB, rent *models.Rent, accessoryIDs []uint) error
	Update(tx *gorm.DB, rent *models.Rent) (*models.Rent, error)
}

func NewRentRepository(db *gorm.DB) RentRepository {
	return &rentRepository{db: db}
}
func (r *rentRepository) BeginTx(ctx context.Context) *gorm.DB {
	return r.db.WithContext(ctx).Begin()
}
func (r *rentRepository) CountInRent(c context.Context, bicycleID uint) (int, error) {
	var total int64
	err := r.db.WithContext(c).
		Where("bicycle_id = ? AND (status = ? OR status = ? OR status = ?)", bicycleID, "в обработке", "арендован", "аренда продлена").
		Model(&models.Rent{}).
		Count(&total).Error
	return int(total), err
}

func (r *rentRepository) Create(c context.Context, rent *models.Rent) (*models.Rent, error) {
	err := r.db.WithContext(c).Create(rent).Error
	return rent, err
}

func (r *rentRepository) GetByAccessoryId(c context.Context, bicycleID uint) (int, error) {
	var total int64
	err := r.db.WithContext(c).
		Where("", bicycleID, "в обработке", "арендован", "аренда продлена").
		Model(&models.Rent{}).
		Count(&total).Error
	return int(total), err
}
func (r *rentRepository) GetAll(c context.Context) ([]models.Rent, error) {
	var rents []models.Rent
	err := r.db.WithContext(c).Preload("Bicycle").Preload("Accessories").Preload("User").Find(&rents).Error
	if err != nil {
		return nil, err
	}
	return rents, nil
}

func (r *rentRepository) GetAllByUserID(c context.Context, userID uint) ([]models.Rent, error) {
	var rents []models.Rent
	err := r.db.WithContext(c).Preload("Bicycle").Preload("Accessories").Find(&rents).Where("user_id = ?", userID).Error
	if err != nil {
		return nil, err
	}
	return rents, nil
}

func (r *rentRepository) GetById(c context.Context, rentID uint) (*models.Rent, error) {
	var rent *models.Rent
	err := r.db.WithContext(c).Preload("Bicycle").First(&rent, rentID).Error
	if err != nil {
		return nil, err
	}
	return rent, nil
}

func (r *rentRepository) UpdateAccessoriesForRent(tx *gorm.DB, rent *models.Rent, accessoryIDs []uint) error {
	if err := tx.Model(&rent).Association("Accessories").Clear(); err != nil {
		return err
	}

	if len(accessoryIDs) > 0 {
		var accessories []models.Accessory
		if err := tx.Where("id IN ?", accessoryIDs).Find(&accessories).Error; err != nil {
			return err
		}
		if len(accessories) != len(accessoryIDs) {
			return errors.New("в наличии нет аксессуара")
		}
		if err := tx.Model(&rent).Association("Accessories").Replace(&accessories); err != nil {
			return err
		}
	}
	return nil
}

func (r *rentRepository) Update(tx *gorm.DB, rent *models.Rent) (*models.Rent, error) {
	err := tx.Save(rent).Error
	if err != nil {
		return nil, err
	}
	return rent, nil
}
