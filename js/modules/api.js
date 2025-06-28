export async function fetchPriceData() {
    try {
        const response = await fetch('./data/prices.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fatal Error: Could not load price data.", error);
        alert("ERROR: Could not load price data.");
        return [];
    }
}