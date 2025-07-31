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

func SetupRouter(UserRouter Router, RoleRouter Router) *chi.Mux {
	chiRouter := chi.NewRouter()
	chiRouter.Use(middlewares.RateLimitMiddleware)
	chiRouter.HandleFunc("/fakestoreservice/*", utils.ProxyToService("https://fakestoreapi.in", "/fakestoreservice"))
	chiRouter.HandleFunc("/api/v1/hotelservice/*", utils.ProxyServiceToHotel("http://localhost:3000", "/api/v1/hotelservice"))
	chiRouter.HandleFunc("/api/v1/bookingservice/*", utils.ProxyServiceToBooking("http://localhost:3001", "/api/v1/bookingservice"))
	chiRouter.Get("/ping", controllers.PingHandler)
	UserRouter.Register(chiRouter)
	RoleRouter.Register(chiRouter)
	return chiRouter
}

//http://localhost:3001/fakestoreservice/products/category
