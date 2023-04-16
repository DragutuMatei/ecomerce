import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Home";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductPage from "./components/ProductPage";
import Shop from "./components/Shop";
import Contact from "./components/Contact";
import AdminPage from "./components/AdminPage";
import { getAuth } from "@firebase/auth";
import Footer from "./components/Footer";
import Checkout from "./components/Checkout";
import Firestore from "./js/Firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const firestore = new Firestore();
const auth = getAuth();

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [cos, setCos] = useState(0);
  const [cos_ev, setCosEv] = useState(0);

  const getCos = async () => {
    setCos(await firestore.getCos(user));
    console.log(await firestore.getCos(user));
  };

  useEffect(() => {
    getCos();
    // await setCos(await firestore.getCos());
  }, [cos_ev, user]);

  const addit = async (id) => {
    firestore.addit(id, user);
    setCosEv((old) => old + 1);
  };
  return (
    <Router>
      <Navbar cos={cos} />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/shop/:categorie" element={<Shop addit={addit} />} />
        <Route path="/prod/:id" Component={ProductPage} />
        <Route path="/contact" Component={Contact} />
        <Route path="/checkout" element={<Checkout />}  />
        <Route path="/admin" Component={AdminPage} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
