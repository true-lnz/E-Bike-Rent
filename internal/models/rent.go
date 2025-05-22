package models

import "time"

type Rent struct {
	ID         int       `gorm:"primaryKey" json:"id,omitempty"`
	ExpireDate time.Time `json:"expire_date"`
	UpdatedAt  time.Time `gorm:"default now" json:"updated_at"`
	UserID     uint      `json:"user_id,omitempty"`
	BicycleID  uint      `json:"bicycle_id,omitempty"`
	User       User      `gorm:"foreignKey:UserID" json:"user"`
	Bicycle    Bicycle   `gorm:"foreignKey:BicycleID"`
}
