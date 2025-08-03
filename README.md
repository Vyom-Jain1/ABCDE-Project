# Local Store - E-commerce Platform

A modern e-commerce platform built with React frontend and Go backend, featuring user authentication, product management, shopping cart functionality, and order processing.

## 🚀 Features

- **User Authentication**: Secure login and signup system with JWT tokens
- **Product Catalog**: Browse and search through available products
- **Shopping Cart**: Add items to cart and manage quantities
- **Order Management**: Complete purchase flow with order tracking
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Real-time Updates**: Live cart and inventory updates

## 🛠️ Tech Stack

### Frontend

- **React 19.1.1** - Modern UI framework
- **React Router DOM** - Client-side routing
- **CSS3** - Custom styling with responsive design

### Backend

- **Go 1.23.0** - High-performance server language
- **Gin Framework** - HTTP web framework
- **GORM** - Object-relational mapping
- **SQLite** - Lightweight database
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing

## 📁 Project Structure

```
ABCDE-Project/
├── backend/                 # Go backend server
│   ├── main.go             # Main server file
│   ├── go.mod              # Go dependencies
│   ├── go.sum              # Dependency checksums
│   └── local_store.db      # SQLite database
├── public/                 # Static assets
│   ├── index.html          # Main HTML file
│   ├── favicon.ico         # Site icon
│   └── manifest.json       # PWA manifest
├── src/                    # React source code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── styles/            # CSS stylesheets
│   ├── assets/            # Images and assets
│   ├── App.js             # Main app component
│   └── index.js           # App entry point
├── package.json            # Node.js dependencies
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Go (v1.23 or higher)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Vyom-Jain1/ABCDE-Project.git
   cd ABCDE-Project
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Start the backend server**

   ```bash
   cd backend
   go run main.go
   ```

   The backend will start on `http://localhost:8080`

4. **Start the frontend development server**
   ```bash
   npm start
   ```
   The frontend will start on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/users` - Create new user account
- `POST /api/users/login` - User login
- `GET /api/users` - List all users (admin only)

### Product Endpoints

- `GET /api/items` - Get all available products
- `POST /api/items` - Create new product (admin only)

### Cart Endpoints

- `POST /api/carts` - Add item to cart
- `GET /api/carts` - Get user's cart

### Order Endpoints

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders

## 🔧 Development

### Frontend Development

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

### Backend Development

```bash
cd backend
go run main.go     # Start development server
go test           # Run tests
```

## 🚀 Deployment

### Frontend Deployment

1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to your hosting service

### Backend Deployment

1. Build the Go binary:
   ```bash
   cd backend
   go build -o main.exe main.go
   ```
2. Deploy the binary and database file to your server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vyom Jain**

- GitHub: [@Vyom-Jain1](https://github.com/Vyom-Jain1)

## 🙏 Acknowledgments

- React team for the amazing framework
- Gin framework for the robust backend
- GORM for the excellent ORM library
