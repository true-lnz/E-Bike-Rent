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
		addTriggers(db)
		if err = populateDB(db); err != nil {
			log.Printf("failed to populate DB: %v", err)
			return
		}
	})

	if db == nil {
		return nil, err
	}

	return db, nil
}

func addTriggers(db *gorm.DB) {
	//db.Exec(`
	//	CREATE TRIGGER IF NOT EXISTS update_average_rating_after_insert
	//	AFTER INSERT ON reviews
	//	BEGIN
	//	  UPDATE split_systems
	//	  SET average_rating = (
	//		SELECT AVG(rating)
	//		FROM reviews
	//		WHERE split_system_id = NEW.split_system_id
	//	  )
	//	  WHERE id = NEW.split_system_id;
	//	END;
	//`)
	//db.Exec(`
	//	CREATE TRIGGER IF NOT EXISTS update_average_rating_after_update
	//	AFTER UPDATE ON reviews
	//	BEGIN
	//	  UPDATE split_systems
	//	  SET average_rating = (
	//		SELECT AVG(rating)
	//		FROM reviews
	//		WHERE split_system_id = NEW.split_system_id
	//	  )
	//	  WHERE id = NEW.split_system_id;
	//	END;
	//`)
	//
	//db.Exec(`
	//	CREATE TRIGGER IF NOT EXISTS update_average_rating_after_delete
	//	AFTER DELETE ON reviews
	//	BEGIN
	//	  UPDATE split_systems
	//	  SET average_rating = (
	//		SELECT AVG(rating)
	//		FROM reviews
	//		WHERE split_system_id = OLD.split_system_id
	//	  )
	//	  WHERE id = OLD.split_system_id;
	//	END;
	//`)

}

func populateDB(db *gorm.DB) error {
	//	var brands = []models.Brand{
	//		{Name: "Tosot"}, {Name: "Lessar"}, {Name: "Midea"}, {Name: "Mitsubishi"},
	//		{Name: "Ballu"}, {Name: "Samsung"}, {Name: "LG"}, {Name: "Panasonic"},
	//		{Name: "Daikin"}, {Name: "Hitachi"}, {Name: "DEXP"}, {Name: "Centek"},
	//		{Name: "Electrolux"}, {Name: "Haier"}, {Name: "TCL"}, {Name: "Aceline"},
	//		{Name: "Bosch"}, {Name: "Daichi"}, {Name: "EcoClima"}, {Name: "Loriot"},
	//		{Name: "Marsa"}, {Name: "Pioneer"}, {Name: "Thermex"}, {Name: "iFFALCON"},
	//		{Name: "GoldStar"}, {Name: "Jax"}, {Name: "Candy"},
	//	}
	//	for _, b := range brands {
	//		db.FirstOrCreate(&b, models.Brand{Name: b.Name})
	//	}
	//
	//	var types = []models.Type{
	//		{Name: "Настенные"}, {Name: "Кассетные"}, {Name: "Канальные"},
	//		{Name: "Напольно-потолочные"}, {Name: "Мультисплит-системы"},
	//	}
	//	for _, t := range types {
	//		db.FirstOrCreate(&t, models.Type{Name: t.Name})
	//	}
	//
	//	var modes = []models.Mode{
	//		{Name: "охлаждение"}, {Name: "обогрев"}, {Name: "осушение"}, {Name: "вентиляция"},
	//	}
	//	for _, m := range modes {
	//		db.FirstOrCreate(&m, models.Mode{Name: m.Name})
	//	}
	//
	//	var energyClasses = []models.EnergyClass{
	//		{Name: "A+++"}, {Name: "A++"}, {Name: "A+"}, {Name: "A"}, {Name: "B"}, {Name: "C"}, {Name: "D"},
	//	}
	//	for _, e := range energyClasses {
	//		db.FirstOrCreate(&e, models.EnergyClass{Name: e.Name})
	//	}
	//
	//	var brand models.Brand
	//	db.First(&brand, "name = ?", "LG")
	//
	//	var t models.Type
	//	db.First(&t, "name = ?", "Настенные")
	//
	//	var coolingClass, heatingClass models.EnergyClass
	//	db.First(&coolingClass, "name = ?", "A++")
	//	db.First(&heatingClass, "name = ?", "A+")
	//
	//	var modesList []models.Mode
	//	db.Where("name IN ?", []string{"охлаждение", "обогрев"}).Find(&modesList)
	//
	//	if err := SeedSplitSystemsFromJSON(db, "internal/database/data/systems_seed.json"); err != nil {
	//		log.Fatal(err)
	//		return err
	//	}
	//	if err := LoadArticlesIfEmpty(db, "internal/database/data/articles_seed.json"); err != nil {
	//		log.Fatal(err)
	//		return err
	//	}
	//	fmt.Println("Database seeded successfully")
	return nil
}

//func LoadArticlesIfEmpty(db *gorm.DB, filePath string) error {
//	file, err := os.Open(filePath)
//	if err != nil {
//		log.Printf("Не удалось открыть JSON-файл: %v\n", err)
//		return err
//	}
//	defer file.Close()
//
//	data, err := ioutil.ReadAll(file)
//	if err != nil {
//		log.Printf("Не удалось прочитать JSON-файл: %v\n", err)
//		return err
//	}
//
//	var articles []models.Article
//	if err := json.Unmarshal(data, &articles); err != nil {
//		log.Printf("Ошибка при парсинге JSON: %v\n", err)
//		return err
//	}
//
//	var added int
//	for _, article := range articles {
//		var existing models.Article
//		err := db.Where("title = ? AND description = ?", article.Title, article.Description).First(&existing).Error
//		if errors.Is(err, gorm.ErrRecordNotFound) {
//			if err := db.Create(&article).Error; err != nil {
//				log.Printf("Ошибка при добавлении статьи '%s': %v", article.Title, err)
//				continue
//			}
//			added++
//		} else if err != nil {
//			log.Printf("Ошибка при проверке существования статьи: %v", err)
//		}
//	}
//
//	log.Printf("Добавлено новых статей: %d\n", added)
//	return nil
//}
//
//type SplitSystemSeed struct {
//	Title            string   `json:"title,omitempty"`
//	ShortDescription string   `json:"short_description"`
//	LongDescription  string   `json:"long_description"`
//	Brand            string   `json:"brand,omitempty"`
//	Type             string   `json:"type,omitempty"`
//	Price            int      `json:"price,omitempty"`
//	HasInverter      bool     `json:"has_inverter,omitempty"`
//	RecommendedArea  float64  `json:"recommended_area,omitempty"`
//	CoolingPower     float64  `json:"cooling_power,omitempty"`
//	CoolingClass     string   `json:"cooling_class,omitempty"`
//	HeatingClass     string   `json:"heating_class,omitempty"`
//	MinNoise         float64  `json:"min_noise,omitempty"`
//	MaxNoise         float64  `json:"max_noise,omitempty"`
//	ExternalWidth    int      `json:"external_width,omitempty"`
//	ExternalHeight   int      `json:"external_height,omitempty"`
//	ExternalDepth    int      `json:"external_depth,omitempty"`
//	ExternalWeight   float64  `json:"external_weight,omitempty"`
//	InternalWidth    int      `json:"internal_width,omitempty"`
//	InternalHeight   int      `json:"internal_height,omitempty"`
//	InternalDepth    int      `json:"internal_depth,omitempty"`
//	InternalWeight   float64  `json:"internal_weight,omitempty"`
//	Modes            []string `json:"modes,omitempty"`
//	ImageURL         string   `json:"image_url,omitempty"`
//}
//
//func SeedSplitSystemsFromJSON(db *gorm.DB, filePath string) error {
//	data, err := os.ReadFile(filePath)
//	if err != nil {
//		return fmt.Errorf("read json: %w", err)
//	}
//
//	var systems []SplitSystemSeed
//	if err = json.Unmarshal(data, &systems); err != nil {
//		return fmt.Errorf("unmarshal json: %w", err)
//	}
//
//	for _, s := range systems {
//		var brand models.Brand
//		var t models.Type
//		var coolClass, heatClass models.EnergyClass
//		var modes []models.Mode
//
//		db.First(&brand, "name = ?", s.Brand)
//		db.First(&t, "name = ?", s.Type)
//		db.First(&coolClass, "name = ?", s.CoolingClass)
//		db.First(&heatClass, "name = ?", s.HeatingClass)
//		db.Where("name IN ?", s.Modes).Find(&modes)
//
//		system := models.SplitSystem{
//			Title:                s.Title,
//			ShortDescription:     s.ShortDescription,
//			LongDescription:      s.LongDescription,
//			BrandID:              brand.ID,
//			TypeID:               t.ID,
//			Price:                s.Price,
//			HasInverter:          s.HasInverter,
//			RecommendedArea:      s.RecommendedArea,
//			CoolingPower:         s.CoolingPower,
//			EnergyClassCoolingID: coolClass.ID,
//			EnergyClassHeatingID: heatClass.ID,
//			MinNoiseLevel:        s.MinNoise,
//			MaxNoiseLevel:        s.MaxNoise,
//			ExternalWidth:        s.ExternalWidth,
//			ExternalHeight:       s.ExternalHeight,
//			ExternalDepth:        s.ExternalDepth,
//			ExternalWeight:       s.ExternalWeight,
//			InternalWidth:        s.InternalWidth,
//			InternalHeight:       s.InternalHeight,
//			InternalDepth:        s.InternalDepth,
//			InternalWeight:       s.InternalWeight,
//			ImageURL:             s.ImageURL,
//		}
//
//		db.FirstOrCreate(&system, models.SplitSystem{Title: s.Title})
//		if len(modes) > 0 {
//			db.Model(&system).Association("Modes").Replace(&modes)
//		}
//	}
//
//	fmt.Println("Split systems loaded from JSON.")
//	return nil
//}
