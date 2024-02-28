package handler

import (
	"fmt"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type LogoutRequest struct {
	RefreshToken string `validate:"required"`
}

type LogoutResponse struct {
	SuccessMessage string
}

func (ah *AuthHandler) LogoutUser(c *fiber.Ctx) error {
	var request LogoutRequest

	err := c.BodyParser(&request)

	if err != nil {

		return err
	}

	var validate = validator.New()
	validate.Struct(request)

	fmt.Println(request.RefreshToken)

	err = ah.IdentityManager.LogoutUser(c.UserContext(), request.RefreshToken)

	if err != nil {
		return err
	}

	return c.Status(200).JSON(&LogoutResponse{SuccessMessage: "Succesfully logged out"})
}
