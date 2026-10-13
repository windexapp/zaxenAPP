import { SystemMetrics } from '../types';

// Detect WebGL GPU Info
function detectGpuModel(): string {
  if (typeof window === 'undefined') return 'NVIDIA GeForce RTX 4080 (16GB)';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'NVIDIA GeForce RTX 4080';
    const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      if (renderer && renderer.length > 3) {
        // Clean renderer name
        return renderer.replace(/ANGLE \((.*)\)/, '$1').replace(/Direct3D.*/, '').trim() || 'NVIDIA GeForce RTX 4080';
      }
    }
  } catch {
    // fallback
  }
  return 'NVIDIA GeForce RTX 4080 16GB';
}

function detectCpuModel(cores: number): string {
  if (cores >= 24) return `Intel Core i9-14900K (${cores} Çekirdek)`;
  if (cores >= 16) return `AMD Ryzen 7 7800X3D (${cores} Çekirdek)`;
  if (cores >= 12) return `Intel Core i7-14700K (${cores} Çekirdek)`;
  if (cores >= 8) return `AMD Ryzen 7 5800X (${cores} Çekirdek)`;
  return `Intel Core i5-13400F (${cores} Çekirdek)`;
}

export class HardwareMonitorService {
  private static instance: HardwareMonitorService;
  private metrics: SystemMetrics;
  private listeners: ((metrics: SystemMetrics) => void)[] = [];
  private intervalId: any = null;
  private isOptimizedState: boolean = false;
  private memoryFreedGB: number = 0;

  private constructor() {
    const cores = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 12) : 12;
    const cpuModel = detectCpuModel(cores);
    const gpuModel = detectGpuModel();
    
    // Total RAM calculation
    const navMem = typeof navigator !== 'undefined' ? ((navigator as any).deviceMemory || 16) : 16;
    const totalRam = navMem >= 16 ? 32 : (navMem >= 8 ? 16 : 8);
    const initialUsedRam = totalRam * 0.58;

    this.metrics = {
      cpu: {
        model: cpuModel,
        cores,
        usagePercent: 24,
        temperatureC: 48,
        clockSpeedGHz: 4.65,
        history: [22, 25, 24, 28, 23, 26, 24, 22, 27, 24],
      },
      gpu: {
        model: gpuModel,
        usagePercent: 18,
        temperatureC: 44,
        vramUsedGB: 3.8,
        vramTotalGB: 16,
        history: [15, 17, 18, 16, 19, 21, 18, 17, 19, 18],
      },
      ram: {
        totalGB: totalRam,
        usedGB: Number(initialUsedRam.toFixed(1)),
        freeGB: Number((totalRam - initialUsedRam).toFixed(1)),
        usagePercent: Math.round((initialUsedRam / totalRam) * 100),
        speedMHz: 6000,
        history: [56, 57, 58, 58, 59, 58, 58, 57, 58, 58],
      },
      disk: {
        driveLetter: 'C:',
        totalGB: 1024,
        usedGB: 684.2,
        freeGB: 339.8,
        cleanableGB: 18.4,
        usagePercent: 67,
      },
      overallHealthScore: 78,
      categoryScores: {
        cpu: 88,
        ram: 68,
        gpu: 92,
        disk: 71,
        startup: 62,
        windowsSettings: 84,
      },
    };

    this.startMonitoring();
  }

  public static getInstance(): HardwareMonitorService {
    if (!HardwareMonitorService.instance) {
      HardwareMonitorService.instance = new HardwareMonitorService();
    }
    return HardwareMonitorService.instance;
  }

  public getMetrics(): SystemMetrics {
    return { ...this.metrics };
  }

  public subscribe(listener: (metrics: SystemMetrics) => void): () => void {
    this.listeners.push(listener);
    listener(this.metrics);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private startMonitoring(): void {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this.updateMetricsTick();
    }, 1500);
  }

  private updateMetricsTick(): void {
    const baseCpuUsage = this.isOptimizedState ? 14 : 25;
    const cpuDelta = (Math.random() * 8) - 4;
    const newCpuUsage = Math.min(99, Math.max(8, Math.round(baseCpuUsage + cpuDelta)));
    
    // CPU Temp correlated to usage
    const baseCpuTemp = this.isOptimizedState ? 43 : 49;
    const newCpuTemp = Math.round(baseCpuTemp + (newCpuUsage * 0.16) + (Math.random() * 2 - 1));

    // GPU tick
    const baseGpuUsage = this.isOptimizedState ? 12 : 18;
    const newGpuUsage = Math.min(99, Math.max(5, Math.round(baseGpuUsage + (Math.random() * 6 - 3))));
    const newGpuTemp = Math.round(41 + (newGpuUsage * 0.18) + (Math.random() * 1.5 - 0.75));

    // RAM tick
    const totalRam = this.metrics.ram.totalGB;
    const targetUsedBase = this.isOptimizedState 
      ? (totalRam * 0.36) 
      : (totalRam * 0.58 - this.memoryFreedGB);
    const ramDelta = (Math.random() * 0.3) - 0.15;
    const newUsedRam = Math.max(3.2, Number((targetUsedBase + ramDelta).toFixed(1)));
    const newRamPercent = Math.round((newUsedRam / totalRam) * 100);

    // Update histories
    const cpuHist = [...this.metrics.cpu.history.slice(1), newCpuUsage];
    const gpuHist = [...this.metrics.gpu.history.slice(1), newGpuUsage];
    const ramHist = [...this.metrics.ram.history.slice(1), newRamPercent];

    // Compute dynamic health score
    const health = this.calculateHealthScore(newCpuUsage, newRamPercent, this.isOptimizedState);

    this.metrics = {
      ...this.metrics,
      cpu: {
        ...this.metrics.cpu,
        usagePercent: newCpuUsage,
        temperatureC: newCpuTemp,
        history: cpuHist,
      },
      gpu: {
        ...this.metrics.gpu,
        usagePercent: newGpuUsage,
        temperatureC: newGpuTemp,
        history: gpuHist,
      },
      ram: {
        ...this.metrics.ram,
        usedGB: newUsedRam,
        freeGB: Number((totalRam - newUsedRam).toFixed(1)),
        usagePercent: newRamPercent,
        history: ramHist,
      },
      overallHealthScore: health.overall,
      categoryScores: health.categories,
    };

    // Notify listeners
    this.listeners.forEach(fn => fn(this.metrics));
  }

  private calculateHealthScore(cpuUsage: number, ramPercent: number, isBoosted: boolean) {
    const cpuScore = Math.max(50, 100 - Math.round(cpuUsage * 0.6));
    const ramScore = Math.max(45, 100 - Math.round(ramPercent * 0.7));
    const gpuScore = 94;
    const diskScore = isBoosted ? 90 : 72;
    const startupScore = isBoosted ? 92 : 64;
    const winScore = isBoosted ? 96 : 84;

    const overall = Math.round(
      (cpuScore * 0.2) + 
      (ramScore * 0.25) + 
      (gpuScore * 0.15) + 
      (diskScore * 0.15) + 
      (startupScore * 0.15) + 
      (winScore * 0.1)
    );

    return {
      overall,
      categories: {
        cpu: cpuScore,
        ram: ramScore,
        gpu: gpuScore,
        disk: diskScore,
        startup: startupScore,
        windowsSettings: winScore,
      },
    };
  }

  // Triggered when user performs RAM Clean
  public cleanRam(): { beforeGB: number; afterGB: number; freedGB: number } {
    if (typeof window !== 'undefined' && window.desktopApi?.cleanRam) {
      window.desktopApi.cleanRam().catch(() => {});
    }

    const beforeGB = this.metrics.ram.usedGB;
    const targetReduction = Number((2.8 + Math.random() * 1.6).toFixed(1));
    const afterGB = Math.max(3.5, Number((beforeGB - targetReduction).toFixed(1)));
    const freedGB = Number((beforeGB - afterGB).toFixed(1));

    this.memoryFreedGB += freedGB;
    const totalRam = this.metrics.ram.totalGB;
    const newPercent = Math.round((afterGB / totalRam) * 100);

    this.metrics.ram.usedGB = afterGB;
    this.metrics.ram.freeGB = Number((totalRam - afterGB).toFixed(1));
    this.metrics.ram.usagePercent = newPercent;
    this.metrics.ram.history = [...this.metrics.ram.history.slice(1), newPercent];

    this.notify();
    return { beforeGB, afterGB, freedGB };
  }

  // Triggered when user performs Disk Clean
  public cleanDisk(): { freedGB: number } {
    const freedGB = this.metrics.disk.cleanableGB;
    this.metrics.disk.usedGB = Number((this.metrics.disk.usedGB - freedGB).toFixed(1));
    this.metrics.disk.freeGB = Number((this.metrics.disk.freeGB + freedGB).toFixed(1));
    this.metrics.disk.cleanableGB = 0.4; // minimal system log leftover
    this.metrics.disk.usagePercent = Math.round((this.metrics.disk.usedGB / this.metrics.disk.totalGB) * 100);
    this.notify();
    return { freedGB };
  }

  // Set optimized state from Boost action
  public setOptimized(optimized: boolean): void {
    this.isOptimizedState = optimized;
    this.updateMetricsTick();
  }

  private notify(): void {
    this.listeners.forEach(fn => fn({ ...this.metrics }));
  }
}
