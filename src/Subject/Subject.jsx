// Subject.jsx (4 cards/row + bottom action buttons)
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "http://localhost:4000"; // adjust if needed

function Subject() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [sRes, cRes] = await Promise.all([
          axios.get(`${API}/api/subjects/${subjectId}`),
          axios.get(`${API}/api/subjects/${subjectId}/chapters`),
        ]);
        setSubject(sRes.data || null);
        setChapters(Array.isArray(cRes.data) ? cRes.data : []);
      } catch (e) {
        setErr(e?.response?.data?.message || e?.message || "Failed to load subject.");
      } finally {
        setLoading(false);
      }
    })();
  }, [subjectId]);

  return (
    <div className="min-vh-100 d-flex flex-column subject-bg">
      <header className="container py-4 text-center">
        <h1 className="display-6 fw-bold mb-1 text-dark">Physics Problem Solving</h1>
        <h2 className="h5 text-secondary mb-0">
          {subject ? subject.name : (loading ? "Loading…" : "Subject")}
        </h2>
      </header>

      {/* keep .container; sizes chosen to fit 4-up within 1320px */}
      <main className="container pb-5">
        <div className="text-center mb-3">
          <span className="text-uppercase fw-semibold text-secondary">Chapters</span>
        </div>

        <div className="subjects-wrap">
          {/* Loading */}
          {loading && (
            <div className="subjects-grid" style={{ "--grid-max": "1320px" }}>
              {[0, 1, 2, 3].map((i) => (
                <div className="subject-item" key={i} style={{ "--card-width": "clamp(240px, 20vw, 300px)" }}>
                  <div className="card rounded-4 placeholder-wave border-0 w-100 h-100 subject-card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="placeholder me-3" style={{ height: 48, width: 48, borderRadius: 12 }} />
                        <h5 className="card-title mb-0 placeholder col-6">&nbsp;</h5>
                      </div>
                      <p className="card-text placeholder col-12">&nbsp;</p>
                      <p className="card-text placeholder col-8">&nbsp;</p>
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
          {!loading && !err && chapters.length === 0 && (
            <div className="text-center py-5">
              <h5 className="text-dark">No chapters found</h5>
            </div>
          )}

          {/* Chapters grid - 4 per row */}
          {!loading && !err && chapters.length > 0 && (
            <div className="subjects-grid" style={{ "--grid-max": "1320px" }}>
              {chapters.map((c) => {
                const titleId = `chapter-title-${c.id}`;
                return (
                  <div
                    key={c.id}
                    className="subject-item"
                    style={{ "--card-width": "clamp(240px, 20vw, 300px)" }}
                    tabIndex={0} // enables focus ring from your CSS
                    role="group"
                    aria-labelledby={titleId}
                  >
                    <div className="card subject-card rounded-4 w-100 h-100" style={{ cursor: "default" }}>
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex align-items-center mb-3">
                          <div className="subject-avatar me-3">{getInitials(c.name)}</div>
                          <div className="flex-grow-1">
                            {/* Title links to the main chapter page */}
                            <h5 id={titleId} className="card-title mb-0 fw-semibold">
                              <Link
                                to={`/subjects/${subjectId}/chapters/${c.id}`}
                                className="text-decoration-none text-reset"
                                aria-label={`Open chapter ${c.name}`}
                              >
                                {c.name}
                              </Link>
                            </h5>
                          </div>
                        </div>

                        <p className="text-secondary mb-3">
                          {truncate(c.description || "No description provided.", 120)}
                        </p>

                        {/* Action buttons pinned to bottom */}
                        <div className="mt-auto d-flex justify-content-center gap-2 flex-wrap">
                          <Link
                            to={`/subjects/${subjectId}/chapters/${c.id}/videos`}
                            className="btn btn-sm btn-primary"
                            aria-label={`View videos for ${c.name}`}
                          >
                            Videos
                          </Link>
                          <Link
                            to={`/subjects/${subjectId}/chapters/${c.id}/notes`}
                            className="btn btn-sm btn-outline-primary"
                            aria-label={`View notes for ${c.name}`}
                          >
                            Notes
                          </Link>
                          <Link
                            to={`/subjects/${subjectId}/chapters/${c.id}/worksheet`}
                            className="btn btn-sm btn-outline-secondary"
                            aria-label={`View worksheet for ${c.name}`}
                          >
                            Worksheet
                          </Link>
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
  return initials || "C";
}

export default Subject;
