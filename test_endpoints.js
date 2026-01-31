const apiKey = "rr_quhmbld9zj34x8vlcphyzm31omik5ihs";

// We found 'search/stations' works. Let's guess the others based on that pattern.
// Previous attempt: trains/between-stations
const tests = [
    { name: "Station Search", url: "https://api.railradar.in/api/v1/search/stations?query=chennai" },
    { name: "Train Search", url: "https://api.railradar.in/api/v1/search/trains?query=12601" },
    { name: "Train Status", url: "https://api.railradar.in/api/v1/trains/12601/status" }, // Trying original guess
    { name: "Train Status V2", url: "https://api.railradar.in/api/v1/train/12601/status" },
    { name: "Between Stations", url: "https://api.railradar.in/api/v1/trains/between-stations?from=MS&to=TBM&date=31-01-2026" },
    { name: "Between Stations V2", url: "https://api.railradar.in/api/v1/search/trains/between-stations?from=MS&to=TBM&date=31-01-2026" }
];

async function test() {
    for (const t of tests) {
        try {
            console.log(`Testing ${t.name}: ${t.url}`);
            const response = await fetch(t.url, {
                headers: { 'X-API-Key': apiKey }
            });
            
            if (response.ok) {
                 const data = await response.json();
                 console.log(`[PASS] ${t.name}`);
            } else {
                 console.log(`[FAIL] ${t.name}: ${response.status} ${response.statusText}`);
            }
        } catch (e) {
            console.error(`[ERR] ${t.name}: ${e.message}`);
        }
    }
}

test();
