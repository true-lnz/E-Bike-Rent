package models

import "time"

type Rent struct {
	ID             int         `gorm:"primaryKey" json:"id,omitempty"`
	StartDate      time.Time   `gorm:"not null" json:"start_date,omitempty"`
	ExpireDate     time.Time   `json:"expire_date"`
	UpdatedAt      time.Time   `gorm:"default now" json:"updated_at"`
	UserID         uint        `json:"user_id,omitempty"`
	User           User        `gorm:"foreignKey:UserID" json:"user"`
	BicycleID      uint        `json:"bicycle_id,omitempty"`
	Bicycle        Bicycle     `gorm:"foreignKey:BicycleID"`
	Status         string      `gorm:"default:'в обработке'" json:"status"`
	RentPrice      float64     `json:"rent_price"`
	AccessoryPrice float64     `json:"accessory_price"`
	Accessories    []Accessory `gorm:"many2many:rent_accessories" json:"accessories"`
}
