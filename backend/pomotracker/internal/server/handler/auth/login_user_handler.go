package handler

import (
	"github.com/Nerzal/gocloak/v13"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type LoginRequest struct {
	Username string `validate:"required,min=3,max=20"`
	Password string `validate:"required"`
}

type LoginResponse struct {
	Token *gocloak.JWT
}

func (ah *AuthHandler) LoginUser(c *fiber.Ctx) error {
	var request LoginRequest
	err := c.BodyParser(&request)

	if err != nil {
		return err
	}

	validate := validator.New()
	err = validate.Struct(request)

	if err != nil {
		return err
	}

	token, err := ah.IdentityManager.LoginUser(c.UserContext(), request.Username, request.Password)

	if err != nil {
		return err
	}

	var response = &LoginResponse{
		Token: token,
	}

	return c.Status(200).JSON(response)
}
