import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/tripsheet")({
  component: TripSheet,
});

type TripType =
  | "One Way"
  | "Round Trip"
  | "Airport Pickup"
  | "Airport Drop"
  | "Temple Tour"
  | "Local"
  | "Outstation";

function TripSheet() {
  const [tripNo, setTripNo] = useState("RT-0001");
  const [date, setDate] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const [tripType, setTripType] = useState<TripType>("One Way");
  const [reportingTime, setReportingTime] = useState("");

  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState("Hyundai Prime SD CNG");

  const [driverName, setDriverName] = useState("");
  const [driverMobile, setDriverMobile] = useState("");

  const [startKm, setStartKm] = useState("");
  const [closingKm, setClosingKm] = useState("");

  const [vehicleCharge, setVehicleCharge] = useState("");
  const [toll, setToll] = useState("");
  const [parking, setParking] = useState("");
  const [permit, setPermit] = useState("");
  const [driverBata, setDriverBata] = useState("");
  const [otherCharge, setOtherCharge] = useState("");

  const [notes, setNotes] = useState("");

  /* --------------------------------
     Initial Trip Number + Date
  --------------------------------- */

  useEffect(() => {
    try {
      const savedNumber = localStorage.getItem("rajputri-trip-number");

      if (savedNumber) {
        const nextNumber = Number(savedNumber) + 1;
        setTripNo(`RT-${String(nextNumber).padStart(4, "0")}`);
      } else {
        setTripNo("RT-0001");
      }
    } catch {
      setTripNo("RT-0001");
    }

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    setDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  /* --------------------------------
     Calculations
  --------------------------------- */

  const totalKm = useMemo(() => {
    const start = Number(startKm);
    const end = Number(closingKm);

    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      return 0;
    }

    if (end < start) {
      return 0;
    }

    return end - start;
  }, [startKm, closingKm]);

  const totalCharges = useMemo(() => {
    const values = [
      vehicleCharge,
      toll,
      parking,
      permit,
      driverBata,
      otherCharge,
    ];

    return values.reduce((total, value) => {
      const amount = Number(value);

      if (!Number.isFinite(amount)) {
        return total;
      }

      return total + amount;
    }, 0);
  }, [
    vehicleCharge,
    toll,
    parking,
    permit,
    driverBata,
    otherCharge,
  ]);

  /* --------------------------------
     Helpers
  --------------------------------- */

  const formatDate = (value: string) => {
    if (!value) return "";

    const parts = value.split("-");

    if (parts.length !== 3) {
      return value;
    }

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const money = (value: number) => {
    return `₹${value.toLocaleString("en-IN")}`;
  };

  const saveTripNumber = () => {
    const current = Number(tripNo.replace("RT-", ""));

    if (Number.isFinite(current)) {
      localStorage.setItem(
        "rajputri-trip-number",
        String(current),
      );
    }
  };

  const printTripSheet = () => {
    saveTripNumber();
    window.print();
  };

  const createWhatsAppMessage = () => {
    const message = `
RAJPUTRI TRAVELS
TRIP SHEET

Trip No: ${tripNo}
Date: ${formatDate(date)}

Customer: ${customerName || "-"}
Mobile: ${customerMobile || "-"}

Trip Type: ${tripType}
Pickup: ${pickup || "-"}
Drop: ${drop || "-"}
Reporting Time: ${reportingTime || "-"}

Vehicle No: ${vehicleNo || "-"}
Vehicle: ${vehicleType || "-"}
Driver: ${driverName || "-"}
Driver Mobile: ${driverMobile || "-"}

Start KM: ${startKm || "-"}
Closing KM: ${closingKm || "-"}
Total KM: ${totalKm}

Vehicle Charge: ${money(Number(vehicleCharge) || 0)}
Toll: ${money(Number(toll) || 0)}
Parking: ${money(Number(parking) || 0)}
Permit: ${money(Number(permit) || 0)}
Driver Bata: ${money(Number(driverBata) || 0)}
Other: ${money(Number(otherCharge) || 0)}

TOTAL: ${money(totalCharges)}

RAJPUTRI TRAVELS
Founder: SASIKUMAR KUPPUSAMY
Phone: 8489999568
www.rajputritravels.com
blog.rajputritravels.com
`.trim();

    return message;
  };

  const shareWhatsApp = () => {
    const message = createWhatsAppMessage();
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerMobile("");
    setPickup("");
    setDrop("");
    setTripType("One Way");
    setReportingTime("");
    setVehicleNo("");
    setVehicleType("Hyundai Prime SD CNG");
    setDriverName("");
    setDriverMobile("");
    setStartKm("");
    setClosingKm("");
    setVehicleCharge("");
    setToll("");
    setParking("");
    setPermit("");
    setDriverBata("");
    setOtherCharge("");
    setNotes("");

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    setDate(`${yyyy}-${mm}-${dd}`);

    try {
      const saved = localStorage.getItem(
        "rajputri-trip-number",
      );

      const next = saved ? Number(saved) + 1 : 1;

      setTripNo(`RT-${String(next).padStart(4, "0")}`);
    } catch {
      setTripNo("RT-0001");
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .trip-page {
          min-height: 100vh;
          background: #f4f6f9;
          padding: 24px 14px 60px;
          font-family: Arial, Helvetica, sans-serif;
          color: #172033;
        }

        .trip-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }

        .trip-header {
          background: linear-gradient(135deg, #071b3a, #183b72);
          color: white;
          border-radius: 18px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,.12);
        }

        .trip-header h1 {
          margin: 0 0 6px;
          font-size: 28px;
        }

        .trip-header p {
          margin: 4px 0;
          opacity: .9;
        }

        .trip-card {
          background: white;
          border-radius: 18px;
          padding: 20px;
          margin-bottom: 18px;
          box-shadow: 0 5px 20px rgba(0,0,0,.07);
        }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 16px;
          color: #122d5b;
          border-bottom: 2px solid #e9edf4;
          padding-bottom: 10px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 15px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field.full {
          grid-column: 1 / -1;
        }

        .field label {
          font-size: 13px;
          font-weight: 700;
          color: #475569;
        }

        .field input,
        .field select,
        .field textarea {
          width: 100%;
          border: 1px solid #d7dce5;
          border-radius: 10px;
          padding: 12px;
          font-size: 15px;
          outline: none;
          background: white;
        }

        .field textarea {
          min-height: 90px;
          resize: vertical;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: #315fa8;
          box-shadow: 0 0 0 3px rgba(49,95,168,.10);
        }

        .total-box {
          background: #f1f6ff;
          border: 1px solid #d7e4fb;
          border-radius: 14px;
          padding: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-top: 18px;
        }

        .total-label {
          font-size: 14px;
          color: #526071;
        }

        .total-value {
          font-size: 28px;
          font-weight: 800;
          color: #102f62;
        }

        .button-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .action-button {
          border: 0;
          border-radius: 12px;
          padding: 14px 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .print-button {
          background: #122f61;
          color: white;
        }

        .whatsapp-button {
          background: #168a48;
          color: white;
        }

        .reset-button {
          background: #eef1f5;
          color: #263448;
        }

        .sheet {
          background: white;
          border: 2px solid #172b4d;
          padding: 28px;
          max-width: 900px;
          margin: 0 auto;
          position: relative;
        }

        .sheet-top {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 2px solid #172b4d;
          padding-bottom: 18px;
          margin-bottom: 18px;
        }

        .company-name {
          font-size: 28px;
          font-weight: 900;
          color: #102e60;
        }

        .company-info {
          font-size: 13px;
          line-height: 1.6;
        }

        .trip-number {
          text-align: right;
          font-weight: 700;
        }

        .sheet-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 18px;
        }

        .sheet-table th,
        .sheet-table td {
          border: 1px solid #aeb7c5;
          padding: 9px;
          text-align: left;
          font-size: 13px;
        }

        .sheet-table th {
          background: #eef2f7;
          font-weight: 700;
        }

        .seal-sign {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 30px;
          margin-top: 45px;
        }

        .seal {
          width: 105px;
          height: 105px;
          border: 3px solid #172f61;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          font-size: 11px;
          font-weight: 800;
          color: #172f61;
          transform: rotate(-8deg);
        }

        .signature {
          text-align: center;
          min-width: 190px;
        }

        .signature-line {
          border-bottom: 1px solid #333;
          margin-bottom: 7px;
          height: 35px;
        }

        .sheet-footer {
          border-top: 1px solid #c8ced8;
          padding-top: 12px;
          margin-top: 25px;
          text-align: center;
          font-size: 11px;
          color: #596579;
        }

        @media (max-width: 700px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .field.full {
            grid-column: auto;
          }

          .button-row {
            grid-template-columns: 1fr;
          }

          .sheet {
            padding: 15px;
          }

          .sheet-top {
            flex-direction: column;
          }

          .trip-number {
            text-align: left;
          }

          .company-name {
            font-size: 22px;
          }

          .seal-sign {
            flex-direction: column;
            align-items: center;
          }
        }

        @media print {
          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .trip-page {
            padding: 0 !important;
            background: white !important;
          }

          .sheet {
            border: 2px solid #172b4d;
            max-width: none;
            width: 100%;
            box-shadow: none;
          }
        }
      `}</style>

      <div className="trip-page">
        <div className="trip-container">

          {/* ======================================
              FORM
          ======================================= */}

          <div className="no-print">
            <div className="trip-header">
              <h1>RAJPUTRI TRAVELS</h1>
              <p>Digital Trip Sheet Management</p>
              <p>
                8489999568 · www.rajputritravels.com
              </p>
            </div>

            <div className="trip-card">
              <h2 className="section-title">
                Trip Information
              </h2>

              <div className="grid">

                <div className="field">
                  <label>Trip Number</label>
                  <input
                    type="text"
                    value={tripNo}
                    readOnly
                  />
                </div>

                <div className="field">
                  <label>Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) =>
                      setDate(e.target.value)
                    }
                  />
                </div>

                <div className="field">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) =>
                      setCustomerName(e.target.value)
                    }
                    placeholder="Customer name"
                  />
                </div>

                <div className="field">
                  <label>Customer Mobile</label>
                  <input
                    type="tel"
                    value={customerMobile}
                    onChange={(e) =>
                      setCustomerMobile(e.target.value)
                    }
                    placeholder="Mobile number"
                  />
                </div>

                <div className="field">
                  <label>Trip Type</label>
                  <select
                    value={tripType}
                    onChange={(e) =>
                      setTripType(
                        e.target.value as TripType,
                      )
                    }
                  >
                    <option>One Way</option>
                    <option>Round Trip</option>
                    <option>Airport Pickup</option>
                    <option>Airport Drop</option>
                    <option>Temple Tour</option>
                    <option>Local</option>
                    <option>Outstation</option>
                  </select>
                </div>

                <div className="field">
                  <label>Reporting Time</label>
                  <input
                    type="time"
                    value={reportingTime}
                    onChange={(e) =>
                      setReportingTime(e.target.value)
                    }
                  />
                </div>

                <div className="field">
                  <label>Pickup Location</label>
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) =>
                      setPickup(e.target.value)
                    }
                    placeholder="Pickup location"
                  />
                </div>

                <div className="field">
                  <label>Drop Location</label>
                  <input
                    type="text"
                    value={drop}
                    onChange={(e) =>
                      setDrop(e.target.value)
                    }
                    placeholder="Destination"
                  />
                </div>

              </div>
            </div>

            <div className="trip-card">
              <h2 className="section-title">
                Vehicle & Driver
              </h2>

              <div className="grid">

                <div className="field">
                  <label>Vehicle Number</label>
                  <input
                    type="text"
                    value={vehicleNo}
                    onChange={(e) =>
                      setVehicleNo(e.target.value)
                    }
                    placeholder="TN XX XX XXXX"
                  />
                </div>

                <div className="field">
                  <label>Vehicle Type</label>
                  <input
                    type="text"
                    value={vehicleType}
                    onChange={(e) =>
                      setVehicleType(e.target.value)
                    }
                  />
                </div>

                <div className="field">
                  <label>Driver Name</label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) =>
                      setDriverName(e.target.value)
                    }
                    placeholder="Driver name"
                  />
                </div>

                <div className="field">
                  <label>Driver Mobile</label>
                  <input
                    type="tel"
                    value={driverMobile}
                    onChange={(e) =>
                      setDriverMobile(e.target.value)
                    }
                    placeholder="Driver mobile"
                  />
                </div>

              </div>
            </div>

            <div className="trip-card">
              <h2 className="section-title">
                KM Details
              </h2>

              <div className="grid">

                <div className="field">
                  <label>Starting KM</label>
                  <input
                    type="number"
                    min="0"
                    value={startKm}
                    onChange={(e) =>
                      setStartKm(e.target.value)
                    }
                    placeholder="0"
                  />
                </div>

                <div className="field">
                  <label>Closing KM</label>
                  <input
                    type="number"
                    min="0"
                    value={closingKm}
                    onChange={(e) =>
                      setClosingKm(e.target.value)
                    }
                    placeholder="0"
                  />
                </div>

              </div>

              <div className="total-box">
                <div>
                  <div className="total-label">
                    TOTAL DISTANCE
                  </div>
                  <strong>Total KM</strong>
                </div>

                <div className="total-value">
                  {totalKm} KM
                </div>
              </div>
            </div>

            <div className="trip-card">
              <h2 className="section-title">
                Trip Charges
              </h2>

              <div className="grid">

                <div className="field">
                  <label>Vehicle Charge ₹</label>
                  <input
                    type="number"
                    min="0"
                    value={vehicleCharge}
                    onChange={(e) =>
                      setVehicleCharge(e.target.value)
                    }
                    placeholder="0"
                  />
                </div>

                <div className="field">
                  <label>Toll ₹</label>
                  <input
                    type="number"
                    min="0"
                    value={toll}
                    onChange={(e) =>
                      setToll(e.target.value)
                    }
                    placeholder="0"
                  />
                </div>

                <div className="field">
                  <label>Parking ₹</label>
                  <input
                    type="number"
                    min="0"
                    value={parking}
                    onChange={(e) =>
                      setParking(e.target.value)
                    }
                    placeholder="0"
                  />
                </div>

                <div className="field">
                  <label>Permit ₹</label>
                  <input
                    type="number"
                    min="0"
                    value={permit}
                    onChange={(e) =>
                      setPermit(e.target.value)
                    }
                    placeholder="0"
                  />
                </div>

                <div className="field">
                  <label>Driver Bata ₹</label>
                  <input
                    type="number"
                    min="0"
                    value={driverBata}
                    onChange={(e) =>
                      setDriverBata(e.target.value)
                    }
                    placeholder="0"
                  />
                </div>

                <div className="field">
                  <label>Other Charges ₹</label>
                  <input
                    type="number"
                    min="0"
                    value={otherCharge}
                    onChange={(e) =>
                      setOtherCharge(e.target.value)
                    }
                    placeholder="0"
                  />
                </div>

              </div>

              <div className="total-box">
                <div>
                  <div className="total-label">
                    TOTAL TRIP AMOUNT
                  </div>
                  <strong>Grand Total</strong>
                </div>

                <div className="total-value">
                  {money(totalCharges)}
                </div>
              </div>
            </div>

            <div className="trip-card">
              <h2 className="section-title">
                Notes
              </h2>

              <div className="field">
                <label>Additional Information</label>
                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  placeholder="Additional trip details..."
                />
              </div>
            </div>

            <div className="trip-card">
              <div className="button-row">

                <button
                  type="button"
                  className="action-button print-button"
                  onClick={printTripSheet}
                >
                  🖨️ Print / Save PDF
                </button>

                <button
                  type="button"
                  className="action-button whatsapp-button"
                  onClick={shareWhatsApp}
                >
                  💬 WhatsApp
                </button>

                <button
                  type="button"
                  className="action-button reset-button"
                  onClick={resetForm}
                >
                  🔄 New Trip
                </button>

              </div>
            </div>
          </div>

          {/* ======================================
              PRINTABLE TRIP SHEET
          ======================================= */}

          <div className="sheet">

            <div className="sheet-top">

              <div>
                <div className="company-name">
                  RAJPUTRI TRAVELS
                </div>

                <div className="company-info">
                  Airport Pickup & Drop · Temple Tours
                  · Outstation Taxi
                  <br />
                  Phone: 8489999568
                  <br />
                  www.rajputritravels.com
                  <br />
                  blog.rajputritravels.com
                </div>
              </div>

              <div className="trip-number">
                <div>TRIP SHEET</div>
                <div>{tripNo}</div>
                <div>{formatDate(date)}</div>
              </div>

            </div>

            <table className="sheet-table">
              <tbody>

                <tr>
                  <th>Customer Name</th>
                  <td>{customerName || "-"}</td>

                  <th>Mobile</th>
                  <td>{customerMobile || "-"}</td>
                </tr>

                <tr>
                  <th>Trip Type</th>
                  <td>{tripType}</td>

                  <th>Reporting Time</th>
                  <td>{reportingTime || "-"}</td>
                </tr>

                <tr>
                  <th>Pickup</th>
                  <td>{pickup || "-"}</td>

                  <th>Drop</th>
                  <td>{drop || "-"}</td>
                </tr>

                <tr>
                  <th>Vehicle No</th>
                  <td>{vehicleNo || "-"}</td>

                  <th>Vehicle</th>
                  <td>{vehicleType || "-"}</td>
                </tr>

                <tr>
                  <th>Driver</th>
                  <td>{driverName || "-"}</td>

                  <th>Driver Mobile</th>
                  <td>{driverMobile || "-"}</td>
                </tr>

              </tbody>
            </table>

            <table className="sheet-table">
              <tbody>

                <tr>
                  <th>Starting KM</th>
                  <td>{startKm || "-"}</td>

                  <th>Closing KM</th>
                  <td>{closingKm || "-"}</td>
                </tr>

                <tr>
                  <th>Total KM</th>
                  <td colSpan={3}>
                    <strong>{totalKm} KM</strong>
                  </td>
                </tr>

              </tbody>
            </table>

            <table className="sheet-table">
              <thead>
                <tr>
                  <th>Charge Description</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>Vehicle Charge</td>
                  <td>{money(Number(vehicleCharge) || 0)}</td>
                </tr>

                <tr>
                  <td>Toll</td>
                  <td>{money(Number(toll) || 0)}</td>
                </tr>

                <tr>
                  <td>Parking</td>
                  <td>{money(Number(parking) || 0)}</td>
                </tr>

                <tr>
                  <td>Permit</td>
                  <td>{money(Number(permit) || 0)}</td>
                </tr>

                <tr>
                  <td>Driver Bata</td>
                  <td>{money(Number(driverBata) || 0)}</td>
                </tr>

                <tr>
                  <td>Other Charges</td>
                  <td>{money(Number(otherCharge) || 0)}</td>
                </tr>

                <tr>
                  <th>GRAND TOTAL</th>
                  <th>{money(totalCharges)}</th>
                </tr>

              </tbody>
            </table>

            <table className="sheet-table">
              <tbody>
                <tr>
                  <th>Notes</th>
                  <td>{notes || "-"}</td>
                </tr>
              </tbody>
            </table>

            <div className="seal-sign">

              <div className="seal">
                RAJPUTRI
                <br />
                TRAVELS
                <br />
                OFFICIAL
              </div>

              <div className="signature">
                <div className="signature-line"></div>
                <strong>
                  SASIKUMAR KUPPUSAMY
                </strong>
                <br />
                Founder
              </div>

            </div>

            <div className="sheet-footer">
              Thank you for travelling with RAJPUTRI TRAVELS.
              <br />
              Safe · Comfortable · On-Time Travel
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
