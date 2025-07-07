import express from "express"
import path from "path"
import { fileURLToPath } from "url"

const app = express()
const PORT = process.env.PORT || 4000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(__dirname))

app.get("/api/banners", async (req, res) => {
	try {
		const response = await fetch("https://api.ennead.cc/mihoyo/starrail/calendar")
		const data = await response.json()
		res.json(data.banners || [])
	} catch (error) {
		console.error("Error fetching banner data:", error)
		res.status(500).json({ error: "Internal server error" })
	}
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
