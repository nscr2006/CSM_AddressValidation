import create from "zustand";

export const useStore = create((set) => ({
  isSignedIn: false,
  address1: "",
  address2: "",
  city: "",
  states: "",
  zipcode: "",
  user: undefined,
  setSignedIn: (isSignedIn) => set({ isSignedIn }),
  setUser: (user) => set({ user }),
  setAddress1: (address1) => set({ address1 }),
  setAddress2: (address2) => set({ address2 }),
  setCity: (city) => set({ city }),
  setStates: (states) => set({ states }),
  setZipCode: (zipcode) => set({ zipcode }),
}));
