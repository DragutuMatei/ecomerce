import React, { useEffect, useState } from "react";
import Firestore from "../js/Firestore";
import { getAuth } from "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Text from "../util/Text";
import { Link } from "react-router-dom";
import Placeholder from "../util/Placeholder";

const firestore = new Firestore();
const auth = getAuth();

function Cart({ delete_prod_app, update }) {
  let ship = 10;
  const [user, loading, error] = useAuthState(auth);
  const [products, setP] = useState([]);
  const [total, setTotal] = useState(0);

  const updateObjectInArray = (array, objectToUpdate) => {
    const index = array.findIndex((obj) => obj.uid === objectToUpdate.uid);

    const updatedArray = [
      ...array.slice(0, index),
      objectToUpdate,
      ...array.slice(index + 1),
    ];

    return updatedArray;
  };
  const handleUpdateObject = (id, by) => {
    const objectToUpdate = products.find((obj) => obj.uid === id);

    if (objectToUpdate) {
      objectToUpdate.cant = objectToUpdate.cant + by;

      setP(updateObjectInArray(products, objectToUpdate));
    }
  };

  useEffect(() => {
    let totall = 0;
    products.map((p) => {
      totall += p.cant * p.pret;
    });
    setTotal(totall);
  }, [products]);

  const signInWithGoogle = async () => {
    await firestore.signInWithGoogle();
  };
  const ok = async () => {
    let resp = await firestore.getProductByUser(user);
    setP(resp.cant);
    // setTotal(resp.total);
  };
  useEffect(() => {
    ok();
  }, [user]);

  const delete_prod = async (id, cant) => {
    delete_prod_app(id, cant);
    ok();
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row px-xl-5">
          <div className="col-12">
            <nav className="breadcrumb bg-light mb-30">
              <Link className="breadcrumb-item text-dark" to="/">
                Home
              </Link>
              <span className="breadcrumb-item active">Shopping Cart</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row px-xl-5">
          <div className="col-lg-8 table-responsive mb-5">
            <table className="table table-light table-borderless table-hover text-center mb-0">
              <thead className="thead-dark">
                <tr>
                  <th>Products</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody className="align-middle cosul_blana">
                {!user ? (
                  <tr>
                    <td>
                    <h3>Logheaza te ca sa adaugi in cos produse</h3>
                    </td>
                  </tr>
                ) : (
                  products &&
                  products.map((prod) => {
                    let total_map = prod.pret * prod.cant;

                    return (
                      <tr>
                        <td
                          className="align-middle"
                          style={{
                            justifyContent: "flex-start",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={Placeholder.makeimg(prod.images[0])}
                            alt=""
                            style={{ width: "50px", margin: 10 }}
                          />
                          <Link to={`/prod/${prod.id}`}>
                            {Text.returnSizedText(prod.nume)}
                          </Link>
                        </td>
                        <td className="align-middle">
                          ${Placeholder.makenumber(prod.pret)}
                        </td>
                        <td className="align-middle">
                          <div
                            className="input-group quantity mx-auto"
                            style={{ width: "112px" }}
                          >
                            <div className="input-group-btn">
                              <button
                                className="btn btn-sm btn-primary btn-minus"
                                onClick={() => handleUpdateObject(prod.uid, -1)}
                              >
                                <i className="fa fa-minus"></i>
                              </button>
                            </div>
                            <input
                              type="number"
                              className="form-control form-control-sm bg-secondary border-0 text-center"
                              value={prod.cant}
                            />
                            <div className="input-group-btn">
                              <button
                                className="btn btn-sm btn-primary btn-plus"
                                onClick={() => handleUpdateObject(prod.uid, 1)}
                              >
                                <i className="fa fa-plus"></i>
                              </button>
                            </div>
                            <div
                              className="input-group-btn"
                              style={{ borderTop: "3px solid #2f2f2f" }}
                            >
                              <button
                                className="btn btn-sm btn-primary btn-plus"
                                onClick={() => update(prod.cant, prod.uid)}
                              >
                                <i className="fa fa-shopping-cart mr-1"></i>
                                Update Cart
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="align-middle">
                          $
                          {total_map
                            ? Placeholder.makenumber(total_map)
                            : "..."}
                        </td>
                        <td className="align-middle">
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => delete_prod(prod.uid, prod.cant)}
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="col-lg-4">
            <h5 className="section-title position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">Cart Summary</span>
            </h5>
            <div className="bg-light p-30 mb-5">
              <div className="border-bottom pb-2">
                <div className="d-flex justify-content-between mb-3">
                  <h6>Subtotal</h6>
                  <h6>${total ? Placeholder.makenumber(total) : "..."}</h6>
                </div>
                <div className="d-flex justify-content-between">
                  <h6 className="font-weight-medium">Shipping</h6>
                  <h6 className="font-weight-medium">
                    ${Placeholder.makenumber(ship)}
                  </h6>
                </div>
              </div>
              <div className="pt-2">
                <div className="d-flex justify-content-between mt-2">
                  <h5>Total</h5>
                  <h5>
                    {" "}
                    ${total ? Placeholder.makenumber(total + ship) : "..."}
                  </h5>
                </div>
                {user && (
                  <Link to="/checkout">
                    <button className="btn btn-block btn-primary font-weight-bold my-3 py-3">
                      Proceed To Checkout
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
