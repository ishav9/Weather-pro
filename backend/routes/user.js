const express = require("express")
const { saveLocation, removeLocation, getSavedLocations } = require("../controllers/userController")
const auth = require("../middleware/auth")

const router = express.Router()

// All user routes require authentication
router.use(auth)

// POST /api/user/locations - Save location
router.post("/locations", saveLocation)

// DELETE /api/user/locations/:locationId - Remove location
router.delete("/locations/:locationId", removeLocation)

// GET /api/user/locations - Get saved locations
router.get("/locations", getSavedLocations)

module.exports = router
