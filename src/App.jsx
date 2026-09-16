import React, { useEffect, useState } from "react";
import { Shield, MapPin, Star, Wallet, Loader2, LogOut } from "lucide-react";
import { api } from "./api";

const palette = {
  seaDeep: "#0E4B54",
  seaMid: "#1C7C74",
  sand: "#EAF2EF",
  coral: "#FF6F59",
  sun: "#FFB84D",
  ink: "#12262A",
  safety: "#E14B4B",
  white: "#FFFFFF",
};

const SPOTS = [
  { label: "Av. Beira Mar, 1200", lat: -3.7237, lng: -38.4941 },
  { label: "Shopping Iguatemi", lat: -3.7419, lng: -38.4855 },
  { label: "Centro de Fortaleza", lat: -3.7304, lng: -38.5267 },
  { label: "Praia do Futuro", lat: -3.7481, lng: -38.4489 },
  { label: "Aldeota", lat: -3.7379, lng: -38.4979 },
];

function PhoneFrame({ children }) {
  return (
    <div className="mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl relative" style={{ width: 380, minHeight: 720, background: palette.ink, padding: 10, fontFamily: "Inter, sans-serif" }}>
      <div className="w-full h-full rounded-[2rem] overflow-hidden relative flex flex-col" style={{ background: palette.white, minHeight: 700 }}>
        {children}
      </div>
    </div>
  );
}

function Pill({ children, tone = "primary", onClick, disabled, icon: Icon }) {
  const styles = tone === "coral" ? { background: palette.coral, color: palette.white } : tone === "ghost" ? { background: palette.white, color: palette.ink, border: "1px solid #D8E2DF" } : { background: palette.seaDeep, color: palette.white };
  return (
    <button onClick={onClick} disabled={disabled} className="rounded-full px-5 py-3 text-sm font-semibold flex items-center justify-center gap-2 w-full transition-transform active:scale-[0.98] disabled:opacity-50" style={styles}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function Auth({ onAuthed }) {
  const [mode, setMode] = useState("login");
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({ full_name: "", cpf: "", phone: "", password: "", city_id: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.listCities().then(setCities).catch(() => {}); }, []);

  async function submit() {
    setError("");
    setLoading(true);
    try {
      let data;
      if (mode === "login") data = await api.login(form.phone, form.password);
      else data = await api.register({ ...form, role: "passenger" });
      api.setToken(data.token);
      onAuthed(data.user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-7 py-10" style={{ background: `linear-gradient(180deg, ${palette.seaDeep} 0%, ${palette.seaMid} 100%)` }}>
      <p className="text-white text-3xl mb-1" style={{ fontFamily: "Fraunces, serif" }}>Maré</p>
      <p className="text-white/70 text-sm mb-6">{mode === "login" ? "Entrar na sua conta" : "Criar conta de passageiro"}</p>
      <div className="bg-white rounded-2xl p-5 space-y-3">
        {mode === "register" && (
          <>
            <input placeholder="Nome completo" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            <input placeholder="CPF" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
            <select className="w-full border rounded-xl px-3 py-2 text-sm" value={form.city_id} onChange={(e) => setForm({ ...form, city_id: e.target.value })}>
              <option value="">Selecione a cidade</option>
              {cities.map((c) => <option key={c.id} value={c.id}>{c.name} - {c.state}</option>)}
            </select>
          </>
        )}
        <input placeholder="Telefone (só números)" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Senha" type="password" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-xs" style={{ color: palette.safety }}>{error}</p>}
        <Pill tone="coral" onClick={submit} disabled={loading}>{loading ? <Loader2 size={16} className="animate-spin" /> : mode === "login" ? "Entrar" : "Criar conta"}</Pill>
        <button className="text-xs w-full text-center pt-1" style={{ color: palette.seaMid }} onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
        </button>
      </div>
    </div>
  );
}

function Home({ user, onRideCreated, onLogout }) {
  const [pickup, setPickup] = useState(SPOTS[0]);
  const [dropoff, setDropoff] = useState(SPOTS[1]);
  const [payment, setPayment] = useState("pix");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function requestRide() {
    setError("");
    setLoading(true);
    try {
      const ride = await api.requestRide({
        pickup_lat: pickup.lat, pickup_lng: pickup.lng, pickup_address: pickup.label,
        dropoff_lat: dropoff.lat, dropoff_lng: dropoff.lng, dropoff_address: dropoff.label,
        payment_method: payment,
      });
      onRideCreated(ride);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg" style={{ fontFamily: "Fraunces, serif", color: palette.ink }}>Olá, {user.full_name?.split(" ")[0]}</p>
        <button onClick={onLogout}><LogOut size={18} color="#7C8A87" /></button>
      </div>
      <label className="text-xs font-semibold mb-1" style={{ color: palette.seaDeep }}>Coleta</label>
      <select className="w-full border rounded-xl px-3 py-2 text-sm mb-3" value={pickup.label} onChange={(e) => setPickup(SPOTS.find((s) => s.label === e.target.value))}>
        {SPOTS.map((s) => <option key={s.label} value={s.label}>{s.label}</option>)}
      </select>
      <label className="text-xs font-semibold mb-1" style={{ color: palette.seaDeep }}>Destino</label>
      <select className="w-full border rounded-xl px-3 py-2 text-sm mb-3" value={dropoff.label} onChange={(e) => setDropoff(SPOTS.find((s) => s.label === e.target.value))}>
        {SPOTS.map((s) => <option key={s.label} value={s.label}>{s.label}</option>)}
      </select>
      <label className="text-xs font-semibold mb-1" style={{ color: palette.seaDeep }}>Pagamento</label>
      <div className="flex gap-2 mb-4">
        {["pix", "cartao", "especie"].map((m) => (
          <button key={m} onClick={() => setPayment(m)} className="flex-1 rounded-xl py-2 text-xs font-semibold capitalize" style={{ background: payment === m ? palette.seaDeep : palette.sand, color: payment === m ? "#fff" : palette.ink }}>{m}</button>
        ))}
      </div>
      {error && <p className="text-xs mb-2" style={{ color: palette.safety }}>{error}</p>}
      <div className="mt-auto">
        <Pill tone="coral" onClick={requestRide} disabled={loading}>{loading ? <Loader2 size={16} className="animate-spin" /> : "Pedir corrida"}</Pill>
      </div>
    </div>
  );
}

function TrackRide({ rideId, onDone }) {
  const [ride, setRide] = useState(null);
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const r = await api.getRide(rideId);
        setRide(r);
        if (r.status === "completed") { clearInterval(interval); onDone(r); }
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [rideId]);

  const statusLabel = { requested: "Procurando motorista...", accepted: "Motorista a caminho", driver_arriving: "Motorista chegando", in_progress: "Em viagem" }[ride?.status] || "Carregando...";

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8" style={{ background: palette.sand }}>
      <Loader2 size={32} className="animate-spin mb-4" color={palette.coral} />
      <p className="text-base text-center" style={{ fontFamily: "Fraunces, serif", color: palette.ink }}>{statusLabel}</p>
      {ride?.driver_payout && (
        <div className="mt-6 rounded-2xl p-4 w-full" style={{ background: palette.white }}>
          <div className="flex items-center gap-2 mb-1"><Wallet size={14} color={palette.seaDeep} /><span className="text-xs font-semibold" style={{ color: palette.seaDeep }}>Repasse ao motorista</span></div>
          <p className="text-sm" style={{ color: palette.ink }}>R$ {ride.driver_payout}</p>
        </div>
      )}
      {ride?.risk_warnings?.length > 0 && (
        <div className="mt-3 rounded-2xl p-4 w-full flex items-start gap-2" style={{ background: "#FDEDEC" }}>
          <Shield size={16} color={palette.safety} />
          <p className="text-xs" style={{ color: palette.ink }}>Esse trajeto passa por uma área com atenção redobrada nesse horário. Compartilhe seu trajeto.</p>
        </div>
      )}
      <button className="mt-6 text-xs underline" style={{ color: palette.safety }} onClick={() => api.updateRideStatus(rideId, "completed")}>(teste) simular chegada</button>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [ride, setRide] = useState(null);

  if (!user) return <PhoneFrame><Auth onAuthed={setUser} /></PhoneFrame>;
  if (ride) return <PhoneFrame><TrackRide rideId={ride.id} onDone={() => setRide(null)} /></PhoneFrame>;

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-10" style={{ background: "#F3F6F5" }}>
      <PhoneFrame>
        <Home user={user} onRideCreated={setRide} onLogout={() => { api.setToken(null); setUser(null); }} />
      </PhoneFrame>
    </div>
  );
}
