import React, { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function ListConversation({ sortState }) {
  const { currentUser } = useContext(AuthContext);
  const [Chats, setChats] = useState({});
  const [loading, setLoad] = useState(false);
  useEffect(() => {
    const getData = () => {
      setLoad(true);
      const unsub = onSnapshot(
        doc(db, "conversations", currentUser.uid),
        (doc) => {
          const data = doc.data();
          setChats(data);
          setLoad(false);

        }
      );
      return () => {
        unsub();
      };
    };
    currentUser.uid && getData();
  }, [currentUser.uid]);
  return (
    <div className="chatitems grow relative  py-2 overflow-y-auto flex flex-col ">
      {/* {Chats?.map((chat,i) => {
        return <ChatItem key={i} chatid={chat.id} data={chat.userinfor} />;
      })} */}
      {!loading ? (
        Object.entries(Chats)
          .sort((a, b) => {
            return b[1].date - a[1].date;
          })
          .filter((chat) => {
            if(sortState.friend && sortState.stranger){
              return true;
            }
            if(sortState.friend && !sortState.stranger){
              return chat[1].isFriend == true;
            }
            if (!sortState.friend && sortState.stranger)
              return chat[1].isFriend == false;
          })
          .map((chat) => {
            return (
              <ChatItem
                key={chat[0]}
                chatid={chat[0]}
                lastMessage={chat[1].lastMessage}
                data={chat[1].userinfor}
                isFriend={chat[1].isFriend}
                isSendRequest={chat[1].isSendRequest}
              />
            );
          })
      ) : (
        <div
          className="absolute left-[50%] top-[50%] translate-x-[-50%]
        translate-y-[-50%]"
        >
          <AiOutlineLoading3Quarters className="animate-spin  text-white text-[5rem]" />
        </div>
      )}
    </div>
  );
}
