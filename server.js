const express = require("express")
const fetch = require("node-fetch")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname)))

app.get("/api/banners", async (req, res) => {
	try {
		const response = await fetch("https://api.ennead.cc/mihoyo/starrail/calendar?lang=en")
		if (!response.ok) {
			return res.status(response.status).json({ error: "Failed to fetch banner data" })
		}
		const data = await response.json()
		res.json(data.banners) // Only return banners
	} catch (error) {
		console.error("Banner fetch failed:", error)
		res.status(500).json({ error: "Internal server error" })
	}
})

app.listen(PORT, () => {
	console.log(`Server running: http://localhost:${PORT}`)
})
