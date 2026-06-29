import { useState, useEffect } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import bridePhoto from "@/imports/photo_5335006619462476910_y.jpg";
import couplePhoto from "@/imports/photo_5335006619462476917_y.jpg";

// ─── НАСТРОЙКИ САЙТА — редактируйте здесь ────────────────────────────────────
const CONFIG = {
  // Имена
  groomName: "Максим",
  groomName2: "Максима",
  brideName: "Анфиса",
  brideName2: "Анфисы",

  // Дата свадьбы (YYYY-MM-DD)
  weddingDate: "2026-08-08T14:00:00",

  // Тайминги
  schedule: [
    { time: "04.08.2026 16:30", title: "Церемония бракосочетания", place: "Дворец бракосочетания №4, Бутырская ул, 17", mapsLink: "https://yandex.ru/maps/-/CTUw4D9j" },
    { time: "08.08.2026 14:00", title: "Свадебный банкет", place: "Ресторан «Ботаника», Музей-заповедник Архангельское", mapsLink: "https://yandex.ru/maps/-/CTUw42-r" }
  ],

  // Место проведения
  venue: {
    name: "Ресторан «Ботаника»",
    address: "Музей-заповедник Архангельское, 15",
    mapsLink: "https://yandex.com/maps/org/botanika/196493396659?si=d6twvgggrfv6hd88ngdzumggr8",
  },

  // Контакты Telegram
  telegram: {
    groomHandle: "@m_kolyachenko",
    brideHandle: "@anfiss_ka",
    chatHandle: "@anfisamaksim", // замените на ссылку вашего чата
  },

  // Анкета гостя — настройки опций
  form: {
    alcoholOptions: ["Шампанское", "Красное вино", "Белое вино", "Пиво", "Не пью алкоголь"],
    mainCourseOptions: ["Говядина", "Свинина", "Курица", "Рыба", "Вегетарианское"],
  },
};
// ─────────────────────────────────────────────────────────────────────────────

// Countdown hook
function useCountdown(targetDate: string) {
  const calc = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  });
  return time;
}

// Doodle heart SVG
const Heart = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 20S2 13 2 7a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 6-10 13-10 13z"
      stroke="#234968"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

// Garland banner
const Garland = ({ text }: { text: string }) => {
  const words = text.split(" ");
  return (
    <div className="flex flex-wrap justify-center gap-y-2 gap-x-2 py-4 select-none w-full px-2">
      {words.map((word, wi) => (
        <div key={wi} className="flex items-end gap-[3px]">
          {word.split("").map((letter, i) => (
            <div
              key={i}
              className="flex items-center justify-center font-caveat font-bold text-foreground"
              style={{
                width: 28,
                height: 28,
                border: "2px solid #234968",
                borderRadius: 4,
                fontSize: 15,
                transform: `rotate(${(i % 3 === 0 ? -2 : i % 3 === 1 ? 1 : -1)}deg)`,
                flexShrink: 0,
              }}
            >
              {letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Section wrapper
const Section = ({
  children,
  className = "",
  id = "",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => (
  <section
    id={id}
    className={`w-full max-w-lg mx-auto px-6 py-10 ${className}`}
  >
    {children}
  </section>
);

// Wobbly section title
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2
    className="text-3xl font-caveat font-bold text-foreground text-center mb-6"
    style={{ lineHeight: 1.3 }}
  >
    {children}
  </h2>
);

// Divider doodle
const Divider = () => (
  <div className="flex items-center justify-center gap-3 my-2">
    <Heart className="w-4 h-4 opacity-60" />
    <svg width="80" height="8" viewBox="0 0 80 8">
      <path d="M0,4 Q20,0 40,4 Q60,8 80,4" stroke="#234968" strokeWidth="1.5" fill="none" opacity="0.4" />
    </svg>
    <Heart className="w-4 h-4 opacity-60" />
  </div>
);

// Form state type
type FormData = {
  name: string;
  attending: string;
  alcohol: string[];
  mainCourse: string;
  transfer: string;
  submitted: boolean;
};

export default function App() {
  const countdown = useCountdown(CONFIG.weddingDate);

  const [form, setForm] = useState<FormData>({
    name: "",
    attending: "",
    alcohol: [],
    mainCourse: "",
    transfer: "",
    submitted: false,
  });

  const handleAlcohol = (val: string) => {
    setForm((f) => ({
      ...f,
      alcohol: f.alcohol.includes(val)
        ? f.alcohol.filter((a) => a !== val)
        : [...f.alcohol, val],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForm((f) => ({ ...f, submitted: true }));
  };

  const weddingDateFormatted = new Date(CONFIG.weddingDate).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{ background: "#F9EDD9", fontFamily: "'Montserrat', sans-serif" }}
    >
      <DoodleBackground />
      <div className="relative" style={{ zIndex: 1 }}>
      {/* ── 1. ОБЛОЖКА ─────────────────────────────────────────────────────── */}
      <section className="w-full max-w-lg mx-auto px-4 pt-4 pb-10 flex flex-col items-center">
        <Garland text="ЭТО ЧТО СВАДЬБА?" />

        <p
          className="text-foreground opacity-60"
          style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, transform: "rotate(-2deg)", marginTop: -8 }}
        >
          у кого?
        </p>

        <h1
          className="text-5xl font-caveat font-bold text-foreground text-center mt-4 mb-2"
          style={{ lineHeight: 1.25 }}
        >
          {CONFIG.groomName2} и {CONFIG.brideName2}
        </h1>

        <Divider />

        {/* Polaroid photos */}
        <div className="relative w-full mt-8 px-2" style={{ paddingBottom: 48 }}>

          {/* Groom label — top-left, arrow points right-down to photo */}
          <div className="absolute" style={{ left: 0, top: -8, zIndex: 2 }}>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 20, color: "#234968", transform: "rotate(-3deg)", display: "block" }}>
              жених
            </span>
            <svg width="36" height="32" viewBox="0 0 36 32" fill="none">
              <path d="M4 4 Q18 10 30 26" stroke="#234968" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <path d="M24 24 L30 26 L27 19" stroke="#234968" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Bride label — top-right, arrow points left-down to photo */}
          <div className="absolute" style={{ right: 0, top: -8, zIndex: 2, textAlign: "right" }}>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 20, color: "#234968", transform: "rotate(3deg)", display: "block" }}>
              невеста
            </span>
            <svg width="36" height="32" viewBox="0 0 36 32" fill="none" style={{ marginLeft: "auto" }}>
              <path d="M32 4 Q18 10 6 26" stroke="#234968" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <path d="M12 24 L6 26 L9 19" stroke="#234968" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Photos row */}
          <div className="flex justify-center items-end gap-4 pt-10">
            {/* Floating hearts */}
            <Heart className="w-4 h-4 absolute left-1 bottom-12 opacity-50" />
            <Heart className="w-3 h-3 absolute right-2 bottom-16 opacity-40" />

            {/* Groom polaroid */}
            <div
              style={{
                background: "#fff",
                padding: "10px 10px 12px 10px",
                boxShadow: "4px 4px 12px rgba(45,43,110,0.15)",
                transform: "rotate(-4deg)",
                flex: "0 0 44%",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  background: "#E8E0D5",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <rect x="4" y="8" width="28" height="22" rx="2" stroke="#234968" strokeWidth="1.5" fill="none" opacity="0.4"/>
                  <circle cx="18" cy="19" r="6" stroke="#234968" strokeWidth="1.5" fill="none" opacity="0.4"/>
                  <path d="M13 8 L15 4 L21 4 L23 8" stroke="#234968" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: "#234968", opacity: 0.45 }}>
                  ваше фото
                </span>
              </div>
            </div>

            {/* Bride polaroid */}
            <div
              style={{
                background: "#fff",
                padding: "10px 10px 12px 10px",
                boxShadow: "4px 4px 12px rgba(45,43,110,0.15)",
                transform: "rotate(3deg)",
                flex: "0 0 44%",
              }}
            >
              <ImageWithFallback
                src={bridePhoto}
                alt="Невеста в детстве"
                style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", objectPosition: "top center", display: "block" }}
              />
            </div>
          </div>
        </div>

      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────────────────────────── */}
      <WaveDivider />

      {/* ── 2. ТАЙМИНГИ ──────────────────────────────────────────────────────── */}
      <Section id="schedule">
        <SectionTitle>Где и когда?</SectionTitle>

        {/* August 2026 calendar */}
        <div className="mb-8">
          <p className="text-center font-bold text-lg mb-3" style={{ color: "#234968" }}>август 2026</p>
          <div style={{ background: "#FDF5E6", borderRadius: 20, padding: "16px", boxShadow: "3px 3px 0 rgba(35,73,104,0.08)" }}>
            <div className="grid grid-cols-7 mb-2">
              {["пн","вт","ср","чт","пт","сб","вс"].map(d => (
                <div key={d} className="text-center text-xs font-semibold opacity-40" style={{ color: "#234968" }}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
              {[...Array(5)].map((_, i) => <div key={`e${i}`} />)}
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const isMarked = day === 4 || day === 8;
                return (
                  <div key={day} className="flex flex-col items-center justify-center" style={{ height: 36 }}>
                    {isMarked ? (
                      <div className="relative flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                          <path d="M16 27S4 19 4 11a7 7 0 0 1 12-4.9A7 7 0 0 1 28 11c0 8-12 16-12 16z"
                            fill="#5A8BB4" fillOpacity="0.25" stroke="#5A8BB4" strokeWidth="1.2" />
                        </svg>
                        <span className="absolute text-xs font-bold" style={{ color: "#234968" }}>{day}</span>
                      </div>
                    ) : (
                      <span className="text-sm" style={{ color: "#234968", opacity: 0.7 }}>{day}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {CONFIG.schedule.map((item, i) => (
            <div
              key={i}
              className="flex gap-4 items-start"
              style={{
                background: "#FDF5E6",
                border: "none",
                borderRadius: 16,
                padding: "14px 18px",
                transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)`,
                boxShadow: "3px 3px 0 rgba(45,43,110,0.12)",
              }}
            >
              <span
                className="font-caveat font-bold text-xl shrink-0 flex flex-col items-start"
                style={{ color: "#5A8BB4", minWidth: 64 }}
              >
                {item.time.split(" ").map((part, i) => (
                  <span key={i} style={{ lineHeight: 1.3 }}>{part}</span>
                ))}
              </span>
              <div>
                <p className="font-caveat font-bold text-lg text-foreground leading-tight">
                  {item.title}
                </p>
                {item.place && (
                  <p className="font-caveat text-base opacity-70 text-foreground">
                    {item.place}
                  </p>
                )}
                {item.mapsLink && (
                  <a
                    href={item.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-1 text-xs font-semibold text-white"
                    style={{ background: "#5A8BB4", borderRadius: 50, textDecoration: "none" }}
                  >
                    Как добраться →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </Section>

      <WaveDivider flip />

      {/* ── 3. ТАЙМЕР ───────────────────────────────────────────────────────── */}
      <Section id="countdown">
        <SectionTitle>До свадьбы осталось</SectionTitle>
        <div
          className="flex justify-center gap-3 flex-wrap"
        >
          {[
            { value: countdown.days, label: "дней" },
            { value: countdown.hours, label: "часов" },
            { value: countdown.minutes, label: "минут" },
            { value: countdown.seconds, label: "секунд" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center"
              style={{
                background: "#FDF5E6",
                border: "none",
                borderRadius: 16,
                padding: "16px 18px",
                minWidth: 72,
                boxShadow: "3px 3px 0 rgba(45,43,110,0.12)",
              }}
            >
              <span
                className="font-caveat font-bold text-5xl"
                style={{ color: "#5A8BB4", lineHeight: 1 }}
              >
                {String(value).padStart(2, "0")}
              </span>
              <span className="font-caveat text-base text-foreground opacity-70 mt-1">
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6 gap-3">
          <Heart className="w-6 h-6" />
          <Heart className="w-4 h-4 mt-1" />
          <Heart className="w-6 h-6" />
        </div>
      </Section>

      <WaveDivider />

      {/* ── 4. КОНТАКТЫ ─────────────────────────────────────────────────────── */}
      <Section id="contacts">
        <SectionTitle>Есть вопросы?</SectionTitle>
        <p className="font-caveat text-xl text-center text-foreground opacity-80 mb-6">
          Пишите нам в Telegram — ответим с радостью!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {[
            { name: CONFIG.groomName, handle: CONFIG.telegram.groomHandle, rotate: "-1deg" },
            { name: CONFIG.brideName, handle: CONFIG.telegram.brideHandle, rotate: "1deg" },
          ].map(({ name, handle, rotate }) => (
            <a
              key={name}
              href={`https://t.me/${handle.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 flex-1"
              style={{
                background: "#FDF5E6",
                border: "none",
                borderRadius: 20,
                padding: "20px 24px",
                textDecoration: "none",
                transform: `rotate(${rotate})`,
                boxShadow: "3px 3px 0 rgba(45,43,110,0.12)",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="#234968" strokeWidth="2" fill="none" />
                <path d="M10 20 L28 13 L22 30 L18 24 L10 20Z" stroke="#234968" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                <path d="M18 24 L21 27" stroke="#234968" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="font-caveat font-bold text-xl text-foreground">{name}</span>
              <span className="font-caveat text-lg text-foreground opacity-60">{handle}</span>
            </a>
          ))}
        </div>

        {/* Общий чат */}
        <a
          href={`https://t.me/${CONFIG.telegram.chatHandle.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 w-full mt-4"
          style={{
            background: "#FDF5E6",
            border: "none",
            borderRadius: 20,
            padding: "18px 24px",
            textDecoration: "none",
            transform: "rotate(0.5deg)",
            boxShadow: "3px 3px 0 rgba(45,43,110,0.12)",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#234968" strokeWidth="2" fill="none" />
            <path d="M12 14 Q20 10 28 14 Q32 18 28 22 Q24 26 20 24 L16 28 L18 23 Q10 20 12 14Z"
              stroke="#234968" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          </svg>
          <div>
            <span className="font-caveat font-bold text-xl text-foreground block">Общий чат гостей</span>
            <span className="font-caveat text-lg text-foreground opacity-60">{CONFIG.telegram.chatHandle}</span>
          </div>
        </a>
      </Section>

      <WaveDivider flip />

      {/* ── 5. АНКЕТА ГОСТЯ ──────────────────────────────────────────────────── */}
      <Section id="rsvp" className="pb-16">
        <SectionTitle>Анкета гостя</SectionTitle>
        <p className="font-caveat text-xl text-center text-foreground opacity-70 mb-6">
          Заполните, пожалуйста, чтобы мы всё подготовили!
        </p>

        {form.submitted ? (
          <div
            className="text-center py-12 px-6"
            style={{
              background: "#FDF5E6",
              border: "none",
              borderRadius: 24,
              boxShadow: "4px 4px 0 rgba(45,43,110,0.12)",
            }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <p className="font-caveat font-bold text-3xl text-foreground">
              Спасибо, {form.name || "дорогой гость"}!
            </p>
            <p className="font-caveat text-xl text-foreground opacity-70 mt-3">
              Ждём вас на нашем торжестве!
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <Heart className="w-6 h-6" />
              <Heart className="w-5 h-5 mt-1" />
              <Heart className="w-6 h-6" />
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#FDF5E6",
              border: "none",
              borderRadius: 24,
              padding: "28px 24px",
              boxShadow: "4px 4px 0 rgba(45,43,110,0.12)",
            }}
          >
            {/* Name */}
            <FormField label="Ваше имя и фамилия">
              <input
                type="text"
                required
                placeholder="Иванов Иван"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full font-caveat text-xl text-foreground"
                style={inputStyle}
              />
            </FormField>

            {/* Attending */}
            <FormField label="Планируете ли присутствовать?">
              <div className="flex flex-col gap-2 mt-1">
                {["Да, буду!", "К сожалению, не смогу"].map((opt) => (
                  <RadioOption
                    key={opt}
                    label={opt}
                    checked={form.attending === opt}
                    onChange={() => setForm((f) => ({ ...f, attending: opt }))}
                  />
                ))}
              </div>
            </FormField>

            {/* Alcohol */}
            <FormField label="Что предпочитаете из алкоголя?">
              <div className="flex flex-col gap-2 mt-1">
                {CONFIG.form.alcoholOptions.map((opt) => (
                  <CheckboxOption
                    key={opt}
                    label={opt}
                    checked={form.alcohol.includes(opt)}
                    onChange={() => handleAlcohol(opt)}
                  />
                ))}
              </div>
            </FormField>

            {/* Main course */}
            <FormField label="Что предпочтёте в качестве горячего?">
              <div className="flex flex-col gap-2 mt-1">
                {CONFIG.form.mainCourseOptions.map((opt) => (
                  <RadioOption
                    key={opt}
                    label={opt}
                    checked={form.mainCourse === opt}
                    onChange={() => setForm((f) => ({ ...f, mainCourse: opt }))}
                  />
                ))}
              </div>
            </FormField>

            {/* Transfer */}
            <FormField label="Нужен ли вам трансфер?">
              <div className="flex flex-col gap-2 mt-1">
                {["Да, нужен", "Нет, доберусь сам(а)"].map((opt) => (
                  <RadioOption
                    key={opt}
                    label={opt}
                    checked={form.transfer === opt}
                    onChange={() => setForm((f) => ({ ...f, transfer: opt }))}
                  />
                ))}
              </div>
            </FormField>

            <button
              type="submit"
              className="w-full mt-6 py-4 font-caveat font-bold text-base text-foreground"
              style={{
                background: "#5A8BB4",
                border: "none",
                borderRadius: 50,
                cursor: "pointer",
                boxShadow: "3px 3px 0 rgba(45,43,110,0.2)",
                transition: "transform 0.1s",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Отправить анкету
            </button>
          </form>
        )}
      </Section>

      <WaveDivider />

      {/* ── 6. ФИНАЛЬНЫЙ СЛАЙД ───────────────────────────────────────────────── */}
      <section
        className="w-full max-w-lg mx-auto px-6 py-14 flex flex-col items-center"
        style={{ background: "#F9EDD9" }}
      >
        {/* Top text */}
        <div className="self-start flex items-start gap-2 mb-2">
          <Heart className="w-6 h-6 mt-1" />
          <Heart className="w-5 h-5 mt-2" />
          <div className="ml-1">
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, color: "#234968", lineHeight: 1.4 }}>
              До скорой встречи!
            </p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 20, color: "#234968", opacity: 0.7 }}>
              С любовью
            </p>
          </div>
        </div>

        {/* Names */}
        <h2
          className="text-foreground text-center w-full mt-4"
          style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 36, lineHeight: 1.2 }}
        >
          Ваши почти муж и жена
        </h2>

        {/* Polaroid couple photo */}
        <div className="relative mt-10 w-full flex justify-center">
          <div
            style={{
              background: "#fff",
              padding: "12px 12px 48px 12px",
              boxShadow: "6px 6px 20px rgba(45,43,110,0.13)",
              transform: "rotate(-1.5deg)",
              width: "72%",
            }}
          >
            <ImageWithFallback
              src={couplePhoto}
              alt="Максим и Анфиса"
              style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
            />
          </div>
          {/* Hearts beside polaroid */}
          <div className="absolute right-4 top-1/2 flex flex-col gap-1" style={{ transform: "translateY(-50%)" }}>
            <Heart className="w-7 h-7" />
            <Heart className="w-5 h-5 ml-3" />
          </div>
        </div>

        {/* Bottom annotation */}
        <div className="self-start mt-6 ml-4">
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 20, color: "#234968", opacity: 0.7, transform: "rotate(-2deg)", display: "block" }}>
            ↑ мы ждём вас
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pb-10">
        <div className="flex justify-center gap-2 mb-3">
          {[...Array(5)].map((_, i) => (
            <Heart key={i} className="w-4 h-4 opacity-40" />
          ))}
        </div>
        <p className="font-caveat text-lg text-foreground opacity-50">
          {CONFIG.groomName} & {CONFIG.brideName} • {new Date(CONFIG.weddingDate).getFullYear()}
        </p>
      </footer>
      </div>
    </div>
  );
}

// ── Helper components ────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: "2px solid #234968",
  outline: "none",
  padding: "6px 4px",
  fontSize: 20,
};

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <label
        className="block font-caveat font-bold text-xl text-foreground mb-2"
        style={{ lineHeight: 1.3 }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function RadioOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className="flex items-center gap-3 cursor-pointer"
      onClick={onChange}
    >
      <span
        style={{
          width: 22,
          height: 22,
          border: "2px solid #234968",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: checked ? "#D4826A" : "transparent",
          transition: "background 0.15s",
        }}
      >
        {checked && (
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
        )}
      </span>
      <span className="text-base font-normal text-foreground opacity-80">{label}</span>
    </label>
  );
}

function CheckboxOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer" onClick={onChange}>
      <span
        style={{
          width: 22,
          height: 22,
          border: "2px solid #234968",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: checked ? "#234968" : "transparent",
          transition: "background 0.15s",
        }}
      >
        {checked && (
          <svg width="12" height="10" viewBox="0 0 12 10">
            <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        )}
      </span>
      <span className="text-base font-normal text-foreground opacity-80">{label}</span>
    </label>
  );
}

function DoodleBackground() {
  const items = [
    // hearts
    { x: 3,  y: 4,   type: "heart",   size: 18, rot: 15,  op: 0.18 },
    { x: 91, y: 7,   type: "heart",   size: 14, rot: -10, op: 0.15 },
    { x: 7,  y: 13,  type: "heart",   size: 22, rot: 5,   op: 0.12 },
    { x: 85, y: 18,  type: "heart",   size: 16, rot: 20,  op: 0.17 },
    { x: 2,  y: 26,  type: "heart",   size: 12, rot: -8,  op: 0.13 },
    { x: 94, y: 32,  type: "heart",   size: 20, rot: 12,  op: 0.14 },
    { x: 5,  y: 41,  type: "heart",   size: 15, rot: -15, op: 0.16 },
    { x: 88, y: 47,  type: "heart",   size: 24, rot: 8,   op: 0.12 },
    { x: 3,  y: 55,  type: "heart",   size: 13, rot: -5,  op: 0.18 },
    { x: 92, y: 61,  type: "heart",   size: 18, rot: 18,  op: 0.15 },
    { x: 6,  y: 70,  type: "heart",   size: 20, rot: -12, op: 0.13 },
    { x: 87, y: 76,  type: "heart",   size: 14, rot: 6,   op: 0.17 },
    { x: 4,  y: 84,  type: "heart",   size: 16, rot: 10,  op: 0.14 },
    { x: 90, y: 90,  type: "heart",   size: 22, rot: -7,  op: 0.12 },
    // stars
    { x: 12, y: 8,   type: "star",    size: 16, rot: 20,  op: 0.15 },
    { x: 80, y: 12,  type: "star",    size: 12, rot: -15, op: 0.13 },
    { x: 15, y: 22,  type: "star",    size: 20, rot: 5,   op: 0.12 },
    { x: 78, y: 29,  type: "star",    size: 14, rot: 30,  op: 0.16 },
    { x: 10, y: 38,  type: "star",    size: 18, rot: -10, op: 0.14 },
    { x: 82, y: 44,  type: "star",    size: 16, rot: 15,  op: 0.13 },
    { x: 13, y: 52,  type: "star",    size: 12, rot: -20, op: 0.15 },
    { x: 79, y: 58,  type: "star",    size: 22, rot: 8,   op: 0.12 },
    { x: 11, y: 67,  type: "star",    size: 15, rot: 25,  op: 0.16 },
    { x: 83, y: 73,  type: "star",    size: 13, rot: -5,  op: 0.14 },
    { x: 9,  y: 81,  type: "star",    size: 18, rot: 12,  op: 0.13 },
    { x: 81, y: 87,  type: "star",    size: 16, rot: -18, op: 0.15 },
    // balloons
    { x: 20, y: 5,   type: "balloon", size: 22, rot: -5,  op: 0.14 },
    { x: 72, y: 16,  type: "balloon", size: 18, rot: 8,   op: 0.12 },
    { x: 22, y: 33,  type: "balloon", size: 24, rot: -10, op: 0.13 },
    { x: 70, y: 42,  type: "balloon", size: 20, rot: 5,   op: 0.15 },
    { x: 18, y: 60,  type: "balloon", size: 22, rot: -8,  op: 0.12 },
    { x: 74, y: 69,  type: "balloon", size: 18, rot: 12,  op: 0.14 },
    { x: 21, y: 78,  type: "balloon", size: 24, rot: -4,  op: 0.13 },
    { x: 71, y: 85,  type: "balloon", size: 20, rot: 7,   op: 0.12 },
    // flowers
    { x: 30, y: 10,  type: "flower",  size: 20, rot: 10,  op: 0.13 },
    { x: 62, y: 21,  type: "flower",  size: 16, rot: -8,  op: 0.15 },
    { x: 28, y: 48,  type: "flower",  size: 22, rot: 15,  op: 0.12 },
    { x: 64, y: 55,  type: "flower",  size: 18, rot: -12, op: 0.14 },
    { x: 32, y: 73,  type: "flower",  size: 20, rot: 8,   op: 0.13 },
    { x: 60, y: 82,  type: "flower",  size: 16, rot: -5,  op: 0.15 },
    // rings
    { x: 42, y: 3,   type: "ring",    size: 18, rot: 20,  op: 0.13 },
    { x: 50, y: 15,  type: "ring",    size: 14, rot: -15, op: 0.14 },
    { x: 40, y: 36,  type: "ring",    size: 20, rot: 10,  op: 0.12 },
    { x: 52, y: 63,  type: "ring",    size: 16, rot: -8,  op: 0.15 },
    { x: 44, y: 88,  type: "ring",    size: 18, rot: 5,   op: 0.13 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${item.x}%`,
            top: `${item.y}%`,
            opacity: item.op,
            transform: `rotate(${item.rot}deg)`,
          }}
        >
          {item.type === "heart" && (
            <svg width={item.size} height={item.size} viewBox="0 0 24 22" fill="none">
              <path d="M12 20S2 13 2 7a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 6-10 13-10 13z"
                stroke="#234968" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          )}
          {item.type === "star" && (
            <svg width={item.size} height={item.size} viewBox="0 0 24 24" fill="none">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
                stroke="#234968" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          )}
          {item.type === "balloon" && (
            <svg width={item.size} height={Math.round(item.size * 1.4)} viewBox="0 0 22 30" fill="none">
              <ellipse cx="11" cy="11" rx="8" ry="10" stroke="#234968" strokeWidth="1.5" />
              <path d="M11 21 Q9 24 11 27 Q13 24 11 21" stroke="#234968" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M7 21 Q5 22 4 25" stroke="#234968" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
            </svg>
          )}
          {item.type === "flower" && (
            <svg width={item.size} height={item.size} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="#234968" strokeWidth="1.5" />
              <ellipse cx="12" cy="5" rx="2.5" ry="3.5" stroke="#234968" strokeWidth="1.2" />
              <ellipse cx="12" cy="19" rx="2.5" ry="3.5" stroke="#234968" strokeWidth="1.2" />
              <ellipse cx="5" cy="12" rx="3.5" ry="2.5" stroke="#234968" strokeWidth="1.2" />
              <ellipse cx="19" cy="12" rx="3.5" ry="2.5" stroke="#234968" strokeWidth="1.2" />
              <ellipse cx="7" cy="7" rx="2.2" ry="3" stroke="#234968" strokeWidth="1.1" transform="rotate(-45 7 7)" />
              <ellipse cx="17" cy="7" rx="2.2" ry="3" stroke="#234968" strokeWidth="1.1" transform="rotate(45 17 7)" />
              <ellipse cx="7" cy="17" rx="2.2" ry="3" stroke="#234968" strokeWidth="1.1" transform="rotate(45 7 17)" />
              <ellipse cx="17" cy="17" rx="2.2" ry="3" stroke="#234968" strokeWidth="1.1" transform="rotate(-45 17 17)" />
            </svg>
          )}
          {item.type === "ring" && (
            <svg width={item.size} height={item.size} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="7" stroke="#234968" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="4" stroke="#234968" strokeWidth="1" />
              <path d="M9 7 Q12 5 15 7" stroke="#234968" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 400 30"
      preserveAspectRatio="none"
      className="w-full"
      style={{ height: 30, transform: flip ? "scaleY(-1)" : "none" }}
    >
      <path
        d="M0,15 Q50,0 100,15 Q150,30 200,15 Q250,0 300,15 Q350,30 400,15 L400,30 L0,30 Z"
        fill="#234968"
        opacity="0.07"
      />
    </svg>
  );
}
