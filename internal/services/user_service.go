package services

import (
	"E-Bike-Rent/internal/dto"
	"E-Bike-Rent/internal/models"
	"E-Bike-Rent/internal/repositories"
	"context"
	"errors"
	"fmt"
	"github.com/gofiber/fiber/v2/log"
	"gorm.io/gorm"
	"time"
)

type UserService struct {
	repo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) GetUser(c context.Context, userID uint) (*models.User, error) {
	return s.repo.GetUserById(c, userID)
}

func (s *UserService) RegisterUser(c context.Context, input models.User) (*models.User, error) {
	existingUser, err := s.repo.GetUserByEmail(c, input.Email)
	if err == nil && existingUser != nil {
		return nil, fmt.Errorf("Аккаунт с такой почтой уже существует")
	}

	err = s.repo.CreateUser(c, &input)

	if err != nil {
		return nil, fmt.Errorf("не удалось создать новый аккаунт: %w", err)
	}

	return &input, nil
}

//func (s *UserService) LoginUser(c context.Context, input dto.LoginRequest) (*models.User, error) {
//	user, err := s.repo.GetUserByEmail(c, input.Email)
//	if err != nil {
//		return nil, fmt.Errorf("неверная почта или пароль")
//	}
//
//	//err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
//	if err != nil {
//		return nil, fmt.Errorf("неверная почта или пароль")
//	}
//
//	return user, nil
//}
//
//func (s *UserService) ChangePassword(c context.Context, userID uint, newPassword string) error {
//	user, err := s.repo.GetUserById(c, userID)
//	if err != nil {
//		return err
//	}
//
//	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
//	user.Password = string(hashedPassword)
//	if err != nil {
//		return fmt.Errorf("внутренняя ошибка сервера: %w", err)
//	}
//	return s.repo.Update(c, user)
//}

func (s *UserService) DeleteUser(c context.Context, userID uint) error {
	return s.repo.Delete(c, userID)
}

func (s *UserService) GetFirstNameAndLastName(c context.Context, userID uint) (string, string, error) {
	user, err := s.repo.GetUserById(c, userID)
	if err != nil {
		return "", "", err
	}

	return user.FirstName, user.LastName, nil
}

func (s *UserService) ChangeCredentials(c context.Context, userID uint, newCredentials *dto.ChangeCredentialsRequest) error {
	user, err := s.repo.GetUserById(c, userID)
	if err != nil {
		return err
	}
	user.Email = newCredentials.NewEmail
	user.FirstName = newCredentials.NewFirstName
	user.LastName = newCredentials.NewLastName
	user.Patronymic = newCredentials.NewPatronymic
	user.PhoneNumber = newCredentials.NewPhoneNumber

	_, err = s.repo.Update(c, user)
	return err
}

func (s *UserService) GetUserRole(c context.Context, userID uint) (string, error) {
	user, err := s.repo.GetUserById(c, userID)
	if err != nil {
		return "", err
	}
	return user.Role, nil
}

func (s *UserService) GetUserByEmail(c context.Context, email string) (*models.User, error) {
	return s.repo.GetUserByEmail(c, email)
}

func (s *UserService) SetVerificationCode(c context.Context, email, code string) error {
	// Попробуем найти пользователя по email
	_, err := s.repo.GetUserByEmail(c, email)
	if err != nil {
		// Если пользователь не найден — создаём нового
		if errors.Is(err, gorm.ErrRecordNotFound) {
			newUser := &models.User{
				Email:            email,
				VerificationCode: code,
				IsVerified:       false,
			}
			return s.repo.CreateUser(c, newUser)
		}
		// Если другая ошибка — возвращаем её
		return err
	}

	return s.repo.SetVerificationCode(c, email, code)
}

func (s *UserService) CheckVerificationCode(c context.Context, email, code string) (bool, error) {
	storedCode, err := s.repo.GetVerificationCode(c, email)
	if err != nil {
		return false, fmt.Errorf("ошибка получения кода: %w", err)
	}
	return storedCode == code, nil
}

func (s *UserService) CompleteRegistration(c context.Context, req dto.CompleteRegistrationRequest) (*models.User, error) {
	user, err := s.repo.GetUserByEmail(c, req.Email)
	if err != nil {
		log.Error("ошибка получения пользователя: ", err)
		return nil, fmt.Errorf("ошибка получения пользователя: %w", err)
	}
	user.FirstName = req.FirstName
	user.LastName = req.LastName
	user.Patronymic = req.Patronymic
	user.PhoneNumber = req.PhoneNumber

	t, err := time.Parse("2006-01-02", req.Birthday)
	if err != nil {
		log.Error("неверный формат даты: ", err)
		return nil, fmt.Errorf("неверный формат даты: %w", err)
	}

	user.Birthday = t
	if req.CompanyID != nil {
		user.CompanyID = *req.CompanyID
	}
	user, err = s.repo.Update(c, user)
	if err != nil {
		return nil, fmt.Errorf("ошибка сохранения пользователя: %w", err)
	}
	return user, nil
}
