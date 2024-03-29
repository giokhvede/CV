import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  setDoc,
  query,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebase.config";
import { toast } from "react-toastify";

export const getUserDetail = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        const userData = userCred.providerData[0];

        const unsubscribe = onSnapshot(
          doc(db, "users", userData?.uid),
          (_doc) => {
            if (_doc.exists()) {
              resolve(_doc.data());
            } else {
              setDoc(doc(db, "users", userData?.uid), userData).then(() => {
                resolve(userData);
              });
            }
          }
        );

        return unsubscribe;
      } else {
        reject(new Error("User is not authenticated"));
      }

      unsubscribe();
    });
  });
};

export const getTemplates = () => {
  return new Promise((resolve, reject) => {
    const templateQuery = query(
      collection(db, "templates"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
      const templates = querySnap.docs.map((doc) => doc.data());
      resolve(templates);
    });

    return unsubscribe;
  });
};

export const saveToCollections = async (user, data) => {
  if (!user?.collection?.includes(data?._id)) {
    const docRef = doc(db, "users", user?.uid);

    await updateDoc(docRef, {
      collection: arrayUnion(data?._id),
    })
      .then(() => toast.success("Saved to Collections"))
      .catch((err) => toast.error(`Error : ${err.message}`));
  } else {
    const docRef = doc(db, "users", user?.uid);

    await updateDoc(docRef, {
      collection: arrayRemove(data?._id),
    })
      .then(() => toast.success("Removed From Collections"))
      .catch((err) => toast.error(`Error : ${err.message}`));
  }
};

export const saveToFavorites = async (user, data) => {
  if (!data?.favorites?.includes(user?.uid)) {
    const docRef = doc(db, "templates", data?._id);

    await updateDoc(docRef, {
      favorites: arrayUnion(user?.uid),
    })
      .then(() => toast.success("Added to Favorites"))
      .catch((err) => toast.error(`Error : ${err.message}`));
  } else {
    const docRef = doc(db, "templates", data?._id);

    await updateDoc(docRef, {
      favorites: arrayRemove(user?.uid),
    })
      .then(() => toast.success("Removed From Favorites"))
      .catch((err) => toast.error(`Error : ${err.message}`));
  }
};

export const getTemplateDetails = async (templateId) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(doc(db, "templates", templateId), (doc) => {
      resolve(doc.data());
    });
    return unsubscribe;
  });
};

export const getTemplateDetailEditByUser = (uid, id) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      doc(db, "users", uid, "resumes", id),
      (doc) => {
        resolve(doc.data());
      }
    );

    return unsubscribe;
  });
};

export const getSavedResumes = (uid) => {
  return new Promise((resolve, reject) => {
    const templateQuery = query(
      collection(db, "users", uid, "resumes"),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
      const templates = querySnap.docs.map((doc) => doc.data());
      resolve(templates);
    });

    return unsubscribe;
  });
};
