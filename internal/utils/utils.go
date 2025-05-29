package utils

import (
	"E-Bike-Rent/internal/config"
	"E-Bike-Rent/internal/models"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"math/rand"
	"mime/multipart"
	"path/filepath"
	"strconv"
	"time"
)

func SetCookie(c *fiber.Ctx, user *models.User, cfg *config.Config) {
	token, _ := GenerateJWT(user, cfg)
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    token,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		Secure:   false,
		SameSite: "Lax",
	})
}

func GenerateJWT(user *models.User, cfg *config.Config) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = user.ID
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()
	claims["role"] = user.Role

	tokenString, _ := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(cfg.JWTSecret))
	return tokenString, nil
}

func SaveImage(c *fiber.Ctx, file *multipart.FileHeader) (string, error) {
	var filename string
	filename = strconv.FormatInt(time.Now().UnixNano(), 10) + filepath.Ext(file.Filename)
	savePath := "./public/uploads/" + filename
	if err := c.SaveFile(file, savePath); err != nil {
		return "", fmt.Errorf("ошибка при сохранении файла: %w", err)
	}
	return filename, nil
}

func ParseAndValidateJWT(tokenString string, cfg *config.Config) (uint, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(cfg.JWTSecret), nil
	})

	if err != nil || !token.Valid {
		return 0, fmt.Errorf("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok {
		return 0, fmt.Errorf("invalid token claims")

	}
	userID, ok := claims["user_id"].(float64)

	return uint(userID), err
}

func ParseInt(v string) int {
	i, _ := strconv.Atoi(v)
	return i
}

func ParseUint(v string) uint {
	i, _ := strconv.ParseUint(v, 10, 64)
	return uint(i)
}

func ParseFloat(v string) float64 {
	f, _ := strconv.ParseFloat(v, 64)
	return f
}

func GenerateCode() string {
	rand.Seed(time.Now().UnixNano())
	code := fmt.Sprintf("%04d", rand.Intn(10000))
	fmt.Printf(code)
	return code
}
