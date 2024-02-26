package handler

import (
	"pomotracker/internal/server/service"

	"github.com/gofiber/fiber/v2"
)

type ExampleHandler struct {
	Service service.ExampleService
}

func InitExampleHandler(service service.ExampleService) ExampleHandler {
	return ExampleHandler{Service: service}
}

func (eh *ExampleHandler) GetExample(c *fiber.Ctx) error {
	return c.Status(200).JSON(fiber.Map{
		"hello": "world",
	})
}
