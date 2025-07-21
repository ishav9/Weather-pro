module.exports = async (req, res) => {
  // Add CORS headers for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    res.status(200).json({ 
      status: "OK", 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      message: "Weather App Backend API is running!",
      endpoints: [
        "/api/health",
        "/api/weather?city=London", 
        "/api/forecast?city=London",
        "/api/login (POST)",
        "/api/register (POST)"
      ]
    })
  } catch (error) {
    console.error('Health check error:', error)
    res.status(500).json({ error: 'Health check failed' })
  }
}
