package route

import (
	handler "pomotracker/internal/server/handler/auth"

	"github.com/gofiber/fiber/v2"
)

func SetupAuthRoute(app *fiber.App, handler handler.AuthHandler) {
	apiGroup := app.Group("/api/v1/auth")
	apiGroup.Post("/login", handler.RegisterUser)
}
