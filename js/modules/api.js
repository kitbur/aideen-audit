/**
 * Fetches regional price data from a local JSON file
 */
export async function fetchPriceData() {
	try {
		const response = await fetch("./data/prices.json")
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`)
		}
		return await response.json()
	} catch (error) {
		console.error("Fatal Error: Could not load price data.", error)
		alert("ERROR: Could not load price data.")
		return []
	}
}

/**
 * Fetches Honkai: Star Rail banner data
 */
export async function fetchStarRailBanners() {
	try {
		const response = await fetch("./data/banners.json")
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`)
		}
		return await response.json()
	} catch (error) {
		console.error("Failed to load banners:", error)
		return []
	}
}
