package models

type Accessory struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	Name     string `gorm:"unique" json:"name"`
	ImageURL string `gorm:"unique" json:"image_url"`
	Quantity int    `json:"quantity"`
	Price    int    `json:"price"`
}
