package main

import (
	"fmt"
	"os"
	"pomotracker/internal/database"
	"pomotracker/internal/server/dao"
	"pomotracker/internal/server/handler"
	"pomotracker/internal/server/route"
	"pomotracker/internal/server/service"
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

	eDAO := dao.InitExampleDAO(db)
	eService := service.InitExampleService(eDAO)
	eHandler := handler.InitExampleHandler(eService)

	route.SetupExampleRoute(server, eHandler)

	port, _ := strconv.Atoi(os.Getenv("PORT"))
	err := server.Listen(fmt.Sprintf(":%d", port))
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}
}
