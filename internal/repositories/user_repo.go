package repositories

import (
	"E-Bike-Rent/internal/models"
	"context"
	"gorm.io/gorm"
)

type UserRepository interface {
	GetUserByEmail(c context.Context, email string) (*models.User, error)
	CreateUser(c context.Context, user *models.User) error
	GetUserById(c context.Context, id uint) (*models.User, error)
	Update(c context.Context, user *models.User) (*models.User, error)
	Delete(c context.Context, userID uint) error
	SetVerificationCode(c context.Context, email, code string) error
	GetVerificationCode(ctx context.Context, email string) (string, error)
}

type userRepository struct {
	db *gorm.DB
}

func (r userRepository) GetUserById(c context.Context, id uint) (*models.User, error) {
	var user models.User
	err := r.db.WithContext(c).Preload("Company").Where("id = ?", id).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r userRepository) GetUserByEmail(c context.Context, email string) (*models.User, error) {
	var user models.User
	err := r.db.WithContext(c).Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r userRepository) CreateUser(c context.Context, user *models.User) error {
	return r.db.WithContext(c).Create(user).Error
}
func (r userRepository) Update(c context.Context, user *models.User) (*models.User, error) {
	err := r.db.WithContext(c).Save(user).Error
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r userRepository) Delete(c context.Context, userID uint) error {
	err := r.db.WithContext(c).Model(&models.User{ID: userID}).Association("Cart").Clear()
	if err != nil {
		return err
	}
	err = r.db.WithContext(c).Model(&models.User{ID: userID}).Association("Favorites").Clear()
	if err != nil {
		return err
	}
	return r.db.WithContext(c).Delete(models.User{}, userID).Error
}

func (r userRepository) SetVerificationCode(c context.Context, email, code string) error {
	return r.db.WithContext(c).
		Model(&models.User{}).
		Where("email = ?", email).
		Update("verification_code", code).Error
}

func (r userRepository) GetVerificationCode(c context.Context, email string) (string, error) {
	var code string
	err := r.db.WithContext(c).
		Model(&models.User{}).
		Select("verification_code").
		Where("email = ?", email).
		Scan(&code).Error

	return code, err
}
