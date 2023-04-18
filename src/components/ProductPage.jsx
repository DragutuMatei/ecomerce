import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Firestore from "../js/Firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Placeholder from "../util/Placeholder";
import Product from "./Product";
import Text from "../util/Text";

const firestore = new Firestore();

function ProductPage({ addit }) {
  const navigate = useNavigate();
  const { id } = useParams("id");
  const [user, loading, error] = useAuthState(firestore.getuser());
  const [produs, setProdus] = useState();
  const [value, setValue] = useState(1);
  useEffect(() => {
    firestore.getProductById(id).then((res) => {
      setProdus(res);
      getAlso(res.categories);
    });
  }, []);
  const modi = (by) => {
    if ((value >= 1 && by > 0) || value >= 2) setValue((old) => old + by);
  };
  const addit_prod = async (cant) => {
    addit(id, cant);
  };
  const signInWithGoogle = async () => {
    await firestore.signInWithGoogle();
  };

  const [review, setReview] = useState({
    rating: 0,
    review: "",
    user: {
      id: user && user.uid,
      img: user && user.photoURL,
      email: user && user.email,
      nume: user && user.displayName,
    },
    date: Placeholder.getdate(),
  });

  useEffect(() => {
    handlerev("user", {
      id: user && user.uid,
      img: user && user.photoURL,
      email: user && user.email,
      nume: user && user.displayName,
    });
  }, [user]);

  const handlerev = (field, e) => {
    setReview((old) => ({
      ...old,
      [field]: e,
    }));
  };

  const [rated, setRated] = useState(-1);

  const rate = (stars) => {
    handlerev("rating", stars);
    setRated(stars);
    for (let i = 0; i < stars; i++) {
      document.querySelectorAll(".STEA_REV")[i].classList.remove("fa-star");
      document.querySelectorAll(".STEA_REV")[i].classList.remove("far");
      document.querySelectorAll(".STEA_REV")[i].classList.add("fas");
      document.querySelectorAll(".STEA_REV")[i].classList.add("fa-star");
    }
    for (let i = stars; i < 5; i++) {
      document.querySelectorAll(".STEA_REV")[i].classList.remove("fa-star");
      document.querySelectorAll(".STEA_REV")[i].classList.remove("fas");
      document.querySelectorAll(".STEA_REV")[i].classList.add("far");
      document.querySelectorAll(".STEA_REV")[i].classList.add("fa-star");
    }
  };

  const ratehover = (k) => {
    for (let i = 0; i < k; i++) {
      document.querySelectorAll(".STEA_REV")[i].classList.remove("fa-star");
      document.querySelectorAll(".STEA_REV")[i].classList.remove("far");
      document.querySelectorAll(".STEA_REV")[i].classList.add("fas");
      document.querySelectorAll(".STEA_REV")[i].classList.add("fa-star");
    }
  };

  const notratehover = (k) => {
    if (rated == -1)
      for (let i = 0; i < k; i++) {
        document.querySelectorAll(".STEA_REV")[i].classList.remove("fa-star");
        document.querySelectorAll(".STEA_REV")[i].classList.remove("fas");
        document.querySelectorAll(".STEA_REV")[i].classList.add("far");
        document.querySelectorAll(".STEA_REV")[i].classList.add("fa-star");
      }
    else {
      // console.log("rated: ", rated);
      for (let i = 0; i < rated; i++) {
        document.querySelectorAll(".STEA_REV")[i].classList.remove("fa-star");
        document.querySelectorAll(".STEA_REV")[i].classList.remove("far");
        document.querySelectorAll(".STEA_REV")[i].classList.add("fas");
        document.querySelectorAll(".STEA_REV")[i].classList.add("fa-star");
      }
      for (let i = rated; i < k; i++) {
        document.querySelectorAll(".STEA_REV")[i].classList.remove("fa-star");
        document.querySelectorAll(".STEA_REV")[i].classList.remove("fas");
        document.querySelectorAll(".STEA_REV")[i].classList.add("far");
        document.querySelectorAll(".STEA_REV")[i].classList.add("fa-star");
      }
    }
  };
  const leaverev = async () => {
    await firestore.leaveRev(id, review).then((res) => {
      // console.log(res);
      firestore.getProductById(id).then((res) => {
        setProdus(res);
      });
    });
  };

  const delete_rev = async (rev) => {
    // console.log(rev);
    await firestore.deleteRev({ rev, id }).then((res) => {
      firestore.getProductById(id).then((res) => {
        setProdus(res);
      });
    });
  };

  const [also, setAlso] = useState([]);
  const getAlso = async (cat) => {
    setAlso(
      await firestore.readDocuments("products", ["categories", "==", cat])
    );
    // console.log(also);
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
              <a
                className="breadcrumb-item text-dark"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(-1)}
              >
                Shop
              </a>
              <span className="breadcrumb-item active">
                {produs && produs.nume}
              </span>
            </nav>
          </div>
        </div>
      </div>

      <div className="container-fluid pb-5">
        <div className="row px-xl-5">
          <div className="col-lg-5 mb-30">
            <div
              id="product-carousel"
              className="carousel slide"
              data-ride="carousel"
            >
              <div className="carousel-inner bg-light">
                {produs && produs.images.length !== 0 ? (
                  produs.images.map((img, index) => {
                    return (
                      <div
                        key={index}
                        className={
                          index == 0 ? "carousel-item active" : "carousel-item"
                        }
                      >
                        <img className="w-100 h-100" src={img} alt="Image" />
                      </div>
                    );
                  })
                ) : (
                  <div
                    className="carousel-item active"
                    style={{
                      height: 370,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span className="loader"></span>
                  </div>
                )}
              </div>
              <a
                className="carousel-control-prev"
                href="#product-carousel"
                data-slide="prev"
              >
                <i className="fa fa-2x fa-angle-left text-dark"></i>
              </a>
              <a
                className="carousel-control-next"
                href="#product-carousel"
                data-slide="next"
              >
                <i className="fa fa-2x fa-angle-right text-dark"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-7 h-auto mb-30">
            <div className="h-100 bg-light p-30">
              <h3>{produs && produs.nume}</h3>
              <div className="d-flex mb-3">
                <div className="text-primary mr-2">
                  {produs &&
                    [...Array(5)].map((e, index) => {
                      return (
                        <>
                          {index >= produs.rating ? (
                            //gol
                            <i className="far fa-star" key={index}></i>
                          ) : index + 1 <= Math.floor(produs.rating) ? (
                            //plin
                            <i className="fas fa-star" key={index}></i>
                          ) : (
                            //jumate
                            <i className="fas fa-star-half-alt" key={index}></i>
                          )}
                        </>
                      );
                    })}
                </div>
                <small className="pt-1">
                  ({produs && Placeholder.roundit(produs.rating)})
                </small>
              </div>
              <h3 className="font-weight-semi-bold mb-4">
                ${produs && produs.pret}
              </h3>
              <p className="mb-4">{produs && produs.descriere_scurta}</p>
              {/* <div className="d-flex mb-3">
                <strong className="text-dark mr-3">Sizes:</strong>
                <form>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      id="size-1"
                      name="size"
                    />
                    <label className="custom-control-label" htmlFor="size-1">
                      XS
                    </label>
                  </div>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      id="size-2"
                      name="size"
                    />
                    <label className="custom-control-label" htmlFor="size-2">
                      S
                    </label>
                  </div>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      id="size-3"
                      name="size"
                    />
                    <label className="custom-control-label" htmlFor="size-3">
                      M
                    </label>
                  </div>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      id="size-4"
                      name="size"
                    />
                    <label className="custom-control-label" htmlFor="size-4">
                      L
                    </label>
                  </div>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      id="size-5"
                      name="size"
                    />
                    <label className="custom-control-label" htmlFor="size-5">
                      XL
                    </label>
                  </div>
                </form>
              </div>
              <div className="d-flex mb-4">
                <strong className="text-dark mr-3">Colors:</strong>
                <form>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      id="color-1"
                      name="color"
                    />
                    <label className="custom-control-label" htmlFor="color-1">
                      Black
                    </label>
                  </div>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      id="color-2"
                      name="color"
                    />
                    <label className="custom-control-label" htmlFor="color-2">
                      White
                    </label>
                  </div>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      id="color-3"
                      name="color"
                    />
                    <label className="custom-control-label" htmlFor="color-3">
                      Red
                    </label>
                  </div>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      id="color-4"
                      name="color"
                    />
                    <label className="custom-control-label" htmlFor="color-4">
                      Blue
                    </label>
                  </div>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      id="color-5"
                      name="color"
                    />
                    <label className="custom-control-label" htmlFor="color-5">
                      Green
                    </label>
                  </div>
                </form>
              </div> */}
              <div className="d-flex align-items-center mb-4 pt-2">
                <div
                  className="input-group quantity mr-3"
                  style={{ width: "130px" }}
                >
                  <div className="input-group-btn">
                    <button
                      className="btn btn-primary btn-minus"
                      onClick={() => modi(-1)}
                    >
                      <i className="fa fa-minus"></i>
                    </button>
                  </div>
                  <input
                    type="number"
                    className="form-control bg-secondary border-0 text-center"
                    value={value}
                  />
                  <div className="input-group-btn">
                    <button
                      className="btn btn-primary btn-plus"
                      onClick={() => modi(1)}
                    >
                      <i className="fa fa-plus"></i>
                    </button>
                  </div>
                </div>

                {user ? (
                  <button
                    className="btn btn-primary px-3"
                    onClick={() => addit_prod(value)}
                  >
                    <i className="fa fa-shopping-cart mr-1"></i> Add To Cart
                  </button>
                ) : (
                  <h4
                    style={{
                      cursor: "pointer",
                      margin: "5px 20px",
                      color: "#FFD333",
                    }}
                    onClick={signInWithGoogle}
                  >
                    Login to add to cart
                  </h4>
                )}
              </div>
              <div className="d-flex pt-2">
                <strong className="text-dark mr-2">Share on:</strong>
                <div className="d-inline-flex">
                  <a className="text-dark px-2" href="">
                    {/* <ShareButton quote="Check out this cool website I found!" /> */}
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a className="text-dark px-2" href="">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a className="text-dark px-2" href="">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a className="text-dark px-2" href="">
                    <i className="fab fa-pinterest"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row px-xl-5">
          <div className="col">
            <div className="bg-light p-30">
              <div className="nav nav-tabs mb-4">
                <a
                  className="nav-item nav-link text-dark active"
                  data-toggle="tab"
                  href="#tab-pane-1"
                >
                  Description
                </a>
                <a
                  className="nav-item nav-link text-dark"
                  data-toggle="tab"
                  href="#tab-pane-2"
                >
                  Information
                </a>
                <a
                  className="nav-item nav-link text-dark "
                  data-toggle="tab"
                  href="#tab-pane-3"
                >
                  Reviews ({produs && produs.reviews && produs.reviews.length})
                </a>
              </div>
              <div className="tab-content">
                <div className="tab-pane fade show active" id="tab-pane-1">
                  <h4 className="mb-3">Product Description</h4>
                  <p>{produs && produs.descriere_lunga}</p>
                </div>
                <div className="tab-pane fade" id="tab-pane-2">
                  <h4 className="mb-3">Additional Information</h4>
                  <p>{produs && produs.info}</p>
                  {/* <div className="row">
                    <div className="col-md-6">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item px-0">
                          Sit erat duo lorem duo ea consetetur, et eirmod
                          takimata.
                        </li>
                        <li className="list-group-item px-0">
                          Amet kasd gubergren sit sanctus et lorem eos
                          sadipscing at.
                        </li>
                        <li className="list-group-item px-0">
                          Duo amet accusam eirmod nonumy stet et et stet eirmod.
                        </li>
                        <li className="list-group-item px-0">
                          Takimata ea clita labore amet ipsum erat justo
                          voluptua. Nonumy.
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item px-0">
                          Sit erat duo lorem duo ea consetetur, et eirmod
                          takimata.
                        </li>
                        <li className="list-group-item px-0">
                          Amet kasd gubergren sit sanctus et lorem eos
                          sadipscing at.
                        </li>
                        <li className="list-group-item px-0">
                          Duo amet accusam eirmod nonumy stet et et stet eirmod.
                        </li>
                        <li className="list-group-item px-0">
                          Takimata ea clita labore amet ipsum erat justo
                          voluptua. Nonumy.
                        </li>
                      </ul>
                    </div>
                  </div> */}
                </div>
                <div className="tab-pane fade " id="tab-pane-3">
                  <div className="row">
                    <div className="col-md-6">
                      <h4 className="mb-4">
                        ({produs && produs.reviews && produs.reviews.length})
                        reviews for {produs && produs.nume}
                      </h4>
                      {produs && produs.reviews ? (
                        produs.reviews.map((rev, index) => {
                          return (
                            <>
                              <div className="media mb-4" key={index}>
                                <img
                                  src={rev.user.img}
                                  alt="Image"
                                  className="img-fluid mr-3 mt-1"
                                  style={{ width: 45, borderRadius: "90%" }}
                                />
                                <div className="media-body">
                                  <h6>
                                    {rev.user.nume}
                                    <small>
                                      {" "}
                                      - <i>{rev.date}</i>
                                    </small>
                                  </h6>
                                  <div className="text-primary mb-2">
                                    {[...Array(5)].map((e, index) => {
                                      return (
                                        <>
                                          {index >= rev.rating ? (
                                            <i
                                              className="far fa-star"
                                              key={index}
                                            ></i>
                                          ) : (
                                            <i
                                              className="fas fa-star"
                                              key={index}
                                            ></i>
                                          )}
                                        </>
                                      );
                                    })}
                                  </div>
                                  <p>{rev.review} </p>
                                  {user && rev.user.id == user.uid && (
                                    <>
                                      <button
                                        className="btn btn-primary px-3"
                                        onClick={() => {
                                          delete_rev(rev);
                                        }}
                                      >
                                        Delete review
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </>
                          );
                        })
                      ) : (
                        <h5>Nu sunt reviews pentru acest produs</h5>
                      )}
                    </div>
                    {user ? (
                      <>
                        <div className="col-md-6">
                          <h4 className="mb-4">Leave a review</h4>
                          <small>
                            Your email address will not be published. Required
                            fields are marked *
                          </small>
                          <div className="d-flex my-3">
                            <p className="mb-0 mr-2">Your Rating * :</p>
                            <div className="text-primary">
                              <i
                                style={{ cursor: "pointer" }}
                                className="far fa-star STEA_REV"
                                onMouseEnter={() => ratehover(1)}
                                onMouseLeave={() => notratehover(1)}
                                onClick={() => rate(1)}
                              ></i>
                              <i
                                style={{ cursor: "pointer" }}
                                onClick={() => rate(2)}
                                className="far fa-star STEA_REV"
                                onMouseEnter={() => ratehover(2)}
                                onMouseLeave={() => notratehover(2)}
                              ></i>
                              <i
                                style={{ cursor: "pointer" }}
                                onClick={() => rate(3)}
                                className="far fa-star STEA_REV"
                                onMouseEnter={() => ratehover(3)}
                                onMouseLeave={() => notratehover(3)}
                              ></i>
                              <i
                                className="far fa-star STEA_REV"
                                onClick={() => rate(4)}
                                style={{ cursor: "pointer" }}
                                onMouseEnter={() => ratehover(4)}
                                onMouseLeave={() => notratehover(4)}
                              ></i>
                              <i
                                className="far fa-star STEA_REV"
                                onClick={() => rate(5)}
                                style={{ cursor: "pointer" }}
                                onMouseEnter={() => ratehover(5)}
                                onMouseLeave={() => notratehover(5)}
                              ></i>
                            </div>
                          </div>
                          <div>
                            <div className="form-group">
                              <label htmlFor="message">Your Review *</label>
                              <textarea
                                id="message"
                                cols="30"
                                rows="5"
                                required
                                onChange={(e) =>
                                  handlerev("review", e.target.value)
                                }
                                className="form-control"
                              ></textarea>
                            </div>

                            <div className="form-group mb-0">
                              <button
                                className="btn btn-primary px-3"
                                onClick={leaverev}
                              >
                                Leave Your Review
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h4>Logheaza te pentru a lasa un review</h4>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-5">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4">
          <span className="bg-secondary pr-3">You May Also Like</span>
        </h2>
        <div className="row px-xl-5">
          <div className="col-lg-9 col-md-8">
            <div className="row pb-3 products">
              {also && also.length !== 1 ? (
                also.map((prod, index) => {
                  if (prod.id !== id)
                    return (
                      <Product
                        key={prod.id}
                        id={prod.id}
                        addit={addit}
                        img={prod.images ? prod.images[0] : ""}
                        link={`/prod/${prod.id}`}
                        name={Text.returnSizedText(prod.nume)}
                        price={prod.pret}
                        oldPrice={prod.old_pret}
                        rating={prod.rating}
                      />
                    );
                })
              ) : (
                  <h4>Nu mai sunt alte produse din aceasta categorie</h4>
                // <div
                //   className="carousel-item active"
                //   key={Math.random()}
                //   style={{
                //     height: 370,
                //     display: "flex",
                //     justifyContent: "center",
                //     alignItems: "center",
                //   }}
                // >
                //   <span className="loader"></span>
                // </div>
              )}
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

export default ProductPage;
