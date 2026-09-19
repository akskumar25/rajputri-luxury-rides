import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";

export const Route = createFileRoute("/tripsheet")({
  component: TripSheetPage,
});

type Trip = {
  id: string;
  tripNo: string;
  date: string;
  endDate: string;
  customerName: string;
  customerMobile: string;
  tripType: string;
  reportingTime: string;
  releaseTime: string;
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

const STORAGE_KEY = "rajputri_trip_history_v2";

const today = () => new Date().toISOString().slice(0, 10);

const newTrip = (): Trip => ({
  id: crypto.randomUUID(),
  tripNo: `RT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
  date: today(),
  endDate: today(),
  customerName: "",
  customerMobile: "",
  tripType: "Round Trip",
  reportingTime: "",
  releaseTime: "",
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

const num = (v: string) => {
  const n = Number(v || 0);
  return Number.isFinite(n) ? n : 0;
};

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const totalAmount = (t: Trip) =>
  num(t.vehicleCharge) +
  num(t.toll) +
  num(t.parking) +
  num(t.permit) +
  num(t.driverBata) +
  num(t.other);

function TripSheetPage() {
  const [trip, setTrip] = useState<Trip>(newTrip());
  const [history, setHistory] = useState<Trip[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

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

  const totalKm = Math.max(0, num(trip.closeKm) - num(trip.startKm));

  const rentalDays = useMemo(() => {
    if (trip.tripType !== "Full Day Rental") return 0;

    const start = new Date(`${trip.date}T${trip.reportingTime || "00:00"}`);
    const end = new Date(`${trip.endDate || trip.date}T${trip.releaseTime || trip.reportingTime || "00:00"}`);
    const hours = !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())
      ? Math.max(0, (end.getTime() - start.getTime()) / 3600000)
      : 0;

    const daysByHours = hours > 0 ? Math.ceil(hours / 12) : 1;
    const daysByKm = totalKm > 0 ? Math.ceil(totalKm / 220) : 1;
    return Math.max(1, daysByHours, daysByKm);
  }, [trip.tripType, trip.date, trip.endDate, trip.reportingTime, trip.releaseTime, totalKm]);

  const rentalAmount = rentalDays * 2000;
  const total = trip.tripType === "Full Day Rental"
    ? rentalAmount + num(trip.toll) + num(trip.parking) + num(trip.permit) + num(trip.driverBata) + num(trip.other)
    : totalAmount(trip);

  const save = (item = trip) => {
    const next = [item, ...history.filter((x) => x.id !== item.id)];
    setHistory(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const saveTrip = () => {
    if (!trip.customerName.trim()) {
      setNotice("Customer Name உள்ளிடவும்.");
      return;
    }
    save();
    setNotice("Trip Sheet History-ல் சேமிக்கப்பட்டது.");
    window.setTimeout(() => setNotice(""), 2500);
  };

  const printPdf = () => {
    save();
    window.setTimeout(() => window.print(), 150);
  };

  const shareWhatsApp = () => {
    save();
    const phone = trip.customerMobile.replace(/\D/g, "");
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
      `https://wa.me/${phone.startsWith("91") ? phone : `91${phone}`}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  const months = useMemo(() => {
    return Array.from(
      new Set(history.map((x) => x.date.slice(0, 7)).filter(Boolean)),
    ).sort().reverse();
  }, [history]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return history.filter((x) => {
      const monthOk =
        selectedMonth === "all" || x.date.startsWith(selectedMonth);

      const haystack = [
        x.tripNo,
        x.customerName,
        x.customerMobile,
        x.pickup,
        x.drop,
        x.vehicleNo,
      ]
        .join(" ")
        .toLowerCase();

      return monthOk && (!q || haystack.includes(q));
    });
  }, [history, selectedMonth, search]);

  const filteredTotal = filtered.reduce((sum, item) => {
    if (item.tripType === "Full Day Rental") {
      const km = Math.max(0, num(item.closeKm) - num(item.startKm));
      const start = new Date(`${item.date}T${item.reportingTime || "00:00"}`);
      const end = new Date(`${item.endDate || item.date}T${item.releaseTime || item.reportingTime || "00:00"}`);
      const hours = !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())
        ? Math.max(0, (end.getTime() - start.getTime()) / 3600000)
        : 0;
      const days = Math.max(1, hours > 0 ? Math.ceil(hours / 12) : 1, km > 0 ? Math.ceil(km / 220) : 1);
      return sum + days * 2000 + num(item.toll) + num(item.parking) + num(item.permit) + num(item.driverBata) + num(item.other);
    }
    return sum + totalAmount(item);
  }, 0);

  const openTrip = (item: Trip) => {
    setTrip(item);
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

  return (
    <>
      <div className="ts-app">
        <header className="app-header">
          <div className="app-brand">
            <MiniLogo />
            <div>
              <div className="app-brand-main">RAJPUTRI</div>
              <div className="app-brand-sub">TOURS &amp; TRAVELS</div>
            </div>
          </div>

          <div className="app-buttons">
            <button onClick={() => setTrip(newTrip())}>＋ NEW TRIP</button>
            <button onClick={saveTrip}>SAVE</button>
            <button onClick={printPdf}>PDF / PRINT</button>
            <button onClick={shareWhatsApp}>WHATSAPP</button>
          </div>
        </header>

        <div className="notice">{notice}</div>

        <div className="workspace">
          <main>
            <section className="form-card">
              <CardTitle title="Trip Details" />
              <div className="form-grid">
                <Field label="Trip No">
                  <input value={trip.tripNo} onChange={(e) => update("tripNo", e.target.value)} />
                </Field>
                <Field label="Date">
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
                    <option>Full Day Rental</option>
                  </select>
                </Field>
                <Field label={trip.tripType === "Full Day Rental" ? "Start Time" : "Reporting Time"}>
                  <input type="time" value={trip.reportingTime} onChange={(e) => update("reportingTime", e.target.value)} />
                </Field>
                <Field label="Pickup">
                  <input value={trip.pickup} onChange={(e) => update("pickup", e.target.value)} />
                </Field>
                <Field label="Drop">
                  <input value={trip.drop} onChange={(e) => update("drop", e.target.value)} />
                </Field>

                {trip.tripType === "Full Day Rental" && (
                  <>
                    <Field label="Rental End Date">
                      <input type="date" value={trip.endDate} onChange={(e) => update("endDate", e.target.value)} />
                    </Field>
                    <Field label="Release / End Time">
                      <input type="time" value={trip.releaseTime} onChange={(e) => update("releaseTime", e.target.value)} />
                    </Field>
                  </>
                )}
              </div>

              {trip.tripType === "Full Day Rental" && (
                <div className="rental-rule-card">
                  <div className="rental-rule-title">FULL DAY RENTAL — ₹2,000 / DAY</div>
                  <div className="rental-rule-grid">
                    <div><b>12 HOURS</b><span>OR</span><b>200 KM</b></div>
                    <div><b>200 + 20 KM</b><span>GRACE KM</span></div>
                    <div><b>220 KM+</b><span>NEXT DAY ₹2,000</span></div>
                  </div>
                  <p>Daily Rental is a fixed package charge. Lower KM usage does not reduce the daily rental. KM-based rate calculation does not apply.</p>
                  <p><b>Fuel, Toll, Parking, Permit and other applicable charges are payable by the Customer.</b></p>
                  <div className="rental-calculation">Rental Days: <strong>{rentalDays}</strong> × ₹2,000 = <strong>{inr(rentalAmount)}</strong></div>
                </div>
              )}
            </section>

            <section className="form-card">
              <CardTitle title="Vehicle & Driver Details" />
              <div className="form-grid">
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

              <div className="km-box">
                TOTAL DISTANCE: <strong>{totalKm.toLocaleString("en-IN")} KM</strong>
              </div>
            </section>

            <section className="form-card">
              <CardTitle title={trip.tripType === "Full Day Rental" ? "Rental & Other Charges" : "Charge Details"} />
              {trip.tripType === "Full Day Rental" && (
                <div className="fixed-rental">
                  <span>DAILY RENTAL</span>
                  <strong>{rentalDays} × ₹2,000 = {inr(rentalAmount)}</strong>
                </div>
              )}
              <div className="charge-grid">
                {trip.tripType !== "Full Day Rental" && (
                  <AmountField label="Vehicle Charge" value={trip.vehicleCharge} onChange={(v) => update("vehicleCharge", v)} />
                )}
                <AmountField label="Toll" value={trip.toll} onChange={(v) => update("toll", v)} />
                <AmountField label="Parking" value={trip.parking} onChange={(v) => update("parking", v)} />
                <AmountField label="Permit" value={trip.permit} onChange={(v) => update("permit", v)} />
                <AmountField label="Driver Bata" value={trip.driverBata} onChange={(v) => update("driverBata", v)} />
                <AmountField label="Other Charges" value={trip.other} onChange={(v) => update("other", v)} />
              </div>

              <div className="grand-total">
                <span>GRAND TOTAL</span>
                <strong>{inr(total)}</strong>
              </div>
            </section>

            <section className="form-card">
              <CardTitle title="Notes" />
              <textarea rows={3} value={trip.notes} onChange={(e) => update("notes", e.target.value)} />
            </section>
          </main>

          <aside className="history-card">
            <div className="history-heading">
              <div>
                <div className="history-title">MONTHLY TRIP HISTORY</div>
                <div className="history-count">{history.length} saved trip(s)</div>
              </div>
              <button className="clear-btn" onClick={clearHistory}>CLEAR</button>
            </div>

            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option value="all">All Months</option>
              {months.map((m) => (
                <option value={m} key={m}>{monthName(m)}</option>
              ))}
            </select>

            <input
              className="history-search"
              placeholder="Search customer / trip no"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="history-summary">
              <span>Trips <b>{filtered.length}</b></span>
              <span>Total <b>{inr(filteredTotal)}</b></span>
            </div>

            <div className="history-list">
              {filtered.length === 0 ? (
                <div className="empty-history">No trip history yet.</div>
              ) : (
                filtered.map((item) => (
                  <div className="history-item" key={item.id}>
                    <div>
                      <b>{item.tripNo}</b>
                      <strong>{item.customerName || "Customer"}</strong>
                      <span>{item.date}</span>
                      <span>{item.pickup || "-"} → {item.drop || "-"}</span>
                    </div>
                    <div className="history-actions">
                      <strong>{inr(item.tripType === "Full Day Rental" ? (() => {
                        const km = Math.max(0, num(item.closeKm) - num(item.startKm));
                        const start = new Date(`${item.date}T${item.reportingTime || "00:00"}`);
                        const end = new Date(`${item.endDate || item.date}T${item.releaseTime || item.reportingTime || "00:00"}`);
                        const hours = !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) ? Math.max(0, (end.getTime() - start.getTime()) / 3600000) : 0;
                        const days = Math.max(1, hours > 0 ? Math.ceil(hours / 12) : 1, km > 0 ? Math.ceil(km / 220) : 1);
                        return days * 2000 + num(item.toll) + num(item.parking) + num(item.permit) + num(item.driverBata) + num(item.other);
                      })() : totalAmount(item))}</strong>
                      <button onClick={() => openTrip(item)}>OPEN</button>
                      <button className="delete-btn" onClick={() => deleteTrip(item.id)}>DELETE</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>

      <div className="print-area">
        <PrintableTripSheet trip={trip} totalKm={totalKm} total={total} rentalDays={rentalDays} rentalAmount={rentalAmount} />
      </div>

      <style>{`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          background: #f3f1ee;
          color: #201b17;
          font-family: Arial, Helvetica, sans-serif;
        }

        button, input, select, textarea { font: inherit; }

        button {
          cursor: pointer;
          border: 0;
        }

        .ts-app { min-height: 100vh; }

        .app-header {
          position: sticky;
          top: 0;
          z-index: 30;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 14px 22px;
          background: #120e0c;
          color: white;
          box-shadow: 0 4px 20px #0004;
        }

        .app-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .app-brand-main {
          font-family: Georgia, serif;
          color: #e5b95f;
          font-size: 27px;
          font-weight: 900;
          letter-spacing: 3px;
        }

        .app-brand-sub {
          color: white;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .app-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .app-buttons button {
          padding: 10px 13px;
          border-radius: 7px;
          background: #d8ad56;
          color: #1b120c;
          font-size: 12px;
          font-weight: 900;
        }

        .notice {
          min-height: 30px;
          padding: 6px;
          text-align: center;
          color: #216b42;
          font-size: 13px;
          font-weight: 800;
        }

        .workspace {
          width: min(1450px, 100%);
          margin: auto;
          padding: 16px;
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(350px, .75fr);
          gap: 18px;
        }

        .form-card, .history-card {
          background: white;
          border: 1px solid #ddd6ce;
          border-radius: 12px;
          box-shadow: 0 5px 20px #0000000c;
          margin-bottom: 16px;
        }

        .form-card { padding: 20px; }

        .card-title {
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 2px solid #ead8b5;
          color: #734c18;
          font-size: 19px;
          font-weight: 900;
          letter-spacing: .3px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 15px;
        }

        label {
          display: block;
          margin-bottom: 7px;
          color: #625a52;
          font-size: 13px;
          font-weight: 800;
        }

        input, select, textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #cec6bc;
          border-radius: 7px;
          background: white;
          color: #211c18;
          font-size: 16px;
          outline: none;
        }

        input:focus, select:focus, textarea:focus {
          border-color: #a67528;
          box-shadow: 0 0 0 3px #a6752820;
        }

        .km-box {
          margin-top: 15px;
          padding: 12px 14px;
          background: #f7f0e3;
          border-radius: 7px;
          color: #60451f;
          font-size: 15px;
          font-weight: 800;
        }

        .km-box strong {
          font-size: 18px;
        }

        .charge-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
        }

        .grand-total {
          margin-top: 17px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 8px;
          background: #17110e;
          color: white;
          font-size: 17px;
          font-weight: 900;
        }

        .grand-total strong {
          color: #e7bd69;
          font-size: 24px;
        }

        .history-card {
          position: sticky;
          top: 88px;
          height: fit-content;
          max-height: calc(100vh - 105px);
          overflow: hidden;
          padding: 18px;
        }

        .history-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 13px;
        }

        .history-title {
          color: #734c18;
          font-size: 18px;
          font-weight: 900;
        }

        .history-count {
          margin-top: 4px;
          color: #777;
          font-size: 12px;
        }

        .clear-btn, .delete-btn {
          color: #9b2d27;
          background: #fff0ee;
          padding: 7px 9px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 800;
        }

        .history-search { margin-top: 9px; }

        .history-summary {
          margin: 12px 0;
          padding: 11px;
          display: flex;
          justify-content: space-between;
          border-radius: 7px;
          background: #f6efe3;
          font-size: 13px;
        }

        .history-list {
          overflow-y: auto;
          max-height: calc(100vh - 305px);
        }

        .history-item {
          padding: 11px;
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
          gap: 10px;
          border: 1px solid #e3ddd5;
          border-radius: 8px;
        }

        .history-item > div:first-child {
          min-width: 0;
          display: grid;
          gap: 4px;
          font-size: 12px;
        }

        .history-item > div:first-child b {
          color: #80591e;
        }

        .history-item > div:first-child strong {
          font-size: 15px;
        }

        .history-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
        }

        .history-actions > strong { font-size: 13px; }

        .history-actions button {
          padding: 5px 7px;
          border-radius: 5px;
          background: #f0ece6;
          font-size: 10px;
          font-weight: 800;
        }

        .empty-history {
          padding: 35px 10px;
          text-align: center;
          color: #888;
        }

        .rental-rule-card { margin-top: 17px; padding: 16px; border: 2px solid #d2ae67; border-radius: 9px; background: linear-gradient(135deg,#fffaf0,#f7edd7); }
        .rental-rule-title { color:#6e4514; font-size:18px; font-weight:900; }
        .rental-rule-grid { margin:13px 0; display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
        .rental-rule-grid div { padding:10px; display:flex; flex-direction:column; gap:3px; align-items:center; text-align:center; background:#fff; border:1px solid #ead9b8; border-radius:7px; }
        .rental-rule-grid b { color:#2b2118; font-size:15px; }
        .rental-rule-grid span { color:#826d50; font-size:10px; font-weight:800; }
        .rental-rule-card p { margin:7px 0; color:#554a3e; font-size:13px; line-height:1.5; }
        .rental-calculation { margin-top:11px; padding:11px; border-radius:6px; background:#17110e; color:white; font-size:14px; }
        .rental-calculation strong { color:#e6bb63; font-size:17px; }
        .fixed-rental { margin-bottom:15px; padding:14px; display:flex; justify-content:space-between; border-radius:7px; background:#17110e; color:white; font-size:15px; font-weight:900; }
        .fixed-rental strong { color:#e6bb63; font-size:18px; }

        /* A4 print layout */
        .print-border { width:100%; height:100%; border:1.4px solid #a77a2b; padding:5.5mm; position:relative; overflow:hidden; background:#fff; }
        .print-header { display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #d9c18f; padding-bottom:3.5mm; }
        .logo-area { display:flex; align-items:center; gap:3.5mm; }
        .logo-name { font-family:Georgia,serif; font-size:25px; line-height:1; font-weight:900; letter-spacing:3px; color:#9a6b1e; }
        .logo-sub { margin-top:1.5mm; font-size:11px; font-weight:900; letter-spacing:2.5px; color:#17110e; }
        .logo-tagline { margin-top:1.5mm; font-size:8px; color:#685a49; font-weight:700; }
        .trip-title-box { text-align:right; font-size:9px; }
        .trip-title { display:inline-block; padding:2mm 4mm; background:#17110e; color:#e6bb63; border-radius:1.5mm; font-size:19px; font-weight:900; letter-spacing:1px; margin-bottom:2mm; }
        .service-line { margin-top:2.5mm; text-align:center; font-size:8px; font-weight:800; color:#6b5a44; letter-spacing:.3px; }
        .print-section-heading { margin-top:3mm; padding:2.2mm 3mm; background:#17110e; color:#fff; font-size:9px; font-weight:900; letter-spacing:.5px; }
        .info-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:3mm; padding:3mm; border:1px solid #ded7ce; border-top:none; }
        .vehicle-grid { background:#f8f0e1; border:none; }
        .print-info { min-width:0; }
        .print-label { font-size:7px; text-transform:uppercase; letter-spacing:.6px; color:#826f59; font-weight:900; }
        .print-value { margin-top:1mm; min-height:4mm; font-size:10px; font-weight:800; word-break:break-word; }
        .distance-strip { margin-top:2.5mm; padding:2.5mm 4mm; display:flex; justify-content:space-between; align-items:center; background:#f2dfb6; border:1px solid #d1ad65; font-size:9px; font-weight:900; }
        .distance-strip b { font-size:16px; }
        .charge-table { width:100%; border-collapse:collapse; font-size:9px; }
        .charge-table th { padding:1.8mm; border:1px solid #d8d0c6; background:#f4e5c6; }
        .charge-table td { padding:1.8mm; border:1px solid #e2ddd7; }
        .charge-table td:first-child { text-align:center; }
        .charge-table td:last-child { text-align:right; font-weight:800; }
        .total-row td { background:#e9c879; border-color:#c7a45f; font-size:12px; font-weight:900; }
        .notes-box { margin-top:2.5mm; padding:2mm 3mm; border:1px solid #ddd5ca; font-size:8px; line-height:1.4; }
        .bottom-area { margin-top:3mm; padding-top:2.5mm; border-top:1px solid #d8c39a; display:grid; grid-template-columns:1fr 82px 1fr; align-items:center; gap:4mm; }
        .contact-block, .digital-block { font-size:8px; line-height:1.55; }
        .contact-brand { font-size:10px; font-weight:900; color:#754b14; }
        .digital-block { text-align:right; }
        .distance-big { font-size:16px; font-weight:900; }
        .distance-caption { font-size:8px; font-weight:900; }
        .digital-note { margin-top:1mm; }
        .footer-line { position:absolute; bottom:3mm; left:5mm; right:5mm; padding-top:2mm; border-top:1px solid #d7c093; display:flex; justify-content:space-between; font-size:7px; color:#746a60; font-weight:700; }

        .rental-print-terms { margin-top:2.5mm; padding:2.2mm 3mm; border:1px solid #d3ae68; background:#fff9ed; font-size:7.5px; line-height:1.4; }
        .rental-print-title { color:#704713; font-size:9px; font-weight:900; margin-bottom:1mm; }

        .print-area { display: none; }

        @media(max-width: 950px) {
          .workspace { grid-template-columns: 1fr; }
          .history-card {
            position: static;
            max-height: none;
          }
          .history-list { max-height: 500px; }
        }

        @media(max-width: 650px) {
          .app-header {
            align-items: flex-start;
            flex-direction: column;
          }
          .form-grid, .charge-grid, .rental-rule-grid { grid-template-columns: 1fr; }
          .workspace { padding: 9px; }
          .form-card { padding: 15px; }
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          body * {
            visibility: hidden !important;
          }

          .ts-app {
            display: none !important;
          }

          .print-area,
          .print-area * {
            visibility: visible !important;
          }

          .print-area {
            display: block !important;
            width: 210mm;
            height: 297mm;
            overflow: hidden;
          }

          .print-sheet {
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            overflow: hidden;
            padding: 8mm;
            background: white;
            color: #171310;
            font-family: Arial, Helvetica, sans-serif;
            page-break-after: avoid;
            break-after: avoid;
          }
        }
      `}</style>
    </>
  );
}

function CardTitle({ title }: { title: string }) {
  return <div className="card-title">{title}</div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label>{label}</label>
      {children}
    </div>
  );
}

function AmountField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <input
        inputMode="decimal"
        placeholder="₹ 0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

function monthName(value: string) {
  const [year, month] = value.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
    "en-IN",
    { month: "long", year: "numeric" },
  );
}

function MiniLogo() {
  return (
    <svg width="54" height="54" viewBox="0 0 100 100" aria-label="Rajputri logo">
      <circle cx="50" cy="50" r="46" fill="#111" stroke="#e3b75c" strokeWidth="4" />
      <path
        d="M21 45 C29 22 43 16 58 20 C73 24 80 35 79 49 C76 69 62 80 45 80 C31 79 23 67 21 45Z"
        fill="#21150e"
        stroke="#e3b75c"
        strokeWidth="2"
      />
      <path
        d="M30 39 L35 25 L43 32 L50 19 L57 32 L65 25 L70 39 L64 44 L36 44Z"
        fill="#e3b75c"
      />
      <text x="50" y="66" textAnchor="middle" fill="#e3b75c" fontSize="28" fontFamily="Georgia" fontWeight="900">
        R
      </text>
    </svg>
  );
}

function PrintLogo() {
  return (
    <svg width="76" height="76" viewBox="0 0 100 100" aria-label="Rajputri Tours and Travels logo">
      <circle cx="50" cy="50" r="47" fill="#111" stroke="#d8aa50" strokeWidth="3" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="#8f681f" strokeWidth="1" />
      <path
        d="M22 42 C27 25 42 17 56 20 C71 23 79 36 77 51 C74 67 63 78 48 80 C34 79 25 67 22 42Z"
        fill="#19120e"
        stroke="#d8aa50"
        strokeWidth="1.5"
      />
      <path
        d="M30 37 L34 23 L42 30 L50 17 L58 30 L66 23 L70 37 L64 42 L36 42Z"
        fill="#d8aa50"
      />
      <text x="50" y="64" textAnchor="middle" fill="#e5b95f" fontSize="29" fontFamily="Georgia" fontWeight="900">
        R
      </text>
      <text x="50" y="88" textAnchor="middle" fill="#e5b95f" fontSize="5.5" fontWeight="800" letterSpacing="1">
        RAJPUTRI
      </text>
    </svg>
  );
}

function DigitalSeal() {
  return (
    <svg width="82" height="82" viewBox="0 0 100 100" aria-label="Official digital seal">
      <circle cx="50" cy="50" r="46" fill="white" stroke="#9b7026" strokeWidth="3" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#c39a50" strokeWidth="1.5" strokeDasharray="2 3" />
      <text x="50" y="27" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="#6f4c19">
        RAJPUTRI
      </text>
      <text x="50" y="35" textAnchor="middle" fontSize="5.3" fontWeight="800" fill="#6f4c19">
        TOURS &amp; TRAVELS
      </text>
      <circle cx="50" cy="51" r="12" fill="#17110e" />
      <text x="50" y="56" textAnchor="middle" fontSize="13" fontWeight="900" fill="#e3b75c">
        R
      </text>
      <text x="50" y="72" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#6f4c19">
        ✓ OFFICIAL
      </text>
      <text x="50" y="81" textAnchor="middle" fontSize="5" fontWeight="700" fill="#777">
        DIGITAL TRIP SHEET
      </text>
    </svg>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="print-info">
      <div className="print-label">{label}</div>
      <div className="print-value">{value || "-"}</div>
    </div>
  );
}

function PrintableTripSheet({
  trip,
  totalKm,
  total,
  rentalDays,
  rentalAmount,
}: {
  trip: Trip;
  totalKm: number;
  total: number;
  rentalDays: number;
  rentalAmount: number;
}) {
  const isRental = trip.tripType === "Full Day Rental";
  const charges = isRental
    ? [
        ["Daily Rental", rentalAmount],
        ["Toll", num(trip.toll)],
        ["Parking", num(trip.parking)],
        ["Permit", num(trip.permit)],
        ["Driver Bata", num(trip.driverBata)],
        ["Other Charges", num(trip.other)],
      ]
    : [
        ["Vehicle Charge", num(trip.vehicleCharge)],
        ["Toll", num(trip.toll)],
        ["Parking", num(trip.parking)],
        ["Permit", num(trip.permit)],
        ["Driver Bata", num(trip.driverBata)],
        ["Other Charges", num(trip.other)],
      ];

  return (
    <div className="print-sheet">
      <div className="print-border">
        <div className="print-header">
          <div className="logo-area">
            <PrintLogo />
            <div>
              <div className="logo-name">RAJPUTRI</div>
              <div className="logo-sub">TOURS &amp; TRAVELS</div>
              <div className="logo-tagline">Safe Journey · Happy Memories</div>
            </div>
          </div>
          <div className="trip-title-box">
            <div className="trip-title">TRIP SHEET</div>
            <div>Trip No: <b>{trip.tripNo}</b></div>
            <div style={{ marginTop: "1mm" }}>Date: <b>{trip.date}</b></div>
          </div>
        </div>

        <div className="service-line">Airport Pickup &amp; Drop · Temple Tours · Outstation Taxi · Car Rental</div>

        <div className="print-section-heading">CUSTOMER &amp; TRIP DETAILS</div>
        <div className="info-grid">
          <Info label="Customer Name" value={trip.customerName} />
          <Info label="Customer Mobile" value={trip.customerMobile} />
          <Info label="Trip Type" value={trip.tripType} />
          <Info label={isRental ? "Start Time" : "Reporting Time"} value={trip.reportingTime} />
          <Info label="Pickup" value={trip.pickup} />
          <Info label="Drop" value={trip.drop} />
          {isRental && <Info label="Rental End Date" value={trip.endDate} />}
          {isRental && <Info label="Release / End Time" value={trip.releaseTime} />}
          {isRental && <Info label="Package" value="₹2,000 / 12 Hours / 200 KM" />}
        </div>

        <div className="print-section-heading">VEHICLE &amp; DRIVER DETAILS</div>
        <div className="info-grid vehicle-grid">
          <Info label="Vehicle No" value={trip.vehicleNo} />
          <Info label="Vehicle" value={trip.vehicle} />
          <Info label="Driver" value={trip.driver} />
          <Info label="Driver Mobile" value={trip.driverMobile} />
          <Info label="Starting KM" value={trip.startKm} />
          <Info label="Closing KM" value={trip.closeKm} />
        </div>

        <div className="distance-strip">
          <span>TOTAL DISTANCE</span>
          <b>{totalKm.toLocaleString("en-IN")} KM</b>
        </div>

        {isRental && (
          <div className="rental-print-terms">
            <div className="rental-print-title">DAILY RENTAL TERMS — ₹2,000 / DAY</div>
            <div>
              One Day Rental = <b>12 Hours or 200 KM</b>. The daily rental is a fixed package charge;
              lower KM usage does not reduce the charge and KM-based rate calculation does not apply.
            </div>
            <div>
              After 200 KM, up to <b>20 additional KM</b> is allowed without extra charge.
              Beyond 220 KM, the <b>next day rental charge of ₹2,000</b> applies.
            </div>
            <div><b>Fuel, Toll, Parking, Permit and other applicable charges are payable by the Customer.</b></div>
          </div>
        )}

        <div className="print-section-heading">CHARGE DETAILS</div>
        <table className="charge-table">
          <thead>
            <tr>
              <th style={{ width: "13%" }}>S.NO</th>
              <th>DESCRIPTION</th>
              <th style={{ width: "25%" }}>AMOUNT (₹)</th>
            </tr>
          </thead>
          <tbody>
            {charges.map(([label, value], index) => (
              <tr key={label}>
                <td>{index + 1}</td>
                <td>{label}{label === "Daily Rental" ? ` (${rentalDays} day${rentalDays > 1 ? "s" : ""})` : ""}</td>
                <td>{money(value as number)}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan={2}>GRAND TOTAL</td>
              <td>{money(total)}</td>
            </tr>
          </tbody>
        </table>

        <div className="notes-box"><b>Notes:</b> {trip.notes || "-"}</div>

        <div className="bottom-area">
          <div className="contact-block">
            <div className="contact-brand">RAJPUTRI TOURS &amp; TRAVELS</div>
            <div>8489999568</div>
            <div>www.rajputritravels.com</div>
            <div>blog.rajputritravels.com</div>
          </div>
          <DigitalSeal />
          <div className="digital-block">
            <div className="distance-big">{totalKm.toLocaleString("en-IN")} KM</div>
            <div className="distance-caption">TOTAL DISTANCE</div>
            <div className="digital-note">Digitally Generated Trip Sheet</div>
          </div>
        </div>

        <div className="footer-line">
          <span>RAJPUTRI TOURS &amp; TRAVELS</span>
          <span>Safe · Comfortable · On-Time Travel</span>
        </div>
      </div>
    </div>
  );
}
