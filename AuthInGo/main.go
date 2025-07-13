package main

import (
	"AuthInGo/app"
	"fmt"
)

func main() {
	fmt.Println("hello world")
	cfg := app.NewConfig(":8080")
	app := app.NewApplication(cfg)
	app.Run()
}
