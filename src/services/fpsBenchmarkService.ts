import { FpsRecord } from '../types';

const STORAGE_KEY = 'zaxenbooster_fps_records';

const DEFAULT_RECORDS: FpsRecord[] = [
  {
    id: 'fps-1',
    gameName: 'Counter-Strike 2',
    beforeFps: 184,
    afterFps: 228,
    gainFps: 44,
    gainPercent: 23.9,
    date: '10 Ekim 2026',
  },
  {
    id: 'fps-2',
    gameName: 'Valorant',
    beforeFps: 245,
    afterFps: 298,
    gainFps: 53,
    gainPercent: 21.6,
    date: '8 Ekim 2026',
  },
  {
    id: 'fps-3',
    gameName: 'Cyberpunk 2077',
    beforeFps: 62,
    afterFps: 76,
    gainFps: 14,
    gainPercent: 22.5,
    date: '5 Ekim 2026',
  },
];

export class FpsBenchmarkService {
  private static instance: FpsBenchmarkService;
  private records: FpsRecord[] = [];

  private constructor() {
    this.load();
  }

  public static getInstance(): FpsBenchmarkService {
    if (!FpsBenchmarkService.instance) {
      FpsBenchmarkService.instance = new FpsBenchmarkService();
    }
    return FpsBenchmarkService.instance;
  }

  private load(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        this.records = JSON.parse(raw);
        return;
      } catch {
        // fallback
      }
    }
    this.records = [...DEFAULT_RECORDS];
    this.save();
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records));
  }

  public getRecords(): FpsRecord[] {
    return [...this.records];
  }

  public addRecord(gameName: string, beforeFps: number, afterFps: number): FpsRecord {
    const gainFps = Math.max(0, afterFps - beforeFps);
    const gainPercent = beforeFps > 0 ? Number(((gainFps / beforeFps) * 100).toFixed(1)) : 0;
    
    const record: FpsRecord = {
      id: `fps-${Date.now()}`,
      gameName,
      beforeFps,
      afterFps,
      gainFps,
      gainPercent,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
    };

    this.records.unshift(record);
    this.save();
    return record;
  }

  public deleteRecord(id: string): void {
    this.records = this.records.filter(r => r.id !== id);
    this.save();
  }
}
