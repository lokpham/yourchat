import React from "react";
import {
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import { Tooltip } from "antd";
import InputChat from "../components/InputChat";
import Message from "../components/Message";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
export default function ChatBox() {
  const navigate = useNavigate();
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
    if (!currentChat.chatid) {
      navigate("/");
      return;
    } else {
      getData();
    }
  }, [currentChat.chatid]);
  useEffect(() => {
    setIsSendingRequest(currentChat.isSendRequest);
  }, [currentChat.isSendRequest]);
  // useEffect(() => {
  //   if (chatboxRef.current) {
  //     chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  //   }
  // }, [chatboxRef.current]);

  return (
    <div className=" grow h-screen flex flex-col">
      <div className="shrink-0 text-white h-[67px] bg-sky-600 px-4 flex justify-between items-center">
        <h1 className="font-semibold text-[1.4rem] flex justify-center items-center gap-2">
          <div>
            <BsArrowLeft onClick={() => navigate("/")} />
          </div>
          <p>{currentChat?.userinfor.displayName}</p>
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
        className="p-2 grow w-full overflow-y-auto messagesBox bg-slate-300"
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
  );
}
