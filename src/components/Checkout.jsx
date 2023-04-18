import React, { useEffect, useState } from "react";
import Firestore from "../js/Firestore";
import { getAuth } from "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Text from "../util/Text";
import { Link, Navigate } from "react-router-dom";

const firestore = new Firestore();
const auth = getAuth();

function Checkout({ addit }) {
  let ship = 10;
  const [user, loading, error] = useAuthState(auth);
  const [products, setP] = useState([]);
  const [total, setTotal] = useState(0);
  const [value, setValue] = useState(1);

  const modi = (by) => {
    if ((value >= 1 && by > 0) || value >= 2) setValue((old) => old + by);
  };
  const addit_prod = async (id, cant) => {
    addit(id, cant);
  };
  const signInWithGoogle = async () => {
    await firestore.signInWithGoogle();
  };
  const ok = async () => {
    // console.log(user);
    let resp = await firestore.getProductByUser(user);
    setP(resp.cant);
    setTotal(resp.total);
  };
  useEffect(() => {
    ok();
  }, [user]);

  return (
    <>
      {!user && <Navigate to="/" />}
      <div className="container-fluid">
        <div className="row px-xl-5">
          <div className="col-12">
            <nav className="breadcrumb bg-light mb-30">
              <Link className="breadcrumb-item text-dark" to="/">
                Home
              </Link>
              <span className="breadcrumb-item active">Checkout</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        {" "}
        <div className="bg-light p-30 mb-5">
          <div className="border-bottom">
            <h6 className="mb-3">Products</h6>
            {products &&
              products.map((prod) => {
                return (
                  <div
                    key={prod.id}
                    className="d-flex justify-content-between mb-2 rand"
                    style={{ alignItems: "center" }}
                  >
                    <Link to={`/prod/${prod.id}`}>
                      <p>{prod.nume}</p>
                    </Link>
                    <p style={{ margin: 0, textAlign: "end" }}>
                      {prod.cant.toLocaleString("en-US")} x $
                      {prod.pret.toLocaleString("en-US")}
                    </p>
                  </div>
                );
              })}
          </div>
          <div className="border-bottom pt-3 pb-2">
            <div className="d-flex justify-content-between mb-3">
              <h6>Subtotal</h6>
              <h6>${total.toLocaleString("en-US")}</h6>
            </div>
            <div className="d-flex justify-content-between">
              <h6 className="font-weight-medium">Shipping</h6>
              <h6 className="font-weight-medium">
                ${ship.toLocaleString("en-US")}
              </h6>
            </div>
          </div>
          <div className="pt-2">
            <div className="d-flex justify-content-between mt-2">
              <h5>Total</h5>
              <h5>${(total + ship).toLocaleString("en-US")}</h5>
            </div>
          </div>
        </div>
        <div className="row px-xl-5">
          <div className="col-lg-8">
            <h5 className="section-title position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">Billing Address</span>
            </h5>
            <div className="bg-light p-30 mb-5">
              <div className="row">
                <div className="col-md-6 form-group">
                  <label>First Name</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="John"
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Last Name</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Doe"
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>E-mail</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="example@email.com"
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Mobile No</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="+123 456 789"
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Address Line 1</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="123 Street"
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>Address Line 2</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="123 Street"
                  />
                </div>

                <div className="col-md-6 form-group">
                  <label>City</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="New York"
                  />
                </div>
                <div className="col-md-6 form-group">
                  <label>ZIP Code</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="123"
                  />
                </div>
                <div className="col-md-12">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="shipto"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="shipto"
                      data-toggle="collapse"
                      data-target="#shipping-address"
                    >
                      Ship to different address
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="collapse mb-5" id="shipping-address">
              <h5 className="section-title position-relative text-uppercase mb-3">
                <span className="bg-secondary pr-3">Shipping Address</span>
              </h5>
              <div className="bg-light p-30">
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label>First Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="John"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Last Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Doe"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>E-mail</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Mobile No</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="+123 456 789"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Address Line 1</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="123 Street"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Address Line 2</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="123 Street"
                    />
                  </div>

                  <div className="col-md-6 form-group">
                    <label>City</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="New York"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>ZIP Code</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <h5 className="section-title position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">Order Total</span>
            </h5>

            <div className="mb-5">
              <h5 className="section-title position-relative text-uppercase mb-3">
                <span className="bg-secondary pr-3">Payment</span>
              </h5>
              <div className="bg-light p-30">
                <div className="form-group">
                  <div className="custom-control custom-radio">
                    <input
                      type="radio"
                      className="custom-control-input"
                      name="payment"
                      id="paypal"
                    />
                    <label className="custom-control-label" htmlFor="paypal">
                      Paypal
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <div className="custom-control custom-radio">
                    <input
                      type="radio"
                      className="custom-control-input"
                      name="payment"
                      id="directcheck"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="directcheck"
                    >
                      Direct Check
                    </label>
                  </div>
                </div>
                <div className="form-group mb-4">
                  <div className="custom-control custom-radio">
                    <input
                      type="radio"
                      className="custom-control-input"
                      name="payment"
                      id="banktransfer"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="banktransfer"
                    >
                      Bank Transfer
                    </label>
                  </div>
                </div>
                <button className="btn btn-block btn-primary font-weight-bold py-3">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a href="#" className="btn btn-primary back-to-top">
        <i className="fa fa-angle-double-up"></i>
      </a>
    </>
  );
}

export default Checkout;
