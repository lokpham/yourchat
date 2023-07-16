import React from "react";
import {
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
  getDoc,
  collection,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { AiOutlineUserAdd, AiFillWarning } from "react-icons/ai";
import { useState, useEffect, useRef } from "react";
import { Tooltip } from "antd";
import InputChat from "./InputChat";
import Message from "./Message";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import defaultavatar from "../assets/defaultavatar.jpg";
import classNames from "classnames";
export default function ChatBox() {
  const { currentChat } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const chatboxRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isSendingRequest, setIsSendingRequest] = useState(
    currentChat.isSendRequest
  );
  const handleAddFriend = async () => {
    if (!isSendingRequest) {
      await updateDoc(doc(db, "users", currentChat.userinfor.id), {
        ["notifications." + currentUser.uid + ".type"]: "addfriend-request",
        ["notifications." + currentUser.uid + ".date"]: Timestamp.now(),
        ["notifications." + currentUser.uid + ".displayName"]:
          currentUser.displayName,
        ["notifications." + currentUser.uid + ".photoURL"]:
          currentUser.photoURL,
      });
      await updateDoc(doc(db, "conversations", currentUser.uid), {
        [currentChat.chatid + ".isSendRequest"]: true,
        [currentChat.chatid + ".date"]: serverTimestamp(),
      });
      console.log("send request!");
      setIsSendingRequest(true);
    } else {
      console.log("already send request!");
    }
  };
  useEffect(() => {
    const getData = () => {
      const unsub = onSnapshot(doc(db, "chats", currentChat.chatid), (doc) => {
        const data = doc.data().messages;
        setMessages(data);
      });
      return () => {
        unsub();
      };
    };
    currentChat.chatid && getData();
  }, [currentChat.chatid]);
  useEffect(()=>{
    setIsSendingRequest(currentChat.isSendRequest);
  },[currentChat.isSendRequest]);
  // useEffect(() => {
  //   if (chatboxRef.current) {
  //     chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  //   }
  // }, [chatboxRef.current]);
  const CheckAllowUser = ({ children }) => {
    if (!currentChat.chatid) {
      return (
        <div className="hidden smCT:w-[60%] md:w-[75%] h-full bg-sky-600 smCT:flex flex-col justify-center items-center">
          <div>
            {currentUser.photoURL ? (
              <img
                className="w-[100px] h-[100px] object-cover rounded-full shadow-lg"
                src={currentUser.photoURL}
                alt="avataruser"
              />
            ) : (
              <img
                className="w-[100px] h-[100px] object-cover rounded-full shadow-lg "
                src={defaultavatar}
                alt="avataruser"
              />
            )}
          </div>
          <p className="text-white text-[2rem]">
            Welcome {currentUser.displayName}
          </p>
        </div>
      );
    } else {
      return children;
    }
  };
  return (
    <>
      <CheckAllowUser>
        <div className="smCT:w-[60%] hidden md:w-[75%] grow h-full smCT:flex flex-col">
          <div className="shrink-0 text-white h-[67px] bg-sky-600 px-4 flex justify-between items-center">
            <h1 className="font-semibold text-[1.4rem]">
              {currentChat?.userinfor.displayName}
            </h1>
            <div className="text-[1.4rem] flex gap-4">
              {currentChat.isFriend == false && (
                <Tooltip placement="bottomLeft" title="Add friend">
                  <AiOutlineUserAdd
                    onClick={handleAddFriend}
                    className={classNames({
                      "cursor-pointer hover:opacity-[0.8]": !isSendingRequest,
                      "opacity-[0.7]": isSendingRequest,
                    })}
                  />
                </Tooltip>
              )}
            </div>
          </div>
          <div
            ref={chatboxRef}
            className="p-2 w-full grow overflow-y-auto messagesBox bg-slate-300"
          >
            {messages.map((message, i) => {
              return (
                <Message
                  key={i}
                  data={message}
                  owner={message.userinfor.id == currentUser.uid}
                />
              );
            })}
          </div>
          <InputChat />
        </div>
      </CheckAllowUser>
    </>
  );
}
