import React from "react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Image } from "antd";
import { BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
export default function ChatItem({
  data,
  chatid,
  lastMessage,
  isFriend,
  isSendRequest,
}) {
  const navigate = useNavigate();
  const { dispatch, currentChat } = useContext(ChatContext);

  const handleSelect = () => {
    if (window.innerWidth < 720) {
      dispatch({
        type: "change_user",
        payload: {
          userinfor: data,
          chatid: chatid,
          isFriend: isFriend,
          isSendRequest: isSendRequest,
        },
      });
      navigate(`/chat/${data.displayName}/${data.id}`);
    }
    if (chatid != currentChat.chatid) {
      dispatch({
        type: "change_user",
        payload: {
          userinfor: data,
          chatid: chatid,
          isFriend: isFriend,
          isSendRequest: isSendRequest,
        },
      });
    }
  };
  return (
    <div
      onClick={handleSelect}
      className="box-border w-full flex gap-2 items-center rounded-lg cursor-pointer hover:bg-sky-600 p-2 relative"
    >
      {/* <Image
        src={data?.photoURL}
        alt="friend-avatar"
        preview={false}
        width={60}
        height={60}
        className="object-cover rounded-full shrink-0"
      /> */}
      <img
        src={data?.photoURL}
        className="w-[60px] h-[60px] object-cover rounded-full shrink-0"
        alt=""
      />
      <div className="w-[65%] shrink">
        <p className="font-semibold">{data?.displayName}</p>
        <p className="text-gray-100 truncate text-ellipsis w-[85%]">
          {lastMessage}
        </p>
      </div>
    </div>
  );
}
