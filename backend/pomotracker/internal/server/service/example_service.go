package service

import "pomotracker/internal/server/dao"

type ExampleService struct {
	DAO dao.ExampleDAO
}

func InitExampleService(dao dao.ExampleDAO) ExampleService {
	return ExampleService{DAO: dao}
}
