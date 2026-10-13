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
    "id": "game-cs2",
    "name": "Counter-Strike 2",
    "platform": "Steam",
    "steamAppId": 730,
    "imageUrl": "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
    "installDrive": "C:\\\\Program Files (x86)\\\\Steam\\\\steamapps\\\\common\\\\Counter-Strike Global Offensive",
    "path": "game\\\\bin\\\\win64\\\\cs2.exe",
    "sizeGB": 34.6,
    "launchOptions": "-novid -freq 240 -high -threads 8 +exec autoexec.cfg",
    "configFileTweak": "cs2_video.txt & autoexec.cfg (fps_max 0, r_player_visibility_mode 1)",
    "profile": {
      "id": "prof-cs2",
      "gameId": "game-cs2",
      "highPriority": true,
      "closeBackgroundApps": true,
      "gameMode": true,
      "ultimatePowerPlan": true,
      "cleanRamOnLaunch": true,
      "autoApply": true
    }
  },
  {
    "id": "game-fivem",
    "name": "FiveM (GTA V RP)",
    "platform": "Custom",
    "imageUrl": "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg",
    "installDrive": "%localappdata%\\\\FiveM\\\\FiveM.app",
    "path": "FiveM.exe",
    "sizeGB": 18.4,
    "launchOptions": "-high -useALLavailableCores",
    "configFileTweak": "CitizenFX.ini & caches.xml temizliği + NUI in-game overlay optimizasyonu",
    "profile": {
      "id": "prof-fivem",
      "gameId": "game-fivem",
      "highPriority": true,
      "closeBackgroundApps": true,
      "gameMode": true,
      "ultimatePowerPlan": true,
      "cleanRamOnLaunch": true,
      "autoApply": true
    }
  },
  {
    "id": "game-fortnite",
    "name": "Fortnite",
    "platform": "Epic Games",
    "imageUrl": "https://cdn2.unrealengine.com/14br-consoles-1920x1080-wlogo-1920x1080-e99f52c6508d.jpg",
    "installDrive": "C:\\\\Program Files\\\\Epic Games\\\\Fortnite\\\\FortniteGame",
    "path": "Binaries\\\\Win64\\\\FortniteClient-Win64-Shipping.exe",
    "sizeGB": 52.3,
    "launchOptions": "-USEALLAVAILABLECORES -NOSPLASH -PREFERREDPROCESSOR 8",
    "configFileTweak": "GameUserSettings.ini (bShowGrass=False, bDisableMouseAcceleration=True)",
    "profile": {
      "id": "prof-fortnite",
      "gameId": "game-fortnite",
      "highPriority": true,
      "closeBackgroundApps": true,
      "gameMode": true,
      "ultimatePowerPlan": true,
      "cleanRamOnLaunch": true,
      "autoApply": true
    }
  },
  {
    "id": "game-apex",
    "name": "Apex Legends",
    "platform": "Steam",
    "steamAppId": 1172470,
    "imageUrl": "https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg",
    "installDrive": "D:\\\\SteamLibrary\\\\steamapps\\\\common\\\\Apex Legends",
    "path": "r5apex.exe",
    "sizeGB": 76.8,
    "launchOptions": "+fps_max 0 -novid -high +exec autoexec.cfg",
    "configFileTweak": "videoconfig.txt (setting.csm_enabled 0, setting.stream_memory 0)",
    "profile": {
      "id": "prof-apex",
      "gameId": "game-apex",
      "highPriority": true,
      "closeBackgroundApps": true,
      "gameMode": true,
      "ultimatePowerPlan": true,
      "cleanRamOnLaunch": true,
      "autoApply": true
    }
  },
  {
    "id": "game-pubg",
    "name": "PUBG: BATTLEGROUNDS",
    "platform": "Steam",
    "steamAppId": 578080,
    "imageUrl": "https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg",
    "installDrive": "C:\\\\Program Files (x86)\\\\Steam\\\\steamapps\\\\common\\\\PUBG",
    "path": "TslGame\\\\Binaries\\\\Win64\\\\TslGame.exe",
    "sizeGB": 48.2,
    "launchOptions": "-USEALLAVAILABLECORES -malloc=system -sm4",
    "configFileTweak": "GameUserSettings.ini & Engine.ini (FrameRateLimit=0)",
    "profile": {
      "id": "prof-pubg",
      "gameId": "game-pubg",
      "highPriority": true,
      "closeBackgroundApps": true,
      "gameMode": true,
      "ultimatePowerPlan": true,
      "cleanRamOnLaunch": true,
      "autoApply": true
    }
  },
  {
    "id": "game-rust",
    "name": "Rust",
    "platform": "Steam",
    "steamAppId": 252490,
    "imageUrl": "https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg",
    "installDrive": "D:\\\\SteamLibrary\\\\steamapps\\\\common\\\\Rust",
    "path": "RustClient.exe",
    "sizeGB": 28.5,
    "launchOptions": "-high -maxMem=16384 -malloc=system -force-feature-level-11-0",
    "configFileTweak": "client.cfg (gc.buffer 2048, graphics.shadowdistance 0)",
    "profile": {
      "id": "prof-rust",
      "gameId": "game-rust",
      "highPriority": true,
      "closeBackgroundApps": true,
      "gameMode": true,
      "ultimatePowerPlan": true,
      "cleanRamOnLaunch": true,
      "autoApply": true
    }
  },
  {
    "id": "game-minecraft",
    "name": "Minecraft (Java Edition)",
    "platform": "Custom",
    "imageUrl": "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=600&q=80",
    "installDrive": "%appdata%\\\\.minecraft",
    "path": "javaw.exe",
    "sizeGB": 4.2,
    "launchOptions": "-Xmx8G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=20",
    "configFileTweak": "options.txt (renderDistance:8, maxFps:260, entityDistanceScaling:0.8)",
    "profile": {
      "id": "prof-mc",
      "gameId": "game-minecraft",
      "highPriority": true,
      "closeBackgroundApps": true,
      "gameMode": true,
      "ultimatePowerPlan": true,
      "cleanRamOnLaunch": true,
      "autoApply": true
    }
  },
  {
    "id": "game-roblox",
    "name": "Roblox",
    "platform": "Custom",
    "imageUrl": "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80",
    "installDrive": "%localappdata%\\\\Roblox\\\\Versions",
    "path": "RobloxPlayerBeta.exe",
    "sizeGB": 1.8,
    "launchOptions": "Roblox FPS Unlocker (240 FPS)",
    "configFileTweak": "ClientAppSettings.json (DFIntTaskSchedulerTargetFps: 240)",
    "profile": {
      "id": "prof-roblox",
      "gameId": "game-roblox",
      "highPriority": true,
      "closeBackgroundApps": true,
      "gameMode": true,
      "ultimatePowerPlan": true,
      "cleanRamOnLaunch": true,
      "autoApply": true
    }
  },
  {
    "id": "game-dota2",
    "name": "Dota 2",
    "platform": "Steam",
    "steamAppId": 570,
    "imageUrl": "https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg",
    "installDrive": "C:\\\\Program Files (x86)\\\\Steam\\\\steamapps\\\\common\\\\dota 2 beta",
    "path": "game\\\\bin\\\\win64\\\\dota2.exe",
    "sizeGB": 45,
    "launchOptions": "-novid -high -mainthreadpriority 1 -map dota",
    "configFileTweak": "video.txt & autoexec.cfg (dota_camera_accelerate 49)",
    "profile": {
      "id": "prof-dota2",
      "gameId": "game-dota2",
      "highPriority": true,
      "closeBackgroundApps": true,
      "gameMode": true,
      "ultimatePowerPlan": true,
      "cleanRamOnLaunch": true,
      "autoApply": true
    }
  },
  {
    "id": "game-rocketleague",
    "name": "Rocket League",
    "platform": "Epic Games",
    "imageUrl": "https://cdn.akamai.steamstatic.com/steam/apps/252950/header.jpg",
    "installDrive": "C:\\\\Program Files\\\\Epic Games\\\\rocketleague\\\\Binaries\\\\Win64",
    "path": "RocketLeague.exe",
    "sizeGB": 19.5,
    "launchOptions": "-high -USEALLAVAILABLECORES",
    "configFileTweak": "TASystemSettings.ini (bEnableBranchingPCFShadows=False, MaxChannels=64)",
    "profile": {
      "id": "prof-rl",
      "gameId": "game-rocketleague",
      "highPriority": true,
      "closeBackgroundApps": true,
      "gameMode": true,
      "ultimatePowerPlan": true,
      "cleanRamOnLaunch": true,
      "autoApply": true
    }
  },
  {
    "id": "game-r6",
    "name": "Tom Clancy's Rainbow Six Siege",
    "platform": "Steam",
    "steamAppId": 359550,
    "imageUrl": "https://cdn.akamai.steamstatic.com/steam/apps/359550/header.jpg",
    "installDrive": "C:\\\\Program Files (x86)\\\\Steam\\\\steamapps\\\\common\\\\Tom Clancy's Rainbow Six Siege",
    "path": "RainbowSix_Vulkan.exe",
    "sizeGB": 62.4,
    "launchOptions": "-vulkan -high",
    "configFileTweak": "GameSettings.ini (VulkanRenderScale=1.0, DynamicResolution=0)",
    "profile": {
      "id": "prof-r6",
      "gameId": "game-r6",
      "highPriority": true,
      "closeBackgroundApps": true,
      "gameMode": true,
      "ultimatePowerPlan": true,
      "cleanRamOnLaunch": true,
      "autoApply": true
    }
  },
  {
    "id": "game-gta5",
    "name": "Grand Theft Auto V",
    "platform": "Steam",
    "steamAppId": 271590,
    "imageUrl": "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg",
    "installDrive": "D:\\\\SteamLibrary\\\\steamapps\\\\common\\\\Grand Theft Auto V",
    "path": "GTA5.exe",
    "sizeGB": 104.2,
    "launchOptions": "-high -ignorepipelinecache -GPUCount 1",
    "configFileTweak": "settings.xml (ShadowQuality value=0, GrassQuality value=0)",
    "profile": {
      "id": "prof-gta5",
      "gameId": "game-gta5",
      "highPriority": true,
      "closeBackgroundApps": false,
      "gameMode": true,
      "ultimatePowerPlan": true,
      "cleanRamOnLaunch": true,
      "autoApply": false
    }
  },
  {
    "id": "game-overwatch2",
    "name": "Overwatch 2",
    "platform": "Custom",
    "imageUrl": "https://cdn.akamai.steamstatic.com/steam/apps/2357570/header.jpg",
    "installDrive": "C:\\\\Program Files (x86)\\\\Overwatch",
    "path": "Overwatch.exe",
    "sizeGB": 50,
    "isWindowsPriorityOnly": true,
    "launchOptions": "Windows Yüksek CPU Önceliği (High Priority Registry)",
    "configFileTweak": "Anti-cheat ve oyun sürecine dokunulmaz. Windows tarafında CPU afinitesi ayrılır.",
    "profile": {
      "id": "prof-ow2",
      "gameId": "game-overwatch2",
      "highPriority": true,
      "closeBackgroundApps": true,
      "gameMode": true,
      "ultimatePowerPlan": true,
      "cleanRamOnLaunch": true,
      "autoApply": true
    }
  },
  {
    "id": "game-marvelrivals",
    "name": "Marvel Rivals",
    "platform": "Steam",
    "steamAppId": 2767030,
    "imageUrl": "https://cdn.akamai.steamstatic.com/steam/apps/2767030/header.jpg",
    "installDrive": "C:\\\\Program Files (x86)\\\\Steam\\\\steamapps\\\\common\\\\MarvelRivals",
    "path": "MarvelRivals.exe",
    "sizeGB": 46,
    "isWindowsPriorityOnly": true,
    "launchOptions": "Windows Yüksek CPU Önceliği & DirectX 12 Pipeline",
    "configFileTweak": "Oyun dosyalarına müdahale edilmez; Windows zamanlayıcısı thread önceliği verir.",
    "profile": {
      "id": "prof-rivals",
      "gameId": "game-marvelrivals",
      "highPriority": true,
      "closeBackgroundApps": true,
      "gameMode": true,
      "ultimatePowerPlan": true,
      "cleanRamOnLaunch": true,
      "autoApply": true
    }
  },
  {
    "id": "game-deltaforce",
    "name": "Delta Force: Hawk Ops",
    "platform": "Steam",
    "steamAppId": 2507950,
    "imageUrl": "https://cdn.akamai.steamstatic.com/steam/apps/2507950/header.jpg",
    "installDrive": "C:\\\\Program Files (x86)\\\\Steam\\\\steamapps\\\\common\\\\DeltaForce",
    "path": "DeltaForce.exe",
    "sizeGB": 55,
    "isWindowsPriorityOnly": true,
    "launchOptions": "Windows Yüksek CPU Önceliği (MMCSS Audio / Input Priority)",
    "configFileTweak": "Anti-cheat (ACE) güvenli kalır. Yalnızca Windows işletim sistemi optimizasyonu uygulanır.",
    "profile": {
      "id": "prof-df",
      "gameId": "game-deltaforce",
      "highPriority": true,
      "closeBackgroundApps": true,
      "gameMode": true,
      "ultimatePowerPlan": true,
      "cleanRamOnLaunch": true,
      "autoApply": true
    }
  },
  {
    "id": "game-cod",
    "name": "Call of Duty (Warzone / MW3)",
    "platform": "Steam",
    "steamAppId": 1938090,
    "imageUrl": "https://cdn.akamai.steamstatic.com/steam/apps/1938090/header.jpg",
    "installDrive": "D:\\\\SteamLibrary\\\\steamapps\\\\common\\\\Call of Duty HQ",
    "path": "cod.exe",
    "sizeGB": 120,
    "isWindowsPriorityOnly": true,
    "launchOptions": "Windows Yüksek CPU Önceliği & VRAM Target 0.75",
    "configFileTweak": "options.4.cod23.cst (RendererWorkerCount çekirdek sayısı eşitlemesi)",
    "profile": {
      "id": "prof-cod",
      "gameId": "game-cod",
      "highPriority": true,
      "closeBackgroundApps": true,
      "gameMode": true,
      "ultimatePowerPlan": true,
      "cleanRamOnLaunch": true,
      "autoApply": true
    }
  },
  {
    "id": "game-val",
    "name": "Valorant (Vanguard Korumalı)",
    "platform": "Riot Games",
    "imageUrl": "https://images.contentstack.io/v3/assets/blt3706121367b58f11/blte949988226e6f5c8/5ebc83789436ea08b7762635/V_AGENTS_587x900_all.jpg",
    "installDrive": "C:\\\\Riot Games\\\\VALORANT\\\\live",
    "path": "ShooterGame\\\\Binaries\\\\Win64\\\\VALORANT-Win64-Shipping.exe",
    "sizeGB": 42.1,
    "isWindowsPriorityOnly": true,
    "launchOptions": "Yalnızca Windows Tarafı Optimizasyonu (Vanguard Dokunulmaz)",
    "configFileTweak": "Vanguard çekirdeğine asla dokunulmaz. Windows Timer Resolution 0.5ms ve DWM gecikmesi optimize edilir.",
    "profile": {
      "id": "prof-val",
      "gameId": "game-val",
      "highPriority": true,
      "closeBackgroundApps": true,
      "gameMode": true,
      "ultimatePowerPlan": true,
      "cleanRamOnLaunch": true,
      "autoApply": true
    }
  }
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
