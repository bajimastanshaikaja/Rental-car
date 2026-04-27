
import { Dashboard } from "./admin/pages/Dashboard";
import Addcars from "./admin/components/Addcars";
import { ManageCars } from "./admin/pages/ManageCars";
// import BrowseCars from "./users/BrowseCars";
import UpdateCar from "./admin/pages/UpdateCar";

import { createContext, useState, useEffect } from "react"; // ✅ include useEffect
import { collection, getDocs } from "firebase/firestore";
import { db } from "./DB/FirebaseConfig";
import CarCard from "./users/CarCard";

// ✅ create context
export const CarContext = createContext();

export default function App() {
  const [cars, setCars] = useState([]);


  // ✅ fetch cars
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

  // ✅ load data on start
  useEffect(() => {
    fetchCars();
  }, []);

  return (

    <CarContext.Provider value={{ cars, setCars, fetchCars }}>


      <div>

        <BrowseCars />

      </div>

    </CarContext.Provider>

  );
}