package utils

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
)

var Validator *validator.Validate

func init() {
	Validator = NewValidator()
}
func NewValidator() *validator.Validate {
	return validator.New(validator.WithRequiredStructEnabled()) //struct level validation
}
func WriteJsonResponse(w http.ResponseWriter, status int, data any) error {
	w.Header().Set("Content-Type", "application/json") //set content type to application/json
	w.WriteHeader(status)
	//NewEncoder encode the json means create a json and Encode will insert the data into json
	return json.NewEncoder(w).Encode(data)

}
func WriteJsonSuccessResponse(w http.ResponseWriter, status int, message string, data any) error {
	response := map[string]any{}
	response["status"] = "success"
	response["message"] = message
	response["data"] = data
	return WriteJsonResponse(w, status, response)

}
func WriteJsonErrorResponse(w http.ResponseWriter, status int, message string, err error) error {
	response := map[string]any{}
	response["status"] = "error"
	response["message"] = message
	if ve, ok := err.(validator.ValidationErrors); ok {
		errors := make(map[string]string)
		for _, fe := range ve {
			errors[fe.Field()] = fmt.Sprintf("Field validation for '%s' failed on '%s' constraint", fe.Field(), fe.Tag())
		}
		response["error"] = errors
	} else {
		response["error"] = err.Error()
	}
	return WriteJsonResponse(w, status, response)

}
func ReadJsonBody(r *http.Request, result any) error {
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	return decoder.Decode(result) //decoded value set into result
}
