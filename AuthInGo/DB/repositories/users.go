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
	GetByEmail(email string) (*models.User, error)
	SaveMFASecret(userId int64, secret string) error
	GetMFASecret(userId int64) (string, error)
	EnableMFA(userId int64) error
	MarkUserAsVerified(email string) error
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
	query := "select id,username,email,password,created_at,updated_at from users where email=?"
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
	query := "SELECT id, email, password, mfa_enabled FROM users WHERE id = ?"
	//step 2:Execute the query
	row := u.db.QueryRow(query, id) //return single row
	//u.db.Query() return multiple rows
	//step 3 :Process the result of the query
	user := &models.User{}
	err := row.Scan(&user.Id, &user.Email, &user.Password, &user.MFAEnabled)
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
func (u *UserRepositoryImpl) MarkUserAsVerified(email string) error {
	query := "UPDATE users SET is_verified = true WHERE email = ?"
	result, err := u.db.Exec(query, email)
	if err != nil {
		fmt.Println("Error marking user as verified:", err)
		return err
	}

	rowsAffected, rowErr := result.RowsAffected()
	if rowErr != nil {
		fmt.Println("Error getting rows affected:", rowErr)
		return rowErr
	}
	if rowsAffected == 0 {
		fmt.Println("No rows were affected, user not marked as verified")
		return nil
	}
	fmt.Println("User marked as verified successfully, rows affected:", rowsAffected)
	return nil
}
func (u *UserRepositoryImpl) GetByEmail(email string) (*models.User, error) {
	query := "SELECT id, email, password,mfa_enabled,is_verified FROM users WHERE email = ?"

	row := u.db.QueryRow(query, email)

	user := &models.User{}

	err := row.Scan(&user.Id, &user.Email, &user.Password, &user.MFAEnabled, &user.Is_Verified) // hashed password

	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("No user found with the given email")
			return nil, err
		} else {
			fmt.Println("Error scanning user:", err)
			return nil, err
		}
	}

	return user, nil
}
func (u *UserRepositoryImpl) SaveMFASecret(userId int64, secret string) error {
	query := "UPDATE users SET mfa_secret = ? WHERE id = ?"
	result, err := u.db.Exec(query, secret, userId)
	if err != nil {
		fmt.Println("Error saving MFA secret:", err)
		return err
	}

	rowsAffected, rowErr := result.RowsAffected()
	if rowErr != nil {
		fmt.Println("Error getting rows affected:", rowErr)
		return rowErr
	}
	if rowsAffected == 0 {
		fmt.Println("No rows were affected, MFA secret not saved")
		return nil
	}
	fmt.Println("MFA secret saved successfully, rows affected:", rowsAffected)
	return nil
}
func (u *UserRepositoryImpl) GetMFASecret(userId int64) (string, error) {
	query := "SELECT mfa_secret FROM users WHERE id = ?"

	row := u.db.QueryRow(query, userId)

	var secret string

	err := row.Scan(&secret)

	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("No MFA secret found for the user")
			return "", err
		} else {
			fmt.Println("Error scanning MFA secret:", err)
			return "", err
		}
	}
	return secret, nil
}
func (u *UserRepositoryImpl) EnableMFA(userId int64) error {
	query := "UPDATE users SET mfa_enabled = true WHERE id = ?"
	result, err := u.db.Exec(query, userId)
	if err != nil {
		fmt.Println("Error enabling MFA:", err)
		return err
	}

	rowsAffected, rowErr := result.RowsAffected()
	if rowErr != nil {
		fmt.Println("Error getting rows affected:", rowErr)
		return rowErr
	}
	if rowsAffected == 0 {
		fmt.Println("No rows were affected, MFA not enabled")
		return nil
	}
	fmt.Println("MFA enabled successfully, rows affected:", rowsAffected)
	return nil
}
