package models

import "time"

type Rent struct {
	ID             uint        `gorm:"primaryKey" json:"id,omitempty"`
	StartDate      *time.Time  `json:"start_date,omitempty"`
	ExpireDate     time.Time   `json:"expire_date"`
	UpdatedAt      time.Time   `gorm:"default now" json:"updated_at"`
	UserID         uint        `json:"user_id,omitempty"`
	User           *User       `gorm:"foreignKey:UserID" json:"user,omitempty"`
	BicycleID      uint        `json:"bicycle_id,omitempty"`
	Bicycle        Bicycle     `gorm:"foreignKey:BicycleID" json:"bicycle"`
	Status         string      `gorm:"default:'в обработке'" json:"status"`
	RentPrice      int         `json:"rent_price"`
	AccessoryPrice int         `json:"accessory_price"`
	Accessories    []Accessory `gorm:"many2many:rent_accessories" json:"accessories"`
}
