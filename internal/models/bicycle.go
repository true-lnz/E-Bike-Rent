package models

type Bicycle struct {
	ID              uint   `gorm:"PrimaryKey" json:"id,omitempty"`
	Name            string `json:"name,omitempty"`
	Weight          int    `json:"weight,omitempty"`
	MaxSpeed        int    `json:"max_speed,omitempty"`
	MaxRange        int    `json:"max_range,omitempty"`
	MaxLoad         int    `json:"max_load,omitempty"`
	Power           int    `json:"power,omitempty"`
	ChargeTimeHours string `json:"charge_time_hours,omitempty"`
	Battery         string `json:"battery,omitempty"`
	Suspension      bool   `json:"suspension,omitempty"`
	Brakes          string `json:"brakes,omitempty"`
	Frame           string `json:"frame,omitempty"`
	WheelSize       byte   `json:"wheel_size,omitempty"`
	WheelType       string `json:"wheel_type,omitempty"`
	Drive           string `json:"drive,omitempty"`
	BrakeSystem     string `json:"brake_system,omitempty"`
	DayPrice        int    `json:"day_price,omitempty"`
	Quantity        int    `json:"quantity,omitempty"`
	ImageURL        string `json:"image_url,omitempty"`
}
