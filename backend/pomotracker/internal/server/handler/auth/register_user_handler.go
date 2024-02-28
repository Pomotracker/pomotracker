package handler

import (
	"fmt"
	"strings"

	"github.com/Nerzal/gocloak/v13"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type RegisterRequest struct {
	Username     string `validate:"required,min=3,max=20"`
	Password     string `validate:"required"`
	FirstName    string `validate:"min=1,max=30"`
	LastName     string `validate:"min=1,max=30"`
	Email        string `validate:"required,email"`
	MobileNumber string
}

type RegisterResponse struct {
	User *gocloak.User
}

func (ah *AuthHandler) RegisterUser(c *fiber.Ctx) error {

	var request RegisterRequest
	err := c.BodyParser(&request)

	if err != nil {
		fmt.Println("ERROR")
		return err
	}

	var validate = validator.New()
	err = validate.Struct(request)

	if err != nil {
		fmt.Println(err)
		return err
	}

	user := gocloak.User{
		Username:      gocloak.StringP(request.Username),
		FirstName:     gocloak.StringP(request.FirstName),
		LastName:      gocloak.StringP(request.LastName),
		Email:         gocloak.StringP(request.Email),
		EmailVerified: gocloak.BoolP(true),
		Enabled:       gocloak.BoolP(true),
		Attributes:    &map[string][]string{},
	}

	if strings.TrimSpace(request.MobileNumber) != "" {
		(*user.Attributes)["mobile"] = []string{request.MobileNumber}
	}

	userResponse, _, err := ah.IdentityManager.CreateUser(c.UserContext(), user, request.Password, "user")

	if err != nil {
		fmt.Print(err)
		return err
	}

	var response = &RegisterResponse{User: userResponse}
	return c.Status(200).JSON(response)
}
