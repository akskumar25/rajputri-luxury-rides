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

const createTrip = (): Trip => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  tripNo: "",
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
    <svg width="108" height="108" viewBox="0 0 120 120" aria-label="Official digital seal">
      <circle cx="60" cy="60" r="56" fill="white" stroke="#171717" strokeWidth="4" />
      <circle cx="60" cy="60" r="47" fill="none" stroke="#c9a227" strokeWidth="2.5" />
      <path
        d="M60 25 L64 35 L75 35 L66 42 L70 52 L60 46 L50 52 L54 42 L45 35 L56 35 Z"
        fill="#c9a227"
      />
      <text
        x="60"
        y="70"
        textAnchor="middle"
        fontSize="23"
        fontWeight="900"
        fontFamily="Arial, sans-serif"
        fill="#111"
      >
        R
      </text>
      <text
        x="60"
        y="84"
        textAnchor="middle"
        fontSize="8"
        fontWeight="800"
        fontFamily="Arial, sans-serif"
        fill="#111"
      >
        ✓ OFFICIAL
      </text>
      <text
        x="60"
        y="96"
        textAnchor="middle"
        fontSize="6.5"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
        fill="#555"
      >
        DIGITAL TRIP SHEET
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
    const daysByKm = totalKm > 0 ? Math.ceil(totalKm / 220) : 1;

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
            const byKm = km > 0 ? Math.ceil(km / 220) : 1;
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
      const match = item.tripNo.match(/(\d+)$/);
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
    setTrip(createTrip());
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

  return (
    <div className="trip-app">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #f4f5f7; color: #171717; font-family: Arial, Helvetica, sans-serif; }
        button, input, select, textarea { font: inherit; }
        button { cursor: pointer; }
        .trip-app { min-height: 100vh; }
        .topbar {
          position: sticky; top: 0; z-index: 30;
          background: #111; color: white; border-bottom: 3px solid #c9a227;
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
        .container { max-width: 1180px; margin: 0 auto; padding: 20px; }
        .notice {
          background: #fffdf4; border: 1px solid #e6d28b; border-left: 5px solid #c9a227;
          padding: 12px 14px; border-radius: 10px; margin-bottom: 16px;
        }
        .notice strong { display: block; margin-bottom: 4px; }
        .saved { color: #167743; font-weight: 800; font-size: 13px; }
        .card {
          background: white; border: 1px solid #dedede; border-radius: 14px; padding: 18px;
          margin-bottom: 16px; box-shadow: 0 3px 12px rgba(0,0,0,.04);
        }
        .section-title {
          display: flex; align-items: center; gap: 8px; font-weight: 900; font-size: 17px;
          margin-bottom: 14px; border-bottom: 1px solid #eee; padding-bottom: 10px;
        }
        .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 13px; }
        .grid.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field > span, .charge-field > span { font-size: 12px; font-weight: 800; color: #444; }
        input, select, textarea {
          width: 100%; border: 1px solid #cfcfcf; border-radius: 8px; padding: 11px 12px;
          background: white; color: #111; outline: none;
        }
        input:focus, select:focus, textarea:focus { border-color: #c9a227; box-shadow: 0 0 0 2px rgba(201,162,39,.12); }
        textarea { min-height: 80px; resize: vertical; }
        .rental-box {
          margin-top: 15px; padding: 15px; border-radius: 12px; background: #111; color: white;
          border: 2px solid #c9a227;
        }
        .rental-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .rental-head strong { color: #f0d16b; font-size: 18px; }
        .rental-price { font-size: 24px; font-weight: 900; }
        .rental-rules { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 12px; }
        .rental-rule { background: #222; border: 1px solid #444; border-radius: 8px; padding: 9px; font-size: 12px; line-height: 1.4; }
        .rental-rule b { display: block; color: #f0d16b; margin-bottom: 3px; }
        .terms { font-size: 12px; line-height: 1.55; margin-top: 11px; color: #eee; }
        .charge-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
        .money-input { display: flex; align-items: center; border: 1px solid #cfcfcf; border-radius: 8px; overflow: hidden; }
        .money-input > span { padding-left: 10px; color: #666; }
        .money-input input { border: 0; border-radius: 0; }
        .total-box {
          display: flex; align-items: center; justify-content: space-between; gap: 20px;
          padding: 16px 18px; background: #111; color: white; border-radius: 12px;
        }
        .total-box small { color: #d5d5d5; }
        .total { color: #f0d16b; font-size: 28px; font-weight: 900; }
        .action-row { display: flex; flex-wrap: wrap; gap: 9px; }
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

        @media (max-width: 900px) {
          .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .charge-grid { grid-template-columns: repeat(3, 1fr); }
          .rental-rules { grid-template-columns: repeat(2, 1fr); }
          .history-item { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .topbar { align-items: flex-start; flex-direction: column; }
          .toolbar { width: 100%; justify-content: flex-start; }
          .container { padding: 12px; }
          .grid, .grid.two, .charge-grid { grid-template-columns: 1fr; }
          .rental-head { align-items: flex-start; flex-direction: column; }
          .rental-rules { grid-template-columns: 1fr; }
          .total-box { align-items: flex-start; flex-direction: column; }
          .total { font-size: 24px; }
          .history-tools { width: 100%; }
          .searchbox, .searchbox input { width: 100%; }
        }

        @media print {
          @page { size: A4 portrait; margin: 0; }
          html, body { width: 210mm; height: 297mm; margin: 0; background: white; }
          body { overflow: hidden; }
          .trip-app { display: none !important; }
          .print-area {
            display: block !important;
            width: 210mm;
            height: 297mm;
            overflow: hidden;
            background: white;
          }
          .print-sheet {
            width: 210mm;
            height: 297mm;
            padding: 9mm 10mm 7mm;
            overflow: hidden;
            color: #111;
            font-family: Arial, Helvetica, sans-serif;
          }
          .p-header {
            height: 36mm;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1.4px solid #c9a227;
            padding-bottom: 4mm;
          }
          .p-brand { display: flex; align-items: center; gap: 4mm; }
          .p-brand-text h1 {
            margin: 0; font: 900 23pt Georgia, serif; letter-spacing: 2px;
          }
          .p-brand-text .sub {
            margin-top: 1mm; font-size: 8.5pt; font-weight: 800; letter-spacing: 1.7px;
          }
          .p-brand-text .tag {
            margin-top: 1.5mm; font-size: 7pt; color: #555;
          }
          .p-title { text-align: right; }
          .p-title h2 { margin: 0; font-size: 18pt; letter-spacing: 1px; }
          .p-title div { margin-top: 2mm; font-size: 8.5pt; }
          .p-grid {
            display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; margin-top: 4mm;
          }
          .p-box {
            border: .7px solid #bbb; border-radius: 2mm; padding: 3mm 3.5mm;
            min-height: 25mm;
          }
          .p-box h3 {
            margin: 0 0 2mm; font-size: 8pt; text-transform: uppercase; letter-spacing: .7px;
            border-bottom: .5px solid #ddd; padding-bottom: 1.5mm;
          }
          .p-line {
            display: grid; grid-template-columns: 34% 66%; gap: 2mm; margin-bottom: 1.2mm;
            font-size: 8.3pt; line-height: 1.25;
          }
          .p-line b { color: #555; }
          .p-full { grid-column: 1 / -1; }
          .p-distance {
            margin-top: 3mm; border: 1px solid #c9a227; background: #fffdf4;
            border-radius: 2mm; padding: 2.5mm 3mm; display: flex; justify-content: space-between;
            font-size: 9pt; font-weight: 800;
          }
          .p-rental {
            margin-top: 3mm; border: 1px solid #222; border-radius: 2mm; padding: 3mm;
            background: #fafafa;
          }
          .p-rental-title { font-size: 9pt; font-weight: 900; margin-bottom: 1.5mm; }
          .p-rental-lines { font-size: 7.5pt; line-height: 1.42; }
          .p-charges { margin-top: 3mm; }
          .p-charges table { width: 100%; border-collapse: collapse; font-size: 8pt; }
          .p-charges th, .p-charges td { border: .5px solid #ccc; padding: 1.7mm 2mm; }
          .p-charges th { background: #f1f1f1; text-align: left; }
          .p-charges td:last-child, .p-charges th:last-child { text-align: right; }
          .p-grand {
            margin-top: 2.5mm; display: flex; align-items: center; justify-content: space-between;
            border: 1.5px solid #111; border-radius: 2mm; padding: 3mm 4mm;
          }
          .p-grand span:first-child { font-size: 9pt; font-weight: 900; }
          .p-grand strong { font-size: 16pt; }
          .p-bottom {
            margin-top: 3mm; display: grid; grid-template-columns: 1fr 32mm; gap: 5mm; align-items: center;
          }
          .p-notes {
            border: .5px solid #ccc; border-radius: 2mm; padding: 2.5mm; min-height: 17mm;
            font-size: 7.5pt; line-height: 1.4;
          }
          .p-contact { margin-top: 2.5mm; font-size: 7.3pt; color: #444; line-height: 1.4; }
          .p-seal { text-align: center; }
          .p-footer {
            margin-top: 3mm; padding-top: 2.5mm; border-top: .7px solid #c9a227;
            display: flex; justify-content: space-between; font-size: 7pt; color: #555;
          }
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

        <div className="toolbar">
          <button className="btn dark" onClick={newTrip}>
            <FileText size={16} /> New
          </button>
          <button className="btn gold" onClick={saveTrip}>
            <CheckCircle2 size={16} /> Save
          </button>
          <button className="btn" onClick={() => window.print()}>
            <Printer size={16} /> PDF / Print
          </button>
          <button className="btn green" onClick={whatsapp}>
            <MessageCircle size={16} /> WhatsApp
          </button>
          <button className="btn" onClick={() => setShowHistory(true)}>
            <History size={16} /> History
          </button>
        </div>
      </header>

      <main className="container">
        <div className="notice">
          <strong>Digital Trip Sheet</strong>
          Customer-facing A4 Trip Sheet. Save செய்து PDF / Print மூலம் A4-ல் ஒரே பக்கமாக உருவாக்கலாம்.
          {savedMessage && <div className="saved">✓ {savedMessage}</div>}
        </div>

        <section className="card">
          <div className="section-title">
            <CalendarDays size={18} /> Trip Details
          </div>

          <div className="grid">
            <Field
              label="Trip No"
              value={trip.tripNo}
              placeholder="Auto generated on Save"
              onChange={(v) => update("tripNo", v)}
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
                  12 HOURS OR 200 KM
                </div>
                <div className="rental-rule">
                  <b>GRACE KM</b>
                  200 KM + 20 KM FREE
                </div>
                <div className="rental-rule">
                  <b>LIMIT</b>
                  Up to 220 KM
                </div>
                <div className="rental-rule">
                  <b>220 KM+</b>
                  Next day rental ₹2,000 applies
                </div>
              </div>

              <div className="terms">
                Fuel, Toll, Parking, Permit and other applicable charges are payable by the
                customer. Rental calculation is based on the 12-hour / 200 KM package rule;
                20 KM grace is allowed beyond 200 KM.
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
            <div className="field">
              <span>Total Distance</span>
              <input value={`${totalKm} KM`} readOnly />
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

        <div className="action-row">
          <button className="btn dark" onClick={newTrip}>
            <FileText size={17} /> New Trip
          </button>
          <button className="btn gold" onClick={saveTrip}>
            <CheckCircle2 size={17} /> Save Trip
          </button>
          <button className="btn" onClick={() => window.print()}>
            <Printer size={17} /> Create PDF
          </button>
          <button className="btn green" onClick={whatsapp}>
            <MessageCircle size={17} /> Send WhatsApp
          </button>
          <button className="btn" onClick={() => setShowHistory(true)}>
            <History size={17} /> Monthly History
          </button>
        </div>
      </main>

      {showHistory && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,.55)",
            padding: 18,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              background: "white",
              borderRadius: 14,
              padding: 18,
              minHeight: "80vh",
            }}
          >
            <div className="history-header">
              <div>
                <div className="section-title" style={{ marginBottom: 0, border: 0 }}>
                  <History size={19} /> Monthly Trip History
                </div>
                <div style={{ color: "#666", fontSize: 13 }}>
                  {filteredHistory.length} record(s) · {money(historyTotal)}
                </div>
              </div>
              <button className="btn" onClick={() => setShowHistory(false)}>
                <X size={17} /> Close
              </button>
            </div>

            <div className="history-tools" style={{ marginTop: 15 }}>
              <input
                type="month"
                value={historyMonth}
                onChange={(e) => setHistoryMonth(e.target.value)}
                style={{ maxWidth: 180 }}
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
              <div><b>Trip No:</b> {trip.tripNo || "DRAFT"}</div>
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
                <b>One Day Rental = 12 Hours or 200 KM.</b> Fixed package charge; lower KM does not reduce
                the daily rental charge and KM-based calculation does not apply.
                After 200 KM, up to 20 additional KM is free. Beyond 220 KM, next day rental charge
                of ₹2,000 applies. Fuel, Toll, Parking, Permit and other applicable charges are payable
                by the customer.
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
                  <tr><td>Daily Rental ({rentalDays} day × ₹2,000)</td><td>{money(rentalAmount)}</td></tr>
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
