import Dexie, { Table } from 'dexie';

export interface SimulationSession {
  id?: number;
  timestamp: number;
  duration: number;
  averageSpeed: number;
  eventsCount: number;
}

export class SimulationDatabase extends Dexie {
  sessions!: Table<SimulationSession, number>;

  constructor() {
    super('DrivingSimulationDB');
    this.version(1).stores({
      sessions: '++id, timestamp, averageSpeed'
    });
  }
}

export const db = new SimulationDatabase();