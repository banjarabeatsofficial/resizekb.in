const imageInput = document.getElementById("imageInput");
const resizeBtn = document.getElementById("resizeBtn");
const targetSize = document.getElementById("targetSize");

const result = document.getElementById("result");
const originalSize = document.getElementById("originalSize");
const targetOutput = document.getElementById("targetOutput");
const newSize = document.getElementById("newSize");
const statusText = document.getElementById("statusText");
const preview = document.getElementById("preview");
const downloadBtn = document.getElementById("downloadBtn");

resizeBtn.addEventListener("click", function () {
  const file = imageInput.files[0];

  if (!file) {
    alert("Please select image");
    return;
  }

  const targetKB = Number(targetSize.value);
  originalSize.textContent = (file.size / 1024).toFixed(2) + " KB";
  targetOutput.textContent = targetKB + " KB";

  const reader = new FileReader();

  reader.onload = function (e) {
    const img = new Image();

    img.onload = function () {
      compressImage(img, targetKB);
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

function compressImage(img, targetKB) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  let width = img.width;
  let height = img.height;

  const maxWidth = 1600;

  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  let bestImage = null;
  let bestSize = 0;

  for (let quality = 0.95; quality >= 0.05; quality -= 0.01) {
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    const size = getDataUrlSize(dataUrl);

    if (size <= targetKB * 1024) {
      bestImage = dataUrl;
      bestSize = size;
      break;
    }
  }

  if (!bestImage) {
    alert("This image cannot be resized to this size. Try higher KB.");
    return;
  }

  preview.src = bestImage;
  downloadBtn.href = bestImage;
  downloadBtn.download = "resizekb-under-" + targetKB + "kb.jpg";
  downloadBtn.style.display = "inline-block";

  newSize.textContent = (bestSize / 1024).toFixed(2) + " KB";
  statusText.textContent = "✅ Successfully resized under " + targetKB + "KB";

  result.style.display = "block";
}

function getDataUrlSize(dataUrl) {
  const base64 = dataUrl.split(",")[1];
  return Math.round((base64.length * 3) / 4);
}
