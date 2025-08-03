package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "modernc.org/sqlite"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID        uint      `json:"id" gorm:"primary_key"`
	Username  string    `json:"username" gorm:"unique;not null"`
	Password  string    `json:"-" gorm:"not null"`
	Token     string    `json:"token"`
	CartID    *uint     `json:"cart_id"`
	CreatedAt time.Time `json:"created_at"`
}

type Cart struct {
	ID        uint      `json:"id" gorm:"primary_key"`
	UserID    uint      `json:"user_id" gorm:"not null"`
	Name      string    `json:"name"`
	Status    string    `json:"status" gorm:"default:'active'"`
	CreatedAt time.Time `json:"created_at"`
	Items     []Item    `json:"items" gorm:"many2many:cart_items;"`
}

type Item struct {
	ID        uint      `json:"id" gorm:"primary_key"`
	Name      string    `json:"name" gorm:"not null"`
	Status    string    `json:"status" gorm:"default:'available'"`
	CreatedAt time.Time `json:"created_at"`
}

type CartItem struct {
	CartID uint `json:"cart_id" gorm:"primary_key"`
	ItemID uint `json:"item_id" gorm:"primary_key"`
}

type Order struct {
	ID        uint      `json:"id" gorm:"primary_key"`
	CartID    uint      `json:"cart_id" gorm:"not null"`
	UserID    uint      `json:"user_id" gorm:"not null"`
	CreatedAt time.Time `json:"created_at"`
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type CreateUserRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type AddToCartRequest struct {
	ItemID uint `json:"item_id" binding:"required"`
}

type CreateOrderRequest struct {
	CartID uint `json:"cart_id" binding:"required"`
}

var db *gorm.DB
var jwtSecret = []byte("your-secret-key")

func main() {
	var err error
	db, err = gorm.Open("sqlite", "local_store.db")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	db.AutoMigrate(&User{}, &Cart{}, &Item{}, &CartItem{}, &Order{})

	seedItems()

	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config))

	api := r.Group("/api")
	{
		api.POST("/users", createUser)
		api.GET("/users", listUsers)
		api.POST("/users/login", loginUser)

		api.POST("/items", createItem)
		api.GET("/items", listItems)

		api.POST("/carts", authMiddleware(), addToCart)
		api.GET("/carts", authMiddleware(), listCarts)

		api.POST("/orders", authMiddleware(), createOrder)
		api.GET("/orders", authMiddleware(), listOrders)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server starting on port %s", port)
	r.Run(":" + port)
}

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
			tokenString = tokenString[7:]
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		userID := uint(claims["user_id"].(float64))
		c.Set("user_id", userID)
		c.Next()
	}
}

func createUser(c *gin.Context) {
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existingUser User
	if !db.Where("username = ?", req.Username).First(&existingUser).RecordNotFound() {
		c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := User{
		Username:  req.Username,
		Password:  string(hashedPassword),
		CreatedAt: time.Now(),
	}

	db.Create(&user)

	token := generateToken(user.ID)
	user.Token = token
	db.Save(&user)

	c.JSON(http.StatusCreated, user)
}

func listUsers(c *gin.Context) {
	var users []User
	db.Find(&users)
	c.JSON(http.StatusOK, users)
}

func loginUser(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user User
	if db.Where("username = ?", req.Username).First(&user).RecordNotFound() {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username/password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username/password"})
		return
	}

	token := generateToken(user.ID)
	user.Token = token
	db.Save(&user)

	c.JSON(http.StatusOK, user)
}

func createItem(c *gin.Context) {
	var item Item
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	item.CreatedAt = time.Now()
	db.Create(&item)
	c.JSON(http.StatusCreated, item)
}

func listItems(c *gin.Context) {
	var items []Item
	db.Find(&items)
	c.JSON(http.StatusOK, items)
}

func addToCart(c *gin.Context) {
	userID := c.GetUint("user_id")
	var req AddToCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var item Item
	if db.First(&item, req.ItemID).RecordNotFound() {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	var cart Cart
	if db.Where("user_id = ? AND status = ?", userID, "active").First(&cart).RecordNotFound() {
		cart = Cart{
			UserID:    userID,
			Name:      "Shopping Cart",
			Status:    "active",
			CreatedAt: time.Now(),
		}
		db.Create(&cart)
	}

	cartItem := CartItem{
		CartID: cart.ID,
		ItemID: req.ItemID,
	}
	db.Create(&cartItem)

	var user User
	db.First(&user, userID)
	user.CartID = &cart.ID
	db.Save(&user)

	c.JSON(http.StatusOK, gin.H{"message": "Item added to cart", "cart_id": cart.ID})
}

func listCarts(c *gin.Context) {
	userID := c.GetUint("user_id")
	var carts []Cart
	db.Where("user_id = ?", userID).Preload("Items").Find(&carts)
	c.JSON(http.StatusOK, carts)
}

func createOrder(c *gin.Context) {
	userID := c.GetUint("user_id")
	var req CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var cart Cart
	if db.Where("id = ? AND user_id = ?", req.CartID, userID).First(&cart).RecordNotFound() {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	order := Order{
		CartID:    req.CartID,
		UserID:    userID,
		CreatedAt: time.Now(),
	}
	db.Create(&order)

	cart.Status = "converted"
	db.Save(&cart)

	var user User
	db.First(&user, userID)
	user.CartID = nil
	db.Save(&user)

	c.JSON(http.StatusCreated, order)
}

func listOrders(c *gin.Context) {
	userID := c.GetUint("user_id")
	var orders []Order
	db.Where("user_id = ?", userID).Find(&orders)
	c.JSON(http.StatusOK, orders)
}

func generateToken(userID uint) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, _ := token.SignedString(jwtSecret)
	return tokenString
}

func seedItems() {
	var count int
	db.Model(&Item{}).Count(&count)
	if count == 0 {
		items := []Item{
			{Name: "Fresh Organic Bananas", Status: "available"},
			{Name: "Whole Grain Bread", Status: "available"},
			{Name: "Organic Milk", Status: "available"},
			{Name: "Fresh Tomatoes", Status: "available"},
			{Name: "Free Range Eggs", Status: "available"},
			{Name: "Organic Honey", Status: "available"},
			{Name: "Fresh Spinach", Status: "available"},
			{Name: "Greek Yogurt", Status: "available"},
		}

		for i := range items {
			items[i].CreatedAt = time.Now()
			db.Create(&items[i])
		}
	}
} 