package repositories

import (
	"E-Bike-Rent/internal/models"
	"context"
	"gorm.io/gorm"
)

type companyRepository struct {
	db *gorm.DB
}

type CompanyRepository interface {
	GetAll(c context.Context) ([]models.Company, error)
}

func (r companyRepository) GetAll(c context.Context) ([]models.Company, error) {
	var companies []models.Company
	err := r.db.WithContext(c).Find(&companies).Error
	return companies, err
}

func NewCompanyRepository(db *gorm.DB) CompanyRepository {
	return &companyRepository{db: db}
}
