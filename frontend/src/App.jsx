import { useState } from "react";
import axios from "axios";

function App() {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleConvert = async () => {
    if (!video) {
      alert("Please upload a video file");
      return;
    }

    const formData = new FormData();
    formData.append("file", video);

    try {
      setLoading(true);
      setMessage("Converting...");

      const response = await axios.post(
        "http://127.0.0.1:8000/convert",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const downloadUrl = `http://127.0.0.1:8000${response.data.download_url}`;

      // Auto-download audio
      window.location.href = downloadUrl;

      setMessage("Conversion completed!");
    } catch (error) {
      console.error(error);
      setMessage("Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎬 Video to Audio Converter</h1>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files[0])}
        style={styles.input}
      />

      <button onClick={handleConvert} style={styles.button} disabled={loading}>
        {loading ? "Processing..." : "Convert to Audio"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "#fff",
  },
  title: {
    marginBottom: "20px",
  },
  input: {
    marginBottom: "15px",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#22c55e",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default App;
