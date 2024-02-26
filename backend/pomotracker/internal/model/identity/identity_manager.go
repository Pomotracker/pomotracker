package identity

import (
	"context"
	"os"

	"github.com/Nerzal/gocloak/v13"
)

type identityManager struct {
	baseUrl             string
	realm               string
	restApiClientId     string
	restApiClientSecret string
}

func NewIdentityManager() *identityManager {
	return &identityManager{
		baseUrl:             os.Getenv(""),
		realm:               os.Getenv(""),
		restApiClientId:     os.Getenv(""),
		restApiClientSecret: os.Getenv(""),
	}
}

func (im *identityManager) loginRestApiClient(ctx context.Context) (*gocloak.JWT, error) {
	client := gocloak.NewClient(im.baseUrl)

	token, err := client.LoginClient(ctx, im.restApiClientId, im.restApiClientSecret, im.realm)

	if err != nil {
		return nil, err
	}

	return token, nil
}
