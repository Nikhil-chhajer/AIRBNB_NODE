package db

import (
	"AuthInGo/models"

	"database/sql"
	"fmt"
	"time"
)

type UserRepository interface {
	GetUserById(id string) (*models.User, error)
	Create(username string, email string, hashedpassword string) (*models.User, error)
	GetAll() ([]*models.User, error)
	DeleteByID(id int64) error
	LoginUser(email string) (*models.User, error)
}
type UserRepositoryImpl struct {
	db *sql.DB
}

func NewUserRepository(_db *sql.DB) UserRepository {
	return &UserRepositoryImpl{
		db: _db,
	}
}
func (u *UserRepositoryImpl) GetAll() ([]*models.User, error) {
	return nil, nil
}
func (u *UserRepositoryImpl) DeleteByID(id int64) error {
	return nil
}
func (u *UserRepositoryImpl) LoginUser(email string) (*models.User, error) {
	query := "select * from users where email=?"
	result := u.db.QueryRow(query, email)

	user := &models.User{}
	err := result.Scan(&user.Id, &user.Username, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("no user found")
			return nil, err
		} else {
			fmt.Println("error in finding user")
			return nil, err
		}
	}

	// fmt.Println(user)
	// response := utils.CheckPasswordHash(hashedPassword, plainPassword)
	// if !response {
	// 	fmt.Println("Wrong password")
	// 	return nil
	// }
	return user, nil
}
func (u *UserRepositoryImpl) Create(username string, email string, hashedpassword string) (*models.User, error) {
	fmt.Println(username, email, hashedpassword)
	query := "Insert into users(username,email,password) value(?,?,?)"
	result, err := u.db.Exec(query, username, email, hashedpassword) //Exec does not return any rows
	if err != nil {
		fmt.Println("error crating user")
		return nil, err
	}
	rowsAffected, rowErr := result.RowsAffected()
	if rowErr != nil {
		fmt.Println("error getting rows affected", rowErr)
		return nil, rowErr
	}
	if rowsAffected == 0 {
		fmt.Println("No rows were created,user not created")
		return nil, nil
	}
	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}
	user := &models.User{
		Id:        id,
		Username:  username,
		Email:     email,
		Password:  hashedpassword,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	// fmt.Println(",user created and rows affected ", rowsAffected)
	return user, nil

}

func (u *UserRepositoryImpl) GetUserById(id string) (*models.User, error) {

	//step 1:Prepare Query
	query := "SELECT * FROM Users WHERE id = ?"
	//step 2:Execute the query
	row := u.db.QueryRow(query, id) //return single row
	//u.db.Query() return multiple rows
	//step 3 :Process the result of the query
	user := &models.User{}
	err := row.Scan(&user.Id, &user.Username, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("no user found")
			return nil, err
		} else {
			fmt.Println("error in finding user")
			return nil, err
		}
	}
	//step 4 :Print the Result
	// fmt.Println(user)

	return user, nil
}
