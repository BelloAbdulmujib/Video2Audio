from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from moviepy.editor import VideoFileClip
import uuid
import os
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Video to Audio Converter API")

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


@app.post("/convert")
async def convert_video_to_audio(file: UploadFile = File(...)):
    # Generate filenames
    video_id = str(uuid.uuid4())
    video_path = f"{UPLOAD_DIR}/{video_id}_{file.filename}"
    audio_path = f"{OUTPUT_DIR}/{video_id}.mp3"

    # Save uploaded video
    with open(video_path, "wb") as buffer:
        buffer.write(await file.read())

    # Convert video to audio
    video_clip = VideoFileClip(video_path)
    audio_clip = video_clip.audio
    audio_clip.write_audiofile(audio_path)

    # Release resources
    audio_clip.close()
    video_clip.close()

    return {
        "message": "Conversion successful",
        "audio_id": video_id,
        "download_url": f"/download/{video_id}"
    }


@app.get("/download/{audio_id}")
def download_audio(audio_id: str):
    audio_file = f"{OUTPUT_DIR}/{audio_id}.mp3"

    if not os.path.exists(audio_file):
        return {"error": "File not found"}

    return FileResponse(
        path=audio_file,
        media_type="audio/mpeg",
        filename=f"{audio_id}.mp3"
    )
