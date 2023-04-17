import React from "react";
import { Link } from "react-router-dom";
import Firestore from "../js/Firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const firestore = new Firestore();
function Product({ img, link, name, price, oldPrice, review, id, addit }) {
  const [user, loading, error] = useAuthState(firestore.getuser());

  const addit_prod = async (cant) => {
    addit(id, cant);
  };
  /**
   * 
async function getProduct(productId) {
  const db = getFirestore();
  const productRef = doc(db, "products", productId);

  try {
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      return productSnap.data();
    } else {
      console.log("No such document exists!");
      return null;
    }
  } catch (error) {
    console.log("Error getting document:", error);
    return null;
  }
}
   * 
   * 
   */
  // console.log(user);
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 pb-1">
      <div className="product-item bg-light mb-4">
        <div
          className="product-img position-relative overflow-hidden"
          style={{
            height: 170,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <img
            className="img-fluid w-100"
            src={img ? img : require("../img/product-1.jpg")}
            alt=""
          />
          <div className="product-action">
            {user && (
              <a
                className="btn btn-outline-dark btn-square"
                title="Adaugă în coș"
                onClick={()=>addit_prod(1)}
              >
                <i className="fa fa-shopping-cart"></i>
              </a>
            )}

            <Link className="btn btn-outline-dark btn-square" to={link}>
              <i className="fa fa-search"></i>
            </Link>
          </div>
        </div>
        <div className="text-center py-4">
          <a className="h6 text-decoration-none text-truncate" href={link}>
            {name}
          </a>
          <div className="d-flex align-items-center justify-content-center mt-2">
            <h5>${price}</h5>
            {oldPrice != undefined && oldPrice != 0 && (
              <h6 className="text-muted ml-2">
                <del>${oldPrice}</del>
              </h6>
            )}
          </div>
          <div className="d-flex align-items-center justify-content-center mb-1">
            <small className="fa fa-star text-primary mr-1"></small>
            <small className="fa fa-star text-primary mr-1"></small>
            <small className="fa fa-star text-primary mr-1"></small>
            <small className="fa fa-star text-primary mr-1"></small>
            <small className="fa fa-star text-primary mr-1"></small>
            <small>({review})</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
