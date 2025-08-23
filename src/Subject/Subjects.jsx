// SubjectsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "http://localhost:4000"; // adjust if needed

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/api/subjects`);
        setSubjects(res.data || []);
      } catch (e) {
        setErr(e?.response?.data?.message || e?.message || "Failed to load subjects.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let arr = [...subjects];
    if (q.trim()) {
      const k = q.toLowerCase();
      arr = arr.filter(
        (s) =>
          s.name?.toLowerCase().includes(k) ||
          s.description?.toLowerCase().includes(k)
      );
    }
    if (sortBy === "name-asc") arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    if (sortBy === "name-desc") arr.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    return arr;
  }, [subjects, q, sortBy]);

  return (
    <div className="min-vh-100 d-flex flex-column subject-bg">
      <header className="container py-4 text-center">
        <h1 className="display-6 fw-bold mb-2 text-dark">Physics Problem Solving</h1>
        <p className="text-secondary mb-0">Browse the list and jump into chapters.</p>
      </header>

      <main className="container pb-5">
        <div className="subjects-wrap">
          {/* Loading */}
          {loading && (
            <div className="subjects-grid">
              {[0, 1].map((i) => (
                <div className="subject-item" key={i}>
                  <div className="card rounded-4 shadow-sm placeholder-wave border-0 w-100 h-100 subject-card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div
                          className="placeholder me-3"
                          style={{ height: 48, width: 48, borderRadius: 12 }}
                        />
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
          {!loading && !err && filtered.length === 0 && (
            <div className="text-center py-5">
              <h5 className="text-dark">No subjects found</h5>
            </div>
          )}

          {/* Cards */}
          {!loading && !err && filtered.length > 0 && (
            <div className="subjects-grid">
              {filtered.map((s) => (
                <Link
                  key={s.id}
                  to={`/subjects/${s.id}`}
                  className="subject-item text-decoration-none text-reset"
                  aria-label={`Open subject ${s.name}`}
                >
                  <div className="card subject-card rounded-4 w-100 h-100">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex align-items-center mb-3">
                        <div className="subject-avatar me-3">{getInitials(s.name)}</div>
                        <div className="flex-grow-1">
                          <h5 className="card-title mb-0 fw-semibold">{s.name}</h5>
                        </div>
                      </div>
                      <p className="text-secondary mb-0 flex-grow-1">
                        {truncate(s.description || "No description provided.", 140)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/** Helpers */
function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}
function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const initials = parts.map((p) => p[0]?.toUpperCase() || "").join("");
  return initials || "S";
}

export default Subjects;
