import React from "react";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { AiOutlineLoading3Quarters, AiFillWarning } from "react-icons/ai";
import { Modal } from "antd";
import { db } from "../firebase";
export default function ChatItem_search({ data }) {
  const { currentUser } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState({ state: false, message: "" });
  const handleOk = () => {
    setIsModalOpen({
      state: false,
      message: "",
    });
  };
  const handleCancel = () => {
    setIsModalOpen({ state: false, message: "" });
  };
  const handleSelect = async () => {
    const combineId =
      data.id > currentUser.uid
        ? data.id + currentUser.uid
        : currentUser.uid + data.id;
    if (data.id == currentUser.uid) {
      setIsModalOpen({
        state: true,
        message: "It you",
      });
      return;
    }
    try {
      const docRef = doc(db, "chats", combineId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setIsModalOpen({state:true,message:"This user already have a conversation"});
      } else {
        // docSnap.data() will be undefined in this case

        // Add a new document in collection "cities"
        await setDoc(doc(db, "chats", combineId), {
          messages: [],
        });
        // To update age and favorite color:
        await updateDoc(doc(db, "conversations", currentUser.uid), {
          [combineId]: {
            userinfor: {
              displayName: data.displayName,
              photoURL: data.photoURL,
              id: data.id,
            },
            isFriend: false,
            isSendRequest: false,
            lastMessage: "",
            date: serverTimestamp(),
          },
        });
        await updateDoc(doc(db, "conversations", data.id), {
          [combineId]: {
            userinfor: {
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              id: currentUser.uid,
            },
            lastMessage: "",
            isFriend: false,
            isSendRequest: false,

            date: serverTimestamp(),
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div
        onClick={handleSelect}
        className="box-border w-full flex gap-2 items-center rounded-lg cursor-pointer hover:bg-sky-600 p-2"
      >
        <img
          className="w-[60px] h-[60px] object-cover rounded-full shrink-0"
          src={data.photoURL}
          alt="friend-avatar"
          loading="lazy"
        />
        <div className="w-[70%]">
          <p className="font-semibold">{data.displayName}</p>
          <p className="text-gray-100 truncate text-ellipsis w-[90%]">
            {data?.lastMessage}
          </p>
        </div>
      </div>
      <Modal
        footer={false}
        open={isModalOpen.state}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <AiFillWarning className="text-red-400 text-[1.2rem] inline mr-4" />
          <span className="align-middle">
            {isModalOpen.message}
          </span>
        </div>
      </Modal>
    </>
  );
}
