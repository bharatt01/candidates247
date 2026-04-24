import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "@/firebase";
import { signOut } from "firebase/auth";

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = (ts) => {
  if (!ts) return "—";
  try {
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

const Badge = ({ label, color }) => {
  const styles = {
    green:  "bg-emerald-900/50 text-emerald-300 border-emerald-700/50",
    red:    "bg-red-900/50 text-red-300 border-red-700/50",
    yellow: "bg-yellow-900/50 text-yellow-300 border-yellow-700/50",
    blue:   "bg-blue-900/50 text-blue-300 border-blue-700/50",
    purple: "bg-purple-900/50 text-purple-300 border-purple-700/50",
    gray:   "bg-gray-700/50 text-gray-400 border-gray-600/50",
  };
  return (
    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${styles[color] || styles.gray}`}>
      {label}
    </span>
  );
};

const Row = ({ label, value }) => (
  <div>
    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">{label}</div>
    <div className="text-sm text-gray-200 truncate mt-0.5">{value || "—"}</div>
  </div>
);

const Btn = ({ onClick, color, label }) => {
  const styles = {
    purple: "bg-purple-700/30 hover:bg-purple-600/50 text-purple-300 border-purple-600/30",
    green:  "bg-emerald-700/30 hover:bg-emerald-600/50 text-emerald-300 border-emerald-600/30",
    yellow: "bg-yellow-700/30 hover:bg-yellow-600/50 text-yellow-300 border-yellow-600/30",
    red:    "bg-red-700/30 hover:bg-red-600/50 text-red-300 border-red-600/30",
    gray:   "bg-gray-700/30 hover:bg-gray-600/50 text-gray-300 border-gray-600/30",
  };
  return (
    <button
      onClick={onClick}
      className={`border font-mono transition-all rounded-lg px-3 py-1.5 text-xs ${styles[color] || styles.gray}`}
    >
      {label}
    </button>
  );
};

const Avatar = ({ name }) => {
  const initials = (name || "?").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const colors = ["bg-purple-700", "bg-blue-700", "bg-emerald-700", "bg-orange-700", "bg-rose-700"];
  const color = colors[(initials.charCodeAt(0) || 0) % colors.length];
  return (
    <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
      {initials}
    </div>
  );
};

const Empty = () => (
  <div className="text-center py-20 text-gray-600 font-mono text-sm">No records found</div>
);

// ─── edit modal ──────────────────────────────────────────────────────────────

const EDIT_FIELDS = {
  user:         ["fullName", "email", "phone", "companyName", "role"],
  candidate:    ["fullName", "email", "phone"],
  subscription: ["company_name", "company_email", "plan", "amount_rupees", "resume_limit", "status"],
};

const EditModal = ({ item, type, onSave, onClose }) => {
  const [form, setForm] = useState({ ...item });
  const fields = EDIT_FIELDS[type] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-7 w-full max-w-md shadow-2xl">
        <h2 className="text-base font-semibold text-white mb-5 font-mono">✏️ Edit {type}</h2>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {fields.map((f) => (
            <div key={f}>
              <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
                {f.replace(/_/g, " ")}
              </label>
              {f === "role" ? (
                <select
                  value={form[f] || ""}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-gray-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  {["user", "admin", "superadmin", "company"].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              ) : f === "status" ? (
                <select
                  value={form[f] || ""}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-gray-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  {["pending", "active", "rejected"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <input
                  value={form[f] ?? ""}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-gray-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSave(form)}
            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg text-sm font-mono transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-mono transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── main ─────────────────────────────────────────────────────────────────────

const TABS = ["users", "candidates", "subscriptions"];

const AdminDashboardContent = () => {
  const navigate = useNavigate();

  const [tab, setTab]               = useState("users");
  const [search, setSearch]         = useState("");
  const [users, setUsers]           = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [subscriptions, setSubs]    = useState([]);
  const [fetching, setFetching]     = useState(true);
  const [editTarget, setEditTarget] = useState(null);
  const [editType, setEditType]     = useState(null);

  // ── guard ──
  useEffect(() => {
    if (!localStorage.getItem("isSuperAdmin")) navigate("/superadmin");
  }, [navigate]);

  // ── fetch ──
  const fetchAll = useCallback(async () => {
    setFetching(true);
    try {
      const [uSnap, cSnap, sSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "candidates")),
        getDocs(collection(db, "subscriptions")),
      ]);
      setUsers(uSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setCandidates(cSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setSubs(sSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── logout ──
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("isSuperAdmin");
    navigate("/superadmin");
  };

  // ── edit save ──
  const saveEdit = async (updated) => {
    const colMap = { user: "users", candidate: "candidates", subscription: "subscriptions" };
    const { id, ...data } = updated;
    await updateDoc(doc(db, colMap[editType], id), { ...data, updatedAt: Timestamp.now() });
    setEditTarget(null);
    setEditType(null);
    fetchAll();
  };

  // ── delete ──
  const deleteItem = async (colName, id) => {
    if (!window.confirm("Permanently delete this record?")) return;
    await deleteDoc(doc(db, colName, id));
    fetchAll();
  };

  // ── block toggle ──
  const toggleBlock = async (colName, item) => {
    await updateDoc(doc(db, colName, item.id), { blocked: !item.blocked });
    fetchAll();
  };

  // ── subscription actions ──
  const approveSub = async (sub) => {
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 3);
    await updateDoc(doc(db, "subscriptions", sub.id), {
      status: "active",
      resume_limit: sub.resume_limit || 0,
      expiry_date: Timestamp.fromDate(expiry),
    });
    fetchAll();
  };

  const rejectSub = async (sub) => {
    await updateDoc(doc(db, "subscriptions", sub.id), { status: "rejected" });
    fetchAll();
  };

  // ── filter ──
  const q = search.toLowerCase();
  const filtered = {
    users: users.filter((u) =>
      [u.fullName, u.email, u.phone, u.role, u.companyName].some((v) => (v || "").toLowerCase().includes(q))
    ),
    candidates: candidates.filter((c) =>
      [c.fullName, c.email, c.phone, c.location].some((v) => (v || "").toLowerCase().includes(q))
    ),
    subscriptions: subscriptions.filter((s) =>
      [s.company_name, s.companyName, s.company_email, s.status, s.plan].some((v) => (v || "").toLowerCase().includes(q))
    ),
  };

  const activeSubs  = subscriptions.filter((s) => s.status === "active");
  const pendingSubs = subscriptions.filter((s) => s.status === "pending");
  const revenue     = activeSubs.reduce((sum, s) => sum + (s.amount_rupees || 0), 0);
  const counts      = { users: users.length, candidates: candidates.length, subscriptions: subscriptions.length };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#080a0f] text-white" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>

      {editTarget && (
        <EditModal
          item={editTarget}
          type={editType}
          onSave={saveEdit}
          onClose={() => { setEditTarget(null); setEditType(null); }}
        />
      )}

      <div className="flex min-h-screen">

        {/* ══ SIDEBAR ══ */}
        <aside className="hidden md:flex flex-col w-60 bg-[#0c0e14] border-r border-white/5 py-8 px-4 sticky top-0 h-screen gap-2">
          <div className="mb-6 px-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-purple-400">⚡</span>
              <span className="text-xs text-purple-400 uppercase tracking-widest">Superadmin</span>
            </div>
            <div className="text-base font-bold text-white">Control Panel</div>
          </div>

          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setSearch(""); }}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all text-left ${
                tab === t
                  ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <span className="capitalize">{t}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t ? "bg-purple-500/30 text-purple-200" : "bg-gray-700 text-gray-400"}`}>
                {tab === t ? filtered[t].length : counts[t]}
              </span>
            </button>
          ))}

          {/* stats */}
          <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
            {[
              { label: "Revenue",    value: `₹${revenue.toLocaleString("en-IN")}`, color: "text-purple-300" },
              { label: "Active",     value: activeSubs.length,  color: "text-emerald-300" },
              { label: "Pending",    value: pendingSubs.length, color: "text-yellow-300" },
              { label: "Candidates", value: candidates.length,  color: "text-blue-300" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between text-xs px-2 py-1.5 rounded bg-white/5">
                <span className="text-gray-400">{label}</span>
                <span className={`font-bold ${color}`}>{value}</span>
              </div>
            ))}

            <button
              onClick={handleLogout}
              className="w-full mt-2 text-xs py-2 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-800/30 transition-colors"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* ══ MAIN ══ */}
        <main className="flex-1 px-4 md:px-8 py-8 max-w-5xl">

          {/* topbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h1 className="text-xl font-bold tracking-tight text-white capitalize">
              {tab}
              <span className="ml-3 text-sm font-normal text-gray-500">
                {filtered[tab].length} records
              </span>
            </h1>

            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">⌕</span>
                <input
                  type="text"
                  placeholder="Search name, email, phone…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 bg-[#13151c] border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={handleLogout}
                className="md:hidden text-xs px-3 py-2 rounded-lg bg-red-900/20 text-red-400 border border-red-800/30"
              >
                Logout
              </button>
            </div>
          </div>

          {/* mobile tabs */}
          <div className="flex md:hidden gap-2 mb-6 overflow-x-auto pb-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setSearch(""); }}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize whitespace-nowrap ${
                  tab === t ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400"
                }`}
              >
                {t} ({counts[t]})
              </button>
            ))}
          </div>

          {fetching && (
            <div className="text-center py-20 text-gray-500 text-sm animate-pulse">Loading data…</div>
          )}

          {/* ── USERS ── */}
          {!fetching && tab === "users" && (
            <div className="space-y-3">
              {filtered.users.length === 0 && <Empty />}
              {filtered.users.map((u) => (
                <div key={u.id} className="bg-[#0f1117] border border-white/5 hover:border-white/10 rounded-xl p-5 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.fullName || u.email} />
                      <div>
                        <div className="font-semibold text-white text-sm">{u.fullName || "—"}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge
                        label={u.role || "user"}
                        color={u.role === "superadmin" ? "purple" : u.role === "admin" ? "blue" : u.role === "company" ? "yellow" : "gray"}
                      />
                      {u.blocked && <Badge label="blocked" color="red" />}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3 p-4 bg-white/[0.02] rounded-lg border border-white/5">
                    <Row label="Phone"   value={u.phone} />
                    <Row label="Company" value={u.companyName} />
                    <Row label="Created" value={fmt(u.createdAt)} />
                    <Row label="Updated" value={fmt(u.updatedAt)} />
                  </div>

                  <div className="text-[10px] text-gray-600 mb-3 truncate">UID: {u.id}</div>

                  <div className="flex flex-wrap gap-2">
                    <Btn onClick={() => { setEditTarget(u); setEditType("user"); }} color="purple" label="✏️ Edit" />
                    <Btn onClick={() => toggleBlock("users", u)} color={u.blocked ? "green" : "yellow"} label={u.blocked ? "✓ Unblock" : "⊘ Block"} />
                    <Btn onClick={() => deleteItem("users", u.id)} color="red" label="🗑 Delete" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── CANDIDATES ── */}
          {!fetching && tab === "candidates" && (
            <div className="space-y-3">
              {filtered.candidates.length === 0 && <Empty />}
              {filtered.candidates.map((c) => (
                <div key={c.id} className="bg-[#0f1117] border border-white/5 hover:border-white/10 rounded-xl p-5 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.fullName || c.email} />
                      <div>
                        <div className="font-semibold text-white text-sm">{c.fullName || "—"}</div>
                        <div className="text-xs text-gray-500">{c.email}</div>
                      </div>
                    </div>
                    <Badge label={c.blocked ? "blocked" : "active"} color={c.blocked ? "red" : "green"} />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3 p-4 bg-white/[0.02] rounded-lg border border-white/5">
                    <Row label="Phone"      value={c.phone} />
                    <Row label="Location"   value={c.location || c.city} />
                    <Row label="Experience" value={c.experience ? `${c.experience} yrs` : null} />
                    <Row label="Education"  value={c.education} />
                    <Row label="Skills"     value={Array.isArray(c.skills) ? c.skills.slice(0, 4).join(", ") : c.skills} />
                    <Row label="Resume"     value={c.resumeUrl ? "Uploaded ✓" : "None"} />
                    <Row label="Joined"     value={fmt(c.createdAt)} />
                    <Row label="Updated"    value={fmt(c.updatedAt)} />
                  </div>

                  <div className="text-[10px] text-gray-600 mb-3 truncate">ID: {c.id}</div>

                  <div className="flex flex-wrap gap-2">
                    <Btn onClick={() => { setEditTarget(c); setEditType("candidate"); }} color="purple" label="✏️ Edit" />
                    <Btn onClick={() => toggleBlock("candidates", c)} color={c.blocked ? "green" : "yellow"} label={c.blocked ? "✓ Unblock" : "⊘ Block"} />
                    <Btn onClick={() => deleteItem("candidates", c.id)} color="red" label="🗑 Delete" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── SUBSCRIPTIONS ── */}
          {!fetching && tab === "subscriptions" && (
            <div className="space-y-3">
              {filtered.subscriptions.length === 0 && <Empty />}
              {filtered.subscriptions.map((s) => (
                <div key={s.id} className="bg-[#0f1117] border border-white/5 hover:border-white/10 rounded-xl p-5 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="font-semibold text-white text-sm">
                        {s.company_name || s.companyName || s.name || "Unknown Company"}
                      </div>
                      <div className="text-xs text-gray-500">{s.company_email}</div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge
                        label={s.status}
                        color={s.status === "active" ? "green" : s.status === "pending" ? "yellow" : s.status === "rejected" ? "red" : "gray"}
                      />
                      {s.amount_rupees > 0 && <Badge label={`₹${s.amount_rupees}`} color="purple" />}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3 p-4 bg-white/[0.02] rounded-lg border border-white/5">
                    <Row label="Plan"           value={s.plan} />
                    <Row label="Resume Limit"   value={s.resume_limit} />
                    <Row label="Amount (₹)"     value={s.amount_rupees} />
                    <Row label="Transaction ID" value={s.transaction_id || s.txId} />
                    <Row label="Phone"          value={s.phone} />
                    <Row label="UID / Ref"      value={s.uid || s.userId} />
                    <Row label="Requested"      value={fmt(s.createdAt)} />
                    <Row label="Expiry"         value={fmt(s.expiry_date)} />
                  </div>

                  <div className="text-[10px] text-gray-600 mb-3 truncate">Doc ID: {s.id}</div>

                  <div className="flex flex-wrap gap-2">
                    {s.status === "pending" && (
                      <>
                        <Btn onClick={() => approveSub(s)} color="green" label="✓ Approve" />
                        <Btn onClick={() => rejectSub(s)}  color="red"   label="✗ Reject" />
                      </>
                    )}
                    <Btn onClick={() => { setEditTarget(s); setEditType("subscription"); }} color="purple" label="✏️ Edit" />
                    <Btn onClick={() => deleteItem("subscriptions", s.id)} color="red" label="🗑 Delete" />
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboardContent;