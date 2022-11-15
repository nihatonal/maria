import { createContext } from "react";

export const ShareContext = createContext({
  date_ranges: [],
  date_ranges_ui: [],
  city: null,
  car: [],
  brand: "Audi",
  options: [],
  services: [],
  error: false,
  selectedCar: {},
  placeImage: null,
  notFound: false,
  addFriend: [],
});
