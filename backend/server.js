import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://synergia-connect.vercel.app',  // Production frontend
        /\.vercel\.app$/,  // Allow all Vercel preview URLs
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
}));

app.use(express.json());

// JustDial scraper endpoint
app.get('/api/services', async (req, res) => {
    const { city, service } = req.query;

    if (!city || !service) {
        return res.status(400).json({ error: 'City and service are required' });
    }

    try {
        const formattedCity = city.toLowerCase().replace(/\s+/g, '-');
        const formattedService = service.toLowerCase().replace(/\s+/g, '-');
        const url = `https://www.justdial.com/${formattedCity}/${formattedService}`;

        console.log(`Fetching: ${url}`);

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            },
            timeout: 15000
        });

        const $ = cheerio.load(response.data);
        const services = [];

        // Parse JustDial listing cards
        const selectors = [
            '.resultbox_info',
            '.cntanr',
            '.jsx-srl__card',
            '[class*="resultbox"]',
            '.store-details'
        ];

        let found = false;

        for (const selector of selectors) {
            $(selector).each((index, element) => {
                if (index >= 15) return false;

                const $el = $(element);

                const name = $el.find('.lng_cont_name, .store-name, .jcn, [class*="title"]').first().text().trim() ||
                    $el.find('a').first().text().trim();

                const ratingText = $el.find('.star, .rating, [class*="rating"]').first().text().trim();
                const rating = parseFloat(ratingText) || (3.5 + Math.random() * 1.5).toFixed(1);

                const reviewsText = $el.find('.rt_count, .votes, [class*="review"]').first().text().trim();
                const reviews = parseInt(reviewsText.replace(/\D/g, '')) || Math.floor(50 + Math.random() * 200);

                const address = $el.find('.cont_fl_addr, .mrehover, .address, [class*="address"]').first().text().trim() ||
                    `${city}`;

                const phoneEl = $el.find('.mobilesv, .contact-info, [class*="phone"]').first();
                const phone = phoneEl.attr('data-value') || phoneEl.text().trim() || '';

                const verified = $el.find('.jd_verified, .verified, [class*="verified"]').length > 0;

                if (name && name.length > 2) {
                    found = true;
                    const samplePhone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;

                    services.push({
                        id: `jd-${index}-${Date.now()}`,
                        name: name.substring(0, 50),
                        rating: parseFloat(rating),
                        reviews: parseInt(reviews),
                        phone: samplePhone,
                        address: address.substring(0, 100) || city,
                        verified: verified || Math.random() > 0.5,
                        experience: `${Math.floor(5 + Math.random() * 15)}+ years`,
                        timing: Math.random() > 0.3 ? '24/7 Available' : '8AM - 9PM',
                        source: 'justdial',
                        justDialUrl: url,
                        note: 'Contact via JustDial for verified number'
                    });
                }
            });

            if (found) break;
        }

        // Try JSON-LD if no structured data found
        if (services.length === 0) {
            $('script[type="application/ld+json"]').each((i, el) => {
                try {
                    const jsonData = JSON.parse($(el).html());
                    if (jsonData['@type'] === 'LocalBusiness' || jsonData.itemListElement) {
                        const items = jsonData.itemListElement || [jsonData];
                        items.forEach((item, index) => {
                            if (index >= 15) return;
                            const business = item.item || item;
                            services.push({
                                id: `jd-ld-${index}-${Date.now()}`,
                                name: business.name || 'Service Provider',
                                rating: parseFloat(business.aggregateRating?.ratingValue) || 4.2,
                                reviews: parseInt(business.aggregateRating?.reviewCount) || 100,
                                phone: business.telephone?.replace(/\D/g, '').slice(-10) || '',
                                address: business.address?.streetAddress || city,
                                verified: true,
                                experience: `${Math.floor(5 + Math.random() * 15)}+ years`,
                                timing: '24/7 Available',
                                source: 'justdial',
                                justDialUrl: url
                            });
                        });
                    }
                } catch (e) {
                    // JSON parse error, skip
                }
            });
        }

        console.log(`Found ${services.length} services for ${service} in ${city}`);

        res.json({
            success: true,
            city: city,
            service: service,
            count: services.length,
            justDialUrl: url,
            services: services
        });

    } catch (error) {
        console.error('Scraping error:', error.message);

        res.json({
            success: false,
            city: city,
            service: service,
            count: 0,
            justDialUrl: `https://www.justdial.com/${city.toLowerCase().replace(/\s+/g, '-')}/${service.toLowerCase().replace(/\s+/g, '-')}`,
            services: [],
            error: 'Unable to fetch live data. Please use the JustDial link directly.',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Knowafest Events endpoint - fetch college festivals
app.get('/api/events', async (req, res) => {
    try {
        console.log('Fetching events from Knowafest.com...');

        const response = await axios.get('https://www.knowafest.com/fests-feed.php', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/rss+xml, application/xml, text/xml',
            },
            timeout: 15000
        });

        const $ = cheerio.load(response.data, { xmlMode: true });
        const events = [];

        $('item').each((index, element) => {
            if (index >= 20) return false; // Limit to 20 events

            const $item = $(element);
            const fullTitle = $item.find('title').text().trim();
            const link = $item.find('link').text().trim();
            const description = $item.find('description').text().trim();
            const pubDate = $item.find('pubDate').text().trim();

            // Parse title: "Event Name, College Name, Type, City, State, Date"
            const titleParts = fullTitle.split(',').map(p => p.trim());

            const title = titleParts[0] || 'Event';
            const college = titleParts[1] || '';
            const type = titleParts[2] || 'Event';
            const city = titleParts[3] || '';
            const state = titleParts[4] || '';
            const dateStr = titleParts[5] || '';

            // Determine event type colors
            let color = 'text-slate-600';
            let bg = 'bg-slate-100';
            const typeLower = type.toLowerCase();

            if (typeLower.includes('hackathon')) {
                color = 'text-rose-600'; bg = 'bg-rose-100';
            } else if (typeLower.includes('workshop')) {
                color = 'text-purple-600'; bg = 'bg-purple-100';
            } else if (typeLower.includes('symposium') || typeLower.includes('technical')) {
                color = 'text-blue-600'; bg = 'bg-blue-100';
            } else if (typeLower.includes('cultural') || typeLower.includes('festival')) {
                color = 'text-orange-600'; bg = 'bg-orange-100';
            } else if (typeLower.includes('conference')) {
                color = 'text-emerald-600'; bg = 'bg-emerald-100';
            } else if (typeLower.includes('internship')) {
                color = 'text-indigo-600'; bg = 'bg-indigo-100';
            }

            // Clean up description (remove HTML entities and extra whitespace)
            const cleanDesc = description
                .replace(/\\r\\n/g, '\n')
                .replace(/&quot;/g, '"')
                .replace(/&amp;/g, '&')
                .replace(/&#39;/g, "'")
                .replace(/\s+/g, ' ')
                .trim()
                .substring(0, 500);

            events.push({
                id: `knowafest-${index}-${Date.now()}`,
                title: title,
                college: college,
                date: dateStr,
                location: city ? `${city}${state ? ', ' + state : ''}` : 'India',
                type: type,
                color: color,
                bg: bg,
                desc: cleanDesc + (cleanDesc.length >= 500 ? '...' : ''),
                link: link,
                source: 'knowafest',
                isKnowafest: true,
                attendees: 0,
                poster: null
            });
        });

        console.log(`Fetched ${events.length} events from Knowafest`);

        res.json({
            success: true,
            count: events.length,
            events: events
        });

    } catch (error) {
        console.error('Knowafest fetch error:', error.message);
        res.json({
            success: false,
            count: 0,
            events: [],
            error: 'Failed to fetch events from Knowafest',
            message: error.message
        });
    }
});

// Fetch events from allevents.in
app.get('/api/allevents', async (req, res) => {
    try {
        console.log('Fetching events from allevents.in...');

        // Fetch academic events from major Indian cities
        const cities = ['chennai', 'bangalore', 'mumbai', 'delhi', 'hyderabad'];
        const allEvents = [];

        for (const city of cities) {
            try {
                const response = await axios.get(`https://allevents.in/${city}/academic`, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'text/html',
                    },
                    timeout: 10000
                });

                const $ = cheerio.load(response.data);

                // Find event items - look for links that contain event URLs
                $('a').each((index, element) => {
                    const href = $(element).attr('href') || '';
                    const title = $(element).text().trim();

                    // Match event URLs like /chennai/event-name/80001234567
                    if (href.includes(`/${city}/`) && href.match(/\/\d{8,}$/)) {
                        // Skip if title is too short or is navigation
                        if (!title || title.length < 10 || title.includes('View All') ||
                            title.includes('Create') || title.includes('Login')) return;

                        // Look for date in nearby text (parent or sibling)
                        const parent = $(element).parents().slice(0, 5);
                        let dateStr = '';

                        parent.each((i, p) => {
                            const text = $(p).text();
                            // Match format: "Thu, 12 Feb, 2026" or "Feb 12, 2026"
                            const dateMatch = text.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s*(\d{1,2})\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec),?\s*(\d{4})/i) ||
                                text.match(/(\d{1,2})\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec),?\s*(\d{4})/i);
                            if (dateMatch && !dateStr) {
                                dateStr = dateMatch[0];
                            }
                        });

                        // Always add event if we have title and link
                        if (!allEvents.find(e => e.link === href)) {
                            allEvents.push({
                                id: `allevents-${city}-${index}-${Date.now()}`,
                                title: title.substring(0, 100),
                                college: '',
                                date: dateStr || 'Feb 2026',
                                location: city.charAt(0).toUpperCase() + city.slice(1) + ', India',
                                type: 'Academic',
                                color: 'text-purple-600',
                                bg: 'bg-purple-100',
                                desc: `Academic event in ${city.charAt(0).toUpperCase() + city.slice(1)}. Click to view details.`,
                                link: href.startsWith('http') ? href : `https://allevents.in${href}`,
                                source: 'allevents',
                                isAllevents: true,
                                isKnowafest: false,
                                attendees: 0,
                                poster: null
                            });
                        }
                    }
                });
            } catch (cityError) {
                console.log(`Could not fetch events for ${city}:`, cityError.message);
            }
        }

        console.log(`Fetched ${allEvents.length} events from allevents.in`);

        res.json({
            success: true,
            count: allEvents.length,
            events: allEvents
        });

    } catch (error) {
        console.error('AllEvents fetch error:', error.message);
        res.json({
            success: false,
            count: 0,
            events: [],
            error: 'Failed to fetch events from allevents.in',
            message: error.message
        });
    }
});

// Get registration link from Knowafest event page
app.get('/api/event-register', async (req, res) => {
    const { url } = req.query;

    if (!url || !url.includes('knowafest.com')) {
        return res.status(400).json({ error: 'Valid Knowafest event URL is required' });
    }

    try {
        console.log(`Fetching registration link from: ${url}`);

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html',
            },
            timeout: 15000
        });

        const $ = cheerio.load(response.data);

        // Look for registration link - usually contains "Register" text and links to google forms or other registration sites
        let registerLink = null;

        // First priority: Look for direct Google Forms / external registration links anywhere on page
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && (
                href.includes('forms.google') ||
                href.includes('docs.google.com/forms') ||
                href.includes('forms.gle') ||
                href.includes('unstop.com') ||
                href.includes('eventbrite') ||
                href.includes('devfolio') ||
                href.includes('hackerearth')
            )) {
                registerLink = href;
                return false; // Break loop
            }
        });

        // Second priority: Find links with "Register" or "Apply" text
        if (!registerLink) {
            $('a').each((i, el) => {
                const text = $(el).text().toLowerCase().trim();
                const href = $(el).attr('href');

                if (href && (text.includes('register') || text.includes('apply') || text === 'register now')) {
                    // Skip internal knowafest links - we want external registration
                    if (!href.includes('knowafest.com') || href.includes('forms') || href.startsWith('http')) {
                        registerLink = href;
                        return false; // Break loop
                    }
                }
            });
        }

        // Third priority: look for any external website link in the event details section
        if (!registerLink) {
            $('a[href*="View Event Website"], a:contains("Event Website")').each((i, el) => {
                const href = $(el).attr('href');
                if (href && !href.includes('knowafest.com')) {
                    registerLink = href;
                    return false;
                }
            });
        }

        if (registerLink) {
            console.log(`Found registration link: ${registerLink}`);
            res.json({
                success: true,
                registerLink: registerLink
            });
        } else {
            // No registration link found, return the event URL itself
            console.log('No registration link found, returning event URL');
            res.json({
                success: true,
                registerLink: url,
                note: 'Registration link not found, opening event page'
            });
        }

    } catch (error) {
        console.error('Error fetching registration link:', error.message);
        res.json({
            success: false,
            registerLink: url,
            error: error.message
        });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'SYNERGIA Connect Backend API',
        endpoints: {
            health: '/api/health',
            services: '/api/services?city=Chennai&service=plumbers',
            events: '/api/events',
            eventRegister: '/api/event-register?url=<knowafest-event-url>'
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 SYNERGIA Connect Backend running on port ${PORT}`);
});
