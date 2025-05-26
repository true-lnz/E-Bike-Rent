package services

import (
	"E-Bike-Rent/internal/models"
	"E-Bike-Rent/internal/repositories"
	"context"
)

type CompanyService struct {
	repo repositories.CompanyRepository
}

func NewCompanyService(repo repositories.CompanyRepository) *CompanyService {
	return &CompanyService{repo: repo}
}

func (s *CompanyService) GetAll(c context.Context) ([]models.Company, error) {
	return s.repo.GetAll(c)
}
