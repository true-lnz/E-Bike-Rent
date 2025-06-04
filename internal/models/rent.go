package models

import "time"

type Rent struct {
	ID             uint        `gorm:"primaryKey" json:"id,omitempty"`
	StartDate      *time.Time  `gorm:"type:date;column:start_date" json:"start_date,omitempty"`
	ExpireDate     time.Time   `gorm:"type:date" json:"expire_date"`
	UpdatedAt      time.Time   `gorm:"type:date;default: now" json:"updated_at"`
	UserID         uint        `gorm:"not null" json:"user_id"`
	User           *User       `gorm:"constraint:OnDelete:CASCADE;" json:"user,omitempty"`
	BicycleID      uint        `json:"bicycle_id,omitempty"`
	Bicycle        Bicycle     `gorm:"foreignKey:BicycleID" json:"bicycle"`
	Status         string      `gorm:"default:'в обработке'" json:"status"`
	RentPrice      int         `json:"rent_price"`
	AccessoryPrice int         `json:"accessory_price"`
	Accessories    []Accessory `gorm:"many2many:rent_accessories" json:"accessories"`
}
