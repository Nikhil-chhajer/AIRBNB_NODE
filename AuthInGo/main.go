package main

import (
	"AuthInGo/app"
	"fmt"
)

func main() {
	fmt.Println("hello world")
	cfg := app.Config{
		Addr: ":3001",
	}
	app := app.Application{
		Config: cfg,
	}
	app.Run()
}
