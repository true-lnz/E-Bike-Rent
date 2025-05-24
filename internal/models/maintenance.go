package models

import "time"

type Maintenance struct {
	ID            uint      `gorm:"primary_key"`
	UserID        uint      `gorm:"not null"`
	User          User      `gorm:"constraint:OnDelete:CASCADE;"`
	BicycleName   string    `gorm:"not null" json:"bicycle_name"`
	Status        string    `gorm:"not null" json:"status"`
	Details       string    `gorm:"not null" json:"details"`
	CreatedAt     time.Time `gorm:"not null" json:"created_at"`
	Price         float64   `gorm:"not null" json:"price"`
	EstimatedTime time.Time `gorm:"not null" json:"estimated_time"`
}
