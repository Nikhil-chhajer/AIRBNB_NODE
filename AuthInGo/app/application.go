package app

import (
	dbConfig "AuthInGo/config/db"
	config "AuthInGo/config/env"
	"AuthInGo/controllers"

	// db "AuthInGo/db/repositories"
	repo "AuthInGo/db/repositories"
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
	// Store  db.Storage
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
		// Store:  *db.NewStorage(),
	}
}
func (app *Application) Run() error {
	db, err := dbConfig.SetupDB()
	if err != nil {
		fmt.Println("error in connecting DB", err)
		return err
	}
	ur := repo.NewUserRepository(db)
	rr := repo.NewRoleRepository(db)
	rpr := repo.NewRolePermissionRepository(db)
	urr := repo.NewUserRoleRepository(db)

	rs := services.NewRoleService(rr, rpr, urr)
	us := services.NewUserService(ur, rs)
	uc := controllers.NewUserController(us)
	rc := controllers.NewRoleController(rs)
	uRouter := router.NewUserRouter(uc)
	rRouter := router.NewRoleRouter(rc)

	server := &http.Server{
		Addr:         app.Config.Addr,
		Handler:      router.SetupRouter(uRouter, rRouter),
		ReadTimeout:  10 * time.Second, // Set read timeout to 10 seconds
		WriteTimeout: 10 * time.Second, // Set write timeout to 10 seconds
	}
	fmt.Println("starting server at", app.Config.Addr)
	return server.ListenAndServe()

}
