import { Routes, Route, BrowserRouter, Link, Navigate,HashRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import Chat from "./pages/Chat";

function App() {
  const {currentUser} = useContext(AuthContext);
  const ProtectedRoute = ({children})=>{
    if(!currentUser){
      
      return <Navigate to={"/login"} ></Navigate>
    }
    return children;
  }
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/chat/:displayName/:idchat" element={<Chat />}></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
