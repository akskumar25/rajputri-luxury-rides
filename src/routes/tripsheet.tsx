import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  FileText,
  History,
  IndianRupee,
  MapPin,
  MessageCircle,
  Phone,
  Printer,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

export const Route = createFileRoute("/tripsheet")({
  component: TripSheet,
});

type TripType =
  | "One Way"
  | "Round Trip"
  | "Local"
  | "Outstation"
  | "Airport Transfer"
  | "Temple Tour"
  | "Full Day Rental";

type Trip = {
  id: string;
  tripNo: string;
  date: string;
  endDate: string;
  customerName: string;
  customerMobile: string;
  tripType: TripType;
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
};

const STORAGE_KEY = "rajputri_trip_history_v4";
const DAILY_RENTAL = 2000;

const todayString = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

const numberValue = (value: string | number | undefined) => {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
};

const formatDate = (value: string) => {
  if (!value) return "-";
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const createTrip = (tripNo = "RT-0001"): Trip => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  tripNo,
  date: todayString(),
  endDate: todayString(),
  customerName: "",
  customerMobile: "",
  tripType: "Round Trip",
  reportingTime: "07:00",
  releaseTime: "",
  pickup: "Chidambaram",
  drop: "",
  vehicleNo: "TN91AD9766",
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
  notes: "",
});

function RoyalLogo({ small = false }: { small?: boolean }) {
  const size = small ? 62 : 88;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-label="Rajputri logo"
      role="img"
    >
      <circle cx="50" cy="50" r="47" fill="#111" stroke="#c9a227" strokeWidth="3" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#c9a227" strokeWidth="1.5" />
      <path
        d="M31 31 L37 20 L44 28 L50 17 L56 28 L64 20 L69 31"
        fill="none"
        stroke="#c9a227"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="50"
        y="65"
        textAnchor="middle"
        fontSize="48"
        fontWeight="900"
        fontFamily="Georgia, serif"
        fill="#fff"
      >
        R
      </text>
      <path d="M24 74 Q50 84 76 74" fill="none" stroke="#c9a227" strokeWidth="2" />
      <circle cx="22" cy="74" r="2" fill="#c9a227" />
      <circle cx="78" cy="74" r="2" fill="#c9a227" />
    </svg>
  );
}

function DigitalSeal() {
  return (
    <svg
      className="premium-digital-seal"
      width="154"
      height="154"
      viewBox="0 0 160 160"
      aria-label="Rajputri Digital Trip Sheet Seal"
      role="img"
    >
      <defs>
        <radialGradient id="sealFace" cx="38%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#fffdf8" />
          <stop offset="42%" stopColor="#f9edc7" />
          <stop offset="78%" stopColor="#e7c96b" />
          <stop offset="100%" stopColor="#b58a16" />
        </radialGradient>
        <linearGradient id="sealEdge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8df87" />
          <stop offset="45%" stopColor="#a87908" />
          <stop offset="72%" stopColor="#f1d16b" />
          <stop offset="100%" stopColor="#8b6407" />
        </linearGradient>
        <filter id="sealShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#07101f" floodOpacity=".22" />
        </filter>
        <path id="sealArcTop" d="M 32 72 A 48 48 0 0 1 128 72" />
        <path id="sealArcBottom" d="M 126 103 A 48 48 0 0 1 34 103" />
      </defs>

      <circle cx="80" cy="80" r="73" fill="#07101f" filter="url(#sealShadow)" />
      <circle cx="80" cy="80" r="69" fill="none" stroke="url(#sealEdge)" strokeWidth="3.2" />
      <circle cx="80" cy="80" r="63" fill="url(#sealFace)" stroke="#fff8df" strokeWidth="1.8" />
      <circle cx="80" cy="80" r="57" fill="none" stroke="#6e5006" strokeWidth="1.2" strokeDasharray="1.5 3.2" />
      <circle cx="80" cy="80" r="51" fill="none" stroke="#b58a16" strokeWidth="1.1" />

      <text fill="#172033" fontSize="8.2" fontWeight="900" letterSpacing="1.8" fontFamily="Arial, sans-serif">
        <textPath href="#sealArcTop" startOffset="50%" textAnchor="middle">
          RAJPUTRI TOURS &amp; TRAVELS
        </textPath>
      </text>

      <text fill="#765707" fontSize="7.2" fontWeight="900" letterSpacing="1.3" fontFamily="Arial, sans-serif">
        <textPath href="#sealArcBottom" startOffset="50%" textAnchor="middle">
          DIGITAL TRIP SHEET • OFFICIAL RECORD
        </textPath>
      </text>

      <path
        d="M80 39 L84 48 L94 48 L86 54 L89 64 L80 58 L71 64 L74 54 L66 48 L76 48 Z"
        fill="#b58a16"
        stroke="#765707"
        strokeWidth="1"
      />

      <circle cx="80" cy="79" r="21" fill="#07101f" />
      <circle cx="80" cy="79" r="17.5" fill="#fffdf4" stroke="#d4af37" strokeWidth="1.5" />
      <text x="80" y="89" textAnchor="middle" fontSize="28" fontWeight="900" fontFamily="Georgia, serif" fill="#07101f">
        R
      </text>

      <circle cx="39" cy="80" r="2.2" fill="#b58a16" />
      <circle cx="121" cy="80" r="2.2" fill="#b58a16" />

      <text x="80" y="111" textAnchor="middle" fontSize="7.2" fontWeight="900" letterSpacing="1.2" fontFamily="Arial, sans-serif" fill="#07101f">
        TRIP SHEET
      </text>
      <text x="80" y="122" textAnchor="middle" fontSize="6.2" fontWeight="800" letterSpacing=".8" fontFamily="Arial, sans-serif" fill="#765707">
        RAJPUTRI
      </text>
    </svg>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function ChargeField({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="charge-field">
      <span>{label}</span>
      <div className="money-input">
        <span>₹</span>
        <input
          inputMode="numeric"
          type="number"
          min="0"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </label>
  );
}

function TripSheet() {
  const [trip, setTrip] = useState<Trip>(() => createTrip());
  const [history, setHistory] = useState<Trip[]>([]);
  const [historyMonth, setHistoryMonth] = useState(todayString().slice(0, 7));
  const [historySearch, setHistorySearch] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setHistory(parsed);
      }
    } catch {
      // Ignore invalid local storage.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignore storage errors.
    }
  }, [history]);

  const update = (key: keyof Trip, value: string) => {
    setTrip((prev) => ({ ...prev, [key]: value }));
  };

  const totalKm = useMemo(() => {
    const start = numberValue(trip.startKm);
    const close = numberValue(trip.closeKm);
    return close > start ? close - start : 0;
  }, [trip.startKm, trip.closeKm]);

  const rentalDays = useMemo(() => {
    if (trip.tripType !== "Full Day Rental") return 0;

    const start = new Date(`${trip.date}T${trip.reportingTime || "00:00"}`);
    const endDate = trip.endDate || trip.date;
    const end = new Date(`${endDate}T${trip.releaseTime || "00:00"}`);

    const hours =
      end.getTime() > start.getTime()
        ? (end.getTime() - start.getTime()) / 3600000
        : 0;

    const daysByHours = hours > 0 ? Math.ceil(hours / 12) : 1;
    const daysByKm = totalKm > 0 ? Math.ceil(totalKm / 200) : 1;

    return Math.max(1, daysByHours, daysByKm);
  }, [trip.tripType, trip.date, trip.endDate, trip.reportingTime, trip.releaseTime, totalKm]);

  const rentalAmount = rentalDays * DAILY_RENTAL;

  const regularVehicleCharge = numberValue(trip.vehicleCharge);
  const toll = numberValue(trip.toll);
  const parking = numberValue(trip.parking);
  const permit = numberValue(trip.permit);
  const driverBata = numberValue(trip.driverBata);
  const other = numberValue(trip.other);

  const grandTotal =
    trip.tripType === "Full Day Rental"
      ? rentalAmount + toll + parking + permit + driverBata + other
      : regularVehicleCharge + toll + parking + permit + driverBata + other;

  const filteredHistory = useMemo(() => {
    const q = historySearch.trim().toLowerCase();
    return history
      .filter((item) => !historyMonth || item.date.startsWith(historyMonth))
      .filter((item) => {
        if (!q) return true;
        return [
          item.tripNo,
          item.customerName,
          item.customerMobile,
          item.pickup,
          item.drop,
          item.vehicleNo,
          item.tripType,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [history, historyMonth, historySearch]);

  const historyTotal = filteredHistory.reduce((sum, item) => {
    const km =
      numberValue(item.closeKm) > numberValue(item.startKm)
        ? numberValue(item.closeKm) - numberValue(item.startKm)
        : 0;

    const rental =
      item.tripType === "Full Day Rental"
        ? (() => {
            const start = new Date(
              `${item.date}T${item.reportingTime || "00:00"}`
            );
            const end = new Date(
              `${item.endDate || item.date}T${item.releaseTime || "00:00"}`
            );
            const hours =
              end.getTime() > start.getTime()
                ? (end.getTime() - start.getTime()) / 3600000
                : 0;
            const byHours = hours > 0 ? Math.ceil(hours / 12) : 1;
            const byKm = km > 0 ? Math.ceil(km / 200) : 1;
            return DAILY_RENTAL * Math.max(1, byHours, byKm);
          })()
        : numberValue(item.vehicleCharge);

    return (
      sum +
      rental +
      numberValue(item.toll) +
      numberValue(item.parking) +
      numberValue(item.permit) +
      numberValue(item.driverBata) +
      numberValue(item.other)
    );
  }, [filteredHistory]);

  const generateTripNo = () => {
    const max = history.reduce((n, item) => {
      const match = String(item.tripNo || "").match(/^RT-(\d+)$/i);
      return Math.max(n, match ? Number(match[1]) : 0);
    }, 0);
    return `RT-${String(max + 1).padStart(4, "0")}`;
  };

  const saveTrip = () => {
    const tripToSave: Trip = {
      ...trip,
      tripNo: trip.tripNo || generateTripNo(),
    };

    setTrip(tripToSave);
    setHistory((prev) => [
      tripToSave,
      ...prev.filter((item) => item.id !== tripToSave.id),
    ]);
    setSavedMessage(`${tripToSave.tripNo} saved`);
    window.setTimeout(() => setSavedMessage(""), 2500);
  };

  const newTrip = () => {
    setTrip(createTrip(generateTripNo()));
    setSavedMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openTrip = (item: Trip) => {
    setTrip(item);
    setShowHistory(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteTrip = (id: string) => {
    if (!window.confirm("இந்த Trip Sheet-ஐ history-ல் இருந்து delete செய்யவா?")) {
      return;
    }
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    if (!filteredHistory.length) return;
    if (
      !window.confirm(
        `${historyMonth || "இந்த"} மாதத்தின் ${filteredHistory.length} records-ஐ delete செய்யவா?`
      )
    ) {
      return;
    }
    const ids = new Set(filteredHistory.map((item) => item.id));
    setHistory((prev) => prev.filter((item) => !ids.has(item.id)));
  };

  const whatsapp = () => {
    if (!trip.customerMobile.trim()) {
      window.alert("Customer Mobile Number உள்ளிடவும்.");
      return;
    }

    const phone = trip.customerMobile.replace(/\D/g, "");
    const intlPhone =
      phone.length === 10 && phone.startsWith("0") === false
        ? `91${phone}`
        : phone;

    const message = [
      `RAJPUTRI TOURS & TRAVELS`,
      `TRIP SHEET ${trip.tripNo || "Draft"}`,
      `Date: ${formatDate(trip.date)}`,
      `Customer: ${trip.customerName || "-"}`,
      `Trip Type: ${trip.tripType}`,
      `Pickup: ${trip.pickup || "-"}`,
      `Drop: ${trip.drop || "-"}`,
      `Vehicle: ${trip.vehicleNo || "-"} - ${trip.vehicle || "-"}`,
      `Total: ${money(grandTotal)}`,
      "",
      `Digitally Generated Trip Sheet`,
      `www.rajputritravels.com`,
    ].join("\n");

    window.open(
      `https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const esc = (value: string | number | undefined | null) =>
    String(value ?? "-")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const openPremiumPdf = () => {
    const popup = window.open("", "_blank", "width=900,height=1100");
    if (!popup) {
      window.alert("PDF window open ஆகவில்லை. Browser-ல் pop-up permission Allow செய்யவும்.");
      return;
    }

    const logo = `
      <svg width="86" height="86" viewBox="0 0 100 100" aria-label="Rajputri logo">
        <circle cx="50" cy="50" r="47" fill="#0b1220" stroke="#d4af37" stroke-width="3"/>
        <circle cx="50" cy="50" r="40" fill="none" stroke="#f4d77d" stroke-width="1.5"/>
        <path d="M31 31 L37 20 L44 28 L50 17 L56 28 L64 20 L69 31" fill="none" stroke="#d4af37" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="50" y="65" text-anchor="middle" font-size="48" font-weight="900" font-family="Georgia,serif" fill="#ffffff">R</text>
        <path d="M24 74 Q50 84 76 74" fill="none" stroke="#d4af37" stroke-width="2"/>
      </svg>`;

    const seal = `
      <div class="seal">
        <div class="seal-ring">
          <div class="seal-arc seal-arc-top">RAJPUTRI TOURS &amp; TRAVELS</div>
          <div class="seal-star">✦</div>
          <div class="seal-core"><span>R</span></div>
          <div class="seal-line"></div>
          <div class="seal-title">TRIP SHEET</div>
          <div class="seal-subtitle">DIGITAL RECORD</div>
          <div class="seal-arc seal-arc-bottom">OFFICIAL TRAVEL DOCUMENT</div>
        </div>
      </div>`;

    const vehicleCharge = trip.tripType === "Full Day Rental" ? rentalAmount : regularVehicleCharge;

    popup.document.open();
    popup.document.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Trip Sheet - ${esc(trip.tripNo || generateTripNo())}</title>
<style>
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0; width: 210mm; height: 297mm;
    background: #e9edf3;
  }
  body {
    font-family: Arial, Helvetica, sans-serif;
    color: #111827;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .sheet {
    width: 210mm; height: 297mm; margin: 0 auto;
    background: #fff; position: relative; overflow: hidden;
  }
  .top-band {
    height: 8mm; background: #07101f;
    border-bottom: 1.2mm solid #d4af37;
  }
  .inner {
    padding: 4.5mm 8.5mm 1.5mm;
    height: 281mm;
  }

  /* Header */
  .header {
    height: 31mm; display: flex; align-items: center;
    justify-content: space-between;
    border-bottom: .45mm solid #d4af37;
  }
  .brand { display: flex; align-items: center; gap: 4mm; }
  .brand h1 {
    margin: 0; font: 900 29pt Georgia, serif;
    letter-spacing: 2px; color: #07101f;
  }
  .brand .sub {
    margin-top: 1mm; font-size: 10.5pt; font-weight: 900;
    letter-spacing: 1.8px; color: #8c6910;
  }
  .brand .tag {
    margin-top: 1.2mm; font-size: 8.8pt;
    color: #263144; font-weight: 600;
  }
  .title { text-align: right; }
  .title h2 {
    margin: 0; font: 900 25pt Georgia, serif;
    letter-spacing: 1.2px; color: #07101f;
  }
  .title .goldline {
    width: 39mm; height: .9mm; background: #d4af37;
    margin: 1.5mm 0 1.7mm auto;
  }
  .title div { font-size: 9.5pt; line-height: 1.45; color: #172033; }
  .title b { color: #07101f; }

  /* Information cards */
  .section-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 2.6mm; margin-top: 2.8mm;
  }
  .box {
    border: .35mm solid #c9d1de; border-radius: 2.3mm;
    padding: 2.8mm 3.5mm; background: #fff;
    box-shadow: 0 .7mm 2mm rgba(15,23,42,.06);
  }
  .box.full { grid-column: 1 / -1; }
  .box h3 {
    margin: 0 0 1.8mm; padding-bottom: 1.25mm;
    border-bottom: .3mm solid #d6dce6;
    font-size: 10pt; letter-spacing: .55px; color: #07101f;
  }
  .box h3 span { color: #a77b0b; font-weight: 900; }
  .line {
    display: grid; grid-template-columns: 31% 69%;
    gap: 1.5mm; margin: .9mm 0;
    font-size: 9.2pt; line-height: 1.28;
  }
  .line .label { color: #334155; font-weight: 900; }
  .line .value { color: #0f172a; font-weight: 800; }

  .vehicle-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 2.5mm;
  }
  .vehicle-item .label {
    display: block; color: #475569; font-size: 7.7pt;
    font-weight: 900; margin-bottom: .7mm; text-transform: uppercase;
  }
  .vehicle-item .value {
    font-size: 9.2pt; font-weight: 900; color: #0f172a;
    line-height: 1.15;
  }

  /* Distance */
  .distance {
    margin-top: 2.5mm; border-radius: 2.3mm; padding: 2.6mm 3.5mm;
    background: #0b1220; color: #fff;
    display: flex; align-items: center; justify-content: space-between;
  }
  .distance .label { font-size: 9.5pt; letter-spacing: .9px; font-weight: 900; }
  .distance .value { font-size: 17pt; font-weight: 900; color: #f4d77d; }

  /* Rental */
  .rental {
    margin-top: 2.5mm; padding: 2.7mm 3.5mm;
    border: .45mm solid #d4af37; border-radius: 2.3mm;
    background: linear-gradient(135deg,#fffdf5,#f8f3df);
  }
  .rental-head {
    display: flex; justify-content: space-between;
    align-items: center; gap: 4mm;
  }
  .rental-title {
    font-size: 10.8pt; font-weight: 900;
    color: #07101f; letter-spacing: .35px;
  }
  .rental-price {
    font-size: 16pt; font-weight: 900;
    color: #7b5a08; white-space: nowrap;
  }
  .rental-copy {
    margin-top: 1.4mm; font-size: 8.4pt;
    line-height: 1.32; color: #263144;
  }

  /* Charges */
  .charges {
    margin-top: 2.5mm; border: .35mm solid #cdd5e1;
    border-radius: 2.3mm; overflow: hidden;
  }
  .charges-head {
    padding: 2.1mm 3.5mm; background: #0b1220;
    color: #fff; font-size: 10pt; font-weight: 900;
    letter-spacing: .65px;
  }
  table { width: 100%; border-collapse: collapse; font-size: 9.1pt; }
  th {
    background: #eee6c9; color: #111827; text-align: left;
    padding: 1.6mm 3.5mm; border-bottom: .35mm solid #d4af37;
    font-weight: 900;
  }
  td {
    padding: 1.55mm 3.5mm; border-bottom: .25mm solid #e3e7ed;
    color: #172033; font-weight: 650;
  }
  td:last-child, th:last-child { text-align: right; font-weight: 900; }
  tr:last-child td { border-bottom: 0; }

  /* Grand total */
  .grand {
    margin-top: 2.5mm; background: #0b1220;
    border: .45mm solid #d4af37; border-radius: 2.3mm;
    padding: 2.8mm 3.8mm;
    display: flex; align-items: center; justify-content: space-between;
    color: #fff;
  }
  .grand .label {
    font-size: 9.8pt; font-weight: 900; letter-spacing: .45px;
  }
  .grand .amount {
    font-size: 20pt; font-weight: 900; color: #f4d77d;
  }

  /* Bottom block - kept inside page */
  .bottom {
    margin-top: 2.3mm; display: grid;
    grid-template-columns: 1fr 39mm; gap: 3.5mm;
    align-items: center;
  }
  .notes {
    min-height: 15mm; max-height: 17mm;
    overflow: hidden;
    border: .35mm solid #cfd7e3; border-radius: 2.3mm;
    padding: 2.3mm 3.2mm; background: #fafbfd;
    font-size: 8pt; line-height: 1.3; color: #263144;
  }
  .notes b { color: #07101f; }
  .contact {
    margin-top: 1.5mm; font-size: 7.5pt;
    color: #263144; line-height: 1.25;
    white-space: nowrap;
  }

  /* Premium embossed seal */
  .seal {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1mm;
  }

  .seal-ring {
    width: 39mm;
    height: 39mm;
    border-radius: 50%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background:
      radial-gradient(circle at 34% 25%, #fffef9 0%, #f8edc8 42%, #e2c263 76%, #a87908 100%);
    border: 1.2mm solid #07101f;
    box-shadow:
      0 .9mm 2.6mm rgba(7,16,31,.22),
      inset 0 .5mm .8mm rgba(255,255,255,.85),
      inset 0 -.7mm 1.2mm rgba(80,55,0,.22);
    overflow: hidden;
  }

  .seal-ring:before {
    content:"";
    position:absolute;
    inset:2.3mm;
    border: .45mm solid #d4af37;
    border-radius:50%;
    box-shadow: inset 0 0 0 .45mm rgba(7,16,31,.08);
  }

  .seal-ring:after {
    content:"";
    position:absolute;
    inset:5.1mm;
    border: .2mm dashed #765707;
    border-radius:50%;
    opacity:.9;
  }

  .seal-arc {
    position:absolute;
    left:0;
    width:100%;
    text-align:center;
    color:#172033;
    font-weight:900;
    white-space:nowrap;
    z-index:2;
  }

  .seal-arc-top {
    top:6.8mm;
    font-size:4.8pt;
    letter-spacing:.75px;
  }

  .seal-arc-bottom {
    bottom:6.4mm;
    font-size:4.25pt;
    letter-spacing:.55px;
    color:#765707;
  }

  .seal-star {
    position:absolute;
    top:10.8mm;
    font-size:8pt;
    line-height:1;
    color:#a87908;
    text-shadow:0 .2mm .3mm rgba(7,16,31,.18);
    z-index:2;
  }

  .seal-core {
    width:13.2mm;
    height:13.2mm;
    border-radius:50%;
    background:#07101f;
    border:.65mm solid #d4af37;
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:2;
    box-shadow:0 .7mm 1.2mm rgba(7,16,31,.18);
  }

  .seal-core span {
    color:#fffdf4;
    font:900 19pt Georgia,serif;
    line-height:1;
    transform:translateY(-.2mm);
  }

  .seal-line {
    width:10mm;
    height:.28mm;
    background:#a87908;
    margin:.9mm 0 .45mm;
    z-index:2;
  }

  .seal-title {
    color:#07101f;
    font-size:5.6pt;
    font-weight:900;
    letter-spacing:1px;
    z-index:2;
  }

  .seal-subtitle {
    color:#765707;
    margin-top:.35mm;
    font-size:4.3pt;
    font-weight:900;
    letter-spacing:.8px;
    z-index:2;
  }


  /* Footer is in normal flow, not absolute, so it cannot be cut off */
  .footer {
    margin: 2.2mm 0 0; border-top: .35mm solid #d4af37;
    padding-top: 1.8mm; display:flex; justify-content:space-between;
    gap:3mm; font-size: 6.9pt; color:#334155; font-weight:700;
  }
  .footer b { color:#07101f; }
  @media print {
    html,body {
      width:210mm; height:297mm; background:#fff !important;
      -webkit-print-color-adjust:exact !important;
      print-color-adjust:exact !important;
    }
    .sheet { margin:0; }
  }
</style>
</head>
<body>
<div class="sheet">
  <div class="top-band"></div>
  <div class="inner">
    <div class="header">
      <div class="brand">${logo}<div><h1>RAJPUTRI</h1><div class="sub">TOURS &amp; TRAVELS</div><div class="tag">Safe Journey · Happy Memories</div></div></div>
      <div class="title"><h2>TRIP SHEET</h2><div class="goldline"></div><div><b>Trip No:</b> ${esc(trip.tripNo || generateTripNo())}</div><div><b>Date:</b> ${esc(formatDate(trip.date))}</div></div>
    </div>

    <div class="section-grid">
      <div class="box">
        <h3><span>01</span> &nbsp; CUSTOMER DETAILS</h3>
        <div class="line"><div class="label">Name</div><div class="value">${esc(trip.customerName || "-")}</div></div>
        <div class="line"><div class="label">Mobile</div><div class="value">${esc(trip.customerMobile || "-")}</div></div>
        <div class="line"><div class="label">Trip Type</div><div class="value">${esc(trip.tripType)}</div></div>
        <div class="line"><div class="label">Reporting</div><div class="value">${esc(trip.reportingTime || "-")}</div></div>
      </div>
      <div class="box">
        <h3><span>02</span> &nbsp; ROUTE DETAILS</h3>
        <div class="line"><div class="label">Pickup</div><div class="value">${esc(trip.pickup || "-")}</div></div>
        <div class="line"><div class="label">Drop</div><div class="value">${esc(trip.drop || "-")}</div></div>
        ${trip.tripType === "Full Day Rental" ? `<div class="line"><div class="label">End Date</div><div class="value">${esc(formatDate(trip.endDate))}</div></div><div class="line"><div class="label">Release</div><div class="value">${esc(trip.releaseTime || "-")}</div></div>` : ""}
      </div>
      <div class="box full">
        <h3><span>03</span> &nbsp; VEHICLE &amp; DRIVER DETAILS</h3>
        <div class="vehicle-grid">
          <div class="vehicle-item"><span class="label">Vehicle No</span><span class="value">${esc(trip.vehicleNo || "-")}</span></div>
          <div class="vehicle-item"><span class="label">Vehicle</span><span class="value">${esc(trip.vehicle || "-")}</span></div>
          <div class="vehicle-item"><span class="label">Driver</span><span class="value">${esc(trip.driver || "-")}</span></div>
          <div class="vehicle-item"><span class="label">Driver Mobile</span><span class="value">${esc(trip.driverMobile || "-")}</span></div>
        </div>
      </div>
    </div>

    <div class="distance"><span class="label">TOTAL DISTANCE</span><span class="value">${totalKm} KM</span></div>

    ${trip.tripType === "Full Day Rental" ? `<div class="rental"><div class="rental-head"><div class="rental-title">FULL DAY RENTAL · ₹3,000 / DAY</div><div class="rental-price">${money(rentalAmount)}</div></div><div class="rental-copy"><b>ONE DAY RENTAL = 12 HOURS OR 200 KM.</b> Fixed package charge; lower KM does not reduce the daily rental charge. Beyond 200 KM, the next rental day charge of ₹3,000 applies. Fuel, Toll, Parking, Permit and other applicable charges are payable by the customer.</div></div>` : ""}

    <div class="charges">
      <div class="charges-head">04 &nbsp; CHARGES &amp; PAYMENT SUMMARY</div>
      <table><thead><tr><th>Description</th><th>Amount</th></tr></thead><tbody>
        <tr><td>${trip.tripType === "Full Day Rental" ? `Daily Rental (${rentalDays} day × ₹3,000)` : "Vehicle Charge"}</td><td>${money(vehicleCharge)}</td></tr>
        <tr><td>Toll</td><td>${money(toll)}</td></tr>
        <tr><td>Parking</td><td>${money(parking)}</td></tr>
        <tr><td>Permit</td><td>${money(permit)}</td></tr>
        <tr><td>Driver Bata</td><td>${money(driverBata)}</td></tr>
        <tr><td>Other</td><td>${money(other)}</td></tr>
      </tbody></table>
    </div>

    <div class="grand"><div class="label">GRAND TOTAL · CUSTOMER PAYABLE</div><div class="amount">${money(grandTotal)}</div></div>

    <div class="bottom">
      <div>
        <div class="notes"><b>NOTES</b><br/>${esc(trip.notes || "Thank you for travelling with Rajputri Tours & Travels.")}<br/><br/><b>Digitally Generated Trip Sheet</b></div>
        <div class="contact"><b>Phone:</b> 8489999568 &nbsp; · &nbsp; <b>Website:</b> www.rajputritravels.com &nbsp; · &nbsp; <b>Blog:</b> blog.rajputritravels.com</div>
      </div>
      ${seal}
    </div>
  </div>
  <div class="footer"><span><b>RAJPUTRI TOURS &amp; TRAVELS</b></span><span>Safe · Comfortable · On-Time Travel</span><span>Digital Trip Sheet</span></div>
</div>
<script>
  window.onload = function(){ setTimeout(function(){ window.focus(); window.print(); }, 500); };
  window.onafterprint = function(){ setTimeout(function(){ window.close(); }, 300); };
</script>
</body></html>`);
    popup.document.close();
  };

  return (
    <div className="trip-app">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: linear-gradient(135deg,#eef1f6 0%,#f8f5ec 52%,#eef1f6 100%); color: #101827; font-family: Arial, Helvetica, sans-serif; }
        button, input, select, textarea { font: inherit; }
        button { cursor: pointer; }
        .trip-app { min-height: 100vh; }
        .topbar {
          position: sticky; top: 0; z-index: 30;
          isolation: isolate;
          background: linear-gradient(90deg,#07101f,#101827 55%,#07101f); color: white; border-bottom: 3px solid #d4af37;
          padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .brand { display: flex; align-items: center; gap: 10px; }
        .brand-title { font-family: Georgia, serif; font-weight: 900; letter-spacing: 1.5px; font-size: 20px; }
        .brand-sub { color: #d8bd62; font-size: 11px; letter-spacing: 1.4px; margin-top: 2px; }
        .toolbar { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
        .btn {
          border: 1px solid #d4d4d4; background: white; color: #171717; border-radius: 9px;
          padding: 10px 13px; display: inline-flex; align-items: center; gap: 7px; font-weight: 700;
        }
        .btn.dark { background: #1b1b1b; color: white; border-color: #333; }
        .btn.gold { background: #c9a227; color: #111; border-color: #c9a227; }
        .btn.green { background: #168b49; color: white; border-color: #168b49; }
        .btn.red { background: #fff; color: #a91f1f; border-color: #e4baba; }
        .container { max-width: 1220px; margin: 0 auto; padding: 24px; }
        .notice {
          background: #fffdf4; border: 1px solid #e6d28b; border-left: 5px solid #c9a227;
          padding: 12px 14px; border-radius: 10px; margin-bottom: 16px;
        }
        .notice strong { display: block; margin-bottom: 4px; }
        .saved { color: #167743; font-weight: 800; font-size: 13px; }
        .card {
          background: rgba(255,255,255,.97); border: 1px solid #d6dbe4; border-radius: 16px; padding: 20px; box-shadow: 0 10px 28px rgba(15,23,42,.07);
          margin-bottom: 16px; box-shadow: 0 3px 12px rgba(0,0,0,.04);
        }
        .section-title {
          display: flex; align-items: center; gap: 8px; font-weight: 900; font-size: 18px;
          margin-bottom: 14px; border-bottom: 1px solid #eee; padding-bottom: 10px;
        }
        .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 13px; }
        .grid.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field > span, .charge-field > span { font-size: 13px; font-weight: 900; color: #263247; }
        input, select, textarea {
          width: 100%; border: 1px solid #c5ccd7; border-radius: 10px; padding: 13px 13px; font-size: 15px;
          background: white; color: #111; outline: none;
        }
        input:focus, select:focus, textarea:focus { border-color: #c9a227; box-shadow: 0 0 0 2px rgba(201,162,39,.12); }
        textarea { min-height: 80px; resize: vertical; }
        .rental-box {
          margin-top: 15px; padding: 15px; border-radius: 12px; background: #0b1220; color: white;
          border: 2px solid #c9a227;
        }
        .rental-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .rental-head strong { color: #f4d77d; font-size: 20px; }
        .rental-price { font-size: 24px; font-weight: 900; }
        .rental-rules { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 12px; }
        .rental-rule { background: #222; border: 1px solid #444; border-radius: 8px; padding: 9px; font-size: 12px; line-height: 1.4; }
        .rental-rule b { display: block; color: #f0d16b; margin-bottom: 3px; }
        .terms { font-size: 12px; line-height: 1.55; margin-top: 11px; color: #eee; }
        .charge-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
        .money-input { display: flex; align-items: center; border: 1px solid #cfcfcf; border-radius: 8px; overflow: hidden; }
        .money-input > span { padding-left: 10px; color: #666; }
        .money-input input { border: 0; border-radius: 0; }
        .distance-result {
          position: relative;
        }

        .distance-live {
          min-height: 46px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 8px 13px;
          border: 1px solid #c9a227;
          border-radius: 9px;
          background: linear-gradient(135deg, #fffdf4, #f7f2df);
          color: #162238;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.7);
        }

        .distance-live strong {
          color: #7a5a08;
          font-size: 19px;
          font-weight: 900;
          letter-spacing: .2px;
        }

        .distance-live small {
          color: #737b88;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .total-box {
          display: flex; align-items: center; justify-content: space-between; gap: 20px;
          padding: 16px 18px; background: #111; color: white; border-radius: 12px;
        }
        .total-box small { color: #d5d5d5; }
        .total { color: #f0d16b; font-size: 30px; font-weight: 900; }
        .action-row { display: flex; flex-wrap: wrap; gap: 9px; }

        .trip-app input::placeholder, .trip-app textarea::placeholder { color:#7b8492; opacity:1; }
        .trip-app input:disabled { background:#f5f6f8; color:#111827; font-weight:900; }
        .trip-app select { font-weight:700; }
        .trip-app .section-title svg { color:#b58a16; }
        .trip-app .card:hover { border-color:#d4af37; }
        .trip-app .btn { box-shadow:0 2px 7px rgba(15,23,42,.06); }
        .trip-app .btn.gold { box-shadow:0 4px 12px rgba(201,162,39,.25); }
        .trip-app .rental-box { box-shadow:0 8px 20px rgba(7,16,31,.15); }

        .history-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .history-tools { display: flex; gap: 8px; flex-wrap: wrap; }
        .searchbox { position: relative; }
        .searchbox svg { position: absolute; left: 10px; top: 12px; color: #777; }
        .searchbox input { padding-left: 35px; min-width: 230px; }
        .history-list { display: grid; gap: 9px; margin-top: 14px; }
        .history-item {
          border: 1px solid #ddd; border-radius: 10px; padding: 12px; display: grid;
          grid-template-columns: 110px 1.4fr 1fr 1fr 110px auto; gap: 10px; align-items: center;
        }
        .history-item strong { display: block; }
        .history-item small { color: #666; }
        .empty { text-align: center; padding: 30px 10px; color: #777; }
        .print-area { display: none; }


        /* Professional office-grade application layer */
        .topbar {
          min-height: 78px;
          padding: 10px 24px;
          box-shadow: 0 8px 24px rgba(7,16,31,.18);
          backdrop-filter: blur(12px);
        }

        .brand {
          min-width: 240px;
        }

        .brand-title {
          font-size: 21px;
          line-height: 1;
        }

        .brand-sub {
          font-size: 10px;
          letter-spacing: 1.8px;
        }

        .toolbar {
          align-items: center;
          gap: 7px;
          flex-wrap: nowrap;
        }

        .toolbar .btn {
          min-height: 42px;
          white-space: nowrap;
          border-radius: 10px;
          padding: 9px 13px;
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
        }

        .toolbar .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(15,23,42,.12);
        }

        .container {
          max-width: 1280px;
          padding: 28px 24px 42px;
        }

        .notice {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 16px;
          padding: 16px 18px;
          margin-bottom: 18px;
          border: 1px solid #e4d59e;
          border-left: 4px solid #c9a227;
          border-radius: 14px;
          background: linear-gradient(135deg, #fffdf6, #f9f6ea);
          box-shadow: 0 5px 18px rgba(15,23,42,.045);
        }

        .notice-main {
          min-width: 0;
        }

        .notice-title {
          color: #111827;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .notice-copy {
          margin-top: 5px;
          color: #596273;
          font-size: 13px;
          line-height: 1.5;
        }

        .notice-flow {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6f5713;
          font-size: 11px;
          font-weight: 900;
          white-space: nowrap;
        }

        .notice-flow span {
          padding: 7px 9px;
          border: 1px solid #eadcae;
          border-radius: 999px;
          background: rgba(255,255,255,.75);
        }

        .saved {
          grid-column: 1 / -1;
          margin-top: -3px;
          color: #167743;
          font-size: 12px;
          font-weight: 900;
        }

        .card {
          border-color: #d9dee7;
          border-radius: 15px;
          padding: 21px;
          box-shadow: 0 5px 20px rgba(15,23,42,.055);
          transition: box-shadow .2s ease, border-color .2s ease;
        }

        .card:hover {
          border-color: #d2b55d;
          box-shadow: 0 8px 26px rgba(15,23,42,.075);
        }

        .section-title {
          font-size: 16px;
          letter-spacing: .1px;
          color: #162238;
          margin-bottom: 16px;
          padding-bottom: 11px;
        }

        .field > span,
        .charge-field > span {
          font-size: 11px;
          letter-spacing: .45px;
          text-transform: uppercase;
          color: #566173;
        }

        input, select, textarea {
          min-height: 46px;
          border-color: #cbd2dd;
          border-radius: 9px;
          transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
        }

        input:hover, select:hover, textarea:hover {
          border-color: #aeb8c7;
        }

        input:focus, select:focus, textarea:focus {
          border-color: #b38a1b;
          box-shadow: 0 0 0 3px rgba(201,162,39,.10);
        }

        .total-box {
          border: 1px solid #2a3342;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.04), 0 7px 20px rgba(7,16,31,.12);
        }

        .total {
          font-size: 29px;
          letter-spacing: -.5px;
        }

        .history-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(5,10,18,.68);
          padding: 22px;
          overflow-y: auto;
          backdrop-filter: blur(5px);
        }

        .history-modal {
          max-width: 1180px;
          margin: 0 auto;
          background: #f8fafc;
          border: 1px solid rgba(255,255,255,.28);
          border-radius: 18px;
          padding: 20px;
          min-height: 80vh;
          box-shadow: 0 24px 70px rgba(0,0,0,.28);
        }

        .history-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #162238;
          font-size: 18px;
          font-weight: 900;
        }

        .history-meta {
          margin-top: 4px;
          color: #6b7280;
          font-size: 12px;
          font-weight: 700;
        }

        .history-tools {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
          margin-top: 16px;
          padding: 11px;
          border: 1px solid #dde2ea;
          border-radius: 12px;
          background: #fff;
        }

        .history-month {
          max-width: 180px;
        }

        .history-item {
          border: 1px solid #dce1e8;
          border-radius: 12px;
          padding: 13px;
          background: #fff;
          box-shadow: 0 2px 8px rgba(15,23,42,.035);
          transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease;
        }

        .history-item:hover {
          border-color: #d2b55d;
          box-shadow: 0 7px 18px rgba(15,23,42,.07);
          transform: translateY(-1px);
        }

        .history-item small {
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .55px;
          text-transform: uppercase;
          color: #7a8494;
        }

        .history-item strong {
          color: #182235;
          font-size: 13px;
        }

        .history-list {
          margin-top: 13px;
        }

        .empty {
          margin-top: 13px;
          border: 1px dashed #cbd2dd;
          border-radius: 12px;
          background: #fff;
        }

        @media (max-width: 900px) {
          .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .charge-grid { grid-template-columns: repeat(3, 1fr); }
          .rental-rules { grid-template-columns: repeat(2, 1fr); }
          .history-item { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .topbar {
            align-items: stretch;
            flex-direction: column;
            gap: 8px;
            padding: 9px 12px;
          }

          .brand {
            min-width: 0;
          }

          .brand-title {
            font-size: 19px;
          }

          .toolbar {
            width: 100%;
            justify-content: flex-start;
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 2px;
            scrollbar-width: thin;
          }

          .toolbar .btn {
            flex: 0 0 auto;
            min-height: 40px;
            padding: 8px 11px;
            font-size: 12px;
          }

          .container {
            padding: 12px 10px 30px;
          }

          .notice {
            grid-template-columns: 1fr;
            gap: 10px;
            padding: 14px;
          }

          .notice-flow {
            white-space: normal;
            flex-wrap: wrap;
          }

          .notice-flow span {
            padding: 6px 8px;
          }

          .grid, .grid.two, .charge-grid {
            grid-template-columns: 1fr;
          }

          .rental-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .rental-rules {
            grid-template-columns: 1fr;
          }

          .distance-live {
            align-items: flex-start;
            flex-direction: column;
            justify-content: center;
            gap: 2px;
          }

          .distance-live strong {
            font-size: 17px;
          }

          .total-box {
            align-items: flex-start;
            flex-direction: column;
          }

          .total {
            font-size: 24px;
          }

          .history-overlay {
            padding: 8px;
          }

          .history-modal {
            padding: 12px;
            border-radius: 14px;
          }

          .history-header {
            align-items: flex-start;
          }

          .history-tools {
            width: 100%;
          }

          .history-month {
            max-width: none;
            width: 100%;
          }

          .searchbox, .searchbox input {
            width: 100%;
          }

          .history-item {
            grid-template-columns: 1fr;
          }
        }

        @media print {
          @page { size: A4 portrait; margin: 0; }
          html, body {
            width: 210mm; height: 297mm; margin: 0; padding: 0;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body { overflow: hidden; }
          .trip-app { display: none !important; }
          .print-area {
            display: block !important;
            width: 210mm; height: 297mm; overflow: hidden;
            background: #ffffff !important;
          }
          .print-sheet {
            position: relative;
            width: 210mm; height: 297mm;
            padding: 8mm 9mm 6mm;
            overflow: hidden;
            color: #172033;
            background: #ffffff;
            font-family: Arial, Helvetica, sans-serif;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Premium header */
          .p-header {
            height: 40mm;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 4mm 5mm;
            border-radius: 4mm;
            background: #101827 !important;
            border: 1px solid #c8a64b;
            border-bottom: 3px solid #c8a64b;
            color: #ffffff !important;
          }
          .p-brand { display: flex; align-items: center; gap: 4mm; }
          .p-brand-text h1 {
            margin: 0;
            color: #ffffff !important;
            font: 900 25pt Georgia, "Times New Roman", serif;
            letter-spacing: 2.4px;
          }
          .p-brand-text .sub {
            margin-top: 1.2mm;
            color: #e1bd59 !important;
            font-size: 9pt;
            font-weight: 900;
            letter-spacing: 2px;
          }
          .p-brand-text .tag {
            margin-top: 2mm;
            color: #d8dde8 !important;
            font-size: 7.5pt;
            letter-spacing: .4px;
          }
          .p-title {
            min-width: 52mm;
            text-align: right;
          }
          .p-title h2 {
            margin: 0;
            color: #e1bd59 !important;
            font-size: 20pt;
            font-weight: 900;
            letter-spacing: 1.6px;
          }
          .p-title div {
            margin-top: 2mm;
            color: #ffffff !important;
            font-size: 8.8pt;
            line-height: 1.25;
          }
          .p-title div b { color: #d8dde8 !important; }

          /* Information cards */
          .p-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3mm;
            margin-top: 4mm;
          }
          .p-box {
            position: relative;
            border: 1px solid #d7dce5;
            border-radius: 3mm;
            padding: 3.5mm 4mm;
            min-height: 25mm;
            background: #fbfcfe !important;
            box-shadow: inset 3px 0 0 #c8a64b;
          }
          .p-box h3 {
            margin: 0 0 2.5mm;
            padding-bottom: 1.5mm;
            color: #152238;
            font-size: 8.5pt;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: .9px;
            border-bottom: 1px solid #e1e5ec;
          }
          .p-line {
            display: grid;
            grid-template-columns: 32% 68%;
            gap: 2mm;
            margin-bottom: 1.5mm;
            font-size: 9pt;
            line-height: 1.25;
          }
          .p-line b { color: #5c6675; }
          .p-line span { color: #182235; font-weight: 600; }
          .p-full { grid-column: 1 / -1; }

          /* Distance strip */
          .p-distance {
            margin-top: 3mm;
            border: 1px solid #d5b75f;
            border-radius: 3mm;
            padding: 2.8mm 4mm;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fff9e8 !important;
            color: #283246;
            font-size: 10pt;
            font-weight: 900;
          }
          .p-distance span:last-child {
            color: #9a7411;
            font-size: 12pt;
          }

          /* Rental terms */
          .p-rental {
            margin-top: 3mm;
            border: 1px solid #c8a64b;
            border-radius: 3mm;
            padding: 3mm 4mm;
            background: #fffaf0 !important;
            box-shadow: inset 4px 0 0 #c8a64b;
          }
          .p-rental-title {
            color: #172238;
            font-size: 10pt;
            font-weight: 900;
            margin-bottom: 1.7mm;
          }
          .p-rental-lines {
            color: #3e4757;
            font-size: 8pt;
            line-height: 1.45;
          }
          .p-rental-lines b { color: #172238; }

          /* Charges */
          .p-charges { margin-top: 3mm; }
          .p-charges table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            border: 1px solid #d7dce5;
            border-radius: 3mm;
            overflow: hidden;
            font-size: 8.8pt;
          }
          .p-charges th, .p-charges td {
            border: 0;
            border-bottom: 1px solid #e4e7ec;
            padding: 1.9mm 3mm;
          }
          .p-charges tr:last-child td { border-bottom: 0; }
          .p-charges th {
            background: #162238 !important;
            color: #ffffff !important;
            text-align: left;
            font-size: 8pt;
            letter-spacing: .5px;
          }
          .p-charges td { color: #263144; }
          .p-charges tbody tr:nth-child(even) td { background: #f8f9fb !important; }
          .p-charges td:last-child,
          .p-charges th:last-child {
            text-align: right;
            font-weight: 800;
          }

          /* Total */
          .p-grand {
            margin-top: 3mm;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid #c8a64b;
            border-radius: 3mm;
            padding: 3.5mm 4.5mm;
            background: #111a29 !important;
            color: #ffffff !important;
          }
          .p-grand span:first-child {
            color: #e6ebf3 !important;
            font-size: 9.5pt;
            font-weight: 900;
            letter-spacing: .4px;
          }
          .p-grand strong {
            color: #f1cb58 !important;
            font-size: 18pt;
            font-weight: 900;
          }

          /* Bottom */
          .p-bottom {
            margin-top: 3mm;
            display: grid;
            grid-template-columns: 1fr 34mm;
            gap: 5mm;
            align-items: center;
          }
          .p-notes {
            border: 1px solid #d7dce5;
            border-radius: 3mm;
            padding: 3mm 3.5mm;
            min-height: 18mm;
            background: #fbfcfe !important;
            color: #3d4655;
            font-size: 8pt;
            line-height: 1.45;
          }
          .p-notes b { color: #162238; }
          .p-contact {
            margin-top: 2.5mm;
            color: #4e5868;
            font-size: 7.8pt;
            line-height: 1.45;
          }
          .p-seal {
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 170px;
            padding: 2mm 1mm;
          }

          .p-seal .premium-digital-seal {
            width: 158px;
            height: 158px;
            filter: drop-shadow(0 4px 7px rgba(7,16,31,.16));
          }

          .p-footer {
            margin-top: 3mm;
            padding-top: 2.5mm;
            border-top: 1px solid #d1b258;
            display: flex;
            justify-content: space-between;
            gap: 4mm;
            color: #596273;
            font-size: 7.4pt;
            font-weight: 700;
          }
          .p-footer span:first-child { color: #1b2638; }
          .p-footer span:nth-child(2) { color: #9a7411; }

          /* Keep SVG logo/seal colors intact in PDF */
          .print-sheet svg { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }

      `}</style>

      <header className="topbar">
        <div className="brand">
          <RoyalLogo small />
          <div>
            <div className="brand-title">RAJPUTRI</div>
            <div className="brand-sub">TOURS & TRAVELS</div>
          </div>
        </div>

        <div className="toolbar" aria-label="Trip actions">
          <button className="btn dark" onClick={newTrip} title="Start a new trip">
            <FileText size={16} /> New Trip
          </button>
          <button className="btn gold" onClick={saveTrip} title="Save this trip">
            <CheckCircle2 size={16} /> Save Trip
          </button>
          <button className="btn" onClick={openPremiumPdf} title="Create A4 PDF / Print">
            <Printer size={16} /> PDF / Print
          </button>
          <button className="btn green" onClick={whatsapp} title="Send trip summary on WhatsApp">
            <MessageCircle size={16} /> WhatsApp
          </button>
          <button className="btn" onClick={() => setShowHistory(true)} title="Open saved trip history">
            <History size={16} /> Trip History
          </button>
        </div>
      </header>

      <main className="container">
        <div className="notice">
          <div className="notice-main">
            <div className="notice-title">DIGITAL TRIP SHEET</div>
            <div className="notice-copy">
              Complete the trip details, save the record, then create a professional A4 document or share the trip summary on WhatsApp.
            </div>
          </div>
          <div className="notice-flow">
            <span>01&nbsp; Enter</span>
            <span>02&nbsp; Save</span>
            <span>03&nbsp; PDF / WhatsApp</span>
          </div>
          {savedMessage && <div className="saved">✓ {savedMessage}</div>}
        </div>

        <section className="card">
          <div className="section-title">
            <CalendarDays size={18} /> Trip Details
          </div>

          <div className="grid">
            <Field
              label="Trip No"
              value={trip.tripNo || generateTripNo()}
              onChange={() => {}}
              disabled
            />
            <Field
              label="Date"
              type="date"
              value={trip.date}
              onChange={(v) => update("date", v)}
            />
            <label className="field">
              <span>Trip Type</span>
              <select
                value={trip.tripType}
                onChange={(e) => update("tripType", e.target.value as TripType)}
              >
                <option>One Way</option>
                <option>Round Trip</option>
                <option>Local</option>
                <option>Outstation</option>
                <option>Airport Transfer</option>
                <option>Temple Tour</option>
                <option>Full Day Rental</option>
              </select>
            </label>
            <Field
              label="Reporting Time"
              type="time"
              value={trip.reportingTime}
              onChange={(v) => update("reportingTime", v)}
            />

            {trip.tripType === "Full Day Rental" && (
              <>
                <Field
                  label="Rental End Date"
                  type="date"
                  value={trip.endDate}
                  onChange={(v) => update("endDate", v)}
                />
                <Field
                  label="Release / End Time"
                  type="time"
                  value={trip.releaseTime}
                  onChange={(v) => update("releaseTime", v)}
                />
              </>
            )}
          </div>

          {trip.tripType === "Full Day Rental" && (
            <div className="rental-box">
              <div className="rental-head">
                <div>
                  <strong>FULL DAY RENTAL</strong>
                  <div className="terms">
                    Fixed package charge. குறைந்த KM சென்றாலும் daily rental charge குறையாது.
                    KM-based calculation கிடையாது.
                  </div>
                </div>
                <div className="rental-price">{money(DAILY_RENTAL)} / DAY</div>
              </div>

              <div className="rental-rules">
                <div className="rental-rule">
                  <b>1 DAY</b>
                  ONE DAY · 12 HOURS / 200 KM
                </div>
                <div className="rental-rule">
                  <b>ONE DAY</b>
                  12 Hours / 200 KM
                </div>
                <div className="rental-rule">
                  <b>ABOVE 200 KM</b>
                  Next day rental applies
                </div>
                <div className="rental-rule">
                  <b>RATE</b>
                  ₹3,000 / DAY
                </div>
              </div>

              <div className="terms">
                Fuel, Toll, Parking, Permit and other applicable charges are payable by the
                customer. Rental calculation is based on the 12-hour / 200 KM package rule.
                Beyond 200 KM, the next rental day charge applies.
              </div>
            </div>
          )}
        </section>

        <section className="card">
          <div className="section-title">
            <UserRound size={18} /> Customer Details
          </div>
          <div className="grid two">
            <Field
              label="Customer Name"
              value={trip.customerName}
              placeholder="Customer name"
              onChange={(v) => update("customerName", v)}
            />
            <Field
              label="Customer Mobile"
              value={trip.customerMobile}
              type="tel"
              placeholder="10 digit mobile number"
              onChange={(v) => update("customerMobile", v)}
            />
          </div>
        </section>

        <section className="card">
          <div className="section-title">
            <MapPin size={18} /> Route Details
          </div>
          <div className="grid two">
            <Field
              label="Pickup Location"
              value={trip.pickup}
              onChange={(v) => update("pickup", v)}
            />
            <Field
              label="Drop Location"
              value={trip.drop}
              onChange={(v) => update("drop", v)}
            />
          </div>
        </section>

        <section className="card">
          <div className="section-title">
            <Car size={18} /> Vehicle & Driver
          </div>
          <div className="grid">
            <Field
              label="Vehicle Number"
              value={trip.vehicleNo}
              onChange={(v) => update("vehicleNo", v)}
            />
            <Field
              label="Vehicle"
              value={trip.vehicle}
              onChange={(v) => update("vehicle", v)}
            />
            <Field
              label="Driver Name"
              value={trip.driver}
              onChange={(v) => update("driver", v)}
            />
            <Field
              label="Driver Mobile"
              value={trip.driverMobile}
              type="tel"
              onChange={(v) => update("driverMobile", v)}
            />
            <Field
              label="Start KM"
              value={trip.startKm}
              type="number"
              onChange={(v) => update("startKm", v)}
            />
            <Field
              label="Close KM"
              value={trip.closeKm}
              type="number"
              onChange={(v) => update("closeKm", v)}
            />
            <div className="field distance-result">
              <span>Total Distance</span>
              <div className="distance-live">
                <strong>{totalKm.toLocaleString("en-IN")} KM</strong>
                <small>Close KM − Start KM</small>
              </div>
            </div>
            <div className="field">
              <span>Rental Days</span>
              <input
                value={trip.tripType === "Full Day Rental" ? `${rentalDays} Day(s)` : "—"}
                readOnly
              />
            </div>
          </div>
        </section>

        <section className="card">
          <div className="section-title">
            <IndianRupee size={18} /> Charges
          </div>

          {trip.tripType === "Full Day Rental" ? (
            <div className="rental-box" style={{ marginTop: 0 }}>
              <div className="rental-head">
                <div>
                  <strong>DAILY RENTAL CHARGE</strong>
                  <div className="terms">
                    {rentalDays} day(s) × {money(DAILY_RENTAL)}
                  </div>
                </div>
                <div className="rental-price">{money(rentalAmount)}</div>
              </div>
            </div>
          ) : (
            <ChargeField
              label="Vehicle Charge"
              value={trip.vehicleCharge}
              onChange={(v) => update("vehicleCharge", v)}
            />
          )}

          <div className="charge-grid" style={{ marginTop: 12 }}>
            <ChargeField label="Toll" value={trip.toll} onChange={(v) => update("toll", v)} />
            <ChargeField
              label="Parking"
              value={trip.parking}
              onChange={(v) => update("parking", v)}
            />
            <ChargeField
              label="Permit"
              value={trip.permit}
              onChange={(v) => update("permit", v)}
            />
            <ChargeField
              label="Driver Bata"
              value={trip.driverBata}
              onChange={(v) => update("driverBata", v)}
            />
            <ChargeField
              label="Other"
              value={trip.other}
              onChange={(v) => update("other", v)}
            />
          </div>

          <div className="total-box" style={{ marginTop: 15 }}>
            <div>
              <small>GRAND TOTAL</small>
              <div>Customer Payable Amount</div>
            </div>
            <div className="total">{money(grandTotal)}</div>
          </div>
        </section>

        <section className="card">
          <div className="section-title">
            <FileText size={18} /> Notes
          </div>
          <textarea
            value={trip.notes}
            placeholder="Additional notes..."
            onChange={(e) => update("notes", e.target.value)}
          />
        </section>

      </main>

      {showHistory && (
        <div className="history-overlay" role="dialog" aria-modal="true" aria-label="Trip history">
          <div className="history-modal">
            <div className="history-header">
              <div>
                <div className="history-title">
                  <History size={19} /> Trip History
                </div>
                <div className="history-meta">
                  {filteredHistory.length} record(s) · {money(historyTotal)}
                </div>
              </div>
              <button className="btn" onClick={() => setShowHistory(false)}>
                <X size={17} /> Close
              </button>
            </div>

            <div className="history-tools">
              <input
                type="month"
                value={historyMonth}
                onChange={(e) => setHistoryMonth(e.target.value)}
                className="history-month"
              />
              <div className="searchbox">
                <Search size={16} />
                <input
                  placeholder="Search customer / trip / vehicle"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                />
              </div>
              <button className="btn red" onClick={clearHistory}>
                <Trash2 size={16} /> Clear Month
              </button>
            </div>

            {filteredHistory.length ? (
              <div className="history-list">
                {filteredHistory.map((item) => {
                  const km =
                    numberValue(item.closeKm) > numberValue(item.startKm)
                      ? numberValue(item.closeKm) - numberValue(item.startKm)
                      : 0;

                  return (
                    <div className="history-item" key={item.id}>
                      <div>
                        <small>TRIP NO</small>
                        <strong>{item.tripNo || "Draft"}</strong>
                      </div>
                      <div>
                        <small>CUSTOMER</small>
                        <strong>{item.customerName || "-"}</strong>
                        <small>{item.customerMobile || ""}</small>
                      </div>
                      <div>
                        <small>DATE / TYPE</small>
                        <strong>{formatDate(item.date)}</strong>
                        <small>{item.tripType}</small>
                      </div>
                      <div>
                        <small>ROUTE</small>
                        <strong>{item.pickup || "-"} → {item.drop || "-"}</strong>
                        <small>{km ? `${km} KM` : ""}</small>
                      </div>
                      <div>
                        <small>VEHICLE</small>
                        <strong>{item.vehicleNo || "-"}</strong>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <button className="btn" onClick={() => openTrip(item)}>
                          Open
                        </button>
                        <button className="btn red" onClick={() => deleteTrip(item.id)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty">இந்த மாதத்திற்கு Trip History இல்லை.</div>
            )}
          </div>
        </div>
      )}

      <div className="print-area">
        <div className="print-sheet">
          <div className="p-header">
            <div className="p-brand">
              <RoyalLogo />
              <div className="p-brand-text">
                <h1>RAJPUTRI</h1>
                <div className="sub">TOURS & TRAVELS</div>
                <div className="tag">Safe Journey · Happy Memories</div>
              </div>
            </div>
            <div className="p-title">
              <h2>TRIP SHEET</h2>
              <div><b>Trip No:</b> {trip.tripNo || generateTripNo()}</div>
              <div><b>Date:</b> {formatDate(trip.date)}</div>
            </div>
          </div>

          <div className="p-grid">
            <div className="p-box">
              <h3>Customer Details</h3>
              <div className="p-line"><b>Name</b><span>{trip.customerName || "-"}</span></div>
              <div className="p-line"><b>Mobile</b><span>{trip.customerMobile || "-"}</span></div>
              <div className="p-line"><b>Trip Type</b><span>{trip.tripType}</span></div>
              <div className="p-line"><b>Reporting</b><span>{trip.reportingTime || "-"}</span></div>
            </div>

            <div className="p-box">
              <h3>Route Details</h3>
              <div className="p-line"><b>Pickup</b><span>{trip.pickup || "-"}</span></div>
              <div className="p-line"><b>Drop</b><span>{trip.drop || "-"}</span></div>
              {trip.tripType === "Full Day Rental" && (
                <>
                  <div className="p-line"><b>End Date</b><span>{formatDate(trip.endDate)}</span></div>
                  <div className="p-line"><b>Release</b><span>{trip.releaseTime || "-"}</span></div>
                </>
              )}
            </div>

            <div className="p-box p-full">
              <h3>Vehicle & Driver Details</h3>
              <div className="p-grid" style={{ marginTop: 0 }}>
                <div className="p-line"><b>Vehicle No</b><span>{trip.vehicleNo || "-"}</span></div>
                <div className="p-line"><b>Vehicle</b><span>{trip.vehicle || "-"}</span></div>
                <div className="p-line"><b>Driver</b><span>{trip.driver || "-"}</span></div>
                <div className="p-line"><b>Driver Mobile</b><span>{trip.driverMobile || "-"}</span></div>
              </div>
            </div>
          </div>

          <div className="p-distance">
            <span>TOTAL DISTANCE</span>
            <span>{totalKm} KM</span>
          </div>

          {trip.tripType === "Full Day Rental" && (
            <div className="p-rental">
              <div className="p-rental-title">
                FULL DAY RENTAL — {money(DAILY_RENTAL)} / DAY · {rentalDays} DAY(S) = {money(rentalAmount)}
              </div>
              <div className="p-rental-lines">
                <b>ONE DAY RENTAL = 12 HOURS OR 200 KM.</b> Fixed package charge; lower KM does not reduce
                the daily rental charge and KM-based calculation does not apply.
                Beyond 200 KM, the next rental day charge of ₹3,000 applies. Fuel, Toll, Parking,
                Permit and other applicable charges are payable by the customer.
              </div>
            </div>
          )}

          <div className="p-charges">
            <table>
              <thead>
                <tr>
                  <th>Charge Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {trip.tripType === "Full Day Rental" ? (
                  <tr><td>Daily Rental ({rentalDays} day × ₹3,000)</td><td>{money(rentalAmount)}</td></tr>
                ) : (
                  <tr><td>Vehicle Charge</td><td>{money(regularVehicleCharge)}</td></tr>
                )}
                <tr><td>Toll</td><td>{money(toll)}</td></tr>
                <tr><td>Parking</td><td>{money(parking)}</td></tr>
                <tr><td>Permit</td><td>{money(permit)}</td></tr>
                <tr><td>Driver Bata</td><td>{money(driverBata)}</td></tr>
                <tr><td>Other</td><td>{money(other)}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="p-grand">
            <span>GRAND TOTAL — CUSTOMER PAYABLE</span>
            <strong>{money(grandTotal)}</strong>
          </div>

          <div className="p-bottom">
            <div>
              <div className="p-notes">
                <b>Notes:</b> {trip.notes || "Thank you for travelling with Rajputri Tours & Travels."}
              </div>
              <div className="p-contact">
                <b>Phone:</b> 8489999568 &nbsp; | &nbsp;
                <b>Website:</b> www.rajputritravels.com &nbsp; | &nbsp;
                <b>Blog:</b> blog.rajputritravels.com
              </div>
            </div>
            <div className="p-seal">
              <DigitalSeal />
            </div>
          </div>

          <div className="p-footer">
            <span>RAJPUTRI TOURS & TRAVELS</span>
            <span>Digitally Generated Trip Sheet</span>
            <span>Safe · Comfortable · On-Time Travel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
