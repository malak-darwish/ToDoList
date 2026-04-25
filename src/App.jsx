import { useState, useEffect, useRef } from "react";

const theme = {
  pink: "#e8a0bf",
  pinkLight: "#fce4ec",
  pinkDark: "#c2185b",
  pinkMid: "#f48fb1",
  bg: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #fce4ec 100%)",
  white: "#ffffff",
  text: "#4a2040",
  muted: "#b07090",
  card: "rgba(255,255,255,0.85)",
  shadow: "0 8px 32px rgba(194,24,91,0.10)",
};


function Nav({ page, setPage }) {
  const tabs = [
    { id: "todo", label: "✅ To-Do" },
    { id: "habits", label: "📊 Habits" },
    { id: "focus", label: "⏱️ Focus" },
  ];
  return (
    <nav style={ns.nav}>
      <div style={ns.brand}>🌸 Bloom</div>
      <div style={ns.tabs}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setPage(t.id)}
            style={{
              ...ns.tab,
              background: page === t.id ? theme.pink : "transparent",
              color: page === t.id ? "#fff" : theme.pinkDark,
              fontWeight: page === t.id ? "700" : "500",
              boxShadow: page === t.id ? "0 2px 12px rgba(232,160,191,0.4)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
const ns = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 32px",
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #f8bbd0",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: {
    fontSize: "22px",
    fontWeight: "800",
    color: theme.pinkDark,
    letterSpacing: "-0.5px",
    fontFamily: "'Georgia', serif",
  },
  tabs: { display: "flex", gap: "8px" },
  tab: {
    padding: "9px 20px",
    border: "none",
    borderRadius: "99px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
};

// ─── PAGE 1: TO-DO LIST ───────────────────────────────────────────────────────
const PRIORITIES = ["Low", "Medium", "High"];
const FILTERS = ["All", "Active", "Completed"];
const priorityColor = { Low: "#a8d8a8", Medium: "#f9c784", High: "#f4978e" };

function TodoPage() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const addTask = () => {
    if (!text.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: text.trim(), priority, completed: false }]);
    setText("");
  };

  const toggle = (id) => setTasks(tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  const del = (id) => setTasks(tasks.filter((t) => t.id !== id));
  const clearDone = () => setTasks(tasks.filter((t) => !t.completed));

  const visible = tasks.filter((t) => {
    const fMatch = filter === "All" ? true : filter === "Active" ? !t.completed : t.completed;
    return fMatch && t.text.toLowerCase().includes(search.toLowerCase());
  });

  const done = tasks.filter((t) => t.completed).length;

  return (
    <div style={p.wrap}>
      <h2 style={p.heading}>My To-Do List</h2>
      <p style={p.sub}>Capture everything, accomplish anything 🌟</p>

      {tasks.length > 0 && (
        <div style={p.progressRow}>
          <div style={p.bar}>
            <div style={{ ...p.fill, width: `${(done / tasks.length) * 100}%` }} />
          </div>
          <span style={p.progLabel}>{done}/{tasks.length} done</span>
        </div>
      )}

      <input
        style={p.input}
        placeholder="🔍 Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={p.row}>
        <input
          style={{ ...p.input, flex: 1, marginBottom: 0 }}
          placeholder="What needs to be done?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <select style={p.select} value={priority} onChange={(e) => setPriority(e.target.value)}>
          {PRIORITIES.map((pr) => <option key={pr}>{pr}</option>)}
        </select>
        <button style={p.addBtn} onClick={addTask}>+ Add</button>
      </div>

      <div style={p.filterRow}>
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            ...p.filterBtn,
            background: filter === f ? theme.pink : theme.pinkLight,
            color: filter === f ? "#fff" : theme.pinkDark,
            fontWeight: filter === f ? "700" : "500",
          }}>{f}</button>
        ))}
      </div>

      <div style={p.list}>
        {visible.length === 0 && (
          <p style={p.empty}>{tasks.length === 0 ? "Add your first task above! 🌸" : "No tasks match."}</p>
        )}
        {visible.map((task) => (
          <div key={task.id} style={{
            ...p.taskItem,
            borderLeft: `5px solid ${priorityColor[task.priority]}`,
            opacity: task.completed ? 0.65 : 1,
          }}>
            <span style={{ cursor: "pointer", fontSize: 18 }} onClick={() => toggle(task.id)}>
              {task.completed ? "✅" : "⬜"}
            </span>
            <span style={{
              flex: 1,
              fontSize: 14,
              color: task.completed ? "#bbb" : theme.text,
              textDecoration: task.completed ? "line-through" : "none",
            }}>{task.text}</span>
            <span style={{
              fontSize: 11, padding: "3px 8px", borderRadius: 99,
              background: priorityColor[task.priority], color: "#555", fontWeight: "bold",
            }}>{task.priority}</span>
            <button style={p.iconBtn} onClick={() => del(task.id)}>🗑️</button>
          </div>
        ))}
      </div>

      {done > 0 && (
        <button style={p.clearBtn} onClick={clearDone}>Clear completed ({done})</button>
      )}

      <div style={p.statsRow}>
        {PRIORITIES.map((pr) => (
          <span key={pr} style={p.stat}>
            <span style={{ ...p.dot, background: priorityColor[pr] }} />
            {pr}: {tasks.filter(t => t.priority === pr).length}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE 2: HABIT TRACKER ────────────────────────────────────────────────────
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_HABITS = ["💧 Drink Water", "🏃 Exercise", "📚 Read", "🧘 Meditate"];

function HabitsPage() {
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [checked, setChecked] = useState({});
  const [newHabit, setNewHabit] = useState("");

  const toggle = (habit, day) => {
    const key = `${habit}|${day}`;
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const addHabit = () => {
    if (!newHabit.trim() || habits.includes(newHabit.trim())) return;
    setHabits([...habits, newHabit.trim()]);
    setNewHabit("");
  };

  const removeHabit = (h) => {
    setHabits(habits.filter((x) => x !== h));
    const next = { ...checked };
    DAYS.forEach((d) => delete next[`${h}|${d}`]);
    setChecked(next);
  };

  const pct = (habit) => {
    const done = DAYS.filter((d) => checked[`${habit}|${d}`]).length;
    return Math.round((done / 7) * 100);
  };

  const todayIdx = (new Date().getDay() + 6) % 7;

  return (
    <div style={p.wrap}>
      <h2 style={p.heading}>Habit Tracker</h2>
      <p style={p.sub}>Build consistency one day at a time 🌱</p>

      <div style={p.row}>
        <input
          style={{ ...p.input, flex: 1, marginBottom: 0 }}
          placeholder="Add a new habit..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addHabit()}
        />
        <button style={p.addBtn} onClick={addHabit}>+ Add</button>
      </div>

      <div style={h.grid}>
        <div style={h.cornerCell} />
        {DAYS.map((d, i) => (
          <div key={d} style={{
            ...h.dayHeader,
            background: i === todayIdx ? theme.pink : "transparent",
            color: i === todayIdx ? "#fff" : theme.pinkDark,
            borderRadius: 8,
          }}>{d}</div>
        ))}

        {habits.map((habit) => (
          <>
            <div key={habit + "_label"} style={h.habitLabel}>
              <span style={{ flex: 1, fontSize: 13 }}>{habit}</span>
              <span style={h.pctBadge}>{pct(habit)}%</span>
              <button style={p.iconBtn} onClick={() => removeHabit(habit)}>✕</button>
            </div>
            {DAYS.map((day, i) => {
              const done = checked[`${habit}|${day}`];
              return (
                <div
                  key={habit + day}
                  onClick={() => toggle(habit, day)}
                  style={{
                    ...h.cell,
                    background: done ? theme.pink : theme.pinkLight,
                    border: i === todayIdx ? `2px solid ${theme.pinkDark}` : `1px solid #f8bbd0`,
                    transform: done ? "scale(1.08)" : "scale(1)",
                  }}
                >
                  {done ? "✓" : ""}
                </div>
              );
            })}
          </>
        ))}
      </div>

      <div style={h.legend}>
        <span style={{ fontSize: 12, color: theme.muted }}>
          💡 Click any cell to mark it done. Highlighted column = today.
        </span>
      </div>

      <div style={h.summaryRow}>
        {habits.map((habit) => (
          <div key={habit} style={h.summaryCard}>
            <div style={h.summaryBar}>
              <div style={{ ...h.summaryFill, width: `${pct(habit)}%` }} />
            </div>
            <span style={{ fontSize: 11, color: theme.muted }}>{habit} — {pct(habit)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const h = {
  grid: {
    display: "grid",
    gridTemplateColumns: "180px repeat(7, 1fr)",
    gap: "6px",
    marginTop: "16px",
    marginBottom: "16px",
  },
  cornerCell: { background: "transparent" },
  dayHeader: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    padding: "6px 2px",
    color: theme.pinkDark,
  },
  habitLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 10px",
    background: theme.pinkLight,
    borderRadius: 10,
    fontSize: 13,
    color: theme.text,
  },
  pctBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.pinkDark,
    minWidth: 30,
    textAlign: "right",
  },
  cell: {
    aspectRatio: "1",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    transition: "all 0.15s",
    minHeight: 36,
  },
  legend: { marginBottom: 16, textAlign: "center" },
  summaryRow: { display: "flex", flexDirection: "column", gap: 8 },
  summaryCard: { display: "flex", flexDirection: "column", gap: 3 },
  summaryBar: {
    height: 6,
    background: theme.pinkLight,
    borderRadius: 99,
    overflow: "hidden",
  },
  summaryFill: {
    height: "100%",
    background: theme.pink,
    borderRadius: 99,
    transition: "width 0.3s",
  },
};

// ─── PAGE 3: FOCUS TIMER ──────────────────────────────────────────────────────
const QUOTES = [
  "The secret of getting ahead is getting started. 🌸",
  "Focus on progress, not perfection. ✨",
  "You are capable of amazing things. 💪",
  "Small steps every day lead to big results. 🌱",
  "Believe in yourself and your work. 🌟",
  "One task at a time. You've got this. 🎯",
];

const MODES = [
  { label: "🍅 Focus", duration: 25 * 60, color: theme.pink },
  { label: "☕ Short Break", duration: 5 * 60, color: "#a8d8a8" },
  { label: "🌙 Long Break", duration: 15 * 60, color: "#85b7eb" },
];

function FocusPage() {
  const [modeIdx, setModeIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MODES[0].duration);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const intervalRef = useRef(null);

  const mode = MODES[modeIdx];

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (modeIdx === 0) setSessions((s) => s + 1);
            setQuoteIdx((q) => (q + 1) % QUOTES.length);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const switchMode = (idx) => {
    setModeIdx(idx);
    setTimeLeft(MODES[idx].duration);
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  const reset = () => {
    setTimeLeft(mode.duration);
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const progress = 1 - timeLeft / mode.duration;
  const circumference = 2 * Math.PI * 100;

  return (
    <div style={p.wrap}>
      <h2 style={p.heading}>Focus Timer</h2>
      <p style={p.sub}>Stay in the zone, one session at a time 🍅</p>

      <div style={f.modeRow}>
        {MODES.map((m, i) => (
          <button key={m.label} onClick={() => switchMode(i)} style={{
            ...f.modeBtn,
            background: modeIdx === i ? m.color : theme.pinkLight,
            color: modeIdx === i ? "#fff" : theme.pinkDark,
            fontWeight: modeIdx === i ? "700" : "500",
            boxShadow: modeIdx === i ? `0 4px 16px ${m.color}88` : "none",
          }}>{m.label}</button>
        ))}
      </div>

      <div style={f.timerWrap}>
        <svg width="240" height="240" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="120" cy="120" r="100" fill="none" stroke={theme.pinkLight} strokeWidth="10" />
          <circle
            cx="120" cy="120" r="100"
            fill="none"
            stroke={mode.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div style={f.timerOverlay}>
          <div style={f.timerDisplay}>{mins}:{secs}</div>
          <div style={{ fontSize: 13, color: theme.muted }}>{mode.label}</div>
        </div>
      </div>

      <div style={f.btnRow}>
        <button style={f.resetBtn} onClick={reset}>↺ Reset</button>
        <button style={{
          ...f.mainBtn,
          background: running ? "#f4978e" : theme.pink,
          boxShadow: `0 4px 20px ${running ? "#f4978e" : theme.pink}88`,
        }} onClick={() => setRunning(!running)}>
          {running ? "⏸ Pause" : "▶ Start"}
        </button>
        <button style={f.resetBtn} onClick={() => setQuoteIdx((q) => (q + 1) % QUOTES.length)}>
          💬
        </button>
      </div>

      <div style={f.sessionsRow}>
        {Array.from({ length: Math.max(sessions, 4) }).map((_, i) => (
          <div key={i} style={{
            ...f.tomato,
            opacity: i < sessions ? 1 : 0.2,
            transform: i < sessions ? "scale(1.1)" : "scale(1)",
          }}>🍅</div>
        ))}
        <span style={{ fontSize: 12, color: theme.muted, marginLeft: 8 }}>
          {sessions} session{sessions !== 1 ? "s" : ""} completed today
        </span>
      </div>

      <div style={f.quoteCard}>
        <p style={f.quoteText}>"{QUOTES[quoteIdx]}"</p>
      </div>
    </div>
  );
}

const f = {
  modeRow: { display: "flex", gap: 8, marginBottom: 24, justifyContent: "center" },
  modeBtn: {
    padding: "10px 18px",
    border: "none",
    borderRadius: 99,
    cursor: "pointer",
    fontSize: 13,
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  timerWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  timerOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  timerDisplay: {
    fontSize: 52,
    fontWeight: "800",
    color: theme.pinkDark,
    letterSpacing: "-2px",
    fontFamily: "'Georgia', serif",
  },
  btnRow: { display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 },
  mainBtn: {
    padding: "14px 40px",
    border: "none",
    borderRadius: 99,
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  resetBtn: {
    padding: "14px 20px",
    border: "none",
    borderRadius: 99,
    background: theme.pinkLight,
    color: theme.pinkDark,
    fontSize: 16,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  sessionsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginBottom: 20,
  },
  tomato: { fontSize: 22, transition: "all 0.3s" },
  quoteCard: {
    background: theme.pinkLight,
    borderRadius: 16,
    padding: "16px 24px",
    textAlign: "center",
    border: `1px solid #f8bbd0`,
  },
  quoteText: { margin: 0, fontSize: 14, color: theme.pinkDark, fontStyle: "italic", lineHeight: 1.6 },
};

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const p = {
  wrap: {
    maxWidth: 600,
    margin: "0 auto",
    padding: "32px 24px",
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.pinkDark,
    margin: "0 0 4px",
    fontFamily: "'Georgia', serif",
  },
  sub: { fontSize: 14, color: theme.muted, margin: "0 0 24px" },
  progressRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 },
  bar: { flex: 1, height: 8, background: theme.pinkLight, borderRadius: 99, overflow: "hidden" },
  fill: { height: "100%", background: theme.pink, borderRadius: 99, transition: "width 0.3s" },
  progLabel: { fontSize: 12, color: theme.pinkDark, whiteSpace: "nowrap" },
  input: {
    width: "100%",
    padding: "11px 16px",
    borderRadius: 12,
    border: `1.5px solid #f8bbd0`,
    fontSize: 14,
    outline: "none",
    color: theme.text,
    background: "#fff9fb",
    marginBottom: 12,
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  row: { display: "flex", gap: 8, marginBottom: 16 },
  select: {
    padding: "11px 10px",
    borderRadius: 12,
    border: `1.5px solid #f8bbd0`,
    fontSize: 13,
    background: "#fff9fb",
    color: theme.pinkDark,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  addBtn: {
    padding: "11px 20px",
    background: theme.pink,
    color: "#fff",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: "700",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
  },
  filterRow: { display: "flex", gap: 8, marginBottom: 16 },
  filterBtn: {
    flex: 1, padding: "8px", border: "none", borderRadius: 99,
    cursor: "pointer", fontSize: 13, transition: "all 0.2s", fontFamily: "inherit",
  },
  list: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 },
  taskItem: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "12px 16px", background: "#fff9fb",
    borderRadius: 12, border: "1px solid #fce4ec", transition: "opacity 0.2s",
  },
  iconBtn: {
    background: "none", border: "none", cursor: "pointer",
    fontSize: 15, flexShrink: 0, padding: 4,
  },
  clearBtn: {
    width: "100%", padding: 10, background: theme.pinkLight,
    color: theme.pinkDark, border: "none", borderRadius: 12,
    cursor: "pointer", fontSize: 13, fontWeight: "700",
    marginBottom: 16, fontFamily: "inherit",
  },
  statsRow: { display: "flex", justifyContent: "space-around", padding: "8px 0" },
  stat: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: theme.muted },
  dot: { width: 10, height: 10, borderRadius: "50%", display: "inline-block" },
  empty: { textAlign: "center", color: theme.pinkMid, padding: "32px 0", fontSize: 14 },
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("todo");

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Segoe UI', sans-serif" }}>
      <Nav page={page} setPage={setPage} />
      <main>
        {page === "todo" && <TodoPage />}
        {page === "habits" && <HabitsPage />}
        {page === "focus" && <FocusPage />}
      </main>
    </div>
  );
}
