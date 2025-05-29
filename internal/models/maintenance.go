package models

import "time"

type Maintenance struct {
	ID           uint      `gorm:"primary_key" json:"id"`
	UserID       uint      `gorm:"not null" json:"user_id"`
	User         *User     `gorm:"constraint:OnDelete:CASCADE;" json:"user,omitempty"`
	BicycleName  string    `gorm:"not null" json:"bicycle_name"`
	Status       string    `gorm:"not null;default:'заявка в обработке'" json:"status"`
	Details      string    `gorm:"not null" json:"details"`
	AdminMessage string    `json:"admin_message"`
	CreatedAt    time.Time `gorm:"not null" json:"created_at"`
	Price        int       `json:"price"`
	StartDate    time.Time `gorm:"type:date" json:"start_date"`
	FinishDate   time.Time `gorm:"type:date" json:"finish_date"`
}
