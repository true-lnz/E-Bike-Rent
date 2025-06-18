package handlers

import (
	"E-Bike-Rent/internal/dto"
	"E-Bike-Rent/internal/models"
	"E-Bike-Rent/internal/services"
	"E-Bike-Rent/internal/utils"
	"github.com/gofiber/fiber/v2"
)

func GetAllBicycles(bicycleService *services.BicycleService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		all, err := bicycleService.GetAll(c.Context())

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(all)
	}
}

func GetBicycleInformation(bicycleService *services.BicycleService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		bicycleID := utils.ParseUint(c.Params("id"))
		information, err := bicycleService.GetInformation(c.Context(), bicycleID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(information)
	}
}

func CreateBicycle(bicycleService *services.BicycleService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		form, err := c.MultipartForm()
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "invalid multipart form",
			})
		}

		get := func(key string) string {
			if v, ok := form.Value[key]; ok && len(v) > 0 {
				return v[0]
			}
			return ""
		}

		weight := utils.ParseInt(get("weight"))
		maxSpeed := utils.ParseInt(get("max_speed"))
		maxRange := utils.ParseInt(get("max_range"))
		maxLoad := utils.ParseInt(get("max_load"))
		power := utils.ParseInt(get("power"))

		oneWeekPrice := utils.ParseInt(get("one_week_price"))
		twoWeekPrice := utils.ParseInt(get("one_week_price"))
		monthPrice := utils.ParseInt(get("month_price"))

		quantity := utils.ParseInt(get("quantity"))
		suspension := utils.ParseBool(get("suspension"))
		wheelSize := utils.ParseByte(get("wheel_size"))

		bicycle := &models.Bicycle{
			Name:            get("name"),
			Weight:          weight,
			MaxSpeed:        maxSpeed,
			MaxRange:        maxRange,
			MaxLoad:         maxLoad,
			Power:           power,
			ChargeTimeHours: get("charge_time_hours"),
			Battery:         get("battery"),
			Suspension:      suspension,
			Brakes:          get("brakes"),
			Frame:           get("frame"),
			WheelSize:       wheelSize,
			WheelType:       get("wheel_type"),
			Drive:           get("drive"),
			BrakeSystem:     get("brake_system"),
			OneWeekPrice:    oneWeekPrice,
			TwoWeekPrice:    twoWeekPrice,
			MonthPrice:      monthPrice,
			Quantity:        quantity,
		}

		created, err := bicycleService.Create(c, bicycle)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.JSON(created)
	}
}
func UpdateBicycle(bicycleService *services.BicycleService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		bicycleID := utils.ParseUint(c.Params("id"))
		form, err := c.MultipartForm()
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "invalid multipart form",
			})
		}

		get := func(key string) string {
			if v, ok := form.Value[key]; ok && len(v) > 0 {
				return v[0]
			}
			return ""
		}

		req := &dto.UpdateBicycleRequest{
			Name:            utils.ToPtr(get("name")),
			Weight:          utils.ToIntPtr(get("weight")),
			MaxSpeed:        utils.ToIntPtr(get("max_speed")),
			MaxRange:        utils.ToIntPtr(get("max_range")),
			MaxLoad:         utils.ToIntPtr(get("max_load")),
			Power:           utils.ToIntPtr(get("power")),
			ChargeTimeHours: utils.ToPtr(get("charge_time_hours")),
			Battery:         utils.ToPtr(get("battery")),
			Suspension:      utils.ToBoolPtr(get("suspension")),
			Brakes:          utils.ToPtr(get("brakes")),
			Frame:           utils.ToPtr(get("frame")),
			WheelSize:       utils.ToBytePtr(get("wheel_size")),
			WheelType:       utils.ToPtr(get("wheel_type")),
			Drive:           utils.ToPtr(get("drive")),
			BrakeSystem:     utils.ToPtr(get("brake_system")),
			OneWeekPrice:    utils.ToIntPtr(get("one_week_price")),
			TwoWeekPrice:    utils.ToIntPtr(get("two_week_price")),
			MonthPrice:      utils.ToIntPtr(get("month_price")),
			Quantity:        utils.ToIntPtr(get("quantity")),
		}

		updated, err := bicycleService.Update(c, req, bicycleID)
		if err != nil {
			return err
		}
		return c.JSON(updated)
	}
}

func DeleteBicycle(bicycleService *services.BicycleService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		bicycleID := utils.ParseUint(c.Params("id"))
		err := bicycleService.Delete(c.Context(), bicycleID)
		if err != nil {
			return err
		}
		return c.SendStatus(fiber.StatusNoContent)
	}
}
