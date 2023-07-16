import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineUpload } from "react-icons/ai";
import { useState } from "react";
import { auth, storage, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { AiOutlineLoading3Quarters, AiFillWarning } from "react-icons/ai";
import { Modal } from "antd";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const displayname = e.target[0].value.trim();
    const email = e.target[1].value.trim();
    const password = e.target[2].value.trim();
    const file = e.target[3].files[0];

    if (
      email == "" ||
      password == "" ||
      displayname == "" ||
      file == undefined
    ) {
      setErrorMessage("Missing information");
      setIsModalOpen(true);
      return;
    }

    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, displayname);
      const UploadSingleImage = (ref, image) => {
        uploadBytes(ref, image).then((snapshot) => {
          getDownloadURL(ref).then(async (url) => {
            await updateProfile(res.user, {
              displayName: displayname,
              photoURL: url,
            });
            await setDoc(doc(db, "users", res.user.uid), {
              displayName: displayname,
              id: res.user.uid,
              email: email,
              photoURL: url,
              notifications: {},
            });
            await setDoc(doc(db, "conversations", res.user.uid), {});
            setLoading(false);
            navigate("/");
          });
        });
      };
      UploadSingleImage(storageRef, file);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      if (errorCode == "auth/invalid-email") {
        setErrorMessage("Email is not valid");
        setIsModalOpen(true);
        setLoading(false);
      }
      if (errorCode == "auth/wrong-password") {
        setErrorMessage("Wrong password");
        setIsModalOpen(true);
        setLoading(false);
      }
      if (errorCode == "auth/too-many-requests") {
        setErrorMessage("Too many requests");
        setIsModalOpen(true);
        setLoading(false);
      }
      if (errorCode == "auth/weak-password") {
        setErrorMessage("Your password is weak");
        setIsModalOpen(true);
        setLoading(false);
      }
    }
  };
  const [image, setImage] = useState(null);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const imgUrl = URL.createObjectURL(event.target.files[0]);
      console.log(imgUrl);
      setImage(imgUrl);
    }
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-blue-200">
      <form
        className="flex gap-4 flex-col  w-[340px] sm:w-[400px] px-6 py-4 bg-white rounded-xl"
        action="post"
        onSubmit={onSubmit}
      >
        <h1 className="text-blue-400 text-center text-[1.8rem]">REGISTER</h1>
        <input
          className="border-gray-400 p-1 rounded-md focus:border-blue-500 outline-none border-[1px] "
          type="text"
          placeholder="Your displayname"
        />
        <input
          className="border-gray-400 p-1 rounded-md focus:border-blue-500 outline-none border-[1px] "
          type="email"
          placeholder="Your email"
        />
        <input
          className="border-gray-400 p-1 rounded-md focus:border-blue-500 outline-none border-[1px] "
          type="password"
          placeholder="Your password"
        />
        <div>
          <input
            className="hidden"
            type="file"
            id="file"
            onChange={onImageChange}
          />
          <label
            className="text-black cursor-pointer mb-2 block"
            htmlFor="file"
          >
            <AiOutlineUpload className="bg-gray-300 rounded-lg p-2 align-middle inline text-[2rem] mr-2" />
            Add an avatar
          </label>
          {image && (
            <img
              className="w-[100px] h-[100px] object-cover"
              src={image}
              alt="img"
            />
          )}
        </div>
        <button className="flex justify-center items-center h-[40px] hover:opacity-[1] w-full text-[1.1rem]  bg-blue-400 opacity-[0.8]  rounded-lg text-white mx-auto">
          {loading ? (
            <AiOutlineLoading3Quarters className="mx-auto animate-spin" />
          ) : (
            "Sign up"
          )}
        </button>
        <p className="text-center text-black ">
          You do have an account?{" "}
          <Link className="text-blue-500 underline" to={"/login"}>
            Login
          </Link>
        </p>
      </form>
      <Modal
        footer={false}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <AiFillWarning className="text-red-400 text-[1.2rem] inline mr-4" />
          <span className="align-middle">{errorMessage}</span>
        </div>
      </Modal>
    </div>
  );
}
