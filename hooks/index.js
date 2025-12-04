const videoGrid = document.querySelector(".video-grid");

const videoFiles = [
    "hook-1.mp4",
    "hook-2.mp4",
    "hook-3.mp4",
    "hook-4.mp4",
    "hook-5.mp4",
];

function createVideoCard(videoFile) {
    const videoCard = document.createElement("div");
    videoCard.classList.add("video-card");

    const videoElement = document.createElement("video");
    videoElement.controls = true;
    videoElement.preload = "none";

    const sourceElement = document.createElement("source");
    sourceElement.src = `/hooks/${videoFile}`;
    sourceElement.type = "video/mp4";
    videoElement.appendChild(sourceElement);
    videoCard.appendChild(videoElement);

    return videoCard;
}

videoFiles.forEach((videoFile) => {
    const videoCard = createVideoCard(videoFile);
    videoGrid.appendChild(videoCard);
});
