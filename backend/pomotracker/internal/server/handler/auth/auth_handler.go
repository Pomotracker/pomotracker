package handler

import (
	"pomotracker/internal/identity"
)

type AuthHandler struct {
	IdentityManager *identity.IdentityManager
}

func InitAuthHandler() *AuthHandler {
	return &AuthHandler{
		IdentityManager: identity.NewIdentityManager(),
	}
}
