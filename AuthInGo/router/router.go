package router

import (
	"AuthInGo/controllers"
	"AuthInGo/middlewares"
	"AuthInGo/utils"

	"github.com/go-chi/chi/v5"
)

type Router interface {
	Register(r chi.Router)
}

func SetupRouter(UserRouter Router) *chi.Mux {
	chiRouter := chi.NewRouter()
	chiRouter.Use(middlewares.RateLimitMiddleware)
	chiRouter.HandleFunc("/fakestoreservice/*", utils.ProxyToService("https://fakestoreapi.in", "/fakestoreservice"))
	chiRouter.Get("/ping", controllers.PingHandler)
	UserRouter.Register(chiRouter)
	return chiRouter
}

//http://localhost:3001/fakestoreservice/products/category
