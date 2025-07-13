package app

import (
	config "AuthInGo/config/env"
	"fmt"
	"net/http"
	"time"
)

// Config holds the configuration for the server
type Config struct {
	Addr string //PORT
}
type Application struct {
	Config Config
}

func NewConfig() Config {

	port := config.GetString("PORT", ":8080")

	return Config{
		Addr: port,
	}

}
func NewApplication(cfg Config) *Application {
	return &Application{
		Config: cfg,
	}
}
func (app *Application) Run() error {
	server := &http.Server{
		Addr:         app.Config.Addr,
		Handler:      nil,              //todo chi will setuo here
		ReadTimeout:  10 * time.Second, // set read timeout to 10 sec
		WriteTimeout: 10 * time.Second, // set write timeout to 10 sec
	}
	fmt.Println("starting server at", app.Config.Addr)
	return server.ListenAndServe()

}
