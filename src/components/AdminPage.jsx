import React, { useEffect, useState } from "react";
import Firestore from "../js/Firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const firestore = new Firestore();

function AdminPage() {
  //get categories
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
    reviews: 0,
    categories: "",
    cantitate: 0,
    images: [],
  });

  const getCategories = async () => {
    firestore.readDocuments("categories").then((res) => {
      setCategories(res);
    });
  };

  useEffect(() => {
    getCategories();
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
    }

    // setNewItem((old) => ({
    // }));

    console.log(downloadUrls, idk);
    // console.log(newItem);

    await firestore.addItem("products", idk);
  };

  const see = () => {
    console.log(newItem);
  };
  return (
    <div>
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
          onChange={(e) => modifield("pret", e.target.value)}
          placeholder="pret"
        />
        <input
          type="number"
          onChange={(e) => modifield("old_pret", e.target.value)}
          placeholder="old_pret"
        />
        <input
          type="date"
          onChange={(e) => modifield("date", e.target.value)}
          placeholder="date"
        />
        <input
          type="number"
          onChange={(e) => modifield("cantitate", e.target.value)}
          placeholder="cantitate"
        />
        <input type="file" multiple onChange={handleFileInputChange} />
        <button onClick={handleSubmit}>submit</button>
        <button onClick={see}>see item</button>
      </section>
    </div>
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
