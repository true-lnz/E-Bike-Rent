package services

import (
	"E-Bike-Rent/internal/config"
	"E-Bike-Rent/internal/dto"
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

func SendAdminMaintenanceCreate(bicycleName string, details string, cfg *config.Config) error {
	m := gomail.NewMessage()
	m.SetAddressHeader("From", cfg.SMTP.User, cfg.SMTP.From)
	m.SetHeader("To", cfg.SMTP.User)
	m.SetHeader("Subject", fmt.Sprintf("Новая заявка на обслуживание: %s", bicycleName))

	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html lang="ru">
		<head>
			<meta charset="UTF-8">
			<style>
				body {
					font-family: Arial, sans-serif;
					background-color: #f4f4f4;
					padding: 20px;
					color: #333;
				}
				.container {
					background-color: #fff;
					border-radius: 8px;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
					padding: 20px;
					max-width: 600px;
					margin: auto;
				}
				.title {
					font-size: 24px;
					color: #2c3e50;
					margin-bottom: 20px;
				}
				.section {
					margin-bottom: 15px;
				}
				.label {
					font-weight: bold;
					color: #555;
				}
				.details {
					background-color: #f9f9f9;
					border-left: 4px solid #2980b9;
					padding: 10px 15px;
					border-radius: 4px;
					white-space: pre-wrap;
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
				<div class="title">Поступила новая заявка на обслуживание</div>

				<div class="section">
					<span class="label">Велосипед:</span>
					<span><strong>%s</strong></span>
				</div>

				<div class="section">
					<span class="label">Детали заявки:</span>
					<div class="details">%s</div>
				</div>

				<div class="footer">
					Это автоматическое уведомление. Не отвечайте на него.
				</div>
			</div>
		</body>
		</html>
	`, bicycleName, details)

	m.SetBody("text/html", body)
	d := gomail.NewDialer(cfg.SMTP.Host, cfg.SMTP.Port, cfg.SMTP.User, cfg.SMTP.Password)
	return d.DialAndSend(m)
}

func SendMaintenanceStatusUpdate(to string, bicycleName string, newStatus string, cfg *config.Config) error {
	m := gomail.NewMessage()
	m.SetAddressHeader("From", cfg.SMTP.User, cfg.SMTP.From)
	m.SetHeader("To", to)
	m.SetHeader("Subject", fmt.Sprintf("Обновление статуса заявки на обслуживание велосипеда «%s»", bicycleName))

	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html lang="ru">
		<head>
			<meta charset="UTF-8">
			<style>
				body {
					font-family: Arial, sans-serif;
					background-color: #f4f4f4;
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
				.status {
					font-size: 20px;
					font-weight: bold;
					color: #2980b9;
					background: #eef2f7;
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
				<h2>Изменение статуса заявки</h2>
				<p>Уважаемый клиент!</p>
				<p>Статус вашей заявки на обслуживание велосипеда <strong>«%s»</strong> был обновлён.</p>
				<p>Новый статус:</p>
				<div class="status">%s</div>
				<p>Спасибо, что пользуетесь нашими услугами!</p>
				<div class="footer">С уважением,<br>Команда поддержки «ФулГаз»</div>
			</div>
		</body>
		</html>
	`, bicycleName, newStatus)

	m.SetBody("text/html", body)
	d := gomail.NewDialer(cfg.SMTP.Host, cfg.SMTP.Port, cfg.SMTP.User, cfg.SMTP.Password)
	return d.DialAndSend(m)
}

func SendFeedbackLetter(request dto.FeedbackRequest, cfg *config.Config) error {
	m := gomail.NewMessage()
	m.SetAddressHeader("From", cfg.SMTP.User, cfg.SMTP.From)
	m.SetHeader("To", cfg.SMTP.User)
	m.SetHeader("Subject", "📩 Новый вопрос от пользователя")

	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html lang="ru">
		<head>
			<meta charset="UTF-8">
			<style>
				body {
					font-family: Arial, sans-serif;
					background-color: #f4f4f4;
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
				.label {
					font-weight: bold;
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
				<h2>Поступил новый вопрос</h2>
				<p><span class="label">Номер телефона:</span> %s</p>
				<p><span class="label">Сообщение:</span></p>
				<p style="white-space: pre-wrap;">%s</p>
				<div class="footer">Это письмо сформировано автоматически</div>
			</div>
		</body>
		</html>
	`, request.PhoneNumber, request.Text)

	m.SetBody("text/html", body)

	d := gomail.NewDialer(cfg.SMTP.Host, cfg.SMTP.Port, cfg.SMTP.User, cfg.SMTP.Password)
	return d.DialAndSend(m)
}
