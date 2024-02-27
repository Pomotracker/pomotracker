package main

import (
	"fmt"
	"os"
	"pomotracker/internal/database"
	handler "pomotracker/internal/server/handler/auth"
	"pomotracker/internal/server/route"
	"strconv"

	"github.com/gofiber/fiber/v2"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	db := database.SetupDB()

	defer func() {
		dbInstance, _ := db.DB()
		_ = dbInstance.Close()
	}()

	server := fiber.New()

	aHandler := handler.InitAuthHandler()

	route.SetupAuthRoute(server, *aHandler)

	port, _ := strconv.Atoi(os.Getenv("PORT"))
	err := server.Listen(fmt.Sprintf(":%d", port))
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}
}
