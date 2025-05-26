package models

import "time"

type Maintenance struct {
	ID            uint      `gorm:"primary_key" json:"id"`
	UserID        uint      `gorm:"not null" json:"user_id"`
	User          User      `gorm:"constraint:OnDelete:CASCADE;" json:"user"`
	BicycleName   string    `gorm:"not null" json:"bicycle_name"`
	Status        string    `gorm:"not null default:'заявка в обработке'" json:"status"`
	Details       string    `gorm:"not null" json:"details"`
	CreatedAt     time.Time `gorm:"not null" json:"created_at"`
	Price         int       `gorm:"not null" json:"price"`
	EstimatedTime time.Time `gorm:"not null" json:"estimated_time"`
}
