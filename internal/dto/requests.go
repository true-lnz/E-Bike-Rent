package dto

import "time"

type CompleteRegistrationRequest struct {
	Email       string `json:"email"`
	LastName    string `json:"last_name"`
	FirstName   string `json:"first_name"`
	Patronymic  string `json:"patronymic"`
	PhoneNumber string `json:"phone_number"`
	Birthday    string `json:"birthday"`
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
	RentalDays  int    `json:"rental_days"`
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
