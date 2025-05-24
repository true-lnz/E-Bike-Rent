package models

type Company struct {
	ID       uint   `gorm:"primary_key"`
	Name     string `gorm:"not null"`
	ImageURL string `gorm:"not null" json:"image_url"`
}
