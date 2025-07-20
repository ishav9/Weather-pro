# 🌤️ WeatherPro - Modern Weather Application

A beautiful, modern weather application built with React + TypeScript frontend and Node.js + Express backend. Features real-time weather data, user authentication, location saving, and smart theming.

![Weather App Preview](https://img.shields.io/badge/Status-Ready%20for%20Deployment-green?style=for-the-badge)

## 🌟 Features

- 🌍 **Global Weather Data**: Real-time weather for any location worldwide
- 🔐 **User Authentication**: Secure login/signup with JWT tokens
- 📍 **Location Management**: Save and manage favorite locations
- 🌙 **Smart Theming**: Automatic day/night mode + manual toggle
- 📱 **Responsive Design**: Perfect on mobile, tablet, and desktop
- 🎨 **Modern UI**: Clean design with smooth animations
- 🔍 **Smart Search**: Location search with autocomplete
- 📊 **7-Day Forecast**: Extended weather predictions
- ⚡ **Fast & Reliable**: Built with modern web technologies

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (free)
- OpenWeatherMap API key (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd weatherapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment template
   cp .env.example .env
   ```
   
   Update the `.env` files with your:
   - MongoDB connection string
   - OpenWeatherMap API key
   - JWT secret

4. **Start development servers**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 🏗️ Project Structure

```
weatherapp/
├── frontend/                # React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   └── lib/          # Utilities
│   └── package.json
│
├── backend/                # Node.js + Express backend
│   ├── controllers/       # Route handlers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   └── package.json
│
├── vercel.json            # Vercel deployment config
├── DEPLOYMENT.md          # Deployment guide
└── README.md             # This file
```

## 🛠️ Technologies

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Express Rate Limit** for API protection
- **Helmet** for security headers

### External APIs
- **OpenWeatherMap** for weather data
- **MongoDB Atlas** for database hosting

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Weather
- `GET /api/weather/current` - Current weather by coordinates
- `GET /api/weather/forecast` - 7-day forecast
- `GET /api/weather/search` - Search locations

### User Data
- `POST /api/user/locations` - Save favorite location
- `DELETE /api/user/locations/:id` - Remove location

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Configure environment variables**
4. **Deploy automatically**

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Other Platforms
- **Frontend**: Can be deployed to Netlify, GitHub Pages, or any static hosting
- **Backend**: Can be deployed to Railway, Heroku, or any Node.js hosting

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
OPENWEATHER_API_KEY=your_openweather_api_key
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5001/api
```

## 📱 Usage

1. **Search Locations**: Use the search bar to find cities worldwide
2. **Create Account**: Sign up to save favorite locations
3. **Save Favorites**: Click the heart icon to save locations
4. **Theme Toggle**: Use the sun/moon icon or enable auto mode
5. **View Forecasts**: See current weather and 7-day predictions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for beautiful icons
- [Vercel](https://vercel.com/) for hosting platform

## 📞 Support

If you have any questions or need help:
- Create an issue in the repository
- Check the [Deployment Guide](./DEPLOYMENT.md)
- Review the documentation

---

**⭐ Star this repository if you found it helpful!**
