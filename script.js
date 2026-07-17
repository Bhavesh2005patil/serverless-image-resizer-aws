const BUCKET_NAME = "serverless-image-resizer-demo-1";
const REGION = "ap-south-1";

const imageInput = document.getElementById("imageInput");
const browseBtn = document.getElementById("browseBtn");
const uploadBtn = document.getElementById("uploadBtn");

const previewImage = document.getElementById("previewImage");

const progressContainer =
    document.querySelector(".progress-container");

const progressBar =
    document.getElementById("progressBar");

const statusText =
    document.getElementById("status");

const downloadBtn =
    document.getElementById("downloadBtn");

const dropArea =
    document.getElementById("dropArea");

let selectedFile = null;

browseBtn.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", (e) => {
    selectedFile = e.target.files[0];

    if(selectedFile){
        showPreview(selectedFile);
    }
});

dropArea.addEventListener("dragover",(e)=>{
    e.preventDefault();
    dropArea.style.borderColor="#00e5ff";
});

dropArea.addEventListener("dragleave",()=>{
    dropArea.style.borderColor=
        "rgba(255,255,255,0.5)";
});

dropArea.addEventListener("drop",(e)=>{
    e.preventDefault();

    selectedFile = e.dataTransfer.files[0];

    if(selectedFile){
        showPreview(selectedFile);
    }
});

function showPreview(file){

    const reader = new FileReader();

    reader.onload = function(e){
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
    };

    reader.readAsDataURL(file);
}

uploadBtn.addEventListener(
    "click",
    async ()=>{

        if(!selectedFile){
            alert("Please select an image.");
            return;
        }

        statusText.innerHTML =
            "Uploading image...";

        progressContainer.style.display =
            "block";

        progressBar.style.width = "20%";

        const uploadUrl =
`https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/uploads/${selectedFile.name}`;

        try{

            await fetch(uploadUrl,{
                method:"PUT",
                body:selectedFile,
                headers:{
                    "Content-Type":
                        selectedFile.type
                }
            });

            progressBar.style.width = "60%";

            statusText.innerHTML =
                "Processing image using AWS Lambda...";

            setTimeout(()=>{

                progressBar.style.width="100%";

                const resizedUrl =
`https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/resized/${selectedFile.name}`;

                downloadBtn.href =
                    resizedUrl;

                downloadBtn.style.display =
                    "inline-block";

                statusText.innerHTML =
                    "✅ Image resized successfully.";

            },5000);

        }
        catch(error){

            console.error(error);

            statusText.innerHTML =
                "❌ Upload failed.";
        }

});