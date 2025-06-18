package dto

import "time"

type CompleteRegistrationRequest struct {
	Email       string `json:"email"`
	LastName    string `json:"last_name"`
	FirstName   string `json:"first_name"`
	Patronymic  string `json:"patronymic"`
	PhoneNumber string `json:"phone_number"`
	Birthday    string `json:"birthday"`
	City        string `json:"city"`
	CompanyID   *uint  `json:"company_id"`
}

type SendVerificationCodeRequest struct {
	Email string `json:"email"`
}

type VerifyCodeRequest struct {
	Email string `json:"email"`
	Code  string `json:"code"`
}

type ChangeCredentialsRequest struct {
	NewPhoneNumber string `json:"new_phone_number"`
	NewLastName    string `json:"new_last_name"`
	NewFirstName   string `json:"new_first_name"`
	NewPatronymic  string `json:"new_patronymic"`
	NewEmail       string `json:"new_email"`
	NewCity        string `json:"new_city"`
}

type CreateMaintenanceRequest struct {
	BicycleName string `json:"bicycle_name"`
	Details     string `json:"details"`
}

type UpdateMaintenanceRequest struct {
	BicycleName  string `json:"bicycle_name"`
	Status       string `json:"status"`
	AdminMessage string `json:"admin_message"`
	Price        int    `json:"price"`
	FinishDate   string `json:"finish_date"`
}

type CreateRentRequest struct {
	RentalDays  int    `json:"rental_days"` // 7, 14, 30
	BicycleID   uint   `json:"bicycle_id,omitempty"`
	Accessories []uint `json:"accessories"`
}

type UpdateRentRequest struct {
	StartDate      *time.Time `json:"start_date,omitempty"`
	ExpireDate     *time.Time `json:"expire_date"`
	Status         *string    `json:"status"`
	RentPrice      *int       `json:"rent_price"`
	AccessoryPrice *int       `json:"accessory_price"`
	Accessories    *[]uint    `json:"accessories"`
}

type FeedbackRequest struct {
	PhoneNumber string `json:"phone_number,omitempty"`
	Text        string `json:"text,omitempty"`
}

type CreateUpdateAccessoryRequest struct {
	Name     *string `json:"name"`
	Quantity *int    `json:"quantity"`
	Price    *int    `json:"price"`
}

type UpdateBicycleRequest struct {
	Name            *string `json:"name,omitempty"`
	Weight          *int    `json:"weight,omitempty"`
	MaxSpeed        *int    `json:"max_speed,omitempty"`
	MaxRange        *int    `json:"max_range,omitempty"`
	MaxLoad         *int    `json:"max_load,omitempty"`
	Power           *int    `json:"power,omitempty"`
	ChargeTimeHours *string `json:"charge_time_hours,omitempty"`
	Battery         *string `json:"battery,omitempty"`
	Suspension      *bool   `json:"suspension,omitempty"`
	Brakes          *string `json:"brakes,omitempty"`
	Frame           *string `json:"frame,omitempty"`
	WheelSize       *byte   `json:"wheel_size,omitempty"`
	WheelType       *string `json:"wheel_type,omitempty"`
	Drive           *string `json:"drive,omitempty"`
	BrakeSystem     *string `json:"brake_system,omitempty"`
	Quantity        *int    `json:"quantity,omitempty"`
	OneWeekPrice    *int    `json:"one_week_price,omitempty"`
	TwoWeekPrice    *int    `json:"two_week_price,omitempty"`
	MonthPrice      *int    `json:"month_price,omitempty"`
}
