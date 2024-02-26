package route

import (
	"pomotracker/internal/server/handler"

	"github.com/gofiber/fiber/v2"
)

func SetupExampleRoute(app *fiber.App, handler handler.ExampleHandler) {
	apiGroup := app.Group("/api/v1/example")
	apiGroup.Get("", handler.GetExample)
}
