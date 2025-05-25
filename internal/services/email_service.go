package services

import (
	"E-Bike-Rent/internal/config"
	"fmt"

	"gopkg.in/gomail.v2"
)

func SendVerificationCode(to string, code string, cfg *config.Config) error {
	m := gomail.NewMessage()
	m.SetAddressHeader("From", cfg.SMTP.User, cfg.SMTP.From)
	m.SetHeader("To", to)
	m.SetHeader("Subject", "Код подтверждения")

	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html lang="ru">
		<head>
			<meta charset="UTF-8">
			<style>
				body {
					font-family: Arial, sans-serif;
					background-color: #f9f9f9;
					padding: 20px;
					color: #333;
				}
				.container {
					background-color: #fff;
					border-radius: 8px;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
					padding: 20px;
					max-width: 500px;
					margin: auto;
				}
				.code {
					font-size: 24px;
					font-weight: bold;
					color: #2c3e50;
					background: #f0f0f0;
					padding: 10px 20px;
					display: inline-block;
					border-radius: 6px;
					margin-top: 10px;
				}
				.footer {
					margin-top: 30px;
					font-size: 12px;
					color: #888;
				}
			</style>
		</head>
		<body>
			<div class="container">
				<h2>Код подтверждения</h2>
				<p>Вы запрашивали вход или регистрацию в системе. Пожалуйста, используйте код ниже для подтверждения действия:</p>
				<div class="code">%s</div>
				<p>Если вы не запрашивали код, просто проигнорируйте это письмо.</p>
				<div class="footer">С уважением,<br>Команда поддержки «ФулГаз»</div>
			</div>
		</body>
		</html>
	`, code)

	m.SetBody("text/html", body)
	d := gomail.NewDialer(cfg.SMTP.Host, cfg.SMTP.Port, cfg.SMTP.User, cfg.SMTP.Password)
	return d.DialAndSend(m)
}
