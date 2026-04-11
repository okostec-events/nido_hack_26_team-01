// ImpactOS Mock Data

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  level: number
  levelTitle: string
  totalPoints: number
  pointsToNextLevel: number
  memberSince: string
}

export interface ImpactMetrics {
  co2Saved: number // in kg
  waterSaved: number // in liters
  wasteReduced: number // in kg
  communityScore: number // 0-100
}

export interface Action {
  id: string
  userId: string
  userName: string
  userAvatar: string
  category: string
  title: string
  description: string
  points: number
  impact: {
    co2?: number
    water?: number
    waste?: number
    community?: number
  }
  timestamp: string
  verified: boolean
}

export interface Opportunity {
  id: string
  title: string
  category: string
  description: string
  location: string
  expectedImpact: {
    co2?: number
    water?: number
    waste?: number
    community?: number
  }
  points: number
  deadline?: string
  participants: number
}

export interface Reward {
  id: string
  title: string
  description: string
  pointsRequired: number
  category: string
  unlocked: boolean
  partner?: string
}

export interface InstitutionalMetrics {
  totalActions: number
  totalParticipants: number
  totalCO2Saved: number
  totalWaterSaved: number
  totalWasteReduced: number
  engagementRate: number
  weeklyTrend: number[]
}

// Mock current user — level 3 at 2840 pts, 160 pts away from level-up (demo arc)
export const currentUser: User = {
  id: "user_1",
  name: "Alex Martinez",
  email: "alex.martinez@email.com",
  avatar: "AM",
  level: 3,
  levelTitle: "Advocate",
  totalPoints: 2840,
  pointsToNextLevel: 3000,
  memberSince: "2025-09-15",
}

// Mock impact metrics for current user
export const userImpact: ImpactMetrics = {
  co2Saved: 127.5,
  waterSaved: 2450,
  wasteReduced: 45.2,
  communityScore: 78,
}

// Mock activity feed
export const recentActions: Action[] = [
  {
    id: "act_1",
    userId: "user_1",
    userName: "Alex Martinez",
    userAvatar: "AM",
    category: "Transport",
    title: "Cycled to work",
    description: "Commuted 12km by bicycle instead of car",
    points: 45,
    impact: { co2: 2.8 },
    timestamp: "2026-04-11T08:30:00Z",
    verified: true,
  },
  {
    id: "act_2",
    userId: "user_2",
    userName: "Sarah Chen",
    userAvatar: "SC",
    category: "Waste",
    title: "Community cleanup",
    description: "Participated in neighborhood cleanup event",
    points: 75,
    impact: { waste: 8.5, community: 15 },
    timestamp: "2026-04-10T14:00:00Z",
    verified: true,
  },
  {
    id: "act_3",
    userId: "user_3",
    userName: "Marcus Johnson",
    userAvatar: "MJ",
    category: "Energy",
    title: "Solar panel installation",
    description: "Installed residential solar panels",
    points: 500,
    impact: { co2: 45 },
    timestamp: "2026-04-10T10:15:00Z",
    verified: true,
  },
  {
    id: "act_4",
    userId: "user_1",
    userName: "Alex Martinez",
    userAvatar: "AM",
    category: "Water",
    title: "Rainwater collection setup",
    description: "Set up rainwater harvesting system for garden",
    points: 120,
    impact: { water: 500 },
    timestamp: "2026-04-09T16:45:00Z",
    verified: true,
  },
  {
    id: "act_5",
    userId: "user_4",
    userName: "Emily Rodriguez",
    userAvatar: "ER",
    category: "Community",
    title: "Volunteered at food bank",
    description: "4 hours of volunteer work at local food bank",
    points: 80,
    impact: { community: 20 },
    timestamp: "2026-04-09T12:00:00Z",
    verified: true,
  },
  {
    id: "act_6",
    userId: "user_5",
    userName: "David Kim",
    userAvatar: "DK",
    category: "Waste",
    title: "Electronics recycling",
    description: "Properly recycled old electronics at certified center",
    points: 60,
    impact: { waste: 12, co2: 5.2 },
    timestamp: "2026-04-08T11:30:00Z",
    verified: true,
  },
]

// Mock opportunities
export const opportunities: Opportunity[] = [
  {
    id: "opp_1",
    title: "City Park Restoration",
    category: "Environment",
    description: "Help restore native plants in Central Park. Tools and refreshments provided.",
    location: "Central Park, Downtown",
    expectedImpact: { co2: 5, community: 25 },
    points: 150,
    deadline: "2026-04-20",
    participants: 45,
  },
  {
    id: "opp_2",
    title: "Bike-to-Work Challenge",
    category: "Transport",
    description: "Commit to cycling for your daily commute this month. Track your rides and earn bonus points.",
    location: "Citywide",
    expectedImpact: { co2: 30 },
    points: 200,
    deadline: "2026-04-30",
    participants: 128,
  },
  {
    id: "opp_3",
    title: "Water Conservation Workshop",
    category: "Education",
    description: "Learn practical techniques to reduce household water consumption.",
    location: "Community Center",
    expectedImpact: { water: 200, community: 10 },
    points: 50,
    deadline: "2026-04-15",
    participants: 22,
  },
  {
    id: "opp_4",
    title: "Zero Waste Challenge",
    category: "Waste",
    description: "30-day challenge to minimize household waste. Weekly check-ins and support group.",
    location: "Online + Local Meetups",
    expectedImpact: { waste: 15, co2: 8 },
    points: 300,
    deadline: "2026-05-01",
    participants: 67,
  },
  {
    id: "opp_5",
    title: "Senior Tech Support",
    category: "Community",
    description: "Help seniors learn to use smartphones and computers at the library.",
    location: "Public Library",
    expectedImpact: { community: 30 },
    points: 100,
    participants: 12,
  },
]

// Mock rewards
export const rewards: Reward[] = [
  {
    id: "rew_1",
    title: "10% Off Local Transit Pass",
    description: "Get 10% off your monthly transit pass at participating transit authorities.",
    pointsRequired: 500,
    category: "Transport",
    unlocked: true,
    partner: "Metro Transit",
  },
  {
    id: "rew_2",
    title: "Free Coffee at Green Cafe",
    description: "Enjoy a complimentary coffee at participating Green Cafe locations.",
    pointsRequired: 200,
    category: "Food",
    unlocked: true,
    partner: "Green Cafe",
  },
  {
    id: "rew_3",
    title: "Tree Planted in Your Name",
    description: "We will plant a tree in the community forest with a plaque in your name.",
    pointsRequired: 1000,
    category: "Environment",
    unlocked: true,
    partner: "City Forestry Dept",
  },
  {
    id: "rew_4",
    title: "15% Off Solar Installation",
    description: "Exclusive discount on residential solar panel installation.",
    pointsRequired: 2500,
    category: "Energy",
    unlocked: true,
    partner: "SunPower Co",
  },
  {
    id: "rew_5",
    title: "VIP Event Access",
    description: "Exclusive access to city sustainability events and networking sessions.",
    pointsRequired: 5000,
    category: "Exclusive",
    unlocked: false,
    partner: "City Council",
  },
]

// Mock institutional metrics
export const institutionalMetrics: InstitutionalMetrics = {
  totalActions: 12847,
  totalParticipants: 3256,
  totalCO2Saved: 45280,
  totalWaterSaved: 892000,
  totalWasteReduced: 15640,
  engagementRate: 72.4,
  weeklyTrend: [1850, 2100, 1920, 2340, 2180, 2450, 2007],
}

// Action categories for submission
export const actionCategories = [
  { id: "transport", label: "Transport", icon: "bike" },
  { id: "energy", label: "Energy", icon: "zap" },
  { id: "water", label: "Water", icon: "droplet" },
  { id: "waste", label: "Waste", icon: "recycle" },
  { id: "community", label: "Community", icon: "users" },
  { id: "education", label: "Education", icon: "book" },
]

// Interest categories for onboarding
export const interestCategories = [
  { id: "environment", label: "Environment", description: "Climate action and conservation" },
  { id: "community", label: "Community", description: "Local volunteering and engagement" },
  { id: "education", label: "Education", description: "Learning and teaching sustainability" },
  { id: "health", label: "Health", description: "Active lifestyle and wellness" },
  { id: "technology", label: "Technology", description: "Smart solutions and innovation" },
]

// Level tiers
export const levelTiers = [
  { level: 1, title: "Newcomer", minPoints: 0, maxPoints: 500 },
  { level: 2, title: "Contributor", minPoints: 500, maxPoints: 1500 },
  { level: 3, title: "Advocate", minPoints: 1500, maxPoints: 3000 },
  { level: 4, title: "Impact Leader", minPoints: 3000, maxPoints: 5000 },
  { level: 5, title: "Sustainability Champion", minPoints: 5000, maxPoints: 10000 },
  { level: 6, title: "Eco Ambassador", minPoints: 10000, maxPoints: null },
]
