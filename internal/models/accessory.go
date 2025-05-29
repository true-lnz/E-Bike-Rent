package models

type Accessory struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	Name     string `json:"name"`
	ImageURL string `json:"image_url"`
	Quantity int    `json:"quantity"`
	Price    int    `json:"price"`
}
