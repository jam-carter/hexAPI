import { InMemoryEventStore } from "../repository/inMemory/EventStore.js";

export const sharedEventStore = new InMemoryEventStore();
