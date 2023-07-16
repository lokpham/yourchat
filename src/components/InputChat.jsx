import React from "react";
import {
  AiOutlineUserAdd,
  AiFillCloseCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { PiImageLight } from "react-icons/pi";
import { useState, useRef, useEffect } from "react";
import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../firebase";
import { Modal } from "antd";
export default function InputChat() {
  const [imagesPreview, setImagesPreview] = useState([]);
  const [uploadImages, setUploadImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { currentChat } = useContext(ChatContext);
  const [text, setText] = useState("");
  const textAreaRef = useRef(null);
  const resizeTextArea = () => {
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  };
  useEffect(resizeTextArea, [text]);
  const onChange = (e) => {
    setText(e.target.value);
  };
  const handleSend = async () => {
   
    if (text == "" && uploadImages.length == 0) {
      setIsModalOpen(true);
      return;
    }
    setLoading(true);
    if (uploadImages.length != 0) {
      const UploadSingleImage = (ref, image) => {
        return new Promise((resolve, reject) => {
          uploadBytes(ref, image).then((snapshot) => {
            getDownloadURL(ref).then((url) => {
              resolve(url);
            });
          });
        });
      };

      Promise.all(
        uploadImages.map((item) => {
          const storageRef = ref(storage, currentChat.chatid + item.file.name);
          return UploadSingleImage(storageRef, item.file);
        })
      ).then(async (urls) => {
        await updateDoc(doc(db, "chats", currentChat.chatid), {
          messages: arrayUnion({
            text: text,
            images: urls,
            date: Timestamp.now(),
            userinfor: {
              id: currentUser.uid,
              photoURL: currentUser.photoURL,
              displayName: currentUser.displayName,
            },
          }),
        });
      });
    } else {
      await updateDoc(doc(db, "chats", currentChat.chatid), {
        messages: arrayUnion({
          text: text,
          images: [],
          date: Timestamp.now(),
          userinfor: {
            id: currentUser.uid,
            photoURL: currentUser.photoURL,
            displayName: currentUser.displayName,
          },
        }),
      });
    }

    await updateDoc(doc(db, "conversations", currentUser.uid), {
      [currentChat.chatid + ".lastMessage"]: text,
      [currentChat.chatid + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "conversations", currentChat.userinfor.id), {
      [currentChat.chatid + ".lastMessage"]: text,
      [currentChat.chatid + ".date"]: serverTimestamp(),
    });
    setLoading(false);
    setText("");
    setUploadImage([]);
    setImagesPreview([]);
  };
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let listFileUrlPreview = [];
      let listFile = [];
      for (let index = 0; index < event.target.files.length; index++) {
        const element = event.target.files[index];
        let imgurl = URL.createObjectURL(element);
        listFileUrlPreview.push(imgurl);
        listFile.push({ file: element, urlFile: imgurl });
      }
      setImagesPreview([...imagesPreview, ...listFileUrlPreview]);
      setUploadImage(listFile);
    }
  };
  const dropImage = (value) => {
    const newArrayOfImagePreview = imagesPreview;
    const newArrayOfImageFile = uploadImages.filter((item) => {
      return item.urlFile != value;
    });
    const index = imagesPreview.indexOf(value);
    if (index > -1) {
      // only splice array when item is found
      newArrayOfImagePreview.splice(index, 1); // 2nd parameter means remove one item only
    }
    setImagesPreview([...newArrayOfImagePreview]);
    setUploadImage(newArrayOfImageFile);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-2 flex w-full bg-white shadow-xl border-t-[1px] box-border">
      <div className="relative w-full items-center ">
        <textarea
          className=" block chat_input max-h-[150px] outline-none w-[80%] resize-none overflow-y-auto "
          placeholder="Type something..."
          name=""
          id=""
          onChange={onChange}
          value={text}
          ref={textAreaRef}
          rows="1"
        ></textarea>
        {imagesPreview.length > 0 ? (
          <p className="border-t-[1px] border-t-gray-400 font-semibold">
            Total: {imagesPreview.length}
          </p>
        ) : (
          ""
        )}

        <div className="images_chat_upload max-h-[200px] overflow-y-auto py-4 flex gap-2 flex-wrap w-[80%]">
          {imagesPreview &&
            imagesPreview.map((item, i) => {
              return (
                <div key={i} className="relative">
                  <img
                    className=" w-[120px] h-[120px] object-cover rounded-sm border-[1px] border-gray-400"
                    src={item}
                    alt="img_chat"
                  ></img>
                  <AiFillCloseCircle
                    onClick={() => {
                      dropImage(item);
                    }}
                    className="text-gray-500 hover:text-blue-400 cursor-pointer absolute right-2 top-2 text-[1.4rem]"
                  />
                </div>
              );
            })}
        </div>
      </div>
      <div className="flex gap-4 items-center ">
        <input
          accept="image/png, image/jpeg"
          className="hidden"
          type="file"
          id="file"
          multiple={true}
          onChange={onImageChange}
        />
        <label htmlFor="file">
          <PiImageLight className="text-[1.4rem] cursor-pointer " />
        </label>
        <button
          onClick={handleSend}
          className="p-1 w-[60px] text-[1rem] bg-sky-700 text-white rounded-sm"
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin mx-auto " />
          ) : (
            <span>SEND</span>
          )}
        </button>
      </div>
      <Modal
        footer={false}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Type somthing</p>
      </Modal>
    </div>
  );
}
