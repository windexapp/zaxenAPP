import React, { useState } from 'react';
import { 
  Gamepad2, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  Play, 
  Check, 
  Zap, 
  Square,
  Plus,
  ExternalLink,
  X,
  Sparkles,
  Layers
} from 'lucide-react';
import { GameItem, AccentColor } from '../../types';
import { GameService, getSteamBannerUrl } from '../../services/gameService';
import { THEMES } from '../../services/themeHelper';
import { soundFx } from '../../services/soundFxService';
import { HardwareMonitorService } from '../../services/hardwareMonitor';

interface GamesViewProps {
  accentColor?: AccentColor;
}

export const GamesView: React.FC<GamesViewProps> = ({ accentColor = 'red' }) => {
  const gameService = GameService.getInstance();
  const monitor = HardwareMonitorService.getInstance();
  const theme = THEMES[accentColor] || THEMES.red;

  const [games, setGames] = useState<GameItem[]>(gameService.getGames());
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(games[0] || null);
  const [isScanning, setIsScanning] = useState(false);
  const [launchingGameId, setLaunchingGameId] = useState<string | null>(null);
  const [activeRunningGame, setActiveRunningGame] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Add Steam Game Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGameName, setNewGameName] = useState('');
  const [newSteamAppId, setNewSteamAppId] = useState<string>('');

  const handleRescan = () => {
    soundFx.playClickSound();
    setIsScanning(true);
    setTimeout(() => {
      const refreshed = gameService.rescanGames();
      setGames(refreshed);
      setIsScanning(false);
      setFeedback('Steam kütüphanesi ve oyun dizinleri tarandı, kapak resimleri güncellendi.');
      setTimeout(() => setFeedback(null), 3000);
    }, 1000);
  };

  const handleToggleProfileOption = (gameId: string, field: keyof GameItem['profile']) => {
    soundFx.playClickSound();
    if (!selectedGame) return;
    const currentVal = selectedGame.profile[field];
    gameService.updateProfile(gameId, { [field]: !currentVal });
    
    const updatedGames = gameService.getGames();
    setGames(updatedGames);
    const updatedSelected = updatedGames.find(g => g.id === gameId);
    if (updatedSelected) setSelectedGame(updatedSelected);
  };

  const handleLaunchWithBoost = async (game: GameItem) => {
    soundFx.playBoostSound();
    setLaunchingGameId(game.id);
    
    await new Promise(r => setTimeout(r, 1200));
    monitor.cleanRam();
    monitor.setOptimized(true);
    soundFx.playCleanSound();

    setLaunchingGameId(null);
    setActiveRunningGame(game.name);
    setFeedback(`"${game.name}" Steam öncelikli profil ile başlatıldı! Gecikme önleyici profil aktif.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleStopGame = () => {
    soundFx.playClickSound();
    setActiveRunningGame(null);
    monitor.setOptimized(false);
  };

  const handleAddSteamGame = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playBoostSound();
    const appIdNum = Number(newSteamAppId) || 730;
    const name = newGameName.trim() || `Steam Game (${appIdNum})`;

    const created = gameService.addGame({
      name,
      platform: 'Steam',
      steamAppId: appIdNum,
      imageUrl: getSteamBannerUrl(appIdNum),
      installDrive: 'C:\\Program Files (x86)\\Steam\\steamapps\\common',
      path: `${name.replace(/\s+/g, '')}.exe`,
      sizeGB: +(Math.random() * 40 + 20).toFixed(1),
      lastPlayed: 'Yeni Eklendi',
    });

    setGames(gameService.getGames());
    setSelectedGame(created);
    setIsAddModalOpen(false);
    setNewGameName('');
    setNewSteamAppId('');
    setFeedback(`✅ "${created.name}" Steam'den kapak görseliyle kütüphaneye eklendi!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6 pb-6 select-none animate-in fade-in">
      {/* Top Header */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 font-display">
            <Gamepad2 className="w-5 h-5" style={{ color: theme.primaryHex }} />
            Oyun Kütüphanesi & Steam Görsel Entegrasyonu
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Steam resmi CDN sunucularından çekilen yüksek çözünürlüklü kapak görselleri ve oyuna özel düşük gecikme profilleri.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors backdrop-blur-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Steam Oyunu Ekle</span>
          </button>

          <button
            onClick={handleRescan}
            disabled={isScanning}
            className="px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shrink-0 backdrop-blur-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} style={{ color: theme.primaryHex }} />
            <span>{isScanning ? 'Taranıyor...' : 'Yeniden Tara'}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Active running game banner */}
      {activeRunningGame && (
        <div className="p-3.5 rounded-xl bg-white/[0.05] border border-white/15 flex items-center justify-between text-xs backdrop-blur-md animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-white font-bold">{activeRunningGame} Çalışıyor:</span>
            <span className="text-emerald-400">Steam Espor Profili & Öncelikli CPU Tahsisi Aktif</span>
          </div>
          <button
            onClick={handleStopGame}
            className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Square className="w-3 h-3 fill-rose-300" />
            <span>Oyunu Durdur & Normale Dön</span>
          </button>
        </div>
      )}

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Games List with Steam Thumbnails (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Tespit Edilen Oyunlar ({games.length})</span>
            <span className="text-[10px] text-slate-500 font-mono">Steam CDN Bağlantılı</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {games.map(game => {
              const isSelected = selectedGame?.id === game.id;
              const isRunning = activeRunningGame === game.name;
              return (
                <div
                  key={game.id}
                  onClick={() => {
                    soundFx.playClickSound();
                    setSelectedGame(game);
                  }}
                  className={`p-2.5 rounded-2xl border cursor-pointer transition-all backdrop-blur-md flex items-center gap-3 overflow-hidden ${
                    isSelected
                      ? 'bg-white/[0.1] shadow-xl'
                      : 'bg-[#0e111a]/70 border-white/[0.06] hover:border-white/20'
                  }`}
                  style={isSelected ? { borderColor: `${theme.primaryHex}80` } : {}}
                >
                  {/* Steam Header Banner Thumbnail */}
                  <div className="w-24 h-14 rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0 relative">
                    {game.imageUrl ? (
                      <img
                        src={game.imageUrl}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          // Fallback to stylized name block
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-xs text-white bg-slate-800">
                        {game.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    {game.steamAppId && (
                      <div className="absolute bottom-0 right-0 px-1 py-0.2 bg-black/80 text-[8px] font-mono text-cyan-400">
                        Steam
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-white truncate">{game.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="font-mono text-slate-300">{game.platform}</span>
                      <span>·</span>
                      <span>{game.sizeGB} GB</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="text-right shrink-0">
                    {isRunning ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Çalışıyor
                      </span>
                    ) : (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        game.profile.autoApply
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/[0.04] text-slate-400'
                      }`}>
                        {game.profile.autoApply ? 'Oto-Boost' : 'Manuel'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Game Hero & Settings Editor (7 cols) */}
        <div className="lg:col-span-7">
          {selectedGame ? (
            <div className="glass-panel rounded-2xl p-5 shadow-xl space-y-5">
              {/* Game Hero Banner with Official Steam Key Art */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[21/9] bg-black shadow-lg">
                {selectedGame.imageUrl ? (
                  <img
                    src={selectedGame.imageUrl}
                    alt={selectedGame.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-slate-900 to-black"></div>
                )}
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                {/* Banner Content */}
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="text-[10px] font-mono px-2 py-0.5 rounded border font-bold"
                        style={{ 
                          backgroundColor: `${theme.glowHex}`,
                          color: theme.primaryHex,
                          borderColor: `${theme.primaryHex}40`
                        }}
                      >
                        {selectedGame.platform}
                      </span>
                      {selectedGame.steamAppId && (
                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-800 px-2 py-0.5 rounded">
                          Steam AppID: {selectedGame.steamAppId}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-black text-white font-display tracking-wide drop-shadow-md">
                      {selectedGame.name}
                    </h2>
                  </div>

                  <button
                    onClick={() => handleLaunchWithBoost(selectedGame)}
                    disabled={launchingGameId === selectedGame.id || activeRunningGame === selectedGame.name}
                    className="px-5 py-2.5 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 transform active:scale-95 shrink-0"
                    style={{
                      backgroundColor: activeRunningGame === selectedGame.name ? '#059669' : theme.primaryHex,
                      boxShadow: `0 0 15px ${theme.glowHex}`
                    }}
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>
                      {activeRunningGame === selectedGame.name 
                        ? 'Oyunda Aktif' 
                        : launchingGameId === selectedGame.id 
                        ? 'Hazırlanıyor...' 
                        : 'Boost ile Başlat'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Install Path */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-400 break-all flex items-center justify-between">
                <div>
                  <span className="text-slate-500">Yol: </span>
                  <span>{selectedGame.installDrive}\\{selectedGame.path}</span>
                </div>
                {selectedGame.steamAppId && (
                  <a
                    href={`https://store.steampowered.com/app/${selectedGame.steamAppId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[10px] shrink-0 ml-2"
                  >
                    <span>Steam Sayfası</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Profile Optimization Toggles */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Özel Performans Ayarları
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'highPriority' as const, title: 'Yüksek CPU Önceliği', desc: 'İşlemci çekirdeklerini bu oyuna tahsis eder' },
                    { key: 'closeBackgroundApps' as const, title: 'Arka Planı Askıya Al', desc: 'Tarayıcı ve gereksiz hizmetleri dondurur' },
                    { key: 'gameMode' as const, title: 'Windows Oyun Modu', desc: 'DWM pencereli optimizasyonunu kilitler' },
                    { key: 'ultimatePowerPlan' as const, title: 'Nihai Performans Planı', desc: 'İşlemci frekans kısılmasını engeller' },
                    { key: 'cleanRamOnLaunch' as const, title: 'Başlangıçta RAM Temizle', desc: 'Standby bellek havuzunu boşaltır' },
                    { key: 'autoApply' as const, title: 'Otomatik Algılama', desc: 'Oyun açıldığında profili otomatik uygular' },
                  ].map(item => {
                    const enabled = selectedGame.profile[item.key];
                    return (
                      <div
                        key={item.key}
                        onClick={() => handleToggleProfileOption(selectedGame.id, item.key)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          enabled
                            ? 'bg-white/[0.08] border-white/20'
                            : 'bg-white/[0.02] border-white/[0.06] text-slate-500'
                        }`}
                      >
                        <div>
                          <div className={`text-xs font-bold ${enabled ? 'text-white' : 'text-slate-400'}`}>
                            {item.title}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                        </div>

                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          enabled 
                            ? 'bg-emerald-500 border-emerald-400 text-black font-bold' 
                            : 'border-white/20 bg-white/[0.04]'
                        }`}>
                          {enabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Lütfen sol menüden bir oyun seçin.
            </div>
          )}
        </div>
      </div>

      {/* Add Custom Steam Game Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0c1017] border border-cyan-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-display">Steam Kütüphanesinden Oyun Ekle</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSteamGame} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Oyun Adı:</label>
                <input
                  type="text"
                  value={newGameName}
                  onChange={e => setNewGameName(e.target.value)}
                  placeholder="Örn: Counter-Strike 2, Rust, GTA V"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Steam App ID:</label>
                <input
                  type="number"
                  value={newSteamAppId}
                  onChange={e => setNewSteamAppId(e.target.value)}
                  placeholder="Örn: 730 (CS2), 578080 (PUBG), 1172470 (Apex)"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white font-mono focus:outline-none focus:border-cyan-400"
                />
                <p className="text-[10px] text-slate-400">
                  Steam CDN üzerinden oyunun resmi afişi ve banner resmi otomatik çekilecektir.
                </p>
              </div>

              {/* Quick Popular Steam App IDs */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-slate-400 font-mono">Hızlı Popüler Seçim:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: 'CS2', id: '730' },
                    { name: 'PUBG', id: '578080' },
                    { name: 'Apex', id: '1172470' },
                    { name: 'Rust', id: '252490' },
                    { name: 'GTA V', id: '271590' },
                    { name: 'Cyberpunk', id: '1091500' },
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setNewGameName(p.name);
                        setNewSteamAppId(p.id);
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.05] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10"
                    >
                      {p.name} ({p.id})
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-slate-300 font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold"
                >
                  Resmi Çek ve Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
