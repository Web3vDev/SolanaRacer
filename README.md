# SOL Race - Solana Price Prediction Game

A decentralized application (DApp) built as a Farcaster miniapp where users predict Solana (SOL) price movements in an exciting racing-themed game.

## 🏎️ Overview

SOL Race is an interactive price prediction game that combines the thrill of Formula 1 racing with cryptocurrency trading. Players predict whether SOL price will "pump" or "dump" within 4-second intervals, earning points and unlocking rewards based on their accuracy.

## ✨ Features

### 🎮 Core Gameplay

- **Real-time Price Predictions**: Predict SOL price movements every 4 seconds
- **Energy System**: Limited predictions with automatic recovery (10 minutes per energy)
- **Racing Theme**: F1-inspired UI with animated cars and racing tracks
- **Sound Effects**: Immersive audio experience with background music and sound effects


### 🏆 Progression System

- **Level System**: 10 levels from Rookie to Godlike
- **Badge Collection**: 15+ badges including leaderboard achievements
- **Avatar Frames**: 9 customizable frames from Starter to Obsidian God
- **Win Streaks**: Combo bonuses for consecutive correct predictions


### 🚗 F1 Car Collection

- **10 Authentic F1 Cars**: From Williams FW46 to Red Bull RB20
- **Car Stats**: Speed, Acceleration, Handling, Reliability
- **Performance Bonuses**: Win rate boost, points multiplier, resistance bonus
- **Rarity System**: Common to Mythic rarity levels


### ⚡ Upgrade System

- **Win Bonus**: Extra points when winning predictions
- **Point Multiplier**: Increase points percentage
- **Recovery Speed**: Faster energy regeneration
- **Energy Tank**: Increase maximum energy capacity
- **Combo Master**: Bonus points for win streaks


### 🏁 Racing Mode

- **1v1 Races**: Compete against AI opponents on famous F1 tracks
- **10 Race Tracks**: From Yas Marina to Ethereum World Circuit
- **Difficulty Levels**: Easy, Medium, Hard, Expert
- **Entry Fees & Rewards**: Risk points to win bigger rewards


### 📋 Task System

- **Daily Tasks**: Check-in, social sharing, predictions
- **Weekly Challenges**: Complete all daily tasks for 7 days
- **One-time Achievements**: Follow social accounts, connect wallet
- **Social Integration**: Twitter/X and Farcaster sharing


### 🏅 Leaderboard

- **Global Rankings**: Compete with players worldwide
- **Real-time Updates**: Live leaderboard with Supabase integration
- **Special Badges**: Top 1, Top 3, Top 10, Top 50, Top 100 achievements
- **User Profiles**: Detailed stats and achievement showcase


## 🛠️ Technology Stack

### Frontend

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icons


### Backend & Data

- **Supabase**: PostgreSQL database with real-time features
- **Alchemy API**: Real-time Solana price data
- **CoinGecko API**: Fallback price data source


### Farcaster Integration

- **Farcaster SDK**: Native miniapp integration
- **Frame Context**: User authentication and social features
- **Cast Embeds**: Shareable game content


### Audio System

- **Web Audio API**: Background music and sound effects
- **Sound Manager**: Centralized audio control with caching
- **Volume Controls**: User-configurable audio settings


## 🏗️ Project Structure

\`\`\`plaintext
sol-race-dapp/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Main application entry
│   └── globals.css              # Global styles and animations
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   ├── tabs/                    # Tab-specific components
│   │   ├── race-tab.tsx         # Main racing game
│   │   ├── profile-tab.tsx      # User profile and stats
│   │   ├── teams-tab.tsx        # Racing mode
│   │   ├── leaderboard-tab.tsx  # Global rankings
│   │   ├── tasks-tab.tsx        # Task and achievement system
│   │   └── race/                # Race-specific components
│   ├── shared/                  # Shared components
│   └── ...                      # Other components
├── lib/                         # Core libraries
│   ├── price-service.ts         # Real-time price data
│   ├── sound-manager.ts         # Audio system
│   ├── supabase.ts             # Database client
│   └── user-data-manager.ts    # User data persistence
├── utils/                       # Utility functions
│   ├── badge-system.ts         # Badge and achievement logic
│   ├── level-system.ts         # Player progression
│   ├── f1-car-system.ts        # Car collection system
│   ├── task-system.ts          # Task management
│   └── leaderboard-system.ts   # Ranking calculations
├── types/                       # TypeScript type definitions
├── hooks/                       # Custom React hooks
└── public/                      # Static assets
    ├── sounds/                  # Audio files
    ├── images/                  # Game images
    ├── f1-cars/                # F1 car images
    ├── badges/                 # Achievement badges
    └── badge-frames/           # Avatar frames
\`\`\`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Alchemy API key (optional, has fallback)


### Installation

1. **Clone the repository**


\`\`\`shellscript
git clone https://github.com/your-username/sol-race-dapp.git
cd sol-race-dapp
\`\`\`

2. **Install dependencies**


\`\`\`shellscript
npm install
\`\`\`

3. **Set up environment variables**


\`\`\`shellscript
cp .env.example .env.local
\`\`\`

Edit `.env.local`:

\`\`\`plaintext
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Alchemy API (optional)
ALCHEMY_API_KEY=your_alchemy_api_key
\`\`\`

4. **Set up Supabase database**


\`\`\`shellscript
# Run the SQL schema in your Supabase SQL editor
cat supabase-schema.sql
\`\`\`

5. **Start development server**


\`\`\`shellscript
npm run dev
\`\`\`

6. **Open in browser**
Navigate to `http://localhost:3000`


### Farcaster Integration

To test Farcaster features:

1. **Deploy to Vercel**


\`\`\`shellscript
npm run build
# Deploy to Vercel or your preferred platform
\`\`\`

2. **Create Farcaster Frame**


- Use your deployed URL as the frame URL
- Test in Farcaster clients like Warpcast


## 🎮 How to Play

### Basic Gameplay

1. **Start Predicting**: Click "PUMP" or "DUMP" to predict SOL price movement
2. **Wait for Result**: 4-second countdown with animated price changes
3. **Earn Points**: Correct predictions earn 100+ points (with bonuses)
4. **Manage Energy**: Each prediction costs 1 energy (max 20, recovers over time)


### Progression

1. **Level Up**: Earn points to increase your level and unlock features
2. **Collect Badges**: Complete achievements to earn special badges
3. **Upgrade Cars**: Buy and equip F1 cars for performance bonuses
4. **Customize Avatar**: Unlock frames to personalize your profile


### Racing Mode

1. **Choose Track**: Select from 10 F1 circuits with different difficulties
2. **Pay Entry Fee**: Risk points for bigger rewards
3. **Race AI**: 6-round prediction battle against AI opponent
4. **Win Rewards**: Beat the AI to earn maximum track rewards


## 🔧 Configuration

### Sound System

\`\`\`typescript
// Enable/disable sounds
import { toggleSound, setMasterVolume } from '@/lib/sound-manager'

toggleSound() // Toggle on/off
setMasterVolume(0.5) // Set volume (0-1)
\`\`\`

### Price Service

\`\`\`typescript
// Configure price update interval
const PRICE_UPDATE_INTERVAL = 2000 // 2 seconds
\`\`\`

### Game Balance

\`\`\`typescript
// Adjust in respective utility files
const BASE_ENERGY_RECOVERY = 10 * 60 * 1000 // 10 minutes
const MAX_SUCCESS_RATE = 95 // 95% cap
const BASE_POINTS_PER_WIN = 100
\`\`\`

## 📊 Database Schema

### User Profiles

\`\`\`sql
CREATE TABLE user_profiles (
  fid BIGINT PRIMARY KEY,
  display_name TEXT NOT NULL,
  username TEXT,
  pfp_url TEXT,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  win_streak INTEGER DEFAULT 0,
  total_races INTEGER DEFAULT 0,
  predictions_remaining INTEGER DEFAULT 10,
  max_predictions INTEGER DEFAULT 20,
  base_success_rate INTEGER DEFAULT 65,
  last_prediction_time TIMESTAMPTZ DEFAULT NOW(),
  double_points_active BOOLEAN DEFAULT FALSE,
  double_points_end_time TIMESTAMPTZ DEFAULT NOW(),
  upgrades JSONB DEFAULT '[]'::jsonb,
  cars JSONB DEFAULT '[]'::jsonb,
  items JSONB DEFAULT '[]'::jsonb,
  unlocked_badges INTEGER[] DEFAULT '{}',
  unlocked_frames INTEGER[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

## 🎨 Customization

### Adding New F1 Cars

1. Add car image to `/public/f1-cars/`
2. Update `utils/f1-car-system.ts`:


\`\`\`typescript
{
  id: 11,
  name: "New F1 Car",
  team: "Team Name",
  image: "/f1-cars/new-car.png",
  price: 5000,
  rarity: "epic",
  stats: { speed: 80, acceleration: 75, handling: 70, reliability: 85 },
  bonuses: { winRateBonus: 8, pointsMultiplier: 0.2, resistanceBonus: 15 },
  owned: false,
  isEquipped: false,
}
\`\`\`

### Adding New Badges

1. Add badge image to `/public/badges/`
2. Update `utils/badge-system.ts`:


\`\`\`typescript
{
  id: 16,
  name: "New Achievement",
  description: "Complete a special task",
  icon: "/badges/new-badge.png",
  pointsRequired: 1000,
  rarity: "rare",
  category: "special",
}
\`\`\`

### Adding New Race Tracks

1. Create track SVG
2. Update `components/tabs/teams-tab.tsx`:


\`\`\`typescript
{
  id: 11,
  name: "New Circuit",
  country: "Country",
  svg: `<svg>...</svg>`,
  difficulty: "Medium",
  entryFee: 400,
  maxReward: 1600,
  playersOnline: 15,
}
\`\`\`

## 🔊 Audio Assets

The game includes various audio files:

- `background-sound.mp3`: Main background music
- `bump-dump-button-sound.mp3`: Prediction button clicks
- `correct.mp3`: Successful prediction
- `wrong.mp3`: Failed prediction
- `notification.mp3`: General notifications
- `nav-button-click.mp3`: Navigation sounds


## 🚀 Deployment

### Vercel (Recommended)

1. **Connect GitHub repository**
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch


### Manual Deployment

\`\`\`shellscript
npm run build
npm start
\`\`\`

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**


### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain component modularity
- Add proper error handling
- Include JSDoc comments for complex functions


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Farcaster Team**: For the amazing social protocol
- **Supabase**: For the excellent backend-as-a-service
- **Formula 1**: For inspiration and racing theme
- **Solana**: For the blockchain technology
- **Alchemy**: For reliable price data APIs


## 📞 Support

- **GitHub Issues**: [Create an issue](https://github.com/your-username/sol-race-dapp/issues)
- **Farcaster**: [@your-username](https://warpcast.com/your-username)
- **Twitter**: [@your-username](https://twitter.com/your-username)


## 🔮 Roadmap

### Phase 1 (Current)

- ✅ Core prediction game
- ✅ F1 car collection
- ✅ Racing mode
- ✅ Task system
- ✅ Leaderboard


### Phase 2 (Next)

- 🔄 Multiplayer racing
- 🔄 Tournament system
- 🔄 NFT integration
- 🔄 Token rewards
- 🔄 Mobile app


### Phase 3 (Future)

- 📋 Cross-chain support
- 📋 Advanced analytics
- 📋 Esports tournaments
- 📋 VR/AR features
- 📋 AI-powered opponents


---

**Built with ❤️ for the Farcaster and Solana communities**

This generation may require the following integrations:
