package models

import "time"

type User struct {
	ID               uint          `gorm:"primaryKey" json:"id"`
	LastName         string        `gorm:"not null" json:"last_name"`
	FirstName        string        `gorm:"not null" json:"first_name"`
	Patronymic       string        `gorm:"not null" json:"patronymic"`
	Email            string        `gorm:"unique" json:"email"`
	PhoneNumber      string        `json:"phone_number"`
	Birthday         time.Time     `gorm:"not null" json:"birthday"`
	Role             string        `gorm:"default:'user'" json:"role"`
	VerificationCode string        `json:"-"`
	IsVerified       bool          `json:"is_verified"`
	CompanyID        uint          `json:"company_id"`
	Company          *Company      `gorm:"foreignKey:CompanyID" json:"company,omitempty"`
	Maintenances     []Maintenance `gorm:"foreignKey:UserID" json:"maintenances,omitempty"`
	Rents            []Rent        `gorm:"foreignKey:UserID" json:"rents,omitempty"`
}
