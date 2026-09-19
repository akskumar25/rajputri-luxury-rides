import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/tripsheet")({
  component: TripSheetPage,
});

type Trip = {
  id: string;
  tripNo: string;
  date: string;
  customerName: string;
  customerMobile: string;
  tripType: string;
  reportingTime: string;
  pickup: string;
  drop: string;
  vehicleNo: string;
  vehicle: string;
  driver: string;
  driverMobile: string;
  startKm: string;
  closeKm: string;
  vehicleCharge: string;
  toll: string;
  parking: string;
  permit: string;
  driverBata: string;
  other: string;
  notes: string;
  createdAt: string;
};

const STORAGE_KEY = "rajputri_trip_history_v1";

const today = () => new Date().toISOString().slice(0, 10);

const money = (value: string) => {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
};

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const makeTripNo = () => {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate(),
  ).padStart(2, "0")}`;
  const suffix = String(Date.now()).slice(-4);
  return `RT-${stamp}-${suffix}`;
};

const blankTrip = (): Trip => ({
  id: crypto.randomUUID(),
  tripNo: makeTripNo(),
  date: today(),
  customerName: "",
  customerMobile: "",
  tripType: "Round Trip",
  reportingTime: "",
  pickup: "",
  drop: "",
  vehicleNo: "",
  vehicle: "Hyundai Prime SD CNG",
  driver: "",
  driverMobile: "",
  startKm: "",
  closeKm: "",
  vehicleCharge: "",
  toll: "",
  parking: "",
  permit: "",
  driverBata: "",
  other: "",
  notes: "Thank you for travelling with RAJPUTRI TRAVELS.",
  createdAt: new Date().toISOString(),
});

function TripSheetPage() {
  const [trip, setTrip] = useState<Trip>(blankTrip);
  const [history, setHistory] = useState<Trip[]>([]);
  const [month, setMonth] = useState("all");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      setHistory([]);
    }
  }, []);

  const update = (key: keyof Trip, value: string) =>
    setTrip((old) => ({ ...old, [key]: value }));

  const totalKm = Math.max(
    0,
    money(trip.closeKm) - money(trip.startKm),
  );

  const grandTotal =
    money(trip.vehicleCharge) +
    money(trip.toll) +
    money(trip.parking) +
    money(trip.permit) +
    money(trip.driverBata) +
    money(trip.other);

  const saveHistory = (item: Trip) => {
    const next = [item, ...history.filter((x) => x.id !== item.id)];
    setHistory(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const saveTrip = () => {
    if (!trip.customerName.trim()) {
      setMessage("Customer Name உள்ளிடவும்.");
      return;
    }
    saveHistory(trip);
    setMessage("Trip Sheet History-ல் சேமிக்கப்பட்டது.");
    setTimeout(() => setMessage(""), 2500);
  };

  const newTrip = () => {
    setTrip(blankTrip());
    setMessage("");
  };

  const loadTrip = (item: Trip) => {
    setTrip(item);
    setMessage("Trip Sheet loaded.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteTrip = (id: string) => {
    const next = history.filter((x) => x.id !== id);
    setHistory(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const clearHistory = () => {
    if (!window.confirm("முழு Trip History-யையும் நீக்க வேண்டுமா?")) return;
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const months = useMemo(() => {
    const set = new Set(
      history.map((x) => x.date.slice(0, 7)).filter(Boolean),
    );
    return Array.from(set).sort().reverse();
  }, [history]);

  const filteredHistory = useMemo(() => {
    const q = search.trim().toLowerCase();
    return history.filter((x) => {
      const monthOk = month === "all" || x.date.startsWith(month);
      const text = [
        x.tripNo,
        x.customerName,
        x.customerMobile,
        x.pickup,
        x.drop,
        x.vehicleNo,
      ]
        .join(" ")
        .toLowerCase();
      return monthOk && (!q || text.includes(q));
    });
  }, [history, month, search]);

  const monthTotal = useMemo(
    () =>
      filteredHistory.reduce(
        (sum, x) =>
          sum +
          money(x.vehicleCharge) +
          money(x.toll) +
          money(x.parking) +
          money(x.permit) +
          money(x.driverBata) +
          money(x.other),
        0,
      ),
    [filteredHistory],
  );

  const printPdf = () => {
    saveHistory(trip);
    setTimeout(() => window.print(), 100);
  };

  const whatsapp = () => {
    saveHistory(trip);
    const text = [
      "Dear Customer,",
      "",
      "Please find attached your official RAJPUTRI TRAVELS Trip Sheet.",
      `Trip No: ${trip.tripNo}`,
      `Date: ${trip.date}`,
      `Customer: ${trip.customerName || "-"}`,
      "",
      "Thank you for travelling with us.",
      "RAJPUTRI TRAVELS",
      "Safe · Comfortable · On-Time Travel",
    ].join("\n");
    window.open(
      `https://wa.me/91${trip.customerMobile.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  return (
    <>
      <div className="ts-app">
        <div className="ts-topbar">
          <div>
            <div className="ts-brand">ILAVARASI</div>
            <div className="ts-brand-sub">RAJPUTRI TRAVELS</div>
          </div>
          <div className="ts-actions">
            <button onClick={newTrip}>＋ New</button>
            <button onClick={saveTrip}>Save</button>
            <button onClick={printPdf}>PDF / Print</button>
            <button onClick={whatsapp}>WhatsApp</button>
          </div>
        </div>

        <div className="ts-message">{message}</div>

        <div className="ts-layout">
          <main>
            <section className="ts-card">
              <div className="ts-card-title">Trip Details</div>
              <div className="ts-grid">
                <Field label="Trip No">
                  <input value={trip.tripNo} onChange={(e) => update("tripNo", e.target.value)} />
                </Field>
                <Field label="Date" type="date">
                  <input type="date" value={trip.date} onChange={(e) => update("date", e.target.value)} />
                </Field>
                <Field label="Customer Name">
                  <input value={trip.customerName} onChange={(e) => update("customerName", e.target.value)} />
                </Field>
                <Field label="Customer Mobile">
                  <input value={trip.customerMobile} onChange={(e) => update("customerMobile", e.target.value)} />
                </Field>
                <Field label="Trip Type">
                  <select value={trip.tripType} onChange={(e) => update("tripType", e.target.value)}>
                    <option>Round Trip</option>
                    <option>One Way</option>
                    <option>Local</option>
                    <option>Outstation</option>
                    <option>Airport Transfer</option>
                    <option>Temple Tour</option>
                  </select>
                </Field>
                <Field label="Reporting Time">
                  <input type="time" value={trip.reportingTime} onChange={(e) => update("reportingTime", e.target.value)} />
                </Field>
                <Field label="Pickup">
                  <input value={trip.pickup} onChange={(e) => update("pickup", e.target.value)} />
                </Field>
                <Field label="Drop">
                  <input value={trip.drop} onChange={(e) => update("drop", e.target.value)} />
                </Field>
              </div>
            </section>

            <section className="ts-card">
              <div className="ts-card-title">Vehicle & Driver</div>
              <div className="ts-grid">
                <Field label="Vehicle No">
                  <input value={trip.vehicleNo} onChange={(e) => update("vehicleNo", e.target.value)} />
                </Field>
                <Field label="Vehicle">
                  <input value={trip.vehicle} onChange={(e) => update("vehicle", e.target.value)} />
                </Field>
                <Field label="Driver">
                  <input value={trip.driver} onChange={(e) => update("driver", e.target.value)} />
                </Field>
                <Field label="Driver Mobile">
                  <input value={trip.driverMobile} onChange={(e) => update("driverMobile", e.target.value)} />
                </Field>
                <Field label="Starting KM">
                  <input inputMode="numeric" value={trip.startKm} onChange={(e) => update("startKm", e.target.value)} />
                </Field>
                <Field label="Closing KM">
                  <input inputMode="numeric" value={trip.closeKm} onChange={(e) => update("closeKm", e.target.value)} />
                </Field>
              </div>
              <div className="ts-km">Total KM: <b>{totalKm.toLocaleString("en-IN")} KM</b></div>
            </section>

            <section className="ts-card">
              <div className="ts-card-title">Charges</div>
              <div className="ts-charge-grid">
                {[
                  ["vehicleCharge", "Vehicle Charge"],
                  ["toll", "Toll"],
                  ["parking", "Parking"],
                  ["permit", "Permit"],
                  ["driverBata", "Driver Bata"],
                  ["other", "Other Charges"],
                ].map(([key, label]) => (
                  <Field key={key} label={label}>
                    <input
                      inputMode="decimal"
                      value={trip[key as keyof Trip] as string}
                      onChange={(e) => update(key as keyof Trip, e.target.value)}
                      placeholder="₹ 0"
                    />
                  </Field>
                ))}
              </div>
              <div className="ts-total">GRAND TOTAL <strong>{formatINR(grandTotal)}</strong></div>
            </section>

            <section className="ts-card">
              <div className="ts-card-title">Notes</div>
              <textarea rows={3} value={trip.notes} onChange={(e) => update("notes", e.target.value)} />
            </section>
          </main>

          <aside className="ts-history">
            <div className="ts-history-head">
              <div>
                <div className="ts-card-title">Monthly Trip History</div>
                <div className="ts-count">{history.length} saved trip(s)</div>
              </div>
              <button className="danger" onClick={clearHistory}>Clear All</button>
            </div>

            <div className="ts-filter">
              <select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="all">All Months</option>
                {months.map((m) => (
                  <option key={m} value={m}>{monthLabel(m)}</option>
                ))}
              </select>
              <input
                placeholder="Search customer / trip no"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="ts-history-summary">
              <span>Filtered Trips <b>{filteredHistory.length}</b></span>
              <span>Total <b>{formatINR(monthTotal)}</b></span>
            </div>

            <div className="ts-history-list">
              {filteredHistory.length === 0 ? (
                <div className="empty">No trip history yet.</div>
              ) : (
                filteredHistory.map((item) => (
                  <div className="history-item" key={item.id}>
                    <div className="history-main">
                      <b>{item.tripNo}</b>
                      <span>{item.date}</span>
                      <strong>{item.customerName || "Customer"}</strong>
                      <span>{item.pickup || "-"} → {item.drop || "-"}</span>
                    </div>
                    <div className="history-right">
                      <b>{formatINR(
                        money(item.vehicleCharge) +
                        money(item.toll) +
                        money(item.parking) +
                        money(item.permit) +
                        money(item.driverBata) +
                        money(item.other)
                      )}</b>
                      <button onClick={() => loadTrip(item)}>Open</button>
                      <button className="danger" onClick={() => deleteTrip(item.id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>

      <div className="print-only">
        <PrintableTripSheet trip={trip} totalKm={totalKm} grandTotal={grandTotal} />
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #f5f3ef; color: #24201b; font-family: Arial, Helvetica, sans-serif; }
        button, input, select, textarea { font: inherit; }
        button { cursor: pointer; border: 0; }
        .ts-app { min-height: 100vh; }
        .ts-topbar { position: sticky; top: 0; z-index: 20; display:flex; align-items:center; justify-content:space-between; gap:16px; padding:14px 22px; background:#21130d; color:white; box-shadow:0 3px 15px #0002; }
        .ts-brand { font-family: Georgia, serif; letter-spacing:3px; font-size:24px; color:#e8bd68; font-weight:700; }
        .ts-brand-sub { font-size:11px; letter-spacing:3px; margin-top:2px; color:#fff; }
        .ts-actions { display:flex; flex-wrap:wrap; gap:8px; }
        .ts-actions button { background:#e7bd69; color:#24160e; padding:9px 13px; border-radius:7px; font-weight:700; }
        .ts-message { min-height:25px; text-align:center; color:#276749; font-weight:700; padding:4px 12px; }
        .ts-layout { max-width:1400px; margin:auto; padding:18px; display:grid; grid-template-columns:minmax(0, 1.45fr) minmax(330px,.8fr); gap:18px; }
        .ts-card, .ts-history { background:white; border:1px solid #ded8cf; border-radius:12px; box-shadow:0 5px 18px #0000000b; margin-bottom:16px; }
        .ts-card { padding:18px; }
        .ts-card-title { font-size:16px; font-weight:800; color:#6d4817; margin-bottom:13px; }
        .ts-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
        .ts-charge-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; }
        label { display:block; font-size:12px; color:#6b6259; font-weight:700; margin-bottom:6px; }
        input, select, textarea { width:100%; border:1px solid #d8d0c5; border-radius:7px; padding:10px; outline:none; background:#fff; }
        input:focus, select:focus, textarea:focus { border-color:#b8842d; box-shadow:0 0 0 2px #b8842d22; }
        textarea { resize:vertical; }
        .ts-km { margin-top:14px; background:#f7f1e7; border-radius:7px; padding:10px 12px; color:#5e4a34; }
        .ts-total { margin-top:15px; padding:14px; border-radius:8px; background:#21130d; color:#fff; display:flex; justify-content:space-between; align-items:center; }
        .ts-total strong { color:#e8bd68; font-size:20px; }
        .ts-history { padding:16px; position:sticky; top:85px; height:fit-content; max-height:calc(100vh - 105px); overflow:hidden; }
        .ts-history-head { display:flex; justify-content:space-between; gap:8px; align-items:start; }
        .ts-count { font-size:12px; color:#777; }
        .danger { color:#a22a24 !important; background:#fff0ef !important; padding:7px 9px; border-radius:6px; }
        .ts-filter { display:grid; gap:8px; margin:12px 0; }
        .ts-history-summary { display:flex; justify-content:space-between; background:#f7f1e7; padding:9px; border-radius:7px; font-size:12px; }
        .ts-history-list { overflow:auto; max-height:calc(100vh - 300px); margin-top:10px; }
        .history-item { border:1px solid #e6e0d8; border-radius:8px; padding:10px; margin-bottom:8px; display:flex; justify-content:space-between; gap:8px; }
        .history-main { display:grid; gap:3px; font-size:12px; min-width:0; }
        .history-main b { color:#76501c; }
        .history-main strong { font-size:14px; }
        .history-right { display:flex; flex-direction:column; align-items:end; gap:5px; }
        .history-right b { color:#333; }
        .history-right button { padding:5px 7px; border-radius:5px; background:#f2eee8; font-size:11px; }
        .empty { text-align:center; padding:35px 10px; color:#888; }
        .print-only { display:none; }

        @media(max-width:900px) {
          .ts-layout { grid-template-columns:1fr; padding:10px; }
          .ts-history { position:static; max-height:none; }
          .ts-history-list { max-height:500px; }
          .ts-charge-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .ts-topbar { align-items:flex-start; flex-direction:column; }
        }
        @media(max-width:560px) {
          .ts-grid, .ts-charge-grid { grid-template-columns:1fr; }
          .ts-actions button { flex:1; }
        }

        @media print {
          @page { size:A4 portrait; margin:0; }
          html, body { width:210mm; height:297mm; margin:0 !important; padding:0 !important; background:#fff !important; }
          body * { visibility:hidden !important; }
          .ts-app { display:none !important; }
          .print-only, .print-only * { visibility:visible !important; }
          .print-only { display:block !important; width:210mm; height:297mm; overflow:hidden; }
          .print-sheet { width:210mm; height:297mm; max-height:297mm; overflow:hidden; page-break-after:avoid; break-after:avoid; padding:10mm 11mm 8mm; background:#fff; color:#1e1a16; font-family:Arial,Helvetica,sans-serif; }
        }
      `}</style>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
  type?: string;
}) {
  return <div><label>{label}</label>{children}</div>;
}

function monthLabel(month: string) {
  const [y, m] = month.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function PrintableTripSheet({
  trip,
  totalKm,
  grandTotal,
}: {
  trip: Trip;
  totalKm: number;
  grandTotal: number;
}) {
  const rows = [
    ["Vehicle Charge", trip.vehicleCharge],
    ["Toll", trip.toll],
    ["Parking", trip.parking],
    ["Permit", trip.permit],
    ["Driver Bata", trip.driverBata],
    ["Other Charges", trip.other],
  ];

  return (
    <div className="print-sheet">
      <div style={{ border: "1.5px solid #8d641f", height: "100%", padding: "6mm", position: "relative" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #d8c39a", paddingBottom:"4mm" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"4mm" }}>
            <LogoMark />
            <div>
              <div style={{ fontFamily:"Georgia,serif", fontSize:"24px", letterSpacing:"3px", fontWeight:800, color:"#9b6c1e" }}>ILAVARASI</div>
              <div style={{ fontSize:"12px", letterSpacing:"3px", fontWeight:800 }}>RAJPUTRI TRAVELS</div>
              <div style={{ fontSize:"8px", color:"#777", marginTop:"1mm" }}>Airport Pickup & Drop · Temple Tours · Outstation Taxi</div>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:"20px", fontWeight:900, letterSpacing:"1px" }}>TRIP SHEET</div>
            <div style={{ fontSize:"9px", marginTop:"2mm" }}>Trip No: <b>{trip.tripNo}</b></div>
            <div style={{ fontSize:"9px" }}>Date: <b>{trip.date}</b></div>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3mm", marginTop:"4mm" }}>
          <Info label="Customer Name" value={trip.customerName} />
          <Info label="Customer Mobile" value={trip.customerMobile} />
          <Info label="Trip Type" value={trip.tripType} />
          <Info label="Reporting Time" value={trip.reportingTime} />
          <Info label="Pickup" value={trip.pickup} />
          <Info label="Drop" value={trip.drop} />
        </div>

        <div style={{ marginTop:"4mm", background:"#f7f1e7", padding:"3mm", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"3mm", borderRadius:"1mm" }}>
          <Info label="Vehicle No" value={trip.vehicleNo} />
          <Info label="Vehicle" value={trip.vehicle} />
          <Info label="Driver" value={trip.driver} />
          <Info label="Driver Mobile" value={trip.driverMobile} />
          <Info label="Starting KM" value={trip.startKm} />
          <Info label="Closing KM" value={trip.closeKm} />
        </div>

        <div style={{ marginTop:"4mm", border:"1px solid #d7d0c6" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 35mm", background:"#21130d", color:"#fff", padding:"2.5mm 3mm", fontWeight:800, fontSize:"9px" }}>
            <span>CHARGE DESCRIPTION</span><span style={{ textAlign:"right" }}>AMOUNT</span>
          </div>
          {rows.map(([name, value]) => (
            <div key={name} style={{ display:"grid", gridTemplateColumns:"1fr 35mm", padding:"2.2mm 3mm", borderTop:"1px solid #eee8df", fontSize:"9px" }}>
              <span>{name}</span><span style={{ textAlign:"right" }}>{formatINR(money(value))}</span>
            </div>
          ))}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 35mm", padding:"3mm", background:"#f5ead3", borderTop:"1px solid #cdb887", fontSize:"12px", fontWeight:900 }}>
            <span>GRAND TOTAL</span><span style={{ textAlign:"right" }}>{formatINR(grandTotal)}</span>
          </div>
        </div>

        <div style={{ marginTop:"3mm", fontSize:"9px", color:"#555" }}>
          <b>Notes:</b> {trip.notes || "-"}
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"4mm", paddingTop:"3mm", borderTop:"1px solid #d8c39a" }}>
          <div style={{ fontSize:"8px", lineHeight:1.55 }}>
            <b>RAJPUTRI TRAVELS</b><br />
            8489999568 · www.rajputritravels.com<br />
            blog.rajputritravels.com
          </div>
          <DigitalSeal />
          <div style={{ textAlign:"right", fontSize:"8px", lineHeight:1.55 }}>
            <b>Total Distance</b><br />
            <span style={{ fontSize:"13px", fontWeight:900 }}>{totalKm.toLocaleString("en-IN")} KM</span><br />
            <span>Digitally Generated Trip Sheet</span>
          </div>
        </div>

        <div style={{ position:"absolute", bottom:"3mm", left:"6mm", right:"6mm", textAlign:"center", fontSize:"7px", color:"#777", letterSpacing:".5px" }}>
          Safe · Comfortable · On-Time Travel
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize:"7px", textTransform:"uppercase", letterSpacing:".7px", color:"#826f59", fontWeight:800 }}>{label}</div>
      <div style={{ fontSize:"9.5px", fontWeight:700, marginTop:"1mm", minHeight:"4mm" }}>{value || "-"}</div>
    </div>
  );
}

function LogoMark() {
  return (
    <svg width="54" height="54" viewBox="0 0 100 100" aria-label="ILAVARASI logo">
      <circle cx="50" cy="50" r="47" fill="#21130d" stroke="#c99b4b" strokeWidth="4"/>
      <path d="M24 36 L31 22 L40 31 L50 17 L60 31 L69 22 L76 36 L70 43 L30 43 Z" fill="#e7bd69"/>
      <path d="M30 48 Q50 40 70 48 L67 73 Q50 83 33 73 Z" fill="none" stroke="#e7bd69" strokeWidth="3"/>
      <text x="50" y="64" textAnchor="middle" fill="#fff" fontSize="15" fontFamily="Georgia" fontWeight="700">IL</text>
    </svg>
  );
}

function DigitalSeal() {
  return (
    <svg width="70" height="70" viewBox="0 0 100 100" aria-label="Digital official seal">
      <circle cx="50" cy="50" r="46" fill="#fff" stroke="#8d641f" strokeWidth="3"/>
      <circle cx="50" cy="50" r="37" fill="none" stroke="#c39a51" strokeWidth="1.5" strokeDasharray="2 3"/>
      <text x="50" y="29" textAnchor="middle" fontSize="7" fontWeight="700" fill="#6d4817">ILAVARASI</text>
      <text x="50" y="39" textAnchor="middle" fontSize="6" fontWeight="700" fill="#6d4817">RAJPUTRI TRAVELS</text>
      <circle cx="50" cy="52" r="12" fill="#21130d"/>
      <text x="50" y="57" textAnchor="middle" fontSize="13" fontWeight="800" fill="#e7bd69">RT</text>
      <text x="50" y="74" textAnchor="middle" fontSize="7" fontWeight="800" fill="#6d4817">✓ OFFICIAL</text>
    </svg>
  );
}
