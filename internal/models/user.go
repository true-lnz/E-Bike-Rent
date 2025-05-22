package models

import "time"

type User struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	LastName         string    `gorm:"not null" json:"last_name"`
	FirstName        string    `gorm:"not null" json:"first_name"`
	Patronymic       string    `gorm:"not null" json:"patronymic"`
	Email            string    `gorm:"unique" json:"email"`
	PhoneNumber      string    `gorm:"unique" json:"phone_number"`
	Password         string    `gorm:"not null" json:"-"`
	Birthday         time.Time `gorm:"not null"`
	Role             string    `gorm:"default:'user'" json:"role"`
	VerificationCode string    `json:"verification_code"`
}
