const apiKey = "rr_quhmbld9zj34x8vlcphyzm31omik5ihs";

const endpoints = [
    "https://api.railradar.in/api/v1/search/stations?query=chennai",
    "https://api.railradar.in/api/v1/stations?q=chennai",
    "https://api.railradar.in/api/v2/stations/search?query=chennai"
];

async function test() {
    for (const url of endpoints) {
        try {
            console.log(`Testing: ${url}`);
            const response = await fetch(url, {
                headers: { 'X-API-Key': apiKey }
            });
            
            if (response.status === 404) {
                console.log("Status: 404 Not Found");
                continue;
            }
            
            const data = await response.json();
            console.log(`SUCCESS [${response.status}]:`, JSON.stringify(data).substring(0, 100));
            break; // Found one!
        } catch (e) {
            console.error("Error:", e.message);
        }
    }
}

test();
