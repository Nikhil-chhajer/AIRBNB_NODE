package main

import (
	"AuthInGo/app"
	"fmt"
)

func main() {
	fmt.Println("hello world")
	cfg := app.NewConfig()
	app := app.NewApplication(cfg)
	app.Run()
}
