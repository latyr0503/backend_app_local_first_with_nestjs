export interface SyncRequest {
  lastPulledAt: number;
  changes: {
    posts: SyncChanges;
    comments: SyncChanges;
  };
}

export interface SyncResponse {
  changes: {
    posts: SyncChanges;
    comments: SyncChanges;
  };
  timestamp: number;
}

export interface SyncChanges {
  created: any[];
  updated: any[];
  deleted: string[];
}

export interface SyncConflict {
  entityType: 'post' | 'comment';
  entityId: string;
  localVersion: any;
  serverVersion: any;
  resolution: 'local' | 'server' | 'manual';
}

export interface SyncMetrics {
  totalChanges: number;
  conflicts: number;
  processingTime: number;
  timestamp: Date;
}
