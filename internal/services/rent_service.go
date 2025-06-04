package services

import (
	"E-Bike-Rent/internal/dto"
	"E-Bike-Rent/internal/models"
	"E-Bike-Rent/internal/repositories"
	"context"
	"fmt"
	"time"
)

type RentService struct {
	repo          repositories.RentRepository
	bicycleRepo   repositories.BicycleRepo
	accessoryRepo repositories.AccessoryRepository
}

func NewRentService(repo repositories.RentRepository, bicycleRepo repositories.BicycleRepo, accessoryRepo repositories.AccessoryRepository) *RentService {
	return &RentService{repo: repo, bicycleRepo: bicycleRepo, accessoryRepo: accessoryRepo}
}

func (s *RentService) CreateRent(c context.Context, req dto.CreateRentRequest, userID uint) (resp *models.Rent, err error) {
	//Узнать есть ли свободные.
	//Если есть, то все ок.

	if req.RentalDays < 1 {
		return nil, fmt.Errorf("некорректное количество дней: %d", req.RentalDays)
	}
	bicycle, err := s.bicycleRepo.GetByID(c, req.BicycleID)
	if err != nil {
		return nil, fmt.Errorf("не удалось получить велосипед: %w", err)
	}
	inRentQuantity, err := s.repo.CountInRent(c, req.BicycleID)
	if err != nil {
		return nil, fmt.Errorf("не удалось посчитать кол-во занятых велоспедов: %w", err)
	}
	if inRentQuantity >= bicycle.Quantity {
		return nil, fmt.Errorf("нет доступных велосипедов данной модели")
	}

	accessories := make([]models.Accessory, len(req.Accessories))
	totalAccessoriesPrice := 0
	for i, accessoryID := range req.Accessories {
		accessory, err := s.accessoryRepo.GetByID(c, accessoryID)
		if err != nil {
			return nil, fmt.Errorf("не удалось получить аксессуар: %w", err)
		}
		accessoriesInRent, err := s.accessoryRepo.CountInRent(c, accessory.ID)
		if err != nil {
			return nil, fmt.Errorf("не удалось посчитать кол-во занятых аксессуаров: %w", err)
		}
		if accessoriesInRent >= accessory.Quantity {
			return nil, fmt.Errorf("аксессуар %s не доступен", accessory.Name)
		}
		accessories[i] = *accessory
		totalAccessoriesPrice += accessory.Price
	}

	exp := time.Now().AddDate(0, 0, req.RentalDays)
	expDate := time.Date(exp.Year(), exp.Month(), exp.Day(), 0, 0, 0, 0, exp.Location())
	totalRentPrice := bicycle.DayPrice * req.RentalDays

	newRent := models.Rent{
		ExpireDate:     expDate,
		UpdatedAt:      time.Now(),
		UserID:         userID,
		BicycleID:      req.BicycleID,
		RentPrice:      totalRentPrice,
		AccessoryPrice: totalAccessoriesPrice,
		Accessories:    accessories,
	}
	created, err := s.repo.Create(c, &newRent)
	if err != nil {
		return nil, fmt.Errorf("не удалось создать аренду: %w", err)
	}
	return created, nil
}

func (s *RentService) GetUsersRents(c context.Context, userID uint) ([]models.Rent, error) {
	return s.repo.GetByUserID(c, userID)
}

func (s *RentService) GetAll(c context.Context) ([]models.Rent, error) {
	return s.repo.GetAll(c)
}

func (s *RentService) UpdateRent(c context.Context, req dto.UpdateRentRequest, rentID uint) (*models.Rent, error) {
	existingRent, err := s.repo.GetById(c, rentID)
	if err != nil {
		return nil, fmt.Errorf("не удалось получить аренду: %w", err)
	}

	if req.Status != nil {
		if req.StartDate == nil && existingRent.Status == "в обработке" && *req.Status == "арендован" {
			now := time.Now()
			start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
			existingRent.StartDate = &start
		} else {
			existingRent.StartDate = req.StartDate
		}
		existingRent.Status = *req.Status
	}

	//if existingRent.Status == "в обработке" && *req.Status == "арендован" {
	//	now := time.Now()
	//	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	//	existingRent.StartDate = &start
	//} else {
	//	existingRent.StartDate = req.StartDate
	//}

	if req.ExpireDate != nil {
		existingRent.ExpireDate = *req.ExpireDate
	}
	if req.RentPrice != nil {
		existingRent.RentPrice = *req.RentPrice
	} else {
		start := existingRent.StartDate
		end := existingRent.ExpireDate
		days := int(end.Sub(*start).Hours() / 24)
		fmt.Println("Количество дней:", days)
		totalRentPrice := existingRent.Bicycle.DayPrice * days
		existingRent.RentPrice = totalRentPrice
	}

	//existingRent.ExpireDate = req.ExpireDate
	//if existingRent.RentPrice != req.RentPrice {
	//	existingRent.RentPrice = req.RentPrice
	//} else {
	//	start := existingRent.StartDate
	//	end := existingRent.ExpireDate
	//	days := int(end.Sub(*start).Hours() / 24)
	//	fmt.Println("Количество дней:", days)
	//	totalRentPrice := existingRent.Bicycle.DayPrice * days
	//	existingRent.RentPrice = totalRentPrice
	//}

	tx := s.repo.BeginTx(c) // начинаем транзакцию

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			panic(r)
		}
	}()

	if req.AccessoryPrice != nil {
		existingRent.AccessoryPrice = *req.AccessoryPrice
	}

	if req.AccessoryPrice == nil && req.Accessories != nil {
		err = s.repo.UpdateAccessoriesForRent(tx, existingRent, *req.Accessories)
		if err != nil {
			tx.Rollback()
			return nil, err
		}
		totalAccessoriesPrice := 0
		for _, price := range existingRent.Accessories {
			totalAccessoriesPrice += price.Price
		}
		existingRent.AccessoryPrice = totalAccessoriesPrice
	}
	updated, err := s.repo.Update(tx, existingRent)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	tx.Commit()
	return updated, nil
}
