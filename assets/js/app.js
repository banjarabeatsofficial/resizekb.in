document.addEventListener("DOMContentLoaded", function () {
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

  if (!imageInput || !resizeBtn || !targetSize) {
    alert("HTML id missing. Check imageInput, resizeBtn, targetSize.");
    return;
  }

  if (result) result.style.display = "none";

  resizeBtn.addEventListener("click", function () {
    const file = imageInput.files[0];

    if (!file) {
      alert("Please select image first");
      return;
    }

    const targetKB = Number(targetSize.value);

    originalSize.textContent = (file.size / 1024).toFixed(2) + " KB";
    targetOutput.textContent = targetKB + " KB";
    statusText.textContent = "Processing...";

    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();

      img.onload = function () {
        processImage(img, targetKB);
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });

  function processImage(img, targetKB) {
    let width = img.width;
    let height = img.height;

    let scale = 1;
    let finalBlob = null;

    const tryCompress = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      let quality = 0.92;

      const compressLoop = () => {
        canvas.toBlob(function (blob) {
          if (!blob) {
            alert("Compression failed.");
            return;
          }

          if (blob.size <= targetKB * 1024) {
            finalBlob = blob;
            showResult(blob);
            return;
          }

          quality -= 0.08;

          if (quality > 0.08) {
            compressLoop();
          } else {
            scale -= 0.1;

            if (scale > 0.2) {
              tryCompress();
            } else {
              alert("This image cannot be compressed to selected size. Try higher KB.");
            }
          }
        }, "image/jpeg", quality);
      };

      compressLoop();
    };

    tryCompress();
  }

  function showResult(blob) {
    const url = URL.createObjectURL(blob);

    preview.src = url;
    downloadBtn.href = url;
    downloadBtn.download = "resizekb-image.jpg";

    newSize.textContent = (blob.size / 1024).toFixed(2) + " KB";
    statusText.textContent = "✅ Successfully resized";

    result.style.display = "block";
  }
});
