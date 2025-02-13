# Conference Room Scheduler

A modern web application for managing conference room bookings in an organization. Built with Next.js, Express, and TypeScript, using Turbopack for optimized development experience.

## Features

- 🏢 Book conference rooms for meetings
- 📅 View current bookings
- 🕒 Time slot validation
- 👥 Add attendees to bookings
- 🌓 Dark/Light mode support
- ⚡ Real-time updates
- 🎨 Modern, responsive UI
- 💫 Loading animations

## Tech Stack

### Frontend

- Next.js 13+ (React framework)
- TypeScript
- Tailwind CSS
- Axios for API calls
- Context API for theme management

### Backend

- Express.js
- Node.js
- CORS for cross-origin support
- In-memory data storage

### Development Tools

- Turbopack for monorepo management
- ESLint for code quality
- Prettier for code formatting

## Project Structure

```
orbitlink-scheduler/
├── apps/
│   ├── frontend/           # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/       # Next.js app router
│   │   │   ├── components/# React components
│   │   │   ├── config/    # API configuration
│   │   │   └── types/     # TypeScript types
│   │   └── ...
│   └── backend/           # Express backend application
│       ├── index.js       # Main server file
│       └── test.js        # API testing
└── package.json           # Root package.json for Turbopack
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/pottenwalder/orbitlink-scheduler.git
cd orbitlink-scheduler
```

2. Install all dependencies from the root:

```bash
npm install
```

### Running the Application

Start both frontend and backend with a single command:

```bash
npm run dev
```

This will start:

- Frontend on http://localhost:3000
- Backend on http://localhost:5000

## Features in Detail

### Room Booking

- Select from available conference rooms
- Choose date and time slots
- Add meeting title and attendees
- Automatic validation of booking times

### Booking Management

- View all current bookings
- Cancel bookings with confirmation
- Time restriction on cancellations (must be 1+ hour before start)

### User Interface

- Responsive design for all screen sizes
- Dark/Light mode toggle
- Loading states and animations
- Error handling and user feedback

## Development

The project uses Turbopack for efficient development workflow:

- Hot Module Replacement (HMR)
- Parallel execution of frontend and backend
- Shared dependencies management
- Optimized builds

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
