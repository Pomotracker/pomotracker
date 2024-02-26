package dao

import "gorm.io/gorm"

type ExampleDAO struct {
	Db *gorm.DB
}

func InitExampleDAO(db *gorm.DB) ExampleDAO {
	return ExampleDAO{Db: db}
}
