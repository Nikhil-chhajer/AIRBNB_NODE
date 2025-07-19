package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

func Load() {

	err := godotenv.Load()
	if err != nil {
		fmt.Println("error loading env file")
	}
}
func GetString(Key string, fallback string) string {
	value, ok := os.LookupEnv(Key)
	if !ok {
		return fallback
	}
	return value

}
func GetInt(Key string, fallback int) int {
	value, ok := os.LookupEnv(Key)
	if !ok {
		return fallback
	}
	intValue, err := strconv.Atoi(value)
	if err != nil {
		return fallback
	}
	return intValue

}
func Getbool(Key string, fallback bool) bool {
	value, ok := os.LookupEnv(Key)
	if !ok {
		return fallback
	}
	boolValue, err := strconv.ParseBool(value)
	if err != nil {
		return fallback
	}
	return boolValue

}

// func getkey(Key string,fallback any) any{
//     value, ok := os.LookupEnv(Key)
// 	if !ok {
// 		return fallback
// 	}
// 	return value

// }
