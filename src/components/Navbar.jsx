import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Firestore from "../js/Firestore";
import firebase from "firebase/compat/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";
import useWindowSize from "../util/WindowSize";

const firestore = new Firestore();

const auth = getAuth();

function Navbar({ cos }) {
  const firebaseConfig = {
    apiKey: "AIzaSyAA7EhvqsU84_G03JK4Z_98M_z0cxsua8c",
    authDomain: "ecommerce-ed019.firebaseapp.com",
    databaseURL:
      "https://ecommerce-ed019-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ecommerce-ed019",
    storageBucket: "ecommerce-ed019.appspot.com",
    messagingSenderId: "366894312098",
    appId: "1:366894312098:web:1a7616c26abdb324c1c5fb",
    measurementId: "G-KC7EV6D3TM",
  };

  firebase.initializeApp(firebaseConfig);

  const [user, loading, error] = useAuthState(auth);
  const [categories, setCategories] = useState([]);
  const getCategories = async () => {
    firestore.readDocuments("categories").then((res) => {
      setCategories(res);
      // console.log(res);
    });
  };

  const { width } = useWindowSize();

  // const getCos = async () => {
  //   let cant = 0;
  //   if (user) {
  //     await firestore
  //       .readDocuments("cos", ["user_id", "==", user.uid])
  //       .then((res) => {
  //         // // console.log(res);
  //         for (let i = 0; i < res.length; i++) {
  //           cant += res[i].cantitate;
  //         }
  //         setcos(cant);
  //       });
  //   } else {
  //     setcos(0);
  //   }
  //   // console.log("cant ", cant);
  // };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    // getCos();
  }, [, user]);

  const signInWithGoogle = async () => {
    await firestore.signInWithGoogle();
  };

  const logout = async () => {
    await firestore.logout();
  };
  // // console.log(user);

  const [search, setSearch] = useState("");
  const searchfct = () => {};
  return (
    <>
      <div className="container-fluid">
        <div className="row align-items-center bg-light py-3 px-xl-5 ">
          <div className="col-lg-4">
            <Link to="/" className="text-decoration-none">
              <span className="h1 text-uppercase text-primary bg-dark px-2">
                NAVI
              </span>
              <span className="h1 text-uppercase text-dark bg-primary px-2 ml-n1">
                SIL
              </span>
            </Link>
          </div>
          <div className="col-lg-4 col-6 text-left">
            <form action="">
              <div className="input-group">
                <input
                  type="text"
                  onChange={(e) => setSearch(e.target.value.trim())}
                  className="form-control"
                  placeholder="Search for products"
                />
                <div className="input-group-append" onClick={searchfct}>
                  <span className="input-group-text bg-transparent text-primary">
                    <i className="fa fa-search"></i>
                  </span>
                </div>
              </div>
            </form>
          </div>
          <div className="col-lg-4 col-6 text-right">
            {user ? (
              <>
                <div
                  style={{
                    display: "flex",
                    margin: 5,
                    alignItems: "center",
                    width: "auto",
                    justifyContent: "flex-end",
                  }}
                >
                  {width > 700 && (
                    <h5 style={{ marginRight: 10, marginBottom: 0 }}>
                      {user.displayName}
                    </h5>
                  )}
                  <img
                    src={user.photoURL}
                    style={{ borderRadius: "50%", width: 20 }}
                  />
                  <h4
                    style={{
                      cursor: "pointer",
                      margin: "5px 20px",
                      color: "#FFD333",
                    }}
                    onClick={logout}
                  >
                    Logout
                  </h4>
                </div>
              </>
            ) : (
              <h4
                style={{
                  cursor: "pointer",
                  margin: "5px 20px",
                  color: "#FFD333",
                }}
                onClick={signInWithGoogle}
              >
                Login with Google
              </h4>
            )}
            {/* <h5 className="m-0">+012 345 6789</h5> */}
          </div>
        </div>
      </div>

      <div className="container-fluid bg-dark mb-30">
        <div className="row px-xl-5">
          <div className="col-lg-9">
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0 px-0">
              <Link to="/" className="text-decoration-none d-block d-lg-none">
                <span className="h1 text-uppercase text-dark bg-light px-2">
                  NAVI
                </span>
                <span className="h1 text-uppercase text-light bg-primary px-2 ml-n1">
                  SIL
                </span>
              </Link>
              <button
                type="button"
                className="navbar-toggler"
                data-toggle="collapse"
                data-target="#navbarCollapse"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse justify-content-between"
                id="navbarCollapse"
              >
                <div className="navbar-nav mr-auto py-0">
                  <Link to="/" className="nav-item nav-link active">
                    Home
                  </Link>
                  <Link to="/contact" className="nav-item nav-link">
                    Contact
                  </Link>

                  {user && (
                    <Link to="/checkout" className="nav-item nav-link">
                      Checkout
                    </Link>
                  )}
                </div>
                <div className="navbar-nav ml-auto py-0 d-none d-lg-block">
                  <Link to="/cart" className="btn px-0 ml-3">
                    <i className="fas fa-shopping-cart text-primary"></i>
                    <span
                      className="badge text-secondary border border-secondary rounded-circle"
                      style={{ paddingBottom: "2px" }}
                    >
                      {cos && cos}
                    </span>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
          <div className="col-lg-3  " style={{ padding: 0 }}>
            <a
              className="btn d-flex align-items-center justify-content-between bg-primary w-100"
              data-toggle="collapse"
              href="#navbar-vertical"
              style={{ height: "65px", padding: "0 30px" }}
            >
              <h6 className="text-dark m-0">
                <i className="fa fa-bars mr-2"></i>Categories
              </h6>
              <i className="fa fa-angle-down text-dark"></i>
            </a>
            <nav
              className="collapse position-absolute navbar navbar-vertical navbar-light align-items-start p-0 bg-light"
              id="navbar-vertical"
              style={{ width: "100%", zIndex: "999" }}
            >
              <div className="navbar-nav w-100 categories">
                {categories &&
                  categories.map((cat) => (
                    <Link
                      key={cat.categorie}
                      to={`/shop/${cat.categorie}`}
                      className="nav-item nav-link"
                    >
                      {cat.categorie}
                    </Link>
                  ))}
                {/* <div className="nav-item dropdown dropright">
                  <a
                    href="#"
                    className="nav-link dropdown-toggle"
                    data-toggle="dropdown"
                  >
                    Dresses{" "}
                    <i className="fa fa-angle-right float-right mt-1"></i>
                  </a>
                  <div className="dropdown-menu position-absolute rounded-0 border-0 m-0">
                    <a href="" className="dropdown-item">
                      Men's Dresses
                    </a>
                    <a href="" className="dropdown-item">
                      Women's Dresses
                    </a>
                    <a href="" className="dropdown-item">
                      Baby's Dresses
                    </a>
                  </div>
                </div>
                <a href="" className="nav-item nav-link">
                  Shirts
                </a>
                <a href="" className="nav-item nav-link">
                  Jeans
                </a>
                <a href="" className="nav-item nav-link">
                  Swimwear
                </a>
                <a href="" className="nav-item nav-link">
                  Sleepwear
                </a>
                <a href="" className="nav-item nav-link">
                  Sportswear
                </a>
                <a href="" className="nav-item nav-link">
                  Jumpsuits
                </a>
                <a href="" className="nav-item nav-link">
                  Blazers
                </a>
                <a href="" className="nav-item nav-link">
                  Jackets
                </a>
                <a href="" className="nav-item nav-link">
                  Shoes
                </a> */}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
