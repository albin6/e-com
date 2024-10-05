import React, { useState, useRef } from "react";
import { PixelCrop } from "react-image-crop";
import { canvasPreview } from "./canvasPreview";

let previewUrl = "";

function toBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve);
  });
}

export async function imgPreview(image, crop, scale = 1, rotate = 0) {
  const canvas = document.createElement("canvas");
  canvasPreview(image, canvas, crop, scale, rotate);

  const blob = await toBlob(canvas);

  if (!blob) {
    console.error("Failed to create blob");
    return "";
  }

  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }

  previewUrl = URL.createObjectURL(blob);
  return previewUrl;
}

const ImageCropper = () => {
  const [imgSrc, setImgSrc] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const imgRef = useRef(null);
  const cropRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImgSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCropChange = async () => {
    if (imgRef.current && cropRef.current) {
      const preview = await imgPreview(imgRef.current, cropRef.current);
      setPreviewSrc(preview);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imgSrc && (
        <img
          ref={imgRef}
          src={imgSrc}
          alt="Source"
          style={{ maxWidth: "100%", marginTop: "10px" }}
        />
      )}
      <button onClick={handleCropChange}>Generate Crop Preview</button>
      {previewSrc && (
        <div>
          <img src={previewSrc} alt="Crop preview" />
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
