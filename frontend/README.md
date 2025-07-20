# WeatherPro Frontend

A modern React + Vite weather application with authentication, location saving, and automatic day/night theming.

## 🌟 Features

- 🔐 **Authentication**: Login/signup with JWT tokens
- 📍 **Location Management**: Save and manage favorite locations
- 🌙 **Smart Theming**: Automatic day/night mode + manual toggle
- 🌤️ **Weather Data**: Current weather and 7-day forecasts
- 🎨 **Modern UI**: Glassmorphism design with animations
- 📱 **Responsive**: Works on all device sizes
- 🔍 **Smart Search**: Location search with autocomplete

## 🚀 Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment setup:**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Update `VITE_API_URL` with your backend URL.

3. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for production:**
   \`\`\`bash
   npm run build
   \`\`\`

## 📁 Project Structure

\`\`\`
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components
│   │   ├── Navbar.tsx      # Navigation with search
│   │   ├── WeatherCard.tsx # Current weather display
│   │   └── ...
│   ├── context/            # React contexts
│   │   ├── AuthContext.tsx # Authentication state
│   │   └── ThemeContext.tsx # Theme management
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # API services
│   └── lib/                # Utilities
├── public/                 # Static assets
└── ...config files
\`\`\`

## 🔌 API Integration

The frontend connects to your backend API with these endpoints:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `POST /api/user/locations` - Save location
- `DELETE /api/user/locations/:id` - Remove location
- `GET /api/weather/current` - Current weather
- `GET /api/weather/forecast` - Weather forecast
- `GET /api/weather/search` - Location search

## 🎨 Theme System

- **Automatic Mode**: Changes theme based on time (6 AM - 6 PM = light)
- **Manual Toggle**: Click sun/moon icon to override
- **Auto Badge**: Shows when automatic mode is active
- **Settings**: Toggle auto mode from user dropdown

## 🛠️ Technologies

- **React 18** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Lucide React** for icons

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Environment Variables

Create a `.env` file in the root directory:

\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

## 🎯 Usage

1. **Search Locations**: Use the search bar to find cities worldwide
2. **Save Favorites**: Login to save your favorite locations
3. **Theme Toggle**: Click the sun/moon icon or use auto mode
4. **Weather Details**: View current conditions and 7-day forecasts
5. **Responsive Design**: Works perfectly on mobile and desktop

Perfect! Now you have a clean, organized frontend-only codebase with:

✅ **Complete React + Vite setup**  
✅ **Modern UI components with Tailwind CSS**  
✅ **Authentication system ready for your backend**  
✅ **Smart theming with auto day/night mode**  
✅ **Weather data integration**  
✅ **Location search and saving**  
✅ **Responsive design**  
✅ **TypeScript support**  
✅ **Clean project structure**

The frontend is ready to connect to your backend API and provides a beautiful, modern weather application experience!
