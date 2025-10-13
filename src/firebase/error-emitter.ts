
import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

// This is a simple event emitter that can be used to broadcast events
// across the application. It's particularly useful for decoupling components.

type AppEvents = {
  'permission-error': (error: FirestorePermissionError) => void;
};

class TypedEventEmitter {
  private emitter = new EventEmitter();

  on<T extends keyof AppEvents>(event: T, listener: AppEvents[T]): void {
    this.emitter.on(event, listener as any);
  }

  off<T extends keyof AppEvents>(event: T, listener: AppEvents[T]): void {
    this.emitter.off(event, listener as any);
  }

  emit<T extends keyof AppEvents>(event: T, ...args: Parameters<AppEvents[T]>): void {
    this.emitter.emit(event, ...args);
  }
}

export const errorEmitter = new TypedEventEmitter();

    
