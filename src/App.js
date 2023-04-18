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
import Cart from "./components/Cart";

const firestore = new Firestore();
const auth = getAuth();

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [cos, setCos] = useState(0);
  const [cos_ev, setCosEv] = useState(0);

  const getCos = async () => {
    setCos(await firestore.getCos(user));
    // console.log(await firestore.getCos(user));
  };

  useEffect(() => {
    getCos();
    // await setCos(await firestore.getCos());
  }, [cos_ev, user]);

  const addit = async (id, cant) => {
    firestore.addit(id, user, cant);
    setCosEv((old) => old + cant);
  };

  const delete_prod_app = async (id, cant) => {
    await firestore.deleteDocument("cos", id).then((res) => {
      setCosEv((old) => old - cant);
      alert("Produs scos din cosul tau!");
    });
  };

  const update = async (cant, uid) => {
    await firestore
      .updateDocument("cos", uid, { cantitate: cant })
      .then((res) => {
        setCosEv((old) => old - cant);
        alert("cantitatea s-a updatat!");
      });
  };

  return (
    <Router>
      <Navbar cos={cos} />
      <Routes>
        <Route path="/" Component={Home} />
        <Route
          path="/shop/:categorie/:sort_param?"
          element={<Shop addit={addit} />}
        />
        <Route path="/prod/:id" element={<ProductPage addit={addit} />} />
        <Route path="/contact" Component={Contact} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/cart"
          element={<Cart delete_prod_app={delete_prod_app} update={update} />}
        />
        <Route path="/admin" Component={AdminPage} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
