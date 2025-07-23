package middlewares

import (
	"AuthInGo/dto"
	"AuthInGo/utils"
	"context"
	"net/http"
)

func UserloginRequestValidator(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var payload dto.LoginUserRequestDTO

		if err := utils.ReadJsonBody(r, &payload); err != nil {
			utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid request body", err)
			return
		}

		// Validate the payload using the Validator instance
		if err := utils.Validator.Struct(payload); err != nil {
			utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Validation failed", err)
			return
		}
		// fmt.Println("Payload received for login ", payload)
		curr_ctx := r.Context()
		new_ctx := context.WithValue(curr_ctx, "payload", payload)
		next.ServeHTTP(w, r.WithContext(new_ctx))

	})

}
func UserCreateRequestValidator(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var payload dto.SignUpUserRequestDTO
		if err := utils.ReadJsonBody(r, &payload); err != nil {
			utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid request body", err)
			return
		}

		// Validate the payload using the Validator instance
		if err := utils.Validator.Struct(payload); err != nil {
			utils.WriteJsonErrorResponse(w, http.StatusBadRequest, "Validation failed", err)
			return
		}
		// fmt.Println("Payload received for login ", payload)
		curr_ctx := r.Context()
		new_ctx := context.WithValue(curr_ctx, "payload", payload)
		next.ServeHTTP(w, r.WithContext(new_ctx))

	})

}
