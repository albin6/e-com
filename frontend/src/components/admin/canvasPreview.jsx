const TO_RADIANS = Math.PI / 180;

export async function canvasPreview(
  image,
  canvas,
  crop,
  scale = 1,
  rotate = 0
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Use devicePixelRatio for sharpness on retina displays
  const pixelRatio = window.devicePixelRatio;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // Apply the transformations in the correct order:
  ctx.translate(-cropX, -cropY); // Move the crop origin to the canvas origin (0,0)
  ctx.translate(centerX, centerY); // Move the origin to the center of the image
  ctx.rotate(rotateRads); // Rotate the image around the new origin
  ctx.scale(scale, scale); // Scale the image based on the user-defined scale
  ctx.translate(-centerX, -centerY); // Move the center of the image to the origin (0,0)

  // Draw the image on the canvas
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();
}
