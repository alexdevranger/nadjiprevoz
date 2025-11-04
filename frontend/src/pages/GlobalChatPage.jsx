import React, { useRef } from "react";
import GlobalChatWidget from "../components/GlobalChatWidget";

const GlobalChatPage = () => {
  const targetRef = useRef(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GlobalChatWidget />
        {/* Target element
        <div
          ref={targetRef}
          className="target"
          style={{
            width: "200px",
            height: "200px",
            backgroundColor: "#3B82F6",
            borderRadius: "8px",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            position: "absolute",
            left: "0px",
            top: "0px",
          }}
        >
          Pomakni me!
        </div> */}

        {/* Moveable komponenta */}
        {/* <Moveable
          target={targetRef.current}
          draggable={true}
          resizable={true}
          scalable={true}
          rotatable={false}
          origin={true}
          keepRatio={false}
          onDrag={({ target, left, top }) => {
            target.style.left = `${left}px`;
            target.style.top = `${top}px`;
          }}
          onResize={({ target, width, height, delta }) => {
            if (delta[0]) target.style.width = `${width}px`;
            if (delta[1]) target.style.height = `${height}px`;
          }}
          onScale={({ target, transform }) => {
            target.style.transform = transform;
          }}
        /> */}
      </div>
    </div>
  );
};

export default GlobalChatPage;
