import { Socket } from "socket.io-client";
import { create } from "zustand";
import { Item } from "./components/ui/inventory-columns";
import { Offer } from "./components/ui/offers-columns";
import * as profileOffers from "./components/ui/profile-offers-columns";
import * as profileTrades from "./components/ui/profile-trades-columns";
import { Trade } from "./components/ui/trades-columns";


interface UidState {
  uid: string | null;
  userName: string | null;
  fullName: string | null;
  setUid: (newUid: string) => void;
  setNames: (newUserName: string, newFullName: string) => void;
}

const useUidStore = create<UidState>((set) => ({
  uid: null,
  userName: null,
  fullName: null,
  setUid: (newUid) => set({ uid: newUid }),
  setNames: (newUserName, newFullName) =>
    set({ userName: newUserName, fullName: newFullName }),
}));

interface AllItemsState {
  allItems: Item[];
  cash: number;
  setCash: (newCash: number) => void;
  setAllItems: (newItems: Item[]) => void;
}

const useAllItemsStore = create<AllItemsState>((set) => ({
  allItems: [],
  cash: 0,
  setCash: (newCash) => set({ cash: newCash }),
  setAllItems: (newItems) => set({ allItems: newItems }),
}));

interface AllTradesState {
  allTradesTable: Trade[];
  setAllTradesTable: (newTrades: Trade[]) => void;
}

const useAllTradesStore = create<AllTradesState>((set) => ({
  allTradesTable: [],
  setAllTradesTable: (newTrades) => set({ allTradesTable: newTrades }),
}));

interface CurrTradeState {
  id: string | null;
  creatorId: string | null;
  allOffers: Offer[];
  setId: (newId: string | null, creatorId: string | null) => void;
  setAllOffers: (newOffers: Offer[]) => void;
}

const useCurrTradeStore = create<CurrTradeState>((set) => ({
  id: null,
  creatorId: null,
  allOffers: [],
  setAllOffers: (newOffers: Offer[]) => set({ allOffers: newOffers }),
  setId: (newId, creatorId) => {
    set({ id: newId, creatorId: creatorId });
    console.log("setting tradeid", newId);
    console.log("setting creatorId", creatorId);
    console.log("uid: ", useUidStore.getState().uid);
  },
}));

interface SocketState {
  socket: Socket | null;
  setSocket: (newSocket: Socket) => void;
}

const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  setSocket: (newSocket) => set({ socket: newSocket }),
}));

interface UserTradesOffersState {
  trades: profileTrades.Trade[];
  offers: profileOffers.Offer[];

  setTrades: (newTrades: profileTrades.Trade[]) => void;
  setOffers: (newOffers: profileOffers.Offer[]) => void;
}

const useUserTradesOffersStore = create<UserTradesOffersState>((set) => ({
  trades: [],
  offers: [],
  setTrades: (newTrades) => set({ trades: newTrades }),
  setOffers: (newOffers) => set({ offers: newOffers }),
}));

export {
  useAllItemsStore,
  useAllTradesStore,
  useCurrTradeStore,
  useSocketStore, useUidStore, useUserTradesOffersStore
};
