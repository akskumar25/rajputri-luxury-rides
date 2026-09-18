import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Car,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  FileText,
  IndianRupee,
  MessageCircle,
  Printer,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/tripsheet")({
  component: TripSheet,
});

function TripSheet() {
  const [tripNo] = useState(() => {
    const current = Number(
      localStorage.getItem("rajputri-trip-number") || "0"
    ) + 1;

    localStorage.setItem(
      "rajputri-trip-number",
      String(current)
    );

    return `RT-${new Date().getFullYear()}-${String(current).padStart(4, "0")}`;
  });

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [customer, setCustomer] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [tripType, setTripType] = useState("One Way");

  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState("Sedan");
  const [driver, setDriver] = useState("");
  const [driverMobile, setDriverMobile] = useState("");

  const [startKm, setStartKm] = useState("");
  const [closeKm, setCloseKm] = useState("");

  const [vehicleCharge, setVehicleCharge] = useState("");
  const [toll, setToll] = useState("");
  const [parking, setParking] = useState("");
  const [permit, setPermit] = useState("");
  const [bata, setBata] = useState("");
  const [other, setOther] = useState("");

  const totalKm =
    Math.max(
      0,
      Number(closeKm || 0) - Number(startKm || 0)
    );

  const totalAmount =
    Number(vehicleCharge || 0) +
    Number(toll || 0) +
    Number(parking || 0) +
    Number(permit || 0) +
    Number(bata || 0) +
    Number(other || 0);

  const money = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;

  const resetForm = () => {
    window.location.reload();
  };

  const printTripSheet = () => {
    window.print();
  };

  const shareWhatsApp = () => {
    const message = `
RAJPUTRI TRAVELS
Trip Sheet: ${tripNo}

Date: ${date}
Customer: ${customer}
Mobile: ${customerMobile}

Pickup: ${pickup}
Drop: ${drop}
Trip Type: ${tripType}

Vehicle: ${vehicleNo}
Driver: ${driver}

Starting KM: ${startKm}
Closing KM: ${closeKm}
Total KM: ${totalKm}

Total Amount: ${money(totalAmount)}

Founder: SASIKUMAR KUPPUSAMMY
Phone: 8489999568
www.rajputritravels.com
blog.rajputritravels.com
`.trim();

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-secondary/40 text-foreground">

      {/* HEADER */}
      <header className="print:hidden bg-royal text-white">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl gradient-gold text-gold-foreground">
              <Car className="h-6 w-6" />
            </div>

            <div>
              <h1 className="font-display text-2xl font-bold">
                RAJPUTRI TRAVELS
              </h1>

              <p className="text-xs text-white/70">
                Professional Travel & Cab Services
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">

        {/* PAGE TITLE */}
        <div className="print:hidden mb-5">
          <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-widest">
            <FileText className="h-4 w-4" />
            Trip Management
          </div>

          <h2 className="mt-2 font-display text-3xl font-bold text-royal">
            Trip Sheet
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Create a professional trip sheet and share it with your customer.
          </p>
        </div>

        {/* FORM */}
        <div className="print:hidden space-y-5">

          {/* Trip Information */}
          <Section title="Trip Information">

            <div className="grid sm:grid-cols-2 gap-4">

              <Input
                label="Trip Sheet No."
                value={tripNo}
                readOnly
                icon={<FileText className="h-4 w-4" />}
              />

              <Input
                label="Trip Date"
                type="date"
                value={date}
                onChange={setDate}
                icon={<Calendar className="h-4 w-4" />}
              />

            </div>
          </Section>

          {/* Customer */}
          <Section title="Customer Details">

            <div className="grid sm:grid-cols-2 gap-4">

              <Input
                label="Customer Name"
                value={customer}
                onChange={setCustomer}
                placeholder="Customer name"
                icon={<User className="h-4 w-4" />}
              />

              <Input
                label="Customer Mobile"
                value={customerMobile}
                onChange={setCustomerMobile}
                placeholder="Mobile number"
                type="tel"
                icon={<Phone className="h-4 w-4" />}
              />

              <Input
                label="Pickup Location"
                value={pickup}
                onChange={setPickup}
                placeholder="Pickup location"
                icon={<MapPin className="h-4 w-4" />}
              />

              <Input
                label="Drop Location"
                value={drop}
                onChange={setDrop}
                placeholder="Drop location"
                icon={<MapPin className="h-4 w-4" />}
              />

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Trip Type
                </label>

                <select
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none"
                >
                  <option>One Way</option>
                  <option>Round Trip</option>
                  <option>Airport Pickup</option>
                  <option>Airport Drop</option>
                  <option>Local</option>
                  <option>Temple Tour</option>
                  <option>Outstation</option>
                </select>
              </div>

              <Input
                label="Reporting Time"
                type="time"
                icon={<Clock className="h-4 w-4" />}
              />

            </div>
          </Section>

          {/* Vehicle */}
          <Section title="Vehicle & Driver">

            <div className="grid sm:grid-cols-2 gap-4">

              <Input
                label="Vehicle Number"
                value={vehicleNo}
                onChange={setVehicleNo}
                placeholder="TN XX XX XXXX"
                icon={<Car className="h-4 w-4" />}
              />

              <Input
                label="Vehicle Type"
                value={vehicleType}
                onChange={setVehicleType}
                icon={<Car className="h-4 w-4" />}
              />

              <Input
                label="Driver Name"
                value={driver}
                onChange={setDriver}
                placeholder="Driver name"
                icon={<User className="h-4 w-4" />}
              />

              <Input
                label="Driver Mobile"
                value={driverMobile}
                onChange={setDriverMobile}
                placeholder="Driver mobile"
                type="tel"
                icon={<Phone className="h-4 w-4" />}
              />

            </div>
          </Section>

          {/* KM */}
          <Section title="KM Details">

            <div className="grid sm:grid-cols-3 gap-4">

              <Input
                label="Starting KM"
                type="number"
                value={startKm}
                onChange={setStartKm}
                placeholder="0"
              />

              <Input
                label="Closing KM"
                type="number"
                value={closeKm}
                onChange={setCloseKm}
                placeholder="0"
              />

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Total KM
                </label>

                <div className="mt-1 rounded-xl bg-royal px-4 py-3 text-lg font-bold text-white">
                  {totalKm} KM
                </div>
              </div>

            </div>
          </Section>

          {/* Charges */}
          <Section title="Trip Charges">

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <MoneyInput
                label="Vehicle Charge"
                value={vehicleCharge}
                onChange={setVehicleCharge}
              />

              <MoneyInput
                label="Toll"
                value={toll}
                onChange={setToll}
              />

              <MoneyInput
                label="Parking"
                value={parking}
                onChange={setParking}
              />

              <MoneyInput
                label="Permit"
                value={permit}
                onChange={setPermit}
              />

              <MoneyInput
                label="Driver Bata"
                value={bata}
                onChange={setBata}
              />

              <MoneyInput
                label="Other Charges"
                value={other}
                onChange={setOther}
              />

            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl bg-royal px-5 py-5 text-white">
              <span className="font-bold">
                TOTAL AMOUNT
              </span>

              <span className="text-2xl font-bold text-gold">
                {money(totalAmount)}
              </span>
            </div>

          </Section>

          {/* ACTIONS */}
          <div className="grid sm:grid-cols-3 gap-3">

            <button
              onClick={printTripSheet}
              className="inline-flex items-center justify-center gap-2 rounded-xl gradient-gold px-5 py-4 font-bold text-gold-foreground shadow-gold"
            >
              <Printer className="h-5 w-5" />
              Generate PDF
            </button>

            <button
              onClick={shareWhatsApp}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#128c7e] px-5 py-4 font-bold text-white"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </button>

            <button
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-royal px-5 py-4 font-bold text-white"
            >
              <RotateCcw className="h-5 w-5" />
              New Trip
            </button>

          </div>

        </div>

        {/* PRINTABLE TRIP SHEET */}
        <div className="trip-print-sheet">

          <div className="border-2 border-royal rounded-2xl overflow-hidden bg-white">

            {/* PDF HEADER */}
            <div className="bg-royal text-white px-6 py-6 text-center">

              <h1 className="font-display text-3xl font-bold">
                RAJPUTRI TRAVELS
              </h1>

              <p className="mt-1 text-sm text-white/80">
                Professional Travel & Cab Services
              </p>

              <div className="mt-4 inline-block rounded-full bg-white/10 px-5 py-2 text-xs font-bold tracking-widest">
                TRIP SHEET
              </div>

            </div>

            <div className="p-6">

              {/* Trip number */}
              <div className="flex justify-between border-b pb-4">

                <div>
                  <div className="text-xs text-muted-foreground">
                    TRIP SHEET NO.
                  </div>

                  <div className="font-bold text-royal">
                    {tripNo}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-muted-foreground">
                    DATE
                  </div>

                  <div className="font-bold text-royal">
                    {date || "-"}
                  </div>
                </div>

              </div>

              <PrintSection title="CUSTOMER DETAILS">

                <PrintRow label="Customer Name" value={customer} />
                <PrintRow label="Mobile" value={customerMobile} />
                <PrintRow label="Pickup" value={pickup} />
                <PrintRow label="Drop" value={drop} />
                <PrintRow label="Trip Type" value={tripType} />

              </PrintSection>

              <PrintSection title="VEHICLE & DRIVER">

                <PrintRow label="Vehicle No." value={vehicleNo} />
                <PrintRow label="Vehicle Type" value={vehicleType} />
                <PrintRow label="Driver Name" value={driver} />
                <PrintRow label="Driver Mobile" value={driverMobile} />

              </PrintSection>

              <PrintSection title="KM DETAILS">

                <PrintRow label="Starting KM" value={`${startKm || 0} KM`} />
                <PrintRow label="Closing KM" value={`${closeKm || 0} KM`} />
                <PrintRow label="Total KM" value={`${totalKm} KM`} />

              </PrintSection>

              <PrintSection title="CHARGES">

                <PrintRow label="Vehicle Charge" value={money(Number(vehicleCharge || 0))} />
                <PrintRow label="Toll" value={money(Number(toll || 0))} />
                <PrintRow label="Parking" value={money(Number(parking || 0))} />
                <PrintRow label="Permit" value={money(Number(permit || 0))} />
                <PrintRow label="Driver Bata" value={money(Number(bata || 0))} />
                <PrintRow label="Other Charges" value={money(Number(other || 0))} />

              </PrintSection>

              {/* TOTAL */}
              <div className="mt-6 rounded-xl bg-royal px-5 py-4 text-white flex justify-between">
                <span className="font-bold">
                  TOTAL AMOUNT
                </span>

                <span className="text-xl font-bold text-gold">
                  {money(totalAmount)}
                </span>
              </div>

              {/* Signature & Seal */}
              <div className="mt-12 grid grid-cols-2 gap-10 items-end">

                <div>
                  <div className="h-12 border-b border-gray-400" />

                  <p className="mt-2 text-xs font-bold">
                    Authorized Signature
                  </p>

                  <p className="text-sm font-bold text-royal">
                    Founder: SASIKUMAR KUPPUSAMY
                  </p>
                </div>

                <div className="flex justify-end">

                  <div className="h-24 w-24 rounded-full border-2 border-royal flex items-center justify-center text-center">

                    <div>
                      <ShieldCheck className="mx-auto h-6 w-6 text-royal" />

                      <div className="text-[9px] font-bold text-royal">
                        RAJPUTRI
                      </div>

                      <div className="text-[8px] font-bold">
                        TRAVELS
                      </div>

                      <div className="text-[7px]">
                        AUTHORIZED
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* Footer */}
              <div className="mt-10 border-t pt-5 text-center">

                <p className="text-sm font-bold text-royal">
                  RAJPUTRI TRAVELS
                </p>

                <p className="mt-1 text-xs">
                  Founder: SASIKUMAR KUPPUSAMY
                </p>

                <p className="text-xs">
                  Phone: 8489999568
                </p>

                <p className="text-xs">
                  www.rajputritravels.com
                </p>

                <p className="text-xs">
                  blog.rajputritravels.com
                </p>

              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}


/* ---------------- Components ---------------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">

      <h3 className="mb-4 border-l-4 border-gold pl-3 font-display text-lg font-bold text-royal">
        {title}
      </h3>

      {children}

    </section>
  );
}


function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  readOnly = false,
}: {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  readOnly?: boolean;
}) {
  return (
    <label className="block">

      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>

      <div className="mt-1 flex items-center gap-2 rounded-xl border border-input bg-background px-3 py-3">

        {icon && (
          <span className="text-royal">
            {icon}
          </span>
        )}

        <input
          type={type}
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={(e) =>
            onChange?.(e.target.value)
          }
          className="w-full bg-transparent text-sm outline-none"
        />

      </div>

    </label>
  );
}


function MoneyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Input
      label={`${label} ₹`}
      type="number"
      value={value}
      onChange={onChange}
      placeholder="0"
      icon={<IndianRupee className="h-4 w-4" />}
    />
  );
}


function PrintSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">

      <h3 className="border-b-2 border-royal pb-2 text-sm font-bold tracking-widest text-royal">
        {title}
      </h3>

      <div className="mt-3">
        {children}
      </div>

    </div>
  );
}


function PrintRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="grid grid-cols-2 border-b border-gray-100 py-2 text-sm">

      <span className="font-semibold text-gray-600">
        {label}
      </span>

      <span className="font-semibold text-gray-900">
        {value || "-"}
      </span>

    </div>
  );
}
