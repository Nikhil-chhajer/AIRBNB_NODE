package main

import (
	"AuthInGo/app"
	dbConfig "AuthInGo/config/db"
	config "AuthInGo/config/env"
	"fmt"
)

func main() {
	config.Load()
	fmt.Println("hello world")
	cfg := app.NewConfig()
	app := app.NewApplication(cfg)
	dbConfig.SetupDB()
	app.Run()
}
