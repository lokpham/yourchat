import React from "react";
import { createContext, useReducer } from "react";

export const ChatContext = createContext();
export function ChatContextProvider({ children }) {
  const initial_state = {
    chatid: "",
    userinfor: {},
    isFriend: false,
    isSendRequest:false
  };
  const chatReducer = (state, action) => {
    switch (action.type) {
      case "change_user":
        return {
          userinfor: action.payload.userinfor,
          chatid: action.payload.chatid,
          isFriend: action.payload.isFriend,
          isSendRequest:action.payload.isSendRequest,
        };

        break;

      default:
        break;
    }
  };
  const [state, dispatch] = useReducer(chatReducer, initial_state);
  return (
    <ChatContext.Provider value={{ currentChat: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}
