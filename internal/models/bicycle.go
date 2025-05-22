package models

type Bicycle struct {
	ID              uint `gorm:"PrimaryKey"`
	Name            string
	MaxSpeed        int
	MaxRange        int
	MaxLoad         int
	Power           int
	ChargeTimeHours string
	Battery         string
	Suspension      bool
	Brakes          string
	Frame           string
	WheelSize       byte
	WheelType       string
	Drive           string
	BrakeSystem     string
	Price           int
	Quantity        int
}
