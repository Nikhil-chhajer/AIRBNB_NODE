package utils

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
)

func ProxyToService(targetBaseUrl string, pathPrefix string) http.HandlerFunc {
	target, err := url.Parse(targetBaseUrl) //parse the url and create go based url object out of it
	if err != nil {
		fmt.Println("Error parsing target URL :", err)
		return nil
	}
	proxy := httputil.NewSingleHostReverseProxy(target) //proxy object created which has capability to forward request to main microservices
	originalDirector := proxy.Director                  //director is a field in proxy object through which we can modify the request like adding something to header and removing/adding some part to url of request etc..

	proxy.Director = func(r *http.Request) {
		originalDirector(r)
		r.Host = target.Host //host of target (local host ) becomes the host of our request
		fmt.Println(" the target base url  is :", targetBaseUrl)
		fmt.Println("the original request by user is :", r.URL.Path)
		fmt.Println("path prefix is:", pathPrefix)
		r.URL.Path = strings.TrimPrefix(r.URL.Path, pathPrefix)
		fmt.Println("modifying the request to :", r.URL.Path)
		fmt.Println("proxing the request to :", targetBaseUrl+r.URL.Path)

		//eg: localhost/hotel/service/:id and we want to trim /hotel/service then pathprefix will be /hotel/service
		if userId, ok := r.Context().Value("userID").(string); ok {
			r.Header.Set("X-User-ID", userId)
		}

	}
	return proxy.ServeHTTP //servehttp is a handlerfunction and handler func are part of chain of middleware or we can say that every handler func is middleware func
}
