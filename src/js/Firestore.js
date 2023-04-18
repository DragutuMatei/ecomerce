import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  updateDoc,
  collection,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/firestore";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export default class Firestore {
  constructor() {
    // Initialize Firebase
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

    const app = initializeApp(firebaseConfig);
    this.db = getFirestore();
    this.auth = getAuth(app);
    this.googleProvider = new GoogleAuthProvider();
  }

  async uploadmessage(data) {
    const contactRef = collection(this.db, "contact");

    return await addDoc(contactRef, data)
      .then((res) => {
        return true;
      })
      .catch((e) => {
        // console.log(e);
        return false;
      });
  }

  getDb() {
    return this.db;
  }

  async logout() {
    await signOut(this.auth);
  }

  getuser() {
    return this.auth;
  }

  async getProductByUser(user) {
    let cant = [];
    let total = 0;
    if (user) {
      await this.readDocuments("cos", ["user_id", "==", user.uid]).then(
        (res) => {
          for (let i = 0; i < res.length; i++) {
            cant.push({
              uid: res[i].id,
              id: res[i].id_produs,
              cant: res[i].cantitate,
            });
          }
        }
      );

      for (let i = 0; i < cant.length; i++) {
        cant[i] = {
          uid: cant[i].uid,
          cant: cant[i].cant,
          ...(await this.getProductById(cant[i].id)),
        };
        total += cant[i].cant * cant[i].pret;
      }
      // cant.forEach(async prod => {
      // })
      // console.log("2) ", cant);
    }
    return { cant, total };
  }

  async addit(id, user, cant) {
    if (user)
      await this.updateProductCos({
        id_produs: id,
        cantitate: cant,
        user_id: user.uid,
      }).then((res) => {
        // console.log(res);
        if (res === "adaug") alert("Adaugat cu succes in cos!");
        else if (res === "update ok") alert("Update cantitate");
        else alert("eroare");
      });
    else {
      alert("nu e logat");
    }
  }

  async getCos(user) {
    let cant = 0;
    if (user) {
      await this.readDocuments("cos", ["user_id", "==", user.uid]).then(
        (res) => {
          for (let i = 0; i < res.length; i++) {
            cant += res[i].cantitate;
          }
        }
      );
    }
    return cant;
  }

  async signInWithGoogle() {
    try {
      const res = await signInWithPopup(this.auth, this.googleProvider);
      const user = res.user;
      const q = query(
        collection(this.db, "users"),
        where("uid", "==", user.uid)
      );
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(this.db, "users"), {
          uid: user.uid,
          name: user.displayName,
          authProvider: "google",
          email: user.email,
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  async addItem(collectionName, product) {
    const db = getFirestore();
    const productsRef = collection(db, collectionName);

    // Use the addDoc() method to add a new document to the products collection
    return await addDoc(productsRef, product)
      .then((docRef) => {
        // console.log("Document written with ID: ", docRef.id);
        return docRef.id;
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }

  async updateProductCos(product) {
    const db = getFirestore();
    const productsRef = collection(db, "cos");

    const q = query(
      productsRef,
      where("id_produs", "==", product.id_produs),
      where("user_id", "==", product.user_id)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size !== 1) {
      await addDoc(productsRef, product)
        .then((docRef) => {
          // console.log("Document written with ID: ", docRef.id);
          return "adaug";
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

      return "adaug";
    }

    const productDoc = querySnapshot.docs[0];
    const productRef = doc(db, "cos", productDoc.id);

    try {
      await updateDoc(productRef, {
        cantitate: productDoc.get("cantitate") + product.cantitate,
      });
      // console.log("Document successfully updated!");
      return "update ok";
    } catch (error) {
      // console.log("Error updating document:", error);
      return false;
    }
  }

  async sortdata(collectionName, by, how) {
    try {
      const collectionRef = this.db.collection(collectionName);

      // Query the collection and sort by price in descending order
      const snapshot = await collectionRef.orderBy(by, how).get();

      // Extract the data from the snapshot
      const sortedData = snapshot.docs.map((doc) => doc.data());

      return sortedData;
    } catch (error) {
      console.error("Error sorting data:", error);
      throw error;
    }
  }

  // Read all documents in a collection
  async readDocuments(collectionName, condition) {
    let q;
    if (condition == undefined) {
      q = query(collection(this.db, collectionName));
    } else {
      q = query(
        collection(this.db, collectionName),
        where(condition[0], condition[1], condition[2])
      );
    }
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    return documents;
  }

  async getProductById(productId) {
    const docRef = doc(this.db, "products", productId);
    const docSnap = await getDoc(docRef);
    // // console.log(docSnap.data().images);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
  }
  // Update a document in a collection
  async updateDocument(collectionName, documentId, data) {
    // console.log(collectionName, documentId, data);
    const ref = doc(this.db, collectionName, documentId);

    // Set the "capital" field of the city 'DC'
    return await updateDoc(ref, data);
  }

  async leaveRev(id, rev) {
    let prod = await this.getProductById(id);
    let reviews = [...prod.reviews, { ...rev }];
    prod.reviews = reviews;
    let rating = prod.rating;
    let newRating = 0;
    if (rating == 0) {
      newRating = rev.rating;
    } else {
      for (let i = 0; i < reviews.length; i++) {
        newRating += reviews[i].rating;
      }
      newRating /= reviews.length;
    }
    prod.rating = newRating;

    return await this.updateDocument("products", id, prod);
  }

  async deleteRev(revi) {
    const { date, rating, review, user } = revi.rev;
    const id = revi.id;

    const prod = await this.getProductById(id);
    let { reviews } = prod;
    let index = 0;
    let newRating = 0;
    prod.reviews.forEach((rev, i, object) => {
      if (
        rev.date == date &&
        rev.rating == rating &&
        rev.review == review &&
        rev.user.id == user.id &&
        rev.user.email == user.email &&
        rev.user.nume == user.nume
      ) {
        index = i;
        for (let i = 0; i < reviews.length; i++) {
          if (i != index) {
            newRating += reviews[i].rating;
            // console.log(reviews[i].rating);
          }
        }
        newRating /= reviews.length - 1;
      }
    });
    reviews.splice(index, 1);
    prod.rating = newRating;
    prod.reviews = reviews;
    return await this.updateDocument("products", id, prod);
  }

  // Delete a document from a collection
  async deleteDocument(collectionName, documentId) {
    await deleteDoc(doc(this.db, collectionName, documentId));
  }
  async delete_all_from_cart(id) {
    const carts = await this.readDocuments("cos", ["id_produs", "==", id]);
    for (const cart of carts) {
      await this.deleteDocument("cos", cart.id);
    }
  }
}
