import React, { useState, useEffect } from 'react';
import { TitleBar } from './components/layout/TitleBar';
import { Sidebar } from './components/layout/Sidebar';
import { SplashScreen } from './components/layout/SplashScreen';
import { BackgroundAmbient } from './components/common/BackgroundAmbient';
import { SmartAlertBanner } from './components/common/SmartAlertBanner';
import { CompactHudOverlay } from './components/common/CompactHudOverlay';
import { DashboardView } from './components/views/DashboardView';
import { CatalogView } from './components/views/CatalogView';
import { HealthView } from './components/views/HealthView';
import { DriversDiskView } from './components/views/DriversDiskView';
import { BiosGuideView } from './components/views/BiosGuideView';
import { AnalysisView } from './components/views/AnalysisView';
import { BoostView } from './components/views/BoostView';
import { NvidiaView } from './components/views/NvidiaView';
import { GamesView } from './components/views/GamesView';
import { FpsBenchmarkView } from './components/views/FpsBenchmarkView';
import { ToolsView } from './components/views/ToolsView';
import { BackupRestoreView } from './components/views/BackupRestoreView';
import { SettingsView } from './components/views/SettingsView';
import { LicenseModal } from './components/modals/LicenseModal';
import { AdminPanelModal } from './components/modals/AdminPanelModal';
import { TabType, AppSettings, LicenseState, SystemMetrics } from './types';
import { HardwareMonitorService } from './services/hardwareMonitor';
import { loadLicense } from './services/licensingService';
import { applyThemeVariables } from './services/themeHelper';
import { soundFx } from './services/soundFxService';

const DEFAULT_SETTINGS: AppSettings = {
  accentColor: 'red',
  autoBoostOnGameLaunch: true,
  startWithWindows: true,
  enableNotifications: true,
  enableSoundEffects: true,
  enableCustomCursor: false,
  temperatureAlertThreshold: 80,
  ramAlertThreshold: 85,
  language: 'tr',
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isCompactHud, setIsCompactHud] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const raw = localStorage.getItem('zaxenbooster_settings');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [license, setLicense] = useState<LicenseState>(() => loadLicense());
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  
  // Real-time hardware metrics
  const hardwareService = HardwareMonitorService.getInstance();
  const [metrics, setMetrics] = useState<SystemMetrics>(() => hardwareService.getMetrics());

  useEffect(() => {
    // Apply initial theme CSS variables
    applyThemeVariables(settings.accentColor);
    soundFx.setEnabled(settings.enableSoundEffects ?? true);

    const unsubscribe = hardwareService.subscribe(newMetrics => {
      setMetrics(newMetrics);
    });

    const licInterval = setInterval(() => {
      setLicense(loadLicense());
    }, 60000);

    return () => {
      unsubscribe();
      clearInterval(licInterval);
    };
  }, [settings.accentColor, settings.enableSoundEffects]);

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    applyThemeVariables(newSettings.accentColor);
    soundFx.setEnabled(newSettings.enableSoundEffects ?? true);
    localStorage.setItem('zaxenbooster_settings', JSON.stringify(newSettings));
  };

  const handleQuickCleanRam = () => {
    soundFx.playCleanSound();
    hardwareService.cleanRam();
  };

  return (
    <div className="relative h-screen w-screen flex flex-col bg-[#07080c] text-[#e2e8f0] font-sans overflow-hidden">
      {/* 1. Opening ZAXEN Boot Animation Splash Screen */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* 2. Constant Flowing Cyber Ambient Canvas */}
      <BackgroundAmbient />

      {/* 3. Windows 11 Title Bar with Admin Login Button */}
      <div className="relative z-30">
        <TitleBar 
          isOptimized={metrics.overallHealthScore >= 85} 
          accentColor={settings.accentColor}
          onToggleHudMode={() => setIsCompactHud(!isCompactHud)}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
        />
      </div>

      {/* 4. Compact Floating HUD Mode (when enabled) */}
      {isCompactHud && (
        <CompactHudOverlay
          metrics={metrics}
          accentColor={settings.accentColor}
          onRestore={() => setIsCompactHud(false)}
          onQuickCleanRam={handleQuickCleanRam}
        />
      )}

      {/* 5. Main Desktop Workspace Canvas */}
      <div className={`relative z-10 flex-1 flex overflow-hidden ${isCompactHud ? 'opacity-30 pointer-events-none filter blur-[2px]' : ''}`}>
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          license={license}
          onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
          accentColor={settings.accentColor}
        />

        {/* Content Viewport with Translucent Backdrop */}
        <main className="flex-1 overflow-y-auto bg-transparent bg-grid-pattern p-6">
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Smart notifications & alerts */}
            {settings.enableNotifications && (
              <SmartAlertBanner
                metrics={metrics}
                onQuickCleanRam={handleQuickCleanRam}
              />
            )}

            {/* Active Tab View */}
            {currentTab === 'dashboard' && (
              <DashboardView
                metrics={metrics}
                license={license}
                accentColor={settings.accentColor}
                onNavigateTab={setCurrentTab}
                onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
                onQuickCleanRam={handleQuickCleanRam}
              />
            )}

            {currentTab === 'catalog' && (
              <CatalogView license={license} />
            )}

            {currentTab === 'games' && (
              <GamesView 
                accentColor={settings.accentColor} 
              />
            )}

            {currentTab === 'health' && (
              <HealthView />
            )}

            {currentTab === 'drivers' && (
              <DriversDiskView />
            )}

            {currentTab === 'bios' && (
              <BiosGuideView />
            )}

            {currentTab === 'analysis' && (
              <AnalysisView />
            )}

            {currentTab === 'boost' && (
              <BoostView
                license={license}
                onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
                onNavigateTab={setCurrentTab}
              />
            )}

            {currentTab === 'nvidia' && (
              <NvidiaView />
            )}

            {currentTab === 'fps' && (
              <FpsBenchmarkView />
            )}

            {currentTab === 'tools' && (
              <ToolsView 
                metrics={metrics} 
                accentColor={settings.accentColor} 
              />
            )}

            {currentTab === 'backups' && (
              <BackupRestoreView />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                license={license}
                onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
                onReplaySplash={() => setShowSplash(true)}
                onLicenseChanged={setLicense}
              />
            )}
          </div>
        </main>
      </div>

      {/* 6. Customer License Modal */}
      <LicenseModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
        license={license}
        onLicenseUpdated={newLic => {
          setLicense(newLic);
        }}
      />

      {/* 7. Master Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onBrandingUpdated={() => {
          setLicense(loadLicense());
        }}
      />
    </div>
  );
}
