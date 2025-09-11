# CivicLink - Consolidated Application

This is a consolidated version of the CivicLink application that combines the waitlist landing page with the full-featured CivicLink Pulse application.

## Project Structure

- **Frontend**: React + TypeScript + Vite application
- **Backend**: Node.js/Express API server
- **Database**: Supabase integration

## Features

### Landing Page (Waitlist)
- Hero section with CivicLink branding
- Problem statement and solution overview
- Feature cards explaining CivicLink's capabilities
- Waitlist form with user information collection
- Community organizer partnership section

### Main Application
- Home dashboard with quick actions
- Deadlines and polling information
- Translation assistant for multilingual support
- Fact-checking hub for misinformation verification
- Organizer portal for community leaders
- Ambassador toolkit
- Help and language support

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account (for database)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Start the backend server (in a separate terminal):
   ```bash
   cd backend
   npm install
   npm start
   ```

## User Flow

1. **Landing Page**: Users visit the main page and see the CivicLink waitlist
2. **Waitlist Submission**: Users fill out the waitlist form with their information
3. **Automatic Redirect**: After successful waitlist submission, users are automatically redirected to the main app
4. **App Access**: Users can explore all the CivicLink features and functionality

## Routes

- `/` - Landing page with waitlist
- `/app` - Main application dashboard
- `/auth` - Authentication page
- `/deadlines` - Important voting deadlines
- `/polling` - Polling location information
- `/fact-check` - Fact-checking hub
- `/language` - Translation assistant
- `/help` - Help and language support
- `/organizer` - Organizer portal
- `/ambassador` - Ambassador toolkit

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express
- **Database**: Supabase
- **State Management**: React Query, React Context
- **Routing**: React Router DOM

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.