import React, { useEffect, useState } from "react";
import { AiOutlineSearch, AiOutlineLoading3Quarters } from "react-icons/ai";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ChatItem_search from "./ChatItem_search";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
export default function Search() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const currentUser = useContext(AuthContext);
  const handleSearch = (e) => {
    // console.log(e.target.value);
    setValue(e.target.value);
  };
  useEffect(() => {
    const id = setTimeout(async () => {
      if (!value.trim()) {
        setData([]);
      } else {
        const q = query(
          collection(db, "users"),
          where("displayName", "==", value),
          
        );
        try {
          setLoading(true);
          const querySnapshot = await getDocs(q);
          // setData(querySnapshot);
          const newData = querySnapshot.docs.map(function (doc) {
            return doc.data();
          }).filter((data)=>{
            return data.id != currentUser.uid; 
          });
          
          setData(newData);
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      }
    }, 800);
    return () => {
      clearTimeout(id);
    };
  }, [value]);
  return (
    <div className="max-h-[50%] border-b-[1px] border-b-gray-200 pb-1 ">
      <div className="">
        <input
          value={value}
          onChange={handleSearch}
          className="w-full text-white bg-transparent outline-none  placeholder-white"
          type="text"
          placeholder="Find a user"
        />
      </div>
      <div className="listuser-search box-border py-2 h-[80%] overflow-y-auto ">
        {loading && (
          <AiOutlineLoading3Quarters className="text-[1.5rem] mx-auto text-white animate-spin" />
        )}
        {data.length > 0 && !loading
          ? data.map((user, i) => {
              return <ChatItem_search key={i} data={user} />;
            })
          : ""}
        {data.length < 1 && value != "" && !loading ? (
          <div className="text-center">Not found user</div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
