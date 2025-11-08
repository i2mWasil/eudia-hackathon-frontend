# API Integration Setup Guide

## Overview
The ExplorePage now fetches company data from the EULA API using domains from `folderlist.csv`.

## Setup Steps

### 1. Copy folderlist.csv to public directory
```bash
cp /Users/ImWasil/Documents/GitHub/eudia-hackathon-frontend/frontend/src/cache/folderlist.csv /Users/ImWasil/Documents/GitHub/eudia-hackathon-frontend/frontend/public/folderlist.csv
```

### 2. Configure Environment Variables
Create a `.env` file in the `frontend` directory based on `example.env`:

```bash
cd frontend
cp example.env .env
```

Edit `.env` to set your API server URL:
```
VITE_SERVER_URL=https://bs7x3fr9-8000.inc1.devtunnels.ms
```

### 3. Install Dependencies (if needed)
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

## How It Works

### Data Flow
1. **Load Domain List**: On page load, `folderlist.csv` is fetched from the public directory
2. **Filter Domains**: If search query exists, domains are filtered by name/domain match
3. **Batch API Requests**: Domains are queried in batches of 10 to avoid overwhelming the API
4. **Transform Response**: API responses are transformed into Company objects
5. **Display Cards**: Companies are displayed in a responsive grid

### API Endpoint
Each domain from `folderlist.csv` is queried using:
```
GET {VITE_SERVER_URL}/context/eula/latest?domain={domain}
```

For example:
```
GET https://bs7x3fr9-8000.inc1.devtunnels.ms/context/eula/latest?domain=apple.com
```

### Response Mapping
The API response is transformed as follows:

| API Field | Company Field | Transformation |
|-----------|--------------|----------------|
| `oneline_desc` | `description` | Direct mapping |
| `privacy_rating_100` | `metrics[0]` (privacy) | String to integer |
| `data_rating_100` | `metrics[1]` (data) | String to integer |
| `clarity_rating_100` | `metrics[2]` (clarity) | String to integer |
| `overall_rating_100` | `overallScore` | String to integer |
| `important_point_1-3` | `importantPoints[]` | Array of objects |

### Performance Optimizations
- **Batch Processing**: Requests are sent in batches of 10
- **Limited Results**: Only first 30 domains are processed to avoid long load times
- **Debounced Search**: 500ms delay before triggering new search
- **Error Handling**: Failed domain requests are skipped, not blocking others

## File Structure

```
frontend/
├── public/
│   └── folderlist.csv          # Domain list (needs to be copied here)
├── src/
│   ├── cache/
│   │   └── folderlist.csv      # Original domain list
│   ├── lib/
│   │   ├── folderlist-loader.ts    # CSV loader and domain utilities
│   │   └── services/
│   │       └── company-service.ts   # API service for fetching companies
│   ├── types/
│   │   └── company.ts              # TypeScript type definitions
│   └── pages/
│       └── public/
│           └── ExplorePage.tsx     # Main explore page component
└── .env                        # Environment configuration (create from example.env)
```

## Key Features

### Search Functionality
- Searches both domain names and formatted company names
- Case-insensitive matching
- Debounced to reduce API calls
- Live filtering as you type

### Domain Processing
- **Domain Cleanup**: Filters out non-domain entries from CSV
- **Name Formatting**: Converts `apple.com` → `Apple`
- **Logo Generation**: Creates placeholder logos with consistent colors
- **Color Hashing**: Each domain gets a unique color based on its name

### Error Handling
- Failed API requests for individual domains are logged and skipped
- Network errors fall back to sample data
- User-friendly error messages
- Graceful degradation

## Customization

### Adjust Batch Size
In `company-service.ts`, change the `batchSize` constant:
```typescript
const batchSize = 10  // Increase/decrease based on API rate limits
```

### Adjust Max Results
In `company-service.ts`, change the limit:
```typescript
for (let i = 0; i < Math.min(filteredDomains.length, 30); i += batchSize)
//                                                      ^^^ Change this number
```

### Change Debounce Delay
In `ExplorePage.tsx`, adjust the timeout:
```typescript
setTimeout(() => {
  setDebouncedSearchQuery(searchQuery)
}, 500) // Change delay in milliseconds
```

## Troubleshooting

### folderlist.csv not found
- Ensure you've copied the file to `frontend/public/folderlist.csv`
- Check browser console for fetch errors

### API requests failing
- Verify `VITE_SERVER_URL` in `.env` file
- Check if API server is running and accessible
- Look for CORS issues in browser console

### Slow loading
- Reduce the max results limit (currently 30)
- Increase batch delay between requests
- Check network tab for slow API responses

### Search not working
- Check browser console for errors
- Verify domain list loaded successfully
- Test with exact domain names from the CSV

## Next Steps

1. **Copy the CSV file** to public directory (required)
2. **Set up .env file** with correct API URL
3. **Test the application** with `npm run dev`
4. **Monitor console** for any errors during development
5. **Adjust performance settings** based on API rate limits
