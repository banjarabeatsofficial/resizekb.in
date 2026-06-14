const imageInput = document.getElementById("imageInput");
const targetSize = document.getElementById("targetSize");
const resizeBtn = document.getElementById("resizeBtn");

const result = document.getElementById("result");
const originalSize = document.getElementById("originalSize");
const newSize = document.getElementById("newSize");

const preview = document.getElementById("preview");
const downloadBtn = document.getElementById("downloadBtn");

result.style.display = "none";

resizeBtn.addEventListener("click", () => {

const file = imageInput.files[0];

if(!file){
alert("Select Image");
return;
}

originalSize.textContent =
(file.size/1024).toFixed(2)+" KB";

const reader = new FileReader();

reader.onload = function(e){

preview.src = e.target.result;

newSize.textContent =
"Target: "+targetSize.value+" KB";

downloadBtn.href = e.target.result;

downloadBtn.download =
"resizekb-image.jpg";

result.style.display = "block";

};

reader.readAsDataURL(file);

});
