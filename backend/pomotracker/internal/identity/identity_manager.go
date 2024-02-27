package identity

import (
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/Nerzal/gocloak/v13"
	"github.com/pkg/errors"
)

type IdentityManager struct {
	baseUrl             string
	realm               string
	restApiClientId     string
	restApiClientSecret string
}

func NewIdentityManager() *IdentityManager {
	return &IdentityManager{
		baseUrl:             os.Getenv("KC_BASE_URL"),
		realm:               os.Getenv("KC_REALM"),
		restApiClientId:     os.Getenv("KC_CLIENT_ID"),
		restApiClientSecret: os.Getenv("KC_CLIENT_SECRET"),
	}
}

// this function is responsible for connecting this backend api to the keycloak server before doing any other operations
func (im *IdentityManager) loginRestApiClient(ctx context.Context) (*gocloak.JWT, error) {

	client := gocloak.NewClient(im.baseUrl)

	token, err := client.LoginClient(ctx, im.restApiClientId, im.restApiClientSecret, im.realm)

	if err != nil {
		return nil, err
	}

	return token, nil
}

func (im *IdentityManager) CreateUser(ctx context.Context, user gocloak.User, password string, role string) (*gocloak.User, *gocloak.JWT, error) {
	token, err := im.loginRestApiClient(ctx)
	if err != nil {
		return nil, nil, err
	}

	client := gocloak.NewClient(im.baseUrl)

	userId, err := client.CreateUser(ctx, token.AccessToken, im.realm, user)
	if err != nil {
		return nil, nil, errors.Wrap(err, "unable to create the user")
	}

	err = client.SetPassword(ctx, token.AccessToken, userId, im.realm, password, false)
	if err != nil {
		return nil, nil, errors.Wrap(err, "unable to set the password for the user")
	}

	var roleNameLowerCase = strings.ToLower(role)
	roleKeycloak, err := client.GetRealmRole(ctx, token.AccessToken, im.realm, roleNameLowerCase)
	if err != nil {
		return nil, nil, errors.Wrap(err, fmt.Sprintf("unable to get role by name: '%v'", roleNameLowerCase))
	}

	err = client.AddRealmRoleToUser(ctx, token.AccessToken, im.realm, userId, []gocloak.Role{
		*roleKeycloak,
	})
	if err != nil {
		return nil, nil, errors.Wrap(err, "unable to add a realm role to user")
	}

	userKeycloak, err := client.GetUserByID(ctx, token.AccessToken, im.realm, userId)
	if err != nil {
		return nil, nil, errors.Wrap(err, "unable to get recently created user")
	}

	return userKeycloak, token, nil
}

func (im *IdentityManager) LoginUser(ctx context.Context, username string, password string) (*gocloak.JWT, error) {
	_, err := im.loginRestApiClient(ctx)

	if err != nil {
		return nil, err
	}

	client := gocloak.NewClient(im.baseUrl)

	userToken, err := client.Login(ctx, im.restApiClientId, im.restApiClientSecret, im.realm, username, password)
	if err != nil {
		return nil, err
	}

	return userToken, nil
}
