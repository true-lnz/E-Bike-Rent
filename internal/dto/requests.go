package dto

type CompleteRegistrationRequest struct {
	Email       string `json:"email"`
	LastName    string `json:"last_name"`
	FirstName   string `json:"first_name"`
	Patronymic  string `json:"patronymic"`
	PhoneNumber string `json:"phone_number"`
	Birthday    string `json:"birthday"`
	CompanyID   *uint  `json:"company_id"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type ChangeCredentialsRequest struct {
	NewPhoneNumber string `json:"new_phone_number"`
	NewLastName    string `json:"new_last_name"`
	NewFirstName   string `json:"new_first_name"`
	NewPatronymic  string `json:"new_patronymic"`
	NewEmail       string `json:"new_email"`
}
