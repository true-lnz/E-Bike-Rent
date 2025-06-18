package database

import (
	"E-Bike-Rent/internal/config"
	"E-Bike-Rent/internal/models"
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
	"sync"
)

var (
	db   *gorm.DB
	once sync.Once
)

func GetConnection(cfg config.DatabaseConfig) (*gorm.DB, error) {
	var err error
	once.Do(func() {
		var dsn string
		switch cfg.Driver {
		case "sqlite":
			dsn = cfg.Name
			db, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{})
		case "postgres":
			dsn = fmt.Sprintf(
				"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
				cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.Name,
			)
			db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		default:
			err = fmt.Errorf("unsupported database driver: %s", cfg.Driver)
		}

		if err != nil {
			return
		}

		err = db.AutoMigrate(
			&models.Company{},
			&models.User{},
			&models.Bicycle{},
			&models.Accessory{},
			&models.Rent{},
			&models.Maintenance{},
		)
		if err != nil {
			log.Printf("failed to populate DB: %v", err)
		}
	})

	if db == nil {
		return nil, err
	}

	return db, nil
}
