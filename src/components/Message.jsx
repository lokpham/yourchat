import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import { Image } from "antd";
export default function Message({ data, owner }) {
  const messRef = useRef(null);
  useEffect(() => {
    messRef.current?.scrollIntoView();
  }, []);
  return (
    <div
      ref={messRef}
      className={classNames({
        "w-[80%] flex items-start gap-4 my-10": true,
        "flex-row": !owner,
        "flex-row-reverse ml-auto": owner,
      })}
    >
      <div className="shrink-0">
        <img
          className="w-[40px] h-[40px] rounded-full object-cover "
          src={data.userinfor.photoURL}
          alt="messageInfor-avatar"
        />
      </div>
      <div
        className={classNames({
          "flex flex-col gap-2 w-full": true,
          "items-end": owner,
          "items-start": !owner,
        })}
      >
        {data.text && (
          <p
            className={classNames({
              "max-w-[70%] overflow-hidden break-words p-2 ": true,
              "bg-blue-500 text-white rounded-tl-md rounded-br-lg rounded-bl-lg":
                owner,
              "bg-white text-black rounded-tr-md rounded-br-lg rounded-bl-lg":
                !owner,
            })}
          >
            {data.text}
          </p>
        )}
        {data.images.length > 0 ? (
          <Image.PreviewGroup>
            {data.images.map((url, i) => {
              return (
                <Image
                  key={i}
                  src={url}
                  rootClassName="w-[60%] shadow-md inline-block"
                 
                />
              );
            })}
          </Image.PreviewGroup>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
