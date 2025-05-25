package repositories

import (
	"E-Bike-Rent/internal/models"
	"context"
	"errors"
	"gorm.io/gorm"
)

type bicycleRepo struct {
	db *gorm.DB
}

func (b *bicycleRepo) GetAll(c context.Context) ([]models.Bicycle, error) {
	var bicycles []models.Bicycle
	err := b.db.WithContext(c).Find(&bicycles).Error
	return bicycles, err
}

func (b *bicycleRepo) GetByID(c context.Context, id string) (*models.Bicycle, error) {
	var bicycle models.Bicycle
	err := b.db.WithContext(c).First(&bicycle, "id = ?", id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &bicycle, err
}

func (b *bicycleRepo) Create(c context.Context, bicycle *models.Bicycle) (*models.Bicycle, error) {
	err := b.db.WithContext(c).Create(bicycle).Error
	return bicycle, err
}

func (b *bicycleRepo) Update(c context.Context, bicycle *models.Bicycle) (*models.Bicycle, error) {
	err := b.db.WithContext(c).Save(bicycle).Error
	return bicycle, err
}

func (b *bicycleRepo) Delete(c context.Context, id string) error {
	return b.db.WithContext(c).Delete(&models.Bicycle{}, "id = ?", id).Error
}

type BicycleRepo interface {
	GetAll(c context.Context) ([]models.Bicycle, error)
	GetByID(c context.Context, id string) (*models.Bicycle, error)
	Create(c context.Context, bicycle *models.Bicycle) (*models.Bicycle, error)
	Update(c context.Context, bicycle *models.Bicycle) (*models.Bicycle, error)
	Delete(c context.Context, id string) error
}

func NewBicycleRepo(db *gorm.DB) BicycleRepo {
	return &bicycleRepo{db: db}
}
