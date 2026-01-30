# Weather Dashboard - Frontend

A beautiful, responsive weather monitoring dashboard built with **Next.js 16**, **React 19**, **Tailwind CSS**, and **shadcn/ui**.

## Features

✨ **Modern UI**
- Dark and light theme support with system preference detection
- Responsive grid layout for weather cards
- Real-time weather updates
- Temperature alert indicators

🌡️ **Weather Management**
- Add multiple favorite cities
- Set custom min/max temperature alerts
- Visual alert status badges
- One-click weather sync across all cities

🎨 **Design**
- Clean, minimalist interface
- Smooth animations and transitions
- Accessible components
- Mobile-optimized

## Prerequisites

- **Node.js** 18+ or 20+
- **npm** or **yarn**
- **Spring Boot Backend** running on `http://localhost:8080`

## Installation

### 1. Clone or download the project

```bash
cd my-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Backend URL

Edit `.env.local` and set your Spring Boot API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

If your backend is on a different host/port, update accordingly:

```env
NEXT_PUBLIC_API_URL=http://192.168.1.100:8080/api
NEXT_PUBLIC_API_URL=https://api.example.com
```

### 4. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
my-app/
├── app/
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Dashboard (main page)
│   ├── theme-toggle.tsx        # Theme switcher component
│   ├── providers.tsx           # Next-themes provider setup
│   └── globals.css             # Global styles & theme variables
│
├── components/
│   ├── ui/
│   │   ├── button.tsx          # Button component
│   │   └── input.tsx           # Input component
│   ├── weather-card.tsx        # Weather card display
│   └── add-city-form.tsx       # Add city form
│
├── lib/
│   ├── utils.ts                # Utility functions
│   ├── weatherService.ts       # API service layer
│
├── .env.local                  # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## API Integration

The frontend communicates with the Spring Boot backend through the `weatherService` module:

### Endpoints Used

- `GET /weather/{city}` - Get weather for a specific city
- `GET /favorites` - Get all favorite cities
- `POST /favorites` - Add a new favorite city
- `DELETE /favorites/{id}` - Delete a favorite city
- `POST /sync` - Sync weather for all cities (optional)

### Types

```typescript
interface FavoriteCity {
  id: number;
  city: string;
  temperature: number;
  alert: boolean;
  minTemp?: number;
  maxTemp?: number;
}
```

## Components

### WeatherCard
Displays a city's weather information with alert status.

```tsx
<WeatherCard
  city="London"
  temperature={18.5}
  description="Cloudy"
  alert={false}
  minTemp={5}
  maxTemp={35}
  onDelete={() => handleDelete()}
/>
```

### AddCityForm
Form for adding new favorite cities with optional temperature alerts.

```tsx
<AddCityForm
  onSubmit={(city, minTemp, maxTemp) => handleAddCity(city, minTemp, maxTemp)}
  loading={false}
  error={error}
/>
```

### AlertBadge
Visual indicator for alert status.

```tsx
<AlertBadge alert={true} minTemp={5} maxTemp={35} />
```

## Theme Configuration

The app uses CSS custom properties for theming:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.6%;
  --primary: 0 0% 9%;
  --secondary: 0 0% 96.1%;
  /* ... more variables ... */
}

.dark {
  --background: 0 0% 3.6%;
  --foreground: 0 0% 98%;
  /* ... more variables ... */
}
```

## Troubleshooting

### Backend Connection Error
- Ensure Spring Boot is running on the configured URL
- Check `.env.local` for correct `NEXT_PUBLIC_API_URL`
- Verify CORS is enabled on the backend

### Theme Not Persisting
- Clear browser cookies/storage
- Check if `suppressHydrationWarning` is in root `<html>` tag

### Form Not Submitting
- Check browser console for specific error messages
- Verify backend is responding with proper JSON
- Ensure temperature values are valid numbers

## Development Tools

- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - High-quality components
- **next-themes** - Dark mode support
- **Lucide React** - Beautiful icons

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- The frontend is a client-side Next.js app (no backend required)
- All API calls go to the Spring Boot server
- Authentication is not implemented (add as needed)
- CORS must be enabled on the Spring Boot backend

## License

MIT
