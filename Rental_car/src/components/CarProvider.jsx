import { createContext, useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/DB/FirebaseConfig";

export const CarContext = createContext();

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);

  // fetch cars from firebase
  const fetchCars = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Carsdb"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCars(data);
    } catch (error) {
      console.error(error);
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