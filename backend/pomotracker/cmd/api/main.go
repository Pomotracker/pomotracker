package main

import (
	"fmt"
	"pomotracker/internal/server"
)

func main() {

	fmt.Println("running server")
	server := server.NewServer()

	err := server.ListenAndServe()
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}
}
