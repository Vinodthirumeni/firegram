import React, { useState, useEffect } from "react";
import {
  projectStorage,
  projectFirestore,
  timestamp,
} from "../firebase/config";

import { motion } from "framer-motion";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const types = ["image/png", "image/jpeg"];
  const [selectedImg, setSelectedImg] = useState(null);

  const changeHandler = (e) => {
    const selected = e.target.files[0];
    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError(null);
    } else {
      setFile(null);
      setError("Please try upload PNG/JPEG");
    }
  };

  // hook to save in firebase storage and firestore start
  const [progress, setProgress] = useState(0);
  const [hookerror, setHookError] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (file) {
      const storageRef = projectStorage.ref(file.name);
      const collectionRef = projectFirestore.collection("images");
      storageRef.put(file).on(
        "state_changed",
        (snap) => {
          let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
          setProgress(percentage);
        },
        (err) => {
          setHookError(err);
        },
        async () => {
          const url = await storageRef.getDownloadURL();
          collectionRef.add({
            url: url,
            createdAt: timestamp(),
          });
          setUrl(url);
          setProgress(0);
        }
      );
    }
  }, [file]);
  // hook to save in firebase storage and firestore end

  // hook to retrive data from firebase start
  const [getDocs, setGetDocs] = useState([]);

  useEffect(() => {
    const unsub = projectFirestore
      .collection("images")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) =>
        setGetDocs(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            doc: doc.data(),
          }))
        )
      );
    return () => unsub();
  }, []);

  // hook to retrive data from firebase end

  const modalClose = (e) => {
    if (e.target.classList.contains("backdrop")) {
      setSelectedImg(null);
    }
  };
  
  return (
    <>
      <div className="title">
        <h1>FireGram</h1>
        <h2>Your Pictures</h2>
        <p>Photo gallery</p>
      </div>

      <form>
        <label>
          <input type="file" onChange={changeHandler} />
          <span>+</span>
        </label>
        <div className="output">
          {error && <div className="error">{error}</div>}
          {file && <div>{file.name}</div>}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: progress + "%" }}
            className="progress-bar"
          ></motion.div>
        </div>
      </form>

      <div className="img-grid">
        {getDocs.map((getDoc) => (
          <motion.div
            layout
            whileHover={{ opacity: 1 }}
            className="img-wrap"
            key={getDoc.id}
            onClick={() => setSelectedImg(getDoc.doc.url)}
          >
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              src={getDoc.doc.url}
              alt=""
            />
          </motion.div>
        ))}
      </div>

      {selectedImg && (
        <motion.div
          className="backdrop"
          onClick={modalClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.img
            initial={{ y: "-100vh" }}
            animate={{ y: 0 }}
            src={selectedImg}
            alt=""
          />
        </motion.div>
      )}
    </>
  );
}

export default UploadForm;
