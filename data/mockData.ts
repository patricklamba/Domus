// Types for our data models
export type CleanerType = {
  id: number;
  name: string;
  age: number;
  experience: number;
  rating: number;
  hourlyRate: number;
  location: string;
  isAvailable: boolean;
  bio?: string;
  services: string[];
  profilePicture: string;
  reviews: {
    from: string;
    rating: number;
    text: string;
  }[];
};

export type EmployerType = {
  id: number;
  name: string;
  location: string;
  profilePicture: string;
};

export type RequestType = {
  id: number;
  employerId: number;
  cleanerId?: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  date: string;
  time: string;
  location: string;
  price: number;
  notes?: string;
};

// Sample data for cleaners
export const CLEANERS: CleanerType[] = [
  {
    id: 1,
    name: 'Maria Silva',
    age: 28,
    experience: 5,
    rating: 4.8,
    hourlyRate: 2500,
    location: 'Luanda Centro',
    isAvailable: true,
    bio: 'Professional cleaner with 5 years of experience in residential cleaning. I am detail-oriented and reliable.',
    services: ['General Cleaning', 'Deep Cleaning', 'Window Cleaning', 'Ironing', 'Dishes'],
    profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    reviews: [
      {
        from: 'João Pereira',
        rating: 5,
        text: 'Maria was excellent. Very thorough and professional.',
      },
      {
        from: 'Ana Martins',
        rating: 4,
        text: 'Good service, arrived on time and did a great job.',
      },
    ],
  },
  {
    id: 2,
    name: 'Carlos Mendes',
    age: 32,
    experience: 7,
    rating: 4.5,
    hourlyRate: 3000,
    location: 'Talatona',
    isAvailable: false,
    services: ['General Cleaning', 'Deep Cleaning', 'Garden Work'],
    profilePicture: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
    reviews: [
      {
        from: 'Sofia Almeida',
        rating: 5,
        text: 'Carlos is very professional and thorough.',
      },
    ],
  },
  {
    id: 3,
    name: 'Isabel Neto',
    age: 25,
    experience: 3,
    rating: 4.2,
    hourlyRate: 2000,
    location: 'Miramar',
    isAvailable: true,
    services: ['General Cleaning', 'Laundry', 'Ironing'],
    profilePicture: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
    reviews: [],
  },
  {
    id: 4,
    name: 'Paulo Santos',
    age: 35,
    experience: 8,
    rating: 4.9,
    hourlyRate: 3500,
    location: 'Talatona',
    isAvailable: true,
    services: ['General Cleaning', 'Deep Cleaning', 'Window Cleaning', 'Dishes'],
    profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    reviews: [
      {
        from: 'Margarida Costa',
        rating: 5,
        text: 'Paulo is amazing! My house has never been cleaner.',
      },
      {
        from: 'Ricardo Ferreira',
        rating: 5,
        text: 'Very professional and punctual.',
      },
    ],
  },
  {
    id: 5,
    name: 'Ana Oliveira',
    age: 29,
    experience: 4,
    rating: 4.0,
    hourlyRate: 2200,
    location: 'Benfica',
    isAvailable: false,
    services: ['General Cleaning', 'Laundry'],
    profilePicture: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    reviews: [],
  },
];

// Sample data for employers
export const EMPLOYERS: EmployerType[] = [
  {
    id: 1,
    name: 'João Pereira',
    location: 'Luanda Centro',
    profilePicture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
  },
  {
    id: 2,
    name: 'Ana Martins',
    location: 'Talatona',
    profilePicture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
  },
  {
    id: 3,
    name: 'Sofia Almeida',
    location: 'Miramar',
    profilePicture: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
  },
  {
    id: 4,
    name: 'Margarida Costa',
    location: 'Benfica',
    profilePicture: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg',
  },
  {
    id: 5,
    name: 'Ricardo Ferreira',
    location: 'Viana',
    profilePicture: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
  },
];

// Sample data for cleaning requests
export const REQUESTS: RequestType[] = [
  {
    id: 1,
    employerId: 1,
    cleanerId: 1,
    status: 'pending',
    date: '2023-05-15',
    time: '8:00 AM',
    location: 'Luanda Centro',
    price: 2500,
    notes: 'Please focus on the kitchen and bathrooms.',
  },
  {
    id: 2,
    employerId: 2,
    status: 'pending',
    date: '2023-05-16',
    time: '10:00 AM',
    location: 'Talatona',
    price: 3000,
    notes: 'Deep cleaning needed for the entire house.',
  },
  {
    id: 3,
    employerId: 3,
    cleanerId: 1,
    status: 'accepted',
    date: '2023-05-20',
    time: '2:00 PM',
    location: 'Miramar',
    price: 2000,
  },
  {
    id: 4,
    employerId: 4,
    cleanerId: 1,
    status: 'completed',
    date: '2023-05-10',
    time: '9:00 AM',
    location: 'Benfica',
    price: 2500,
  },
];