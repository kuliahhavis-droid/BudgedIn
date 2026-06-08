import { EventEmitter } from 'events';
class AppEventEmitter extends EventEmitter {
}
export const eventBus = new AppEventEmitter();
