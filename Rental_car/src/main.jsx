import React, { createContext, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";
import { router } from "./routes/Routes";

import { collection, getDocs } from "firebase/firestore";
import { db } from "./DB/FirebaseConfig";

// ✅ create context
export const CarContext = createContext();

// ✅ create provider (THIS is where hooks should be)
const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);

  const fetchCars = async () => {
    try {
      const carsCollection = await getDocs(collection(db, "Carsdb"));
      const carcollect = carsCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCars(carcollect);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <CarContext.Provider value={{ cars, setCars, fetchCars }}>
      {children}
    </CarContext.Provider>
  );
};

// ✅ render app with provider
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CarProvider>
      <RouterProvider router={router} />
    </CarProvider>
  </React.StrictMode>
);