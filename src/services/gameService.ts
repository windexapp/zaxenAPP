import { GameItem } from '../types';

const STORAGE_KEY = 'zaxenbooster_games';

export function getSteamBannerUrl(appId: number): string {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
}

export function getSteamHeroUrl(appId: number): string {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/library_hero.jpg`;
}

const DEFAULT_GAMES: GameItem[] = [
  {
    id: 'game-cs2',
    name: 'Counter-Strike 2',
    platform: 'Steam',
    steamAppId: 730,
    imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg',
    installDrive: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive',
    path: 'game\\bin\\win64\\cs2.exe',
    sizeGB: 34.6,
    lastPlayed: 'Bugün, 14:20',
    profile: {
      id: 'prof-cs2',
      gameId: 'game-cs2',
      highPriority: true,
      closeBackgroundApps: true,
      gameMode: true,
      ultimatePowerPlan: true,
      cleanRamOnLaunch: true,
      autoApply: true,
    },
  },
  {
    id: 'game-val',
    name: 'Valorant',
    platform: 'Riot Games',
    imageUrl: 'https://images.contentstack.io/v3/assets/blt3706121367b58f11/blte949988226e6f5c8/5ebc83789436ea08b7762635/V_AGENTS_587x900_all.jpg',
    installDrive: 'C:\\Riot Games\\VALORANT\\live',
    path: 'ShooterGame\\Binaries\\Win64\\VALORANT-Win64-Shipping.exe',
    sizeGB: 42.1,
    lastPlayed: 'Dün, 21:05',
    profile: {
      id: 'prof-val',
      gameId: 'game-val',
      highPriority: true,
      closeBackgroundApps: true,
      gameMode: true,
      ultimatePowerPlan: true,
      cleanRamOnLaunch: true,
      autoApply: true,
    },
  },
  {
    id: 'game-pubg',
    name: 'PUBG: BATTLEGROUNDS',
    platform: 'Steam',
    steamAppId: 578080,
    imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg',
    installDrive: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\PUBG',
    path: 'TslGame\\Binaries\\Win64\\TslGame.exe',
    sizeGB: 48.2,
    lastPlayed: '2 gün önce',
    profile: {
      id: 'prof-pubg',
      gameId: 'game-pubg',
      highPriority: true,
      closeBackgroundApps: true,
      gameMode: true,
      ultimatePowerPlan: true,
      cleanRamOnLaunch: true,
      autoApply: true,
    },
  },
  {
    id: 'game-apex',
    name: 'Apex Legends',
    platform: 'Steam',
    steamAppId: 1172470,
    imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg',
    installDrive: 'D:\\SteamLibrary\\steamapps\\common\\Apex Legends',
    path: 'r5apex.exe',
    sizeGB: 76.8,
    lastPlayed: '3 gün önce',
    profile: {
      id: 'prof-apex',
      gameId: 'game-apex',
      highPriority: true,
      closeBackgroundApps: false,
      gameMode: true,
      ultimatePowerPlan: true,
      cleanRamOnLaunch: true,
      autoApply: false,
    },
  },
  {
    id: 'game-rust',
    name: 'Rust',
    platform: 'Steam',
    steamAppId: 252490,
    imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg',
    installDrive: 'D:\\SteamLibrary\\steamapps\\common\\Rust',
    path: 'RustClient.exe',
    sizeGB: 28.5,
    lastPlayed: '4 gün önce',
    profile: {
      id: 'prof-rust',
      gameId: 'game-rust',
      highPriority: true,
      closeBackgroundApps: true,
      gameMode: true,
      ultimatePowerPlan: true,
      cleanRamOnLaunch: true,
      autoApply: true,
    },
  },
  {
    id: 'game-gta5',
    name: 'Grand Theft Auto V',
    platform: 'Steam',
    steamAppId: 271590,
    imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg',
    installDrive: 'D:\\SteamLibrary\\steamapps\\common\\Grand Theft Auto V',
    path: 'GTA5.exe',
    sizeGB: 104.2,
    lastPlayed: '1 hafta önce',
    profile: {
      id: 'prof-gta5',
      gameId: 'game-gta5',
      highPriority: true,
      closeBackgroundApps: false,
      gameMode: true,
      ultimatePowerPlan: true,
      cleanRamOnLaunch: true,
      autoApply: false,
    },
  },
  {
    id: 'game-cyberpunk',
    name: 'Cyberpunk 2077',
    platform: 'Steam',
    steamAppId: 1091500,
    imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg',
    installDrive: 'D:\\SteamLibrary\\steamapps\\common\\Cyberpunk 2077',
    path: 'bin\\x64\\Cyberpunk2077.exe',
    sizeGB: 78.2,
    lastPlayed: '1 hafta önce',
    profile: {
      id: 'prof-cyberpunk',
      gameId: 'game-cyberpunk',
      highPriority: true,
      closeBackgroundApps: true,
      gameMode: true,
      ultimatePowerPlan: true,
      cleanRamOnLaunch: true,
      autoApply: true,
    },
  },
  {
    id: 'game-dota2',
    name: 'Dota 2',
    platform: 'Steam',
    steamAppId: 570,
    imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg',
    installDrive: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\dota 2 beta',
    path: 'game\\bin\\win64\\dota2.exe',
    sizeGB: 45.0,
    lastPlayed: '2 hafta önce',
    profile: {
      id: 'prof-dota2',
      gameId: 'game-dota2',
      highPriority: true,
      closeBackgroundApps: true,
      gameMode: true,
      ultimatePowerPlan: true,
      cleanRamOnLaunch: true,
      autoApply: true,
    },
  },
  {
    id: 'game-r6',
    name: 'Tom Clancy\'s Rainbow Six Siege',
    platform: 'Steam',
    steamAppId: 359550,
    imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/359550/header.jpg',
    installDrive: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Tom Clancy\'s Rainbow Six Siege',
    path: 'RainbowSix.exe',
    sizeGB: 62.4,
    lastPlayed: '3 hafta önce',
    profile: {
      id: 'prof-r6',
      gameId: 'game-r6',
      highPriority: true,
      closeBackgroundApps: true,
      gameMode: true,
      ultimatePowerPlan: true,
      cleanRamOnLaunch: true,
      autoApply: false,
    },
  },
];

export class GameService {
  private static instance: GameService;
  private games: GameItem[] = [];

  private constructor() {
    this.load();
  }

  public static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  private load(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: GameItem[] = JSON.parse(raw);
        // Ensure steam images are present
        const merged = parsed.map(game => {
          if (game.steamAppId && (!game.imageUrl || !game.imageUrl.includes('steamstatic'))) {
            return { ...game, imageUrl: getSteamBannerUrl(game.steamAppId) };
          }
          return game;
        });
        this.games = merged;
        return;
      } catch {
        // fallback
      }
    }
    this.games = JSON.parse(JSON.stringify(DEFAULT_GAMES));
    this.save();
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.games));
  }

  public getGames(): GameItem[] {
    return [...this.games];
  }

  public addGame(item: Omit<GameItem, 'id' | 'profile'>): GameItem {
    const newId = `game-custom-${Date.now()}`;
    const newGame: GameItem = {
      ...item,
      id: newId,
      imageUrl: item.steamAppId ? getSteamBannerUrl(item.steamAppId) : item.imageUrl,
      profile: {
        id: `prof-${newId}`,
        gameId: newId,
        highPriority: true,
        closeBackgroundApps: true,
        gameMode: true,
        ultimatePowerPlan: true,
        cleanRamOnLaunch: true,
        autoApply: true,
      },
    };
    this.games.unshift(newGame);
    this.save();
    return newGame;
  }

  public updateProfile(gameId: string, updates: Partial<GameItem['profile']>): void {
    const game = this.games.find(g => g.id === gameId);
    if (game) {
      game.profile = { ...game.profile, ...updates };
      this.save();
    }
  }

  public rescanGames(): GameItem[] {
    this.load();
    return [...this.games];
  }
}
