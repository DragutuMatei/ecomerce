import React, { useEffect, useState } from "react";
import Firestore from "../js/Firestore";
import firebase from "firebase/compat/app";
import "firebase/storage";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Placeholder from "../util/Placeholder";

const firestore = new Firestore();
const storage = getStorage();

function AdminPage() {
  //get categories
  const [mesajeContact, setMesajeContact] = useState([]);

  const getMesajeContact = async () => {
    firestore.readDocuments("contact").then((res) => {
      setMesajeContact(res);
    });
  };

  const [categories, setCategories] = useState([]);
  const [newItem, setNewItem] = useState({
    nume: "",
    descriere_scurta: "",
    descriere_lunga: "",
    info: "",
    date: "",
    old_pret: 0,
    pret: 0,
    rating: 0,
    reviews: [],
    categories: "",
    cantitate: 0,
    images: [],
  });

  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    setProducts(await firestore.readDocuments("products"));
  };

  const getCategories = async () => {
    firestore.readDocuments("categories").then((res) => {
      setCategories(res);
    });
  };

  useEffect(() => {
    getMesajeContact();
    getCategories();
    getProducts();
  }, []);

  const modifield = (field, e) => {
    setNewItem((old) => ({
      ...old,
      [field]: e,
    }));
  };

  const [images, setImages] = useState([]);

  const handleFileInputChange = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
  };

  const handleSubmit = async () => {
    const storage = getStorage();
    const downloadUrls = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const storageRef = ref(storage, `produse/${image.name}`);
      try {
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        downloadUrls.push(url);
      } catch (error) {
        console.error(error);
      }
    }

    let idk = {
      ...newItem,
      images: downloadUrls,
    };

    // setNewItem((old) => ({
    // }));

    console.log(downloadUrls, idk);
    // console.log(newItem);

    await firestore.addItem("products", idk);
  };

  const see = () => {
    console.log(newItem);
  };

  const [updateItem, setUpdateItem] = useState({
    nume: "",
    descriere_scurta: "",
    descriere_lunga: "",
    info: "",
    date: "",
    old_pret: 0,
    pret: 0,
    rating: 0,
    reviews: [],
    categories: "",
    cantitate: 0,
    images: [],
  });

  const updateF = (field, e) => {
    setUpdateItem((old) => ({
      ...old,
      [field]: e,
    }));
  };

  const [updateState, setUpdateState] = useState(false);
  const update = async (prod) => {
    setUpdateItem(prod);
    setUpdateState(true);
  };
  const updateFCT = async () => {
    let arr = updateItem.images.filter((ok) => typeof ok !== "string");
    console.log(arr);
    updateItem.images.length -= arr.length;

    const storage = getStorage();
    const downloadUrls = [];

    for (let i = 0; i < arr.length; i++) {
      const image = arr[i];
      const storageRef = ref(storage, `produse/${image.name}`);
      try {
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        downloadUrls.push(url);
      } catch (error) {
        console.error(error);
      }
    }
    console.log(downloadUrls);
    let idk = {
      ...updateItem,
      images: updateItem.images.concat(downloadUrls),
    };

    console.log(idk);

    await firestore.updateDocument("products", idk.id, idk).then((res) => {
      getProducts();
      alert("produs updatat");
    });
  };

  const deletef = async (id) => {
    await firestore.deleteDocument("products", id).then((res) => {
      getProducts();
      alert("Produs sters!");
    });
  };

  const handleDelete = (indexToDelete) => {
    console.log(indexToDelete);
    const updatedArray = updateItem.images.filter(
      (_, index) => index !== indexToDelete
    );
    setUpdateItem({ ...updateItem, images: updatedArray });
  };
  const handleAdd = (newElement) => {
    const updatedArray = [...updateItem.images, ...newElement];
    // const updatedArray = [...updateItem.images, newElement];
    setUpdateItem({ ...updateItem, images: updatedArray });
    console.log(updateItem.images);
  };

  const [file, setFile] = useState([]);
  function handleChange(e) {
    console.log(e);
    e.map((file) => {
      setFile((old) => [...old, URL.createObjectURL(file)]);
    });
  }

  const addimgs = (e) => {
    const files = Array.from(e.target.files);
    // getImagesAsStrings(files, (error, imageStrings) => {
    //   handleAdd(imageStrings);
    // });
    // handleChange(files);
    handleAdd(files);
    handleChange(files);
  };
  const delete_mes = async (id) => {
    await firestore.deleteDocument("contact", id).then((res) => {
      getMesajeContact();
      alert("mesaj sters!");
    });
  };
  return (
    <>
      <div style={{ margin: "0 30px" }}>
        <section className="addSection">
          <textarea
            placeholder="nume"
            onChange={(e) => modifield("nume", e.target.value)}
            cols="30"
            rows="10"
          ></textarea>
          <textarea
            name=""
            id=""
            onChange={(e) => modifield("descriere_scurta", e.target.value)}
            cols="30"
            rows="10"
            placeholder="descriere_scurta"
          ></textarea>
          <textarea
            name=""
            id=""
            onChange={(e) => modifield("descriere_lunga", e.target.value)}
            cols="30"
            rows="10"
            placeholder="descriere_lunga"
          ></textarea>
          <textarea
            onChange={(e) => modifield("info", e.target.value)}
            name=""
            id=""
            cols="30"
            rows="10"
            placeholder="info"
          ></textarea>
          <select onChange={(e) => modifield("categories", e.target.value)}>
            <option>Alege o caterogie</option>
            {categories &&
              categories.map((cat) => (
                <option key={cat.categorie} value={cat.categorie}>
                  {cat.categorie}
                </option>
              ))}
          </select>
          <input
            type="number"
            onChange={(e) => modifield("pret", parseFloat(e.target.value))}
            placeholder="pret"
          />
          <input
            type="number"
            onChange={(e) => modifield("old_pret", parseFloat(e.target.value))}
            placeholder="old_pret"
          />
          <input
            type="date"
            onChange={(e) => modifield("date", e.target.value)}
            placeholder="date"
          />
          <input
            type="number"
            onChange={(e) => modifield("cantitate", parseFloat(e.target.value))}
            placeholder="cantitate"
          />
          <input type="file" multiple onChange={handleFileInputChange} />
          <button onClick={handleSubmit}>submit</button>
          <button onClick={see}>see item</button>
        </section>
        <br />
        <br />
        <hr />
        <section className="prods">
          {updateState && (
            <section id="update">
              <h1>Update form:</h1>
              <textarea
                placeholder="nume"
                onChange={(e) => updateF("nume", e.target.value)}
                cols="30"
                rows="10"
                value={updateItem.nume}
              ></textarea>
              <textarea
                name=""
                id=""
                onChange={(e) => updateF("descriere_scurta", e.target.value)}
                cols="30"
                value={updateItem.descriere_scurta}
                rows="10"
                placeholder="descriere_scurta"
              ></textarea>
              <textarea
                name=""
                id=""
                onChange={(e) => updateF("descriere_lunga", e.target.value)}
                value={updateItem.descriere_lunga}
                cols="30"
                rows="10"
                placeholder="descriere_lunga"
              ></textarea>
              <textarea
                onChange={(e) => updateF("info", e.target.value)}
                name=""
                value={updateItem.info}
                id=""
                cols="30"
                rows="10"
                placeholder="info"
              ></textarea>
              <select onChange={(e) => updateF("categories", e.target.value)}>
                <option value={updateItem.categories}>Alege o caterogie</option>
                {categories &&
                  categories.map((cat) => (
                    <option key={cat.categorie} value={cat.categorie}>
                      {cat.categorie}
                    </option>
                  ))}
              </select>
              <input
                value={updateItem.pret}
                type="number"
                onChange={(e) => updateF("pret", parseFloat(e.target.value))}
                placeholder="pret"
              />
              <input
                value={updateItem.old_pret}
                type="number"
                onChange={(e) =>
                  updateF("old_pret", parseFloat(e.target.value))
                }
                placeholder="old_pret"
              />
              <input
                value={updateItem.date}
                type="date"
                onChange={(e) => updateF("date", e.target.value)}
                placeholder="date"
              />
              <input
                type="number"
                value={updateItem.cantitate}
                onChange={(e) =>
                  updateF("cantitate", parseFloat(e.target.value))
                }
                placeholder="cantitate"
              />

              <div>
                {updateItem.images &&
                  updateItem.images.map((img, index) => {
                    // if (typeof img === "string")
                    const remake = (e) => {
                      return URL.createObjectURL(
                        new Blob([e], { type: "application/zip" })
                      );
                    };

                    if (img.slice(0, 5) === "https")
                      return (
                        <>
                          <div>
                            <img src={img} style={{ width: 100 }} />
                            <button onClick={() => handleDelete(index)}>
                              delete img
                            </button>
                          </div>
                          <hr />
                        </>
                      );
                    else {
                      return (
                        <>
                          <div>
                            <img src={remake(img)} style={{ width: 100 }} />
                            <button onClick={() => handleDelete(index)}>
                              delete img
                            </button>
                          </div>
                          <hr />
                        </>
                      );
                    }
                  })}
                <input type="file" multiple onChange={addimgs} />
              </div>
              <button onClick={updateFCT}>update</button>
              <button
                onClick={() => {
                  // console.log(updateItem);
                  setUpdateState(false);
                }}
              >
                inchide form
              </button>
            </section>
          )}
          <hr />
          <br />
          <br />
          <h1>Produse: </h1>
          {products &&
            products.map((prod) => {
              return (
                <React.Fragment key={prod.id}>
                  <br />
                  <div style={{ margin: "0 20px" }}>
                    <div className="buttons">
                      <a href="#update">
                        <button onClick={() => update(prod)}>
                          update produs
                        </button>
                      </a>
                      <button onClick={() => deletef(prod.id)}>
                        delete produs
                      </button>
                    </div>
                    <h3>nume produs: {prod.nume}</h3>
                    <h5>data: {prod.date}</h5>
                    <h5>categorie: {prod.categories}</h5>
                    <h5>cantitate ramasa: {prod.cantitate}</h5>
                    <h5>pret: {Placeholder.makenumber(prod.pret)}</h5>
                    {prod.old_pret && prod.old_pret !== 0 && (
                      <h5>
                        pret vechi: {Placeholder.makenumber(prod.old_pret)}
                      </h5>
                    )}
                    <div>
                      {prod.images &&
                        prod.images.map((img) => (
                          <img
                            src={img}
                            key={img}
                            style={{ width: 100, margin: 10 }}
                          />
                        ))}
                    </div>
                    <h5>rating: {prod.rating}</h5>
                    <p>Descriere scurta: {prod.descriere_scurta}</p>
                    <p>Descriere lunga: {prod.descriere_lunga}</p>
                    <p>Informatii: {prod.info}</p>
                  </div>
                  <hr />
                </React.Fragment>
              );
            })}
        </section>
      </div>
      <br />
      <hr />
      <br />
      <div style={{ margin: "0 30px" }}>
        <h1>Mesaje: </h1>
        {mesajeContact &&
          mesajeContact.map((mes) => {
            return (
              <>
                <div key={mes.id}>
                  <h4>
                    {" "}
                    <b> {mes.nume}</b> -{" "}
                    <a href={`mailto: ${mes.email}`}>{mes.email}</a>{" "}
                  </h4>
                  <h5>
                    {" "}
                    <b>-</b>
                    {mes.subject} <b>-</b>
                  </h5>
                  <p>{mes.message}</p>
                  <button onClick={() => delete_mes(mes.id)}>
                    Delete mesaj
                  </button>
                </div>
                <hr />
                <br />
              </>
            );
          })}
      </div>
    </>
  );
}

export default AdminPage;
/*
 nume: '',
    descriere_scurta: '',
    descriere_lunga: '',
    info: '',
    date: firebase.database.ServerValue.TIMESTAMP,
    old_pret: 0,
    pret: 0,
    rating: 0,
    reviews: 0,
    categories: '',
    cantitate: 0


































                     /´¯¯/)
                   ,/¯   /
                   /    /
               /´¯/'  '/´¯¯`·¸
           /'/   /    /      /¨¯\
          ('(    ´   ´    ¯~/'  ')
           \              '     /
            \    \          _ ·´
             \              (
              \             \

















              

    */
