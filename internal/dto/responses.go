package dto

import "E-Bike-Rent/internal/models"

type BicyclesResponse struct {
	Items []BicycleItem `json:"items"`
	Total int           `json:"total"`
}

type BicycleItem struct {
	models.Bicycle
	AvailableQuantity int `json:"available_quantity"`
}
