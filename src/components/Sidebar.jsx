import React, { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaSortDown } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import ListConversation from "./ListConversation";
import Search from "./Search";
import { ChatContext } from "../context/ChatContext";
import { useContext } from "react";
import defaultavatar from "../assets/defaultavatar.jpg";
import Notification from "./Notification";


export default function Sidebar() {
  const { dispatch } = useContext(ChatContext);
  const [isSort, setIsSort] = useState(false);
  const [sortState, setSortState] = useState({
    friend: true,
    stranger: true,
  });
  const { currentUser } = useContext(AuthContext);
  const handleSignout = () => {
    signOut(auth)
      .then(() => {
        dispatch({
          type: "change_user",
          payload: { userinfor: {}, chatid: "" },
        });
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };
  
  return (
    <div className="shrink-0 flex flex-col w-full smCT:w-[40%] md:w-[25%] bg-sky-900 text-white h-screen">
      <div className=" flex justify-between flex-wrap  items-center  h-[67px] px-4">
        <h4 className="block text-[1.4rem] font-semibold">
          YourChat
        </h4>
        <div className=" flex items-center gap-2">
          {currentUser.photoURL ? (
            <img
              className="w-[35px] h-[35px] object-cover inline rounded-full"
              src={currentUser?.photoURL}
              alt="useravatar"
              loading="lazy"
            />
          ) : (
            <img
              className="w-[35px] h-[35px] object-cover inline rounded-full"
              src={defaultavatar}
              alt="useravatar"
              loading="lazy"
            />
          )}

          <span className="text-[0.9rem]">{currentUser?.displayName}</span>
          <button
            onClick={handleSignout}
            className=" text-[0.9rem] p-1 bg-sky-700 rounded-xl"
          >
            Log out
          </button>
        </div>
      </div>
      <div className="sidebarunder flex flex-col justify-between  bg-sky-700 box-border pt-4 px-2">
        <Notification />
        <Search></Search>
        <div
          onClick={() => {
            setIsSort(!isSort);
          }}
          className="bg-sky-800 p-2 cursor-pointer hover:opacity-[0.8]"
        >
          <div className="flex items-center justify-between">
            <p>Filter  </p>
            <FaSortDown className="block  text-[1.2rem]" />
          </div>
        </div>
        {isSort && (
          <div className="bg-sky-800 p-2">
            <div className="select-none">
              <input
                onChange={() => {
                  setSortState({ ...sortState, friend: !sortState.friend });
                }}
                checked={sortState.friend}
                className="mr-2"
                type="checkbox"
                name=""
                id="friend"
              />
              <label htmlFor="friend">Friend</label>
            </div>
            <div className="select-none">
              <input
                onChange={() => {
                  setSortState({ ...sortState, stranger: !sortState.stranger });
                }}
                checked={sortState.stranger}
                className="mr-2"
                type="checkbox"
                name=""
                id="stranger"
              />
              <label htmlFor="stranger">Stranger</label>
            </div>
          </div>
        )}
        <ListConversation
          sortState={sortState}
        ></ListConversation>
      </div>
    </div>
  );
}
