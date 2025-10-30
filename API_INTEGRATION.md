# API Integration and Debug Mode

## Overview

The frontend now has a debug mode that allows switching between static data (for development/testing) and live API data from the backend server.

## Configuration

### Environment Variables (.env)

The `.env` file in the frontend folder contains:

```properties
DEBUG=true
SERVER_ADDRESS=http://localhost:8000
```

- **DEBUG**: Set to `true` to use static/mock data, `false` to use the backend API
- **SERVER_ADDRESS**: The base URL of the backend server (default: `http://localhost:8000`)

## How It Works

### API Configuration (`app/config/api.ts`)

The API configuration file reads the environment variables and provides:
- `isDebugMode()`: Returns whether debug mode is enabled
- `getServerAddress()`: Returns the backend server address

### Service Files

Three service files handle all API communication:

1. **`app/services/dataService.ts`**
   - Fetches weather and flood risk data
   - Endpoint: `GET /data/{latitude}/{longitude}`
   - Debug mode: Returns mock weather data

2. **`app/services/volunteerService.ts`**
   - Submits volunteer help requests: `POST /volunteer/{latitude}/{longitude}`
   - Fetches volunteer requests: `GET /volunteer/{latitude}/{longitude}`
   - Debug mode: Returns mock responses

3. **`app/services/assessmentService.ts`**
   - Submits post-flood assessments: `POST /upload/final`
   - Uploads flood images: `POST /upload/flood`
   - Fetches assessment data: Uses static JSON in both modes (no backend endpoint yet)
   - Debug mode: Returns mock responses

## API Endpoints Used

### Backend Endpoints (from FastAPI)

1. **Weather Data**
   - `GET /data/{latitude}/{longitude}`
   - Returns: `{ rainfall, temperature, humidity, flood_risk }`

2. **Volunteer Requests**
   - `POST /volunteer/{latitude}/{longitude}`
   - Form data: `type, user_type, help_description, image_taken, image, area_safe, no_medical_emergency, location`
   - Returns: Created volunteer request with ID

   - `GET /volunteer/{latitude}/{longitude}`
   - Returns: List of volunteer requests with distances

3. **Image Uploads**
   - `POST /upload/final`
   - Form data: `file, q1, q2, q3`
   - Returns: Created assessment with ID

   - `POST /upload/flood`
   - Form data: `file, latitude, longitude, altitude`
   - Returns: Created image record with ID

## Components Updated

### PostFloodAssessmentOverlay
- Now uses `submitAssessment()` to send assessment data to backend
- Uses `getPostFloodAssessments()` to fetch regional assessment data
- In debug mode: Uses static data from `postFloodAssessments.json`

### VolunteerFormOverlay
- Now uses `submitVolunteerRequest()` to send help requests to backend
- Gets user location before submission
- In debug mode: Returns mock success response

### pastFlood.tsx
- Uses `getPostFloodAssessments()` to calculate regional statistics
- In debug mode: Uses static data from `postFloodAssessments.json`

## Usage

### Development Mode (DEBUG=true)
1. Set `DEBUG=true` in `.env`
2. App uses static data from `app/static/data/` folder
3. No backend server needed
4. Good for UI development and testing

### Production Mode (DEBUG=false)
1. Set `DEBUG=false` in `.env`
2. Set `SERVER_ADDRESS` to your backend URL
3. Ensure backend server is running
4. App makes real API calls to fetch/submit data

## Testing

To test the integration:

1. **Start the backend server:**
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. **Set debug mode off:**
   ```properties
   DEBUG=false
   SERVER_ADDRESS=http://localhost:8000
   ```

3. **Run the frontend:**
   ```bash
   cd frontend
   npm run start
   ```

4. **Test features:**
   - Submit a volunteer request (will POST to backend)
   - Submit a post-flood assessment (will POST to backend)
   - View regional statistics (will use static data until endpoint is added)

## Notes

- Image uploads currently send `null` for the file parameter (photo URI to File conversion needs to be implemented)
- Post-flood assessments endpoint for GET requests doesn't exist in backend yet, so static data is used
- All API calls include error handling with fallback to mock data
- Backend endpoints match FastAPI router definitions exactly
