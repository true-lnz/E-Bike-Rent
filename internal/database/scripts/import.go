package scripts

import (
	"E-Bike-Rent/internal/models"
	"encoding/json"
	"fmt"
	"gorm.io/gorm"
	"log"
	"os"
)

func ImportBicycles(db *gorm.DB) error {
	file, err := os.Open("internal/database/data/bicycles_seed.json")
	if err != nil {
		log.Fatalf("Не удалось открыть файл: %v", err)
	}
	defer file.Close()

	// Декодирование JSON
	var bicycles []models.Bicycle
	if err := json.NewDecoder(file).Decode(&bicycles); err != nil {
		log.Fatalf("Ошибка декодирования JSON: %v", err)
	}

	// Добавление в базу данных
	for _, bike := range bicycles {
		if err := db.Create(&bike).Error; err != nil {
			log.Printf("Ошибка при добавлении %s: %v", bike.Name, err)
		} else {
			fmt.Printf("Добавлен: %s\n", bike.Name)
		}
	}

	fmt.Println("Импорт велосипедов завершён.")
	return nil
}

func ImportCompanies(db *gorm.DB) error {
	data, err := os.ReadFile("internal/database/data/companies_seed.json")
	if err != nil {
		return fmt.Errorf("ошибка чтения файла: %w", err)
	}

	var companies []models.Company
	if err := json.Unmarshal(data, &companies); err != nil {
		return fmt.Errorf("ошибка парсинга JSON: %w", err)
	}

	for _, company := range companies {
		if company.Name == "" {
			continue // пропускаем пустые названия
		}
		if err := db.Create(&company).Error; err != nil {
			log.Printf("❌ Ошибка при сохранении %s: %v", company.Name, err)
		} else {
			log.Printf("✔ Сохранено: %s", company.Name)
		}
	}

	return nil
}
