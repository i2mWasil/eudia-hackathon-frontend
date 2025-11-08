# ExplorePage Refactoring - Dynamic API Integration

## Overview
The ExplorePage has been refactored from hardcoded data to dynamic API-driven data fetching with search functionality.

## Changes Made

### 1. **Type Definitions** (`src/types/company.ts`)
- Created centralized type definitions for `Company`, `Metric`, and `CompaniesResponse`
- This ensures type consistency across the application

### 2. **API Service** (`src/lib/services/company-service.ts`)
- Created `fetchCompanies(searchQuery?)` function to fetch companies from the API
- Supports optional search query parameter
- Created `fetchCompanyById(id)` for future use
- Uses the existing `authenticatedGet` utility from `api-client.ts`

### 3. **Header Component Updates** (`src/components/layout/Header.tsx`)
- Added props: `searchQuery`, `onSearchChange`, `onSearchSubmit`
- Supports both controlled (external) and uncontrolled (internal) search state
- Parent components can now control the search functionality

### 4. **CompanyCard Component** (`src/components/cards/CompanyCard.tsx`)
- Updated to use shared type definitions from `src/types/company.ts`
- Removed duplicate type definitions

### 5. **ExplorePage Component** (`src/pages/public/ExplorePage.tsx`)
Major refactoring with the following features:

#### State Management
- `companies`: Stores the fetched company data
- `searchQuery`: Current search input
- `debouncedSearchQuery`: Debounced version to reduce API calls
- `isLoading`: Loading state for API calls
- `error`: Error state for failed requests

#### Search Functionality
- **Debounced Search**: 500ms delay before triggering API call
- **Real-time Search**: Updates as user types (with debounce)
- **Submit Search**: Immediate search on form submit
- Search filters companies by name on the backend

#### API Integration
- Fetches companies on component mount
- Re-fetches when search query changes (debounced)
- Error handling with fallback to sample data for development
- Loading states with spinner

#### UI States
1. **Loading**: Shows spinner while fetching data
2. **Error**: Shows error message with fallback sample data
3. **Empty**: Shows "no results" message when no companies match
4. **Success**: Displays company cards in grid

#### Features
- Dynamic company count display
- Graceful error handling
- Sample data fallback for development
- Responsive grid layout maintained

## API Endpoint Expected

The service expects the following endpoint to be available:

### GET `/api/companies`
**Optional Query Parameters:**
- `search` - Filter companies by name

**Expected Response:**
```json
{
  "companies": [
    {
      "id": "string",
      "name": "string",
      "logoUrl": "string",
      "metrics": [
        {
          "name": "string",
          "score": number
        }
      ],
      "overallScore": number
    }
  ],
  "total": number
}
```

## Configuration Required

Make sure to set the server URL in your environment variables:

```env
VITE_SERVER_URL=http://your-api-server.com
```

## Usage

The ExplorePage will now:
1. Automatically fetch companies when the page loads
2. Filter companies as the user types in the search box (with 500ms debounce)
3. Show loading states, error states, and empty states appropriately
4. Display the total count of services found

## Next Steps

To connect to your actual backend:
1. Set up the `VITE_SERVER_URL` environment variable
2. Ensure your backend implements the `/api/companies` endpoint
3. The endpoint should support the `search` query parameter for filtering
4. Return data in the expected format shown above

## Fallback Behavior

If the API fails (development or connection issues):
- An error message is displayed
- Sample data is shown for demonstration purposes
- This allows frontend development to continue without backend dependency
