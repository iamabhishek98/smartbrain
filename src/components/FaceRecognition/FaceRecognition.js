import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ box, imageUrl }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img
          id="inputImage"
          alt=""
          src={imageUrl}
          width="500 px"
          height="auto"
        />
        <div
          className="bounding-box"
          style={{
            left: box.leftCol,
            top: box.topRow,
            right: box.rightCol,
            bottom: box.bottomRow,
          }}
        ></div>
      </div>
    </div>
  );
};

export default FaceRecognition;
