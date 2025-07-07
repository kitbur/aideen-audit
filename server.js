import express from "express"

const app = express()
const PORT = process.env.PORT || 4000

app.get("/api/banners", async (req, res) => {
	try {
		const response = await fetch("https://api.ennead.cc/mihoyo/starrail/calendar?lang=en")
		if (!response.ok) {
			console.error(`API responded with status ${response.status}`)
			return res.status(502).json({ error: "Failed to fetch banner data from upstream API" })
		}
		const data = await response.json()
		res.json(data)
	} catch (err) {
		console.error("Internal server error:", err.message)
		res.status(500).json({ error: "Internal server error" })
	}
})

app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`)
})
