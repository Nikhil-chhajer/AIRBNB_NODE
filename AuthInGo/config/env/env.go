package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func load() {

	err := godotenv.Load()
	if err != nil {
		fmt.Println("error loading env file")
	}
}
func GetString(Key string, fallback string) string {
	load()
	value, ok := os.LookupEnv(Key)
	if !ok {
		return fallback
	}
	return value

}
