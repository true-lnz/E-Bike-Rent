package models

type Company struct {
	ID       uint   `gorm:"primary_key" json:"id"`
	Name     string `gorm:"not null" json:"name"`
	ImageURL string `gorm:"not null" json:"image_url"`
}
