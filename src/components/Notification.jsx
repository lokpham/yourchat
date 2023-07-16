import React from "react";
import { AiOutlineMail, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { Modal } from "antd";
import { useState, useEffect, useContext } from "react";
import {
  doc,
  onSnapshot,
  updateDoc,
  deleteField,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
export default function Notification() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { currentChat } = useContext(ChatContext);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const getUserNotification = () => {
      const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
        const data = doc.data();

        setNotifications(Object.entries(data.notifications));
      });
      return () => {
        unsub();
      };
    };
    currentUser.uid && getUserNotification();
  }, [currentUser.uid]);
  const handleRequest = async (type, id) => {
    const combineId =
      id > currentUser.uid ? id + currentUser.uid : currentUser.uid + id;
    if (type == "accept") {
      await updateDoc(doc(db, "conversations", currentUser.uid), {
        [combineId + ".isFriend"]: true,
        [combineId + ".date"]: serverTimestamp(),
      });
      await updateDoc(doc(db, "conversations", id), {
        [combineId + ".isFriend"]: true,
        [combineId + ".date"]: serverTimestamp(),
      });
      console.log("accept!");
    }
    if (type == "deny") {
      console.log("deny!");

      await updateDoc(doc(db, "conversations", id), {
        [combineId + ".isSendRequest"]: false,
        [combineId + ".date"]: serverTimestamp(),
      });
    }
    await updateDoc(doc(db, "users", currentUser.uid), {
      ["notifications." + id]: deleteField(),
    });
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      {notifications.length == 0 ? (
        ""
      ) : (
        <>
          <div
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="bg-gray-200 mb-2 cursor-pointer hover:opacity-[0.8] text-black flex justify-center items-center gap-2"
          >
            <AiOutlineMail className="text-[1.2rem]" />
            <p>({notifications.length})</p>
          </div>
          <Modal
            title="Notification"
            footer={false}
            onCancel={handleCancel}
            open={isModalOpen}
          >
            {notifications.map((notification, i) => {
              console.log(notification);
              return (
                <div
                  key={notification[0]}
                  className="flex gap-2 items-center mb-2"
                >
                  <img
                    className="object-cover w-[40px] h-[40px] rounded-full shadow-md "
                    src={notification[1].photoURL}
                    alt={notification[1].displayName}
                  />
                  <p>{notification[1].displayName}</p>
                  <div>
                    <AiOutlineCheck
                      onClick={() => handleRequest("accept", notification[0])}
                      className="inline-block mr-1 cursor-pointer hover:text-green-400 text-[1.5rem]"
                    />
                    <AiOutlineClose
                      onClick={() => handleRequest("deny", notification[0])}
                      className="inline-block mr-1 cursor-pointer hover:text-red-400 text-[1.5rem]"
                    />
                  </div>
                </div>
              );
            })}
          </Modal>
        </>
      )}
    </>
  );
}
