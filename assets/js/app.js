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

  const reader = new FileReader();

  reader.onload = function (e) {

    preview.src = e.target.result;

    originalSize.textContent =
      (file.size / 1024).toFixed(2) + " KB";

    targetOutput.textContent =
      targetSize.value + " KB";

    newSize.textContent =
      "Demo Mode";

    statusText.textContent =
      "✅ Button Working Successfully";

    downloadBtn.href = e.target.result;

    result.style.display = "block";

  };

  reader.readAsDataURL(file);

});
