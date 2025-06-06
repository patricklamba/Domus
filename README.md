# Domus Angola

A modern home cleaning service app for Angola, connecting homeowners with trusted cleaning professionals.

## Features

### For Employers (Homeowners)
- Browse and search for available cleaners
- View cleaner profiles with ratings and reviews
- Book cleaning services with flexible scheduling
- Real-time chat with cleaners
- Secure payment system
- Track cleaning history

### For Cleaners
- Create professional profiles
- Set availability and working areas
- Receive and manage booking requests
- Chat with potential clients
- Track earnings and job history
- Manage schedule and preferences

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Styling**: React Native StyleSheet
- **Icons**: Lucide React Native
- **Platform**: Web, iOS, Android

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/domus-angola-app.git
cd domus-angola-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the provided localhost URL

## Demo Instructions

- **Employer View**: Register/login with a phone number ending in an even digit (0, 2, 4, 6, 8)
- **Cleaner View**: Register/login with a phone number ending in an odd digit (1, 3, 5, 7, 9)

## Project Structure

```
app/
├── (cleaner)/          # Cleaner-specific screens
├── (employer)/         # Employer-specific screens
├── _layout.tsx         # Root layout
├── index.tsx           # Landing page
├── login.tsx           # Login screen
└── register.tsx        # Registration screen

components/             # Reusable components
data/                  # Mock data and types
hooks/                 # Custom hooks
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.