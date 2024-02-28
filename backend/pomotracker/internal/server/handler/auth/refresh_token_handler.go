package handler

import (
	"github.com/Nerzal/gocloak/v13"
	"github.com/gofiber/fiber/v2"
)

type RefreshRequest struct {
	RefreshToken string
}

type RefreshResponse struct {
	Token *gocloak.JWT
}

func (ah *AuthHandler) Refresh(c *fiber.Ctx) error {
	var request RefreshRequest
	c.BodyParser(&request)
	token, err := ah.IdentityManager.Refresh(c.UserContext(), request.RefreshToken)

	if err != nil {
		return err
	}

	return c.Status(200).JSON(&RefreshResponse{
		Token: token,
	})
}
