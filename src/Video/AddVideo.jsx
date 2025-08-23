import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

// Adjust to your backend
const API = "http://localhost:4000";

function AddVideo() {
  const { chapterId: chapterIdParam } = useParams();
  const navigate = useNavigate();

  const [chapterId, setChapterId] = useState(chapterIdParam || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoSerial, setVideoSerial] = useState("");
  const [url, setUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Optional: fetch chapter info to show a header (nice UX)
  const [chapterName, setChapterName] = useState("");
  useEffect(() => {
    const fetchChapter = async () => {
      try {
        if (chapterIdParam) {
          const res = await axios.get(`${API}/api/chapters/${chapterIdParam}`);
          setChapterName(res.data?.name || "");
        }
      } catch {
        // ignore
      }
    };
    fetchChapter();
  }, [chapterIdParam]);

  const validate = () => {
    if (!chapterId) return "Chapter ID is required.";
    if (!title.trim()) return "Title is required.";
    if (!url.trim()) return "Video URL is required.";
    // Very light URL check
    try {
      new URL(url);
    } catch {
      return "Please provide a valid URL.";
    }
    if (videoSerial !== "" && Number.isNaN(Number(videoSerial))) {
      return "Video serial must be a number.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      videoSerial: videoSerial === "" ? null : Number(videoSerial),
      videoUrl: url.trim(),
      chapterId: chapterId,
    };

    try {
      setSubmitting(true);
      // POST /videos
      await axios.post(`${API}/api/videos`, payload);
      setSuccessMsg("Video added successfully!");
      // Reset form (except chapterId)
      setTitle("");
      setDescription("");
      setVideoSerial("");
      setUrl("");
      // Optional: navigate back to the chapter's videos list after a short delay
      // setTimeout(() => navigate(`/chapters/${chapterId}/videos`), 800);
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to add video. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h1 className="h3 mb-1">Add Video</h1>
          {chapterName && (
            <div className="text-muted">Chapter: <strong>{chapterName}</strong></div>
          )}
        </div>
        <div>
          {chapterId && (
            <Link to={`/chapters/${chapterId}/videos`} className="btn btn-outline-secondary btn-sm">
              View Videos
            </Link>
          )}
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {errorMsg && (
            <div className="alert alert-danger" role="alert">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="alert alert-success" role="alert">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-3">
                <label htmlFor="chapterId" className="form-label">Chapter ID</label>
                <input
                  type="text"
                  id="chapterId"
                  className="form-control"
                  value={chapterId}
                  onChange={(e) => setChapterId(e.target.value)}
                  placeholder="e.g., 12"
                  disabled={!!chapterIdParam}
                  required
                />
                {chapterIdParam && (
                  <div className="form-text">Auto-filled from the URL</div>
                )}
              </div>

              <div className="col-md-5">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Intro to Waves"
                  required
                />
              </div>

              <div className="col-md-4">
                <label htmlFor="videoSerial" className="form-label">Video Serial (order)</label>
                <input
                  type="number"
                  id="videoSerial"
                  className="form-control"
                  value={videoSerial}
                  onChange={(e) => setVideoSerial(e.target.value)}
                  placeholder="e.g., 1"
                />
                <div className="form-text">Controls the display order in the chapter</div>
              </div>

              <div className="col-12">
                <label htmlFor="url" className="form-label">Video URL</label>
                <input
                  type="url"
                  id="url"
                  className="form-control"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>

              <div className="col-12">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  className="form-control"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of the video..."
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : "Save Video"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setTitle("");
                  setDescription("");
                  setVideoSerial("");
                  setUrl("");
                }}
                disabled={submitting}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-3">
        <small className="text-muted">
          Tip: you can protect YouTube links by serving them via your backend and rendering them in an iframe only after auth.
        </small>
      </div>
    </div>
  );
}

export default AddVideo;
