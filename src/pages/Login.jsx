import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { AiOutlineLoading3Quarters, AiFillWarning } from "react-icons/ai";
import { useState } from "react";
import { Modal } from "antd";

export default function Login() {
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

    const email = e.target[0].value.trim();
    const password = e.target[1].value.trim();
    if (email == "" && password == "") {
      setErrorMessage("Email and password are empty");
      setIsModalOpen(true);
      return;
    }
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        if (errorCode == "auth/invalid-email") {
          setErrorMessage("Email is not valid");
          setIsModalOpen(true);
        }
        if (errorCode == "auth/wrong-password") {
          setErrorMessage("Wrong password");
          setIsModalOpen(true);
        }
        if (errorCode == "auth/too-many-requests") {
          setErrorMessage("Too many requests");
          setIsModalOpen(true);
        }
        setLoading(false);
      });
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-blue-200">
      <form
        className="flex gap-4 flex-col  w-[340px] sm:w-[400px] px-6 py-4 bg-white rounded-xl"
        action="post"
        onSubmit={onSubmit}
      >
        <h1 className="text-blue-400 text-center text-[1.8rem]">LOGIN</h1>
        <input
          className="border-gray-400 p-1 rounded-md focus:border-blue-500 outline-none border-[1px] "
          type="text"
          placeholder="Your email"
        />
        <input
          className="border-gray-400 p-1 rounded-md focus:border-blue-500 outline-none border-[1px] "
          type="password"
          placeholder="Your password"
        />
        <button className="flex justify-center items-center h-[40px] hover:opacity-[1] w-full text-[1.1rem]  bg-blue-400 opacity-[0.8]  rounded-lg text-white mx-auto">
          {loading ? (
            <AiOutlineLoading3Quarters className="mx-auto animate-spin" />
          ) : (
            "Sign in"
          )}
        </button>
        <p className="text-center text-black ">
          You don't have an account?{" "}
          <Link className="text-blue-500 underline" to={"/register"}>
            Register
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
