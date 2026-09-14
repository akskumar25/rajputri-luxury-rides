import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Car,
  Plane,
  Building2,
  Users,
  Clock,
  Shield,
  BadgeCheck,
  Navigation,
  Star,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Calendar,
  ArrowRight,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Route as RouteIcon,
  Landmark,
  Briefcase,
  Train,
} from "lucide-react";

import heroSedan from "@/assets/hero-sedan.jpg";
import carInterior from "@/assets/car-interior.jpg";
import airportPickup from "@/assets/airport-pickup.jpg";
import tChidambaram from "@/assets/temple-chidambaram.jpg";
import tRameswaram from "@/assets/temple-rameswaram.jpg";
import tThanjavur from "@/assets/temple-thanjavur.jpg";
import tVelankanni from "@/assets/temple-velankanni.jpg";
import tPalani from "@/assets/temple-palani.jpg";
import tTiruvannamalai from "@/assets/temple-tiruvannamalai.jpg";
import tSrirangam from "@/assets/temple-srirangam.jpg";
import tKumbakonam from "@/assets/temple-kumbakonam.jpg";

const PHONE = "+918489999568";
const WHATSAPP = "918489999568";
const EMAIL = "akskumar25@gmail.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rajputri Tours & Travels — Premium Taxi in Chidambaram, Tamil Nadu" },
      { name: "description", content: "Book premium Sedan taxi from Chidambaram: Chennai/Trichy airport transfers, temple tour packages, outstation, one-way & round trips. Safe, comfortable, on-time." },
      { property: "og:title", content: "Rajputri Tours & Travels — Premium Taxi in Chidambaram, Tamil Nadu" },
      { property: "og:description", content: "Book premium Sedan taxi from Chidambaram: Chennai/Trichy airport transfers, temple tour packages, outstation, one-way & round trips. Safe, comfortable, on-time." },
    ],
  }),
  component: Index,
});

const nav = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Services", "#services"],
  ["Packages", "#packages"],
  ["Airport", "#airport"],
  ["Pricing", "#pricing"],
  ["Gallery", "#gallery"],
  ["Reviews", "#reviews"],
  ["FAQ", "#faq"],
  ["Contact", "#contact"],
];

function Index() {
  return (
    <div id="home" className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <BookingBar />
      <Services />
      <TemplePackages />
      <PopularRoutes />
      <Airport />
      <WhyUs />
      <Pricing />
      <Reviews />
      <Gallery />
      <FAQ />
      <Contact />
      <Footer />
      <FloatingActions />
    </div>
  );
}

/* ---------------- Header ---------------- */
function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto mt-3 max-w-7xl px-4">
        <div className="glass rounded-2xl shadow-soft flex items-center justify-between gap-4 px-4 py-3">
          <a href="#home" className="flex items-center gap-2 min-w-0">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-royal text-royal-foreground shadow-elegant">
              <Car className="h-5 w-5" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="font-display text-base font-bold text-royal truncate">Rajputri</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Tours & Travels</div>
            </div>
          </a>
          <nav className="hidden lg:flex items-center gap-1">
            {nav.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="px-3 py-2 text-sm font-medium text-foreground/80 rounded-lg hover:bg-white/60 hover:text-royal transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={`tel:${PHONE}`}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-royal hover:bg-white/60 transition"
            >
              <Phone className="h-4 w-4" /> Call
            </a>
            <a
              href="#book"
              className="hidden md:inline-flex items-center gap-2 rounded-xl gradient-gold px-4 py-2 text-sm font-semibold text-gold-foreground shadow-gold hover:opacity-95 transition"
            >
              Book Ride <ArrowRight className="h-4 w-4" />
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden grid place-items-center h-10 w-10 rounded-xl bg-white/70 text-royal"
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden mt-2 glass rounded-2xl p-3 shadow-soft animate-fade-up">
            <div className="grid grid-cols-2 gap-1">
              {nav.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/70"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section className="relative min-h-[100svh] pt-28 pb-16 overflow-hidden">
      <img
        src={heroSedan}
        alt="Premium sedan on Tamil Nadu highway"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-royal/85 via-royal/60 to-royal/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/0 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 flex flex-col justify-center min-h-[calc(100svh-11rem)]">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-xs font-semibold text-white uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Chidambaram · Tamil Nadu
          </span>
          <h1 className="mt-5 text-white font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]">
            Your Trusted <span className="text-gradient-gold">Travel Partner</span> in Tamil Nadu
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/85 max-w-xl">
            Safe · Comfortable · On-Time · Affordable Sedan taxi services for airport transfers,
            temple tours and outstation trips across South India.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-xl">

  {/* Book Your Ride */}
  <a
    href="#book"
    className="group inline-flex items-center justify-center gap-2 rounded-2xl gradient-gold px-6 py-4 text-sm font-bold text-gold-foreground shadow-gold hover:scale-105 hover:-translate-y-1 transition-all duration-300"
  >
    🚖 Book Your Ride
    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
  </a>

  {/* Travel Guide */}
  <a
    href="/travel-guide"
    className="group inline-flex items-center justify-center gap-2 rounded-2xl glass px-6 py-4 text-sm font-semibold text-royal shadow-lg hover:bg-royal hover:text-white hover:-translate-y-1 transition-all duration-300"
  >
    📝 Travel Guide
  </a>

  {/* Hotels */}
  <a
    href="/hotels"
    className="group inline-flex items-center justify-center gap-2 rounded-2xl glass px-6 py-4 text-sm font-semibold text-royal shadow-lg hover:bg-royal hover:text-white hover:-translate-y-1 transition-all duration-300"
  >
    🏨 Hotels
  </a>

  {/* Flights */}
  <a
    href="/flights"
    className="group inline-flex items-center justify-center gap-2 rounded-2xl glass px-6 py-4 text-sm font-semibold text-royal shadow-lg hover:bg-royal hover:text-white hover:-translate-y-1 transition-all duration-300"
  >
    ✈️ Flights
  </a>

</div>
          <div className="mt-10 flex flex-wrap gap-6 text-white/90">
            {[
              ["10K+", "Happy Riders"],
              ["24×7", "Available"],
              ["4.9★", "Google Rating"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="text-2xl font-bold text-gold font-display">{n}</div>
                <div className="text-xs uppercase tracking-widest text-white/70">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Booking Form ---------------- */
function BookingBar() {
  const [type, setType] = useState("One Way");
  const trips = ["One Way", "Round Trip", "Airport Pickup", "Airport Drop", "Temple Tour"];
  return (
    <section id="book" className="relative -mt-24 z-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl bg-card shadow-elegant border border-border p-5 sm:p-7">
          <div className="flex flex-wrap gap-2 mb-5">
            {trips.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                  type === t
                    ? "gradient-royal text-royal-foreground shadow-elegant"
                    : "bg-muted text-foreground/70 hover:bg-accent"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <Field icon={<MapPin className="h-4 w-4" />} label="Pickup" placeholder="Chidambaram" />
            <Field icon={<Navigation className="h-4 w-4" />} label="Destination" placeholder="Chennai Airport" />
            <Field icon={<Calendar className="h-4 w-4" />} label="Date" type="date" />
            <Field icon={<Clock className="h-4 w-4" />} label="Time" type="time" />
            <Field icon={<Users className="h-4 w-4" />} label="Passengers" type="number" placeholder="2" />
           <button
  onClick={() =>
    window.open(
      "https://wa.me/918489999568?text=Hello%20Rajputri%20Travels,%20I%20want%20to%20book%20a%20ride.",
      "_blank"
    )
  }
  className="h-full min-h-14 rounded-xl gradient-gold text-gold-foreground font-semibold shadow-gold hover:opacity-95 transition inline-flex items-center justify-center gap-2"
>
  Book Ride <ArrowRight className="h-4 w-4" />
</button>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <BadgeCheck className="h-4 w-4 text-royal" />
            Instant confirmation on WhatsApp · No advance payment required
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  icon,
  label,
  type = "text",
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
        {label}
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-input bg-background px-3 py-3 focus-within:ring-2 focus-within:ring-ring transition">
        <span className="text-royal">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
      </div>
    </label>
  );
}

/* ---------------- Services ---------------- */
function Services() {
  const items = [
    { icon: Plane, title: "Airport Pickup & Drop", desc: "Chennai · Trichy · Pondicherry airports with meet & greet." },
    { icon: Car, title: "Local Taxi", desc: "Hourly and full-day rentals within the city." },
    { icon: RouteIcon, title: "Outstation Taxi", desc: "Comfortable long-distance rides across Tamil Nadu." },
    { icon: Landmark, title: "Temple Packages", desc: "Curated pilgrimage tours with expert local drivers." },
    { icon: Briefcase, title: "Corporate Travel", desc: "Reliable travel partner for meetings and events." },
    { icon: Sparkles, title: "Wedding Travel", desc: "Elegant Sedan for the family on your special day." },
    { icon: Train, title: "Railway Station Pickup", desc: "On-time arrivals at every major junction." },
    { icon: Building2, title: "Hotel Transfers", desc: "Doorstep pickup from your hotel or resort." },
  ];
  return (
    <SectionShell id="services" eyebrow="What we offer" title="Premium services, priced honestly">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="group rounded-2xl bg-card border border-border p-6 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl gradient-royal text-royal-foreground shadow-elegant group-hover:scale-110 transition">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold text-royal">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ---------------- Temple Packages ---------------- */
function TemplePackages() {
  const packages = [
    { name: "Chidambaram Nataraja", img: tChidambaram, days: "Half day" },
    { name: "Velankanni Church", img: tVelankanni, days: "1 day" },
    { name: "Palani Murugan", img: tPalani, days: "2 days" },
    { name: "Rameswaram", img: tRameswaram, days: "2 days" },
    { name: "Thanjavur Big Temple", img: tThanjavur, days: "1 day" },
    { name: "Kumbakonam Navagraha", img: tKumbakonam, days: "1 day" },
    { name: "Tiruvannamalai", img: tTiruvannamalai, days: "1 day" },
    { name: "Srirangam", img: tSrirangam, days: "1 day" },
  ];
  return (
    <SectionShell id="packages" eyebrow="Divine journeys" title="Temple tour packages" tinted>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {packages.map((p) => (
          <article
            key={p.name}
            className="group rounded-2xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                width={800}
                height={600}
                className="h-full w-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-royal/80 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 rounded-full gradient-gold text-gold-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-gold">
                {p.days}
              </span>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="font-display text-lg font-semibold">{p.name}</div>
                <div className="text-xs text-white/80">Starting from <span className="text-gold font-bold">{p.from}</span></div>
              </div>
            </div>
            <a
              href="#book"
              className="flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-royal hover:bg-accent transition"
            >
              Book this package <ChevronRight className="h-4 w-4" />
            </a>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

/* ---------------- Popular Routes ---------------- */
function PopularRoutes() {
  const routes = [
    ["CDM To Chennai Airport", "424 km", "₹7,000"],
    ["CDM To Trichy Airport", "312 km", "₹5,000"],
    ["CDM To Pondicherry", "137.6 km", "₹3,000"],
    ["CDM To Mahabalipuram", "326 km", "₹5,200"],
    ["CDM To Kumbakonam", "145 km", "₹3,500"],
    ["CDM To Thanjavur", "220 km", "₹4,300"],
    ["CDM To Rameswaram", "708 km", "₹11,000"],
    ["CDM To Madurai", "554 km", "₹8,500"],
    ["CDM To Kalahasti", "684 km", "₹11,500"],
  ];
  return (
    <SectionShell id="pricing" eyebrow="Transparent pricing" title="Popular routes from Chidambaram">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {routes.map(([to, km, price]) => (
          <div
            key={to}
            className="rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-elegant hover:border-gold transition"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
              <MapPin className="h-3.5 w-3.5 text-royal" /> Chidambaram
            </div>
            <div className="mt-1 flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-gold" />
              <div className="font-display text-lg font-semibold text-royal">{to}</div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div className="text-xs text-muted-foreground">{km} · Sedan</div>
              <div className="text-gold font-bold text-lg">{price}</div>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ---------------- Airport ---------------- */
function Airport() {
  return (
    <SectionShell id="airport" eyebrow="Airport transfers" title="Fly stress-free" tinted>
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="rounded-3xl overflow-hidden shadow-elegant">
          <img src={airportPickup} alt="Airport pickup" width={1200} height={800} loading="lazy" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-muted-foreground leading-relaxed">
            “Travel with confidence. Our professional driver will be ready to assist you with a smooth and comfortable airport transfer. We value your time and ensure a reliable, hassle-free journey from pickup to destination.”
          </p>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {[
              ["CDM To Chennai (MAA)"],
              ["CDM To Trichy (TRZ)"],
              ["CDM To Pondicherry (PNY)"],
              ["CDM To Bengaluru (BLR)"],
            ].map(([n, m, p]) => (
              <div key={n} className="glass rounded-2xl p-4 shadow-soft">
                <div className="flex items-center gap-2 text-royal font-semibold">
                  <Plane className="h-4 w-4" /> {n}
                </div>
                <div className="mt-1 flex items-end justify-between">
                  <span className="text-xs text-muted-foreground">{m}</span>
                  <span className="text-gold font-bold">{p}</span>
                </div>
              </div>
            ))}
          </div>
          <a href="#book" className="mt-6 inline-flex items-center gap-2 rounded-xl gradient-royal text-royal-foreground px-5 py-3 text-sm font-semibold shadow-elegant hover:opacity-95">
            Book Airport Transfer <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </SectionShell>
  );
}

/* ---------------- Why Us ---------------- */
function WhyUs() {
  const items = [
    [Shield, "Safe Travel", "GPS-tracked rides & verified drivers."],
    [BadgeCheck, "Professional Drivers", "Courteous, uniformed, English-speaking."],
    [Car, "Clean Sedan", "Sanitised & serviced before every trip."],
    [Clock, "On-Time Service", "Punctuality guaranteed, every ride."],
    [Sparkles, "Affordable Pricing", "No hidden charges, transparent fares."],
    [Phone, "24×7 Booking", "Call or WhatsApp us any time."],
    [MapPin, "Doorstep Pickup", "We pick you up from your home."],
    [Navigation, "GPS Navigation", "Fastest, safest routes always."],
  ];
  return (
    <SectionShell id="about" eyebrow="Why Rajputri" title="Trusted by thousands of travellers">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(([Icon, t, d]) => {
          const I = Icon as typeof Shield;
          return (
            <div key={t as string} className="rounded-2xl p-5 bg-card border border-border shadow-soft hover:shadow-elegant transition text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-gold text-gold-foreground shadow-gold">
                <I className="h-6 w-6" />
              </div>
              <div className="mt-4 font-display font-semibold text-royal">{t as string}</div>
              <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{d as string}</div>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}

/* ---------------- Pricing Card ---------------- */
function Pricing() {
  const tiers = [
    { label: "One Way", price: "₹13", per: "/ km", note: "Min 130 km · Toll & permit extra" },
    { label: "Round Trip", price: "₹11", per: "/ km", note: "Min 250 km/day · Driver bata ₹400" },
    { label: "Local (8 hr / 80 km)", price: "₹2,400", per: "flat", note: "Extra ₹12/km · ₹150/hr" },
    { label: "Outstation Multi-day", price: "₹11", per: "/ km", note: "Custom itinerary · Best value" },
  ];
  return (
    <SectionShell eyebrow="Simple pricing" title="Sedan fares at a glance" tinted>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tiers.map((t, i) => (
          <div
            key={t.label}
            className={`rounded-3xl p-6 border transition shadow-soft ${
              i === 1
                ? "gradient-royal text-royal-foreground border-transparent shadow-elegant scale-[1.02]"
                : "bg-card border-border hover:shadow-elegant"
            }`}
          >
            <div className={`text-xs uppercase tracking-widest font-semibold ${i === 1 ? "text-gold" : "text-muted-foreground"}`}>
              {t.label}
            </div>
            <div className="mt-3 flex items-end gap-1">
              <div className={`font-display text-4xl font-bold ${i === 1 ? "text-white" : "text-royal"}`}>{t.price}</div>
              <div className={`pb-1.5 text-sm ${i === 1 ? "text-white/80" : "text-muted-foreground"}`}>{t.per}</div>
            </div>
            <p className={`mt-3 text-xs leading-relaxed ${i === 1 ? "text-white/80" : "text-muted-foreground"}`}>{t.note}</p>
            <a
              href="#book"
              className={`mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
                i === 1
                  ? "gradient-gold text-gold-foreground shadow-gold"
                  : "bg-secondary text-royal hover:bg-accent"
              }`}
            >
              Book now <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ---------------- Reviews ---------------- */
function Reviews() {
  const reviews = [
    { n: "Priya R.", t: "Chennai Airport Pickup", r: "Driver was punctual, car spotless. Made our early flight stress-free. Highly recommend Rajputri!" },
    { n: "Anand K.", t: "Rameswaram Temple Tour", r: "Comfortable Sedan for a 2-day pilgrimage. Driver knew every temple's timings. Excellent service." },
    { n: "Meera & Family", t: "Kumbakonam Navagraha", r: "Beautiful experience. On-time, safe and very affordable. Will definitely book again." },
    { n: "James (NRI)", t: "Chidambaram → Pondicherry", r: "Booked from abroad via WhatsApp. Professional, clean, exactly as promised." },
    { n: "Karthik S.", t: "Corporate Travel", r: "Our go-to travel partner for client visits in Tamil Nadu. Always reliable." },
    { n: "Lakshmi V.", t: "Wedding Travel", r: "Elegant car for our wedding. Family was very comfortable. Thank you Rajputri!" },
  ];
  return (
    <SectionShell id="reviews" eyebrow="Loved by riders" title="What our customers say">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map((r) => (
          <div key={r.n} className="rounded-2xl bg-card border border-border p-6 shadow-soft hover:shadow-elegant transition">
            <div className="flex gap-1 text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-3 text-sm text-foreground/85 leading-relaxed">"{r.r}"</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full gradient-royal text-royal-foreground grid place-items-center font-semibold">
                {r.n[0]}
              </div>
              <div>
                <div className="text-sm font-semibold text-royal">{r.n}</div>
                <div className="text-xs text-muted-foreground">{r.t}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ---------------- Gallery ---------------- */
function Gallery() {
  const imgs = [heroSedan, carInterior, tChidambaram, tThanjavur, airportPickup, tRameswaram, tPalani, tSrirangam];
  return (
    <SectionShell id="gallery" eyebrow="Snapshots" title="Journeys in pictures" tinted>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {imgs.map((src, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl shadow-soft group ${
              i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"
            }`}
          >
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
            <div className="absolute inset-0 bg-royal/0 group-hover:bg-royal/20 transition" />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  const faqs = [
    ["How do I book a taxi?", "You can book instantly via the form above, WhatsApp us, or call our 24×7 line. Confirmation arrives within minutes."],
    ["What payment methods do you accept?", "Cash, UPI, all major cards, and bank transfer. No advance required for local trips."],
    ["Can I cancel my booking?", "Yes — free cancellation up to 2 hours before pickup. Airport trips: 4 hours prior."],
    ["Are your drivers verified?", "All drivers are background-verified, licensed, and trained for hospitality."],
    ["Do you provide outstation multi-day trips?", "Absolutely. We build custom itineraries across Tamil Nadu, Kerala, Karnataka, and Puducherry."],
    ["What if my flight is delayed?", "We track your flight in real-time and adjust the pickup automatically at no extra cost."],
  ];
  return (
    <SectionShell id="faq" eyebrow="Questions" title="Frequently asked">
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map(([q, a], i) => (
          <details
            key={i}
            className="group rounded-2xl bg-card border border-border p-5 shadow-soft open:shadow-elegant transition"
          >
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="font-semibold text-royal pr-4">{q}</span>
              <ChevronRight className="h-5 w-5 text-gold group-open:rotate-90 transition shrink-0" />
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}

/* ---------------- Contact ---------------- */
function Contact() {
  return (
    <SectionShell id="contact" eyebrow="Get in touch" title="Reach us anytime" tinted>
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="space-y-4">
            <ContactRow icon={<MapPin className="h-5 w-5" />} title="Office" text="Chidambaram, Cuddalore District, Tamil Nadu, India" />
            <ContactRow icon={<Phone className="h-5 w-5" />} title="Phone (24×7)" text={PHONE} href={`tel:${PHONE}`} />
            <ContactRow icon={<MessageCircle className="h-5 w-5" />} title="WhatsApp" text="Instant booking" href={`https://wa.me/${WHATSAPP}`} />
            <ContactRow icon={<Mail className="h-5 w-5" />} title="Email" text={EMAIL} href={`mailto:${EMAIL}`} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-xl gradient-royal text-royal-foreground px-5 py-3 text-sm font-semibold shadow-elegant">
              <Phone className="h-4 w-4" /> Call Now
            </a>
            <a href={`https://wa.me/${WHATSAPP}`} className="inline-flex items-center gap-2 rounded-xl gradient-gold text-gold-foreground px-5 py-3 text-sm font-semibold shadow-gold">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 rounded-xl bg-card border border-border px-5 py-3 text-sm font-semibold text-royal">
              <Mail className="h-4 w-4" /> Email
            </a>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-elegant border border-border h-80 lg:h-full min-h-80">
          <iframe
            title="Chidambaram map"
            src="https://www.google.com/maps?q=Chidambaram,Tamil+Nadu&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </SectionShell>
  );
}

function ContactRow({ icon, title, text, href }: { icon: React.ReactNode; title: string; text: string; href?: string }) {
  const inner = (
    <div className="flex items-start gap-4 rounded-2xl bg-card border border-border p-4 shadow-soft hover:shadow-elegant transition">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-royal text-royal-foreground shadow-elegant">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{title}</div>
        <div className="font-semibold text-royal truncate">{text}</div>
      </div>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="mt-20 gradient-royal text-royal-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl gradient-gold text-gold-foreground">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display font-bold">Rajputri</div>
              <div className="text-[10px] uppercase tracking-widest text-white/70">Tours & Travels</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/75 leading-relaxed">
            Premium Sedan taxi services from Chidambaram since 2015. Safe, comfortable and always on time.
          </p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Instagram, Twitter, Youtube].map((Ic, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full glass-dark hover:bg-white/20 transition">
                <Ic className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <FooterCol title="Quick Links" items={["Home", "About", "Services", "Packages", "Contact"]} />
        <FooterCol title="Services" items={["Airport Transfer", "Temple Tours", "Outstation", "Local Rides", "Corporate"]} />
        <FooterCol title="Legal" items={["Privacy Policy", "Terms of Service", "Refund Policy", "Cancellation"]} />
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-white/70">
          <div>© {new Date().getFullYear()} Rajputri Tours & Travels. All rights reserved.</div>
          <div>Chidambaram · Cuddalore Dt · Tamil Nadu · India</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="font-display font-semibold text-gold">{title}</div>
      <ul className="mt-4 space-y-2 text-sm text-white/75">
        {items.map((i) => (
          <li key={i}>
            <a href="#" className="hover:text-gold transition">{i}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Floating actions ---------------- */
function FloatingActions() {
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
      <a
        href={`https://wa.me/${WHATSAPP}`}
        className="grid h-14 w-14 place-items-center rounded-full gradient-gold text-gold-foreground shadow-gold animate-float hover:scale-110 transition"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <a
        href={`tel:${PHONE}`}
        className="grid h-14 w-14 place-items-center rounded-full gradient-royal text-royal-foreground shadow-elegant hover:scale-110 transition"
        aria-label="Call"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}

/* ---------------- Section shell ---------------- */
function SectionShell({
  id,
  eyebrow,
  title,
  children,
  tinted,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  tinted?: boolean;
}) {
  return (
    <section id={id} className={`py-20 ${tinted ? "bg-secondary/60" : ""}`}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-2xl mb-10">
          <div className="text-xs uppercase tracking-[0.25em] font-semibold text-gold">{eyebrow}</div>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-royal">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}
