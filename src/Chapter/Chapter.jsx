// Chapter.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "http://localhost:4000"; // adjust if needed

function Chapter() {
  const { chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [cRes, vRes] = await Promise.all([
          axios.get(`${API}/api/chapters/${chapterId}`),            // chapter detail
          axios.get(`${API}/api/chapters/${chapterId}/videos`),     // videos list
        ]);
        setChapter(cRes.data || null);
        setVideos(Array.isArray(vRes.data) ? vRes.data : []);
      } catch (e) {
        setErr(e?.response?.data?.message || e?.message || "Failed to load chapter.");
      } finally {
        setLoading(false);
      }
    })();
  }, [chapterId]);

  const totalCount = videos.length;
  const totalDuration = "--:--:--"; // placeholder (compute later when backend provides durations)

  return (
    <div className="min-vh-100 d-flex flex-column subject-bg">
      {/* Top bar: Chapter name (left) + worksheet buttons (right) */}
      <header className="container py-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <h1 className="h4 mb-0 text-dark">
            {chapter ? chapter.name : (loading ? "Loading…" : "Chapter")}
          </h1>

          <div className="d-flex gap-2">
            <Link
              to={`/chapters/${chapterId}/worksheet/new`}
              className="btn btn-sm btn-primary"
            >
              Add Worksheet
            </Link>
            <Link
              to={`/chapters/${chapterId}/worksheet/edit`}
              className="btn btn-sm btn-outline-primary"
            >
              Edit Worksheet
            </Link>
            <Link
              to={`/chapters/${chapterId}/worksheet`}
              className="btn btn-sm btn-outline-secondary"
            >
              View Worksheet
            </Link>
          </div>
        </div>
      </header>

      <main className="container pb-5">
        {/* Description */}
        <div className="mb-3">
          <p className="mb-0 text-secondary">
            {chapter?.description || (loading ? "Loading description…" : "No description provided.")}
          </p>
        </div>

        {/* Add Video + Stats row */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div className="d-flex align-items-center gap-2">
            <Link
              to={`videos/new`}
              className="btn btn-success btn-sm"
            >
              Add Video
            </Link>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="badge text-bg-light">
              <span className="text-uppercase text-secondary me-1">Total Video Count:</span>
              <strong className="text-dark">{totalCount}</strong>
            </span>
            <span className="badge text-bg-light">
              <span className="text-uppercase text-secondary me-1">Total Duration:</span>
              <strong className="text-dark">{totalDuration}</strong>
            </span>
          </div>
        </div>

        {/* Content area */}
        <div className="subjects-wrap">
          {/* Loading */}
          {loading && (
            <div className="subjects-grid" style={{ "--grid-max": "1320px" }}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="subject-item"
                  style={{ "--card-width": "clamp(240px, 20vw, 300px)" }}
                >
                  <div className="card rounded-4 placeholder-wave border-0 w-100 h-100 subject-card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="placeholder me-3" style={{ height: 48, width: 48, borderRadius: 12 }} />
                        <h5 className="card-title mb-0 placeholder col-6">&nbsp;</h5>
                      </div>
                      <p className="card-text placeholder col-12">&nbsp;</p>
                      <p className="card-text placeholder col-8">&nbsp;</p>
                      <div className="mt-3 d-flex justify-content-center gap-2">
                        <span className="placeholder col-3">&nbsp;</span>
                        <span className="placeholder col-3">&nbsp;</span>
                        <span className="placeholder col-3">&nbsp;</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && err && (
            <div className="alert alert-danger shadow-sm rounded-4 mx-auto" role="alert">
              {err}
            </div>
          )}

          {/* Empty */}
          {!loading && !err && videos.length === 0 && (
            <div className="text-center py-5">
              <h5 className="text-dark">No videos yet</h5>
            </div>
          )}

          {/* Videos grid — 4 per row, centered */}
          {!loading && !err && videos.length > 0 && (
            <div className="subjects-grid" style={{ "--grid-max": "1320px" }}>
              {videos.map((v) => {
                const titleId = `video-title-${v.id}`;
                return (
                  <div
                    key={v.id}
                    className="subject-item"
                    style={{ "--card-width": "clamp(240px, 20vw, 300px)" }}
                    role="group"
                    aria-labelledby={titleId}
                  >
                    <div className="card subject-card rounded-4 w-100 h-100 d-flex">
                      <div className="card-body d-flex flex-column">
                        {/* Title row */}
                        <div className="d-flex align-items-center mb-3">
                          <div className="subject-avatar me-3">{getInitials(v.title)}</div>
                          <div className="flex-grow-1">
                            <h5 id={titleId} className="card-title mb-0 fw-semibold">
                              <Link
                                to={`/chapters/${chapterId}/videos/${v.id}`}
                                className="text-decoration-none text-reset"
                                aria-label={`Open video ${v.title}`}
                              >
                                {v.title || "Untitled Video"}
                              </Link>
                            </h5>
                          </div>
                        </div>

                        {/* (Optional) short description if available */}
                        {v.description && (
                          <p className="text-secondary mb-2">
                            {truncate(v.description, 120)}
                          </p>
                        )}

                        {/* Duration row (placeholder for now) */}
                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center small text-secondary">
                            <span>Duration</span>
                            <span className="fw-semibold text-dark">{v.duration || "--:--:--"}</span>
                          </div>

                          {/* Action buttons (centered at bottom) */}
                          <div className="mt-2 d-flex justify-content-center gap-2 flex-wrap">
                            <Link
                              to={`videos/${v.id}`}
                              className="btn btn-sm btn-primary"
                            >
                              View
                            </Link>
                            <Link
                              to={`videos/${v.id}/edit`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              Edit
                            </Link>
                            <Link
                              to={`/chapters/${chapterId}/videos/${v.id}/notes`}
                              className="btn btn-sm btn-outline-secondary"
                            >
                              Note
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/** Helpers */
function truncate(str = "", n = 140) {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}
function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const initials = parts.map((p) => p[0]?.toUpperCase() || "").join("");
  return initials || "V";
}

export default Chapter;
