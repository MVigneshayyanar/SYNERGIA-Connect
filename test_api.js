const apiKey = "rr_y2sq1dl57vc0j08ugiowqhgaemghrdn6";

async function testRailRadarAPI() {
    console.log("Testing RailRadar API endpoints...\n");

    // Test 1: Station Search
    try {
        const stationUrl = "https://api.railradar.in/api/v1/search/stations?query=chennai";
        console.log("1. Testing Station Search:", stationUrl);
        const stationRes = await fetch(stationUrl, {
            headers: { 'X-API-Key': apiKey }
        });
        const stationData = await stationRes.json();
        console.log("Station Response:", JSON.stringify(stationData, null, 2));
    } catch (e) {
        console.error("Station Search Error:", e.message);
    }

    console.log("\n---\n");

    // Test 2: Between Stations - Try different parameter formats
    const formats = [
        "https://api.railradar.in/api/v1/trains/between-stations?from=MAS&to=SBC&date=31-01-2026",
        "https://api.railradar.in/api/v1/search/trains/between-stations?from=MAS&to=SBC&date=31-01-2026",
        "https://api.railradar.in/api/v1/trains/search?from=MAS&to=SBC&date=31-01-2026",
        "https://api.railradar.in/api/v1/search/trains?from_station=MAS&to_station=SBC&date=31-01-2026",
        "https://api.railradar.in/api/v1/trains/between-stations?source=MAS&destination=SBC&date=31-01-2026",
        "https://api.railradar.in/api/v1/trains/between-stations?from=MAS&to=SBC&date=2026-01-31",
    ];

    for (const url of formats) {
        try {
            console.log("Testing:", url);
            const response = await fetch(url, {
                headers: { 'X-API-Key': apiKey }
            });
            const data = await response.json();
            console.log(`Status: ${response.status}`);
            console.log("Response:", JSON.stringify(data, null, 2));
            
            if (response.ok && data.data) {
                console.log("\n✅ SUCCESS! This format works!\n");
                break;
            }
        } catch (e) {
            console.error("Error:", e.message);
        }
        console.log("\n---\n");
    }

    // Test 3: Train Status
    console.log("\n3. Testing Train Status:");
    try {
        const statusUrl = "https://api.railradar.in/api/v1/trains/12607/status";
        console.log("URL:", statusUrl);
        const statusRes = await fetch(statusUrl, {
            headers: { 'X-API-Key': apiKey }
        });
        const statusData = await statusRes.json();
        console.log("Train Status Response:", JSON.stringify(statusData, null, 2));
    } catch (e) {
        console.error("Train Status Error:", e.message);
    }
}

testRailRadarAPI();