import { EventStore } from "../repository/inMemory/EventStore.js";

export const sharedEventStore = new EventStore();
