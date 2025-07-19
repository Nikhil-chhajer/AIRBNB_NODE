package app

import (
	db "AuthInGo/DB/repositories"
	repo "AuthInGo/DB/repositories"
	dbConfig "AuthInGo/config/db"
	config "AuthInGo/config/env"
	"AuthInGo/controllers"
	"AuthInGo/router"
	"AuthInGo/services"
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
	Store  db.Storage
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
		Store:  *db.NewStorage(),
	}
}
func (app *Application) Run() error {
	db, err := dbConfig.SetupDB()
	if err != nil {
		fmt.Println("error in connecting DB", err)
		return err
	}
	ur := repo.NewUserRepository(db)
	us := services.NewUserService(ur)
	uc := controllers.NewUserController(us)
	uRouter := router.NewUserRouter(uc)
	server := &http.Server{
		Addr:         app.Config.Addr,
		Handler:      router.SetupRouter(uRouter), //todo chi will setuo here
		ReadTimeout:  10 * time.Second,            // set read timeout to 10 sec
		WriteTimeout: 10 * time.Second,            // set write timeout to 10 sec
	}
	fmt.Println("starting server at", app.Config.Addr)
	return server.ListenAndServe()

}
