package config

import (
	env "AuthInGo/config/env"
	"database/sql"
	"fmt"

	"github.com/go-sql-driver/mysql"
)

func SetupDB() (*sql.DB, error) {
	cfg := mysql.NewConfig()
	cfg.User = env.GetString("DB_USER", "root")
	cfg.Passwd = env.GetString("DB_PASSWORD", "root")
	cfg.Net = "tcp"
	cfg.Addr = env.GetString("DB_ADDR", "127.0.0.1:3306")
	cfg.DBName = env.GetString("DB_Name", "auth_dev")
	fmt.Println("Connecting to database", cfg.DBName, cfg.FormatDSN())

	//cfg.formatDsn() takes all set of config properties (cf.user,cfg.password ,etc) and convert it to specific string that is dataconnection string
	//instead of passing cfg.FormatDSN we can pass "root:9214@tcp(127.0.0.1:3306)/auth_dev" to sql.open as second parameter and
	// we dont to write cfg.user ="" and all that just directly pass the above string infact formatDSN take config properties and convert them into the above string
	db, err := sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		fmt.Println("error in connecting DB")
		return nil, err
	}
	fmt.Println("trying to connecting DB")
	pingErr := db.Ping()
	if pingErr != nil {
		fmt.Println("Error in pinging DB")
		return nil, pingErr
	}
	fmt.Println("connected to DB", cfg.DBName)
	return db, nil

}
