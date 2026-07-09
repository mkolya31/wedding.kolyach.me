import {useState, useEffect, useRef} from "react";
import {ImageWithFallback} from "@/app/components/figma/ImageWithFallback";
import {submitRsvp} from "@/api/rsvp";
import bridePhoto from "@/imports/photo_5335006619462476910_y.jpg";
import couplePhoto from "@/imports/photo_5335006619462476917_y.jpg";
import gardenTexture from "@/imports/garden-texture.png";
import gardenTextureDesktop from "@/imports/garden-texture-desktop.png";
import toyAirplane from "@/imports/toy-airplane.png";

// ─── НАСТРОЙКИ САЙТА — редактируйте здесь ────────────────────────────────────
const CONFIG = {
    // Имена
    groomName: "Максим",
    groomName2: "Максима",
    brideName: "Анфиса",
    brideName2: "Анфисы",

    // Дата свадьбы (YYYY-MM-DD)
    zagsDate: "2026-08-04T16:30:00",
    weddingDate: "2026-08-08T14:00:00",

    // Тайминги
    schedule: [
        {
            date: "04.08.2026",
            time: "16:30",
            title: "Церемония бракосочетания",
            place: "Дворец бракосочетания №4, Бутырская ул, 17",
            mapsLink: "https://yandex.ru/maps/-/CTUw4D9j"
        },
        {
            date: "08.08.2026",
            time: "14:00",
            title: "Свадебный банкет",
            place: "Ресторан «Ботаника», Музей-заповедник \"Архангельское\"",
            mapsLink: "https://yandex.ru/maps/-/CTUw42-r"
        }
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
        alcoholOptions: ["Шампанское", "Красное вино", "Белое вино", "Пиво", "Водка", "Джин", "Ром", "Коньяк", "Не пью алкоголь"],
        mainCourseOptions: ["Ризотто с ростбифом", "Ризотто карри с лососем и эспуме из угря", "Утиная ножка конфи", "Сибас с пюре из корня сельдерея", "Стейк из телятины со свеклой и черной смородиной", "Рёбра кальки с папоротником", "Стейк Шато Бриан"],
    },
};
// ─────────────────────────────────────────────────────────────────────────────

// Countdown hook
function useCountdown(targetDate: string) {
    const calc = () => {
        const diff = new Date(targetDate).getTime() - Date.now();
        if (diff <= 0) return {days: 0, hours: 0, minutes: 0, seconds: 0};
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
const Heart = ({className = ""}: { className?: string }) => (
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
const Garland = ({text}: { text: string }) => {
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
const SectionTitle = ({children}: { children: React.ReactNode }) => (
    <h2
        className="text-3xl font-caveat font-bold text-foreground text-center mb-6"
        style={{lineHeight: 1.3}}
    >
        {children}
    </h2>
);

const FlightBanner = ({
                          children,
                          rotate = -1,
                          maxWidth = 390,
                          padding = "13px 18px 14px",
                      }: {
    children: React.ReactNode;
    rotate?: number;
    maxWidth?: number;
    padding?: string;
}) => (
    <div
        className="relative text-center"
        style={{
            width: `min(100%, ${maxWidth}px)`,
            background: "#FDF5E6",
            border: "2px solid rgba(140, 109, 86, 0.42)",
            borderRadius: 12,
            padding,
            boxShadow: "5px 7px 0 rgba(45,43,110,0.12), 0 10px 22px rgba(35,73,104,0.12)",
            transform: `rotate(${rotate}deg)`,
        }}
    >
        <span
            aria-hidden="true"
            style={{
                position: "absolute",
                left: -16,
                top: 13,
                width: 24,
                height: 34,
                background: "#EACDB8",
                border: "2px solid rgba(140, 109, 86, 0.32)",
                borderRight: "none",
                borderRadius: "8px 0 0 8px",
                transform: "skewY(8deg)",
                zIndex: -1,
            }}
        />
        <span
            aria-hidden="true"
            style={{
                position: "absolute",
                right: -16,
                top: 13,
                width: 24,
                height: 34,
                background: "#EACDB8",
                border: "2px solid rgba(140, 109, 86, 0.32)",
                borderLeft: "none",
                borderRadius: "0 8px 8px 0",
                transform: "skewY(-8deg)",
                zIndex: -1,
            }}
        />
        {children}
    </div>
);

const FlightCable = ({
                         height,
                         viewBox,
                         path,
                         knotY,
                         style,
                     }: {
    height: number;
    viewBox: string;
    path: string;
    knotY: number;
    style?: React.CSSProperties;
}) => (
    <svg
        width="72"
        height={height}
        viewBox={viewBox}
        fill="none"
        aria-hidden="true"
        style={{overflow: "visible", ...style}}
    >
        <path
            d={path}
            stroke="#8C6D56"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="4 5"
        />
        <circle cx="36" cy={knotY} r="4" fill="#FDF5E6" stroke="#8C6D56" strokeWidth="1.5"/>
    </svg>
);

const HeroFlightBanner = ({names}: { names: string }) => (
    <div className="relative flex w-full flex-col items-center select-none" style={{marginTop: 4}}>
        <img
            src={toyAirplane}
            alt=""
            aria-hidden="true"
            className="pointer-events-none"
            style={{
                width: "min(74vw, 280px)",
                height: "auto",
                display: "block",
                transform: "rotate(12deg)",
                transformOrigin: "50% 55%",
                filter: "drop-shadow(8px 10px 10px rgba(35, 73, 104, 0.18))",
            }}
        />
        <FlightCable
            height={68}
            viewBox="0 0 72 68"
            path="M14 0 C7 14 40 28 31 44 C26 54 35 61 36 68"
            knotY={66}
            style={{marginTop: -32, marginBottom: -4}}
        />
        <FlightBanner rotate={-1}>
            <p
                className="font-caveat font-bold text-foreground"
                style={{fontSize: 30, lineHeight: 1.05}}
            >
                Это что свадьба?
            </p>
        </FlightBanner>
        <FlightCable
            height={38}
            viewBox="0 0 72 38"
            path="M36 0 C30 8 43 14 36 23 C31 29 38 34 36 38"
            knotY={36}
            style={{marginTop: -2, marginBottom: -4}}
        />
        <FlightBanner rotate={1} maxWidth={220} padding="11px 18px 12px">
            <p
                className="font-caveat font-bold text-foreground"
                style={{
                    fontSize: 30,
                    lineHeight: 1.05,
                }}
            >
                У кого?
            </p>
        </FlightBanner>
        <FlightCable
            height={48}
            viewBox="0 0 72 48"
            path="M36 0 C39 10 30 18 36 27 C42 36 34 41 36 48"
            knotY={46}
            style={{marginTop: -2, marginBottom: -5}}
        />
        <FlightBanner rotate={1} maxWidth={360} padding="12px 18px 13px">
            <h1
                className="font-caveat font-bold text-foreground"
                style={{fontSize: 38, lineHeight: 1.05}}
            >
                {names}
            </h1>
        </FlightBanner>
    </div>
);

// Divider doodle
const Divider = () => (
    <div className="flex items-center justify-center gap-3 my-2">
        <Heart className="w-4 h-4 opacity-60"/>
        <svg width="80" height="8" viewBox="0 0 80 8">
            <path d="M0,4 Q20,0 40,4 Q60,8 80,4" stroke="#234968" strokeWidth="1.5" fill="none" opacity="0.4"/>
        </svg>
        <Heart className="w-4 h-4 opacity-60"/>
    </div>
);

// Form state type
type FormData = {
    name: string;
    attending: string;
    alcohol: string[];
    mainCourse: string[];
    transfer: string;
    hostingHelp: string;
    website: string;
    submitted: boolean;
};

export default function App() {
    const zagsCountdown = useCountdown(CONFIG.zagsDate);
    const weddingCountdown = useCountdown(CONFIG.weddingDate);
    const backgroundRef = useRef<HTMLDivElement | null>(null);

    const [form, setForm] = useState<FormData>({
        name: "",
        attending: "",
        alcohol: [],
        mainCourse: [],
        transfer: "",
        hostingHelp: "",
        website: "",
        submitted: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        let frame = 0;

        const updateBackgroundTransform = () => {
            frame = 0;
            if (!backgroundRef.current) return;
            backgroundRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.42}px, 0)`;
        };

        const handleScroll = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(updateBackgroundTransform);
        };

        updateBackgroundTransform();
        window.addEventListener("scroll", handleScroll, {passive: true});

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, []);

    const handleAlcohol = (val: string) => {
        setForm((f) => ({
            ...f,
            alcohol: f.alcohol.includes(val)
                ? f.alcohol.filter((a) => a !== val)
                : [...f.alcohol, val],
        }));
    };

    const handleMainCourse = (val: string) => {
        setForm((f) => ({
            ...f,
            mainCourse: f.mainCourse.includes(val)
                ? f.mainCourse.filter((course) => course !== val)
                : [...f.mainCourse, val],
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSubmitting) return;

        const website = String(new window.FormData(e.currentTarget).get("website") ?? "");

        setIsSubmitting(true);
        setSubmitError("");

        try {
            await submitRsvp({
                name: form.name,
                i_will_come: form.attending,
                alcohol: form.alcohol.join(", "),
                meal: form.mainCourse.join(", "),
                need_transfer: form.transfer,
                hosting_help: form.hostingHelp,
                website,
            });
            setForm((f) => ({...f, submitted: true}));
        } catch {
            setSubmitError("Не удалось отправить анкету. Попробуйте еще раз.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-screen w-full relative overflow-hidden"
            style={{
                backgroundColor: "#F9EDD9",
                fontFamily: "'Montserrat', sans-serif",
                isolation: "isolate",
            }}
        >
            <div
                ref={backgroundRef}
                className="absolute inset-0 pointer-events-none"
                style={{
                    zIndex: 0,
                    willChange: "transform",
                }}
            >
                <div
                    className="absolute inset-0 md:hidden"
                    style={{
                        backgroundImage: `url(${gardenTexture})`,
                        backgroundPosition: "top center",
                        backgroundRepeat: "repeat",
                        backgroundSize: "390px auto",
                    }}
                />
                <div
                    className="absolute inset-0 hidden md:block"
                    style={{
                        backgroundImage: `url(${gardenTextureDesktop})`,
                        backgroundPosition: "top center",
                        backgroundRepeat: "repeat",
                        backgroundSize: "390px auto",
                    }}
                />
            </div>
            <div className="relative" style={{zIndex: 1}}>
                {/* ── 1. ОБЛОЖКА ─────────────────────────────────────────────────────── */}
                <section className="w-full max-w-lg mx-auto px-4 pt-4 pb-10 flex flex-col items-center">
                    <HeroFlightBanner names={`У ${CONFIG.groomName2} и ${CONFIG.brideName2}!`}/>

                    <Divider/>

                    {/* Polaroid photos */}
                    <div className="relative w-full mt-8 px-2" style={{paddingBottom: 48}}>

                        {/* Groom label — top-left, arrow points right-down to photo */}
                        <div className="absolute" style={{left: 0, top: -8, zIndex: 2}}>
            <span style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 20,
                color: "#234968",
                transform: "rotate(-3deg)",
                display: "block"
            }}>
              жених
            </span>
                            <svg width="36" height="32" viewBox="0 0 36 32" fill="none">
                                <path d="M4 4 Q18 10 30 26" stroke="#234968" strokeWidth="1.5" fill="none"
                                      strokeLinecap="round"/>
                                <path d="M24 24 L30 26 L27 19" stroke="#234968" strokeWidth="1.5" fill="none"
                                      strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>

                        {/* Bride label — top-right, arrow points left-down to photo */}
                        <div className="absolute" style={{right: 0, top: -8, zIndex: 2, textAlign: "right"}}>
            <span style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 20,
                color: "#234968",
                transform: "rotate(3deg)",
                display: "block"
            }}>
              невеста
            </span>
                            <svg width="36" height="32" viewBox="0 0 36 32" fill="none" style={{marginLeft: "auto"}}>
                                <path d="M32 4 Q18 10 6 26" stroke="#234968" strokeWidth="1.5" fill="none"
                                      strokeLinecap="round"/>
                                <path d="M12 24 L6 26 L9 19" stroke="#234968" strokeWidth="1.5" fill="none"
                                      strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>

                        {/* Photos row */}
                        <div className="flex justify-center items-end gap-4 pt-10">
                            {/* Floating hearts */}
                            <Heart className="w-4 h-4 absolute left-1 bottom-12 opacity-50"/>
                            <Heart className="w-3 h-3 absolute right-2 bottom-16 opacity-40"/>

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
                                        <rect x="4" y="8" width="28" height="22" rx="2" stroke="#234968"
                                              strokeWidth="1.5" fill="none" opacity="0.4"/>
                                        <circle cx="18" cy="19" r="6" stroke="#234968" strokeWidth="1.5" fill="none"
                                                opacity="0.4"/>
                                        <path d="M13 8 L15 4 L21 4 L23 8" stroke="#234968" strokeWidth="1.5" fill="none"
                                              opacity="0.4" strokeLinejoin="round"/>
                                    </svg>
                                    <span style={{
                                        fontFamily: "'Montserrat', sans-serif",
                                        fontSize: 13,
                                        color: "#234968",
                                        opacity: 0.45
                                    }}>
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
                                    style={{
                                        width: "100%",
                                        aspectRatio: "3/4",
                                        objectFit: "cover",
                                        objectPosition: "top center",
                                        display: "block"
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                </section>

                {/* ── WAVE DIVIDER ─────────────────────────────────────────────────────── */}
                <WaveDivider/>

                {/* ── 2. ТАЙМИНГИ ──────────────────────────────────────────────────────── */}
                <Section id="schedule">
                    <SectionTitle>Где и когда?</SectionTitle>

                    {/* August 2026 calendar */}
                    <div className="mb-8">
                        <p className="text-center font-bold text-lg mb-3" style={{color: "#234968"}}>август 2026</p>
                        <div style={{
                            background: "#FDF5E6",
                            borderRadius: 20,
                            padding: "16px",
                            boxShadow: "3px 3px 0 rgba(35,73,104,0.08)",
                            height: "159px",
                            overflow: "hidden",
                        }}>
                            <div className="grid grid-cols-7 mb-2">
                                {["пн", "вт", "ср", "чт", "пт", "сб", "вс"].map(d => (
                                    <div key={d} className="text-center text-xs font-semibold opacity-40"
                                         style={{color: "#234968"}}>{d}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-y-1">
                                {[...Array(5)].map((_, i) => <div key={`e${i}`}/>)}
                                {[...Array(31)].map((_, i) => {
                                    const day = i + 1;
                                    const isMarked = day === 4 || day === 8;
                                    return (
                                        <div key={day} className="flex flex-col items-center justify-center"
                                             style={{height: 36}}>
                                            {isMarked ? (
                                                <div className="relative flex items-center justify-center">
                                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                                        <path
                                                            d="M16 27S4 19 4 11a7 7 0 0 1 12-4.9A7 7 0 0 1 28 11c0 8-12 16-12 16z"
                                                            fill="#B43A32" fillOpacity="0.25" stroke="#B43A32"
                                                            strokeWidth="1.2"/>
                                                    </svg>
                                                    <span className="absolute text-xs font-bold"
                                                          style={{color: "#234968"}}>{day}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm"
                                                      style={{color: "#234968", opacity: 0.7}}>{day}</span>
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
                                style={{
                                    background: "#FDF5E6",
                                    border: "none",
                                    borderRadius: 16,
                                    padding: "14px 18px",
                                    transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)`,
                                    boxShadow: "3px 3px 0 rgba(45,43,110,0.12)",
                                }}
                            >
                                <p
                                    className="font-caveat font-bold text-xl"
                                    style={{color: "#5A8BB4", lineHeight: 1.2}}
                                >
                                    {item.date} <span style={{color: "#B43A32"}}>{item.time}</span>
                                </p>
                                <div className="mt-3">
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
                                            className="inline-block mt-4 px-4 py-2 text-sm font-semibold text-white"
                                            style={{background: "#5A8BB4", borderRadius: 50, textDecoration: "none"}}
                                        >
                                            Открыть на карте
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                                 viewBox="0 0 24 24" style={{display: "inline-block"}} className="ml-1">
                                                <path fill="currentColor"
                                                      d="M12 1a9.002 9.002 0 0 0-6.366 15.362c1.63 1.63 5.466 3.988 5.693 6.465.034.37.303.673.673.673s.64-.303.673-.673c.227-2.477 4.06-4.831 5.689-6.46A9.002 9.002 0 0 0 12 1m0 12.079a3.079 3.079 0 1 1 0-6.158 3.079 3.079 0 0 1 0 6.158"></path>
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                </Section>

                <WaveDivider flip/>

                {/* ── 3. КОНТАКТЫ ─────────────────────────────────────────────────────── */}
                <Section id="contacts">
                    <SectionTitle>Есть вопросы?</SectionTitle>
                    <p className="font-caveat text-xl text-center text-foreground opacity-80 mb-6">
                        Пишите нам в Telegram — ответим с радостью!
                    </p>

                    {/* Общий чат */}
                    <a
                        href={`https://t.me/${CONFIG.telegram.chatHandle.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 w-full mb-4"
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
                            <circle cx="20" cy="20" r="18" stroke="#234968" strokeWidth="2" fill="none"/>
                            <path d="M12 14 Q20 10 28 14 Q32 18 28 22 Q24 26 20 24 L16 28 L18 23 Q10 20 12 14Z"
                                  stroke="#234968" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                        </svg>
                        <div>
                            <span
                                className="font-caveat font-bold text-xl text-foreground block">Общий чат гостей</span>
                            <span
                                className="font-caveat text-lg text-foreground opacity-60">{CONFIG.telegram.chatHandle}</span>
                        </div>
                    </a>

                    <h3 className="font-caveat font-bold text-3xl text-center text-foreground mt-10 mb-5">
                        Часто задаваемые вопросы
                    </h3>

                    <div className="flex flex-col gap-4">
                        {[
                            {
                                question: "Будет ли дресскод на свадьбе?",
                                answer: "Нет, можете прийти в том, в чем вам будет комфортно веселиться и танцевать!",
                            },
			    {
                                question: "Как добраться до ресторана?",
                                answer: (
                                    <>
                                        Поставьте{" "}
                                        <a
                                            href="https://yandex.ru/maps/-/CTu8rJNv"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold underline"
                                        >
                                            вот эту точку
                                        </a>{" "}
                                        на карте для такси/вашей машины. Мы заранее пришлем вам билет для прохода в
                                        парк (самому ничего покупать не нужно). По билету вы проходите на территорию,
                                        идете прямо 200 метров, и справа будет ресторан.
                                    </>
                                ),
                            },
                            {
                                question: "Есть ли рядом парковка?",
                                answer: (
                                    <>
                                        Да, рядом с входом в парк есть платная парковка за 50 рублей в час. Можете{" "}
                                        <a
                                            href="https://yandex.ru/maps/-/CTu8b48C"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold underline"
                                        >
                                            проложить маршрут до этой точки
                                        </a>
                                        .
                                    </>
                                ),
                            },
			    {
                                question: "Можно ли будет заказать блюда из меню, если мне что-то не подойдет?",
                                answer: "Конечно, вы можете выбрать блюда и напитки, которые будут вам по душе по меню.",
                            },
           		    {
                                question: "Можно ли принести свои напитки в ресторан?",
                                answer: "К сожалению, нет, так как ресторан находится на территории музея-заповедника.",
                            },
                            {
                                question: "Что же вам подарить?",
                                answer: "Мы вложили очень много средств и сил на этот праздник, поэтому лучший подарок для нас - это конвертик.",
                            }
                        ].map(({question, answer}) => (
                            <details
                                key={question}
                                className="group"
                                style={{
                                    background: "#FDF5E6",
                                    border: "none",
                                    borderRadius: 20,
                                    padding: "16px 20px",
                                    boxShadow: "3px 3px 0 rgba(45,43,110,0.12)",
                                }}
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-caveat font-bold text-2xl text-foreground">
                                    <span>{question}</span>
                                    <span className="text-3xl leading-none transition-transform group-open:rotate-45">
                                        +
                                    </span>
                                </summary>
                                <p className="font-caveat text-xl text-foreground opacity-75 mt-3">
                                    {answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </Section>

                <WaveDivider/>

                {/* ── 4. АНКЕТА ГОСТЯ ──────────────────────────────────────────────────── */}
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
                                <Heart className="w-6 h-6"/>
                                <Heart className="w-5 h-5 mt-1"/>
                                <Heart className="w-6 h-6"/>
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
                            <div
                                aria-hidden="true"
                                style={{
                                    position: "absolute",
                                    width: 1,
                                    height: 1,
                                    margin: -1,
                                    padding: 0,
                                    border: 0,
                                    overflow: "hidden",
                                    clip: "rect(0 0 0 0)",
                                    clipPath: "inset(50%)",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <label htmlFor="website">Website</label>
                                <input
                                    id="website"
                                    name="website"
                                    type="text"
                                    value={form.website}
                                    onChange={(e) => setForm((f) => ({...f, website: e.target.value}))}
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                            </div>

                            {/* Name */}
                            <FormField label="Ваше имя и фамилия">
                                <input
                                    type="text"
                                    required
                                    placeholder="Фемистоклюс Манилов"
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({...f, name: e.target.value}))}
                                    className="w-full font-caveat text-xl text-foreground"
                                    style={inputStyle}
                                />
                            </FormField>

                            {/* Attending */}
                            <FormField label="Планируете ли вы присутствовать?">
                                <div className="flex flex-col gap-2 mt-1">
                                    {["Да, буду!", "К сожалению, не смогу"].map((opt) => (
                                        <RadioOption
                                            key={opt}
                                            label={opt}
                                            checked={form.attending === opt}
                                            onChange={() => setForm((f) => ({...f, attending: opt}))}
                                        />
                                    ))}
                                </div>
                            </FormField>

                            {/* Alcohol */}
                            <FormField label="Что вы предпочитаете в качестве напитков?">
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
                            <FormField label="Что бы вы предпочли в качестве горячего?">
                                <div className="flex flex-col gap-2 mt-1">
                                    {CONFIG.form.mainCourseOptions.map((opt) => (
                                        <CheckboxOption
                                            key={opt}
                                            label={opt}
                                            checked={form.mainCourse.includes(opt)}
                                            onChange={() => handleMainCourse(opt)}
                                        />
                                    ))}
                                </div>
                            </FormField>

                            {/* Transfer */}
                            <FormField label="Потребуется ли вам трансфер?">
                                <div className="flex flex-col gap-2 mt-1">
                                    {["Да, нужен", "Нет, доберусь сам(а)"].map((opt) => (
                                        <RadioOption
                                            key={opt}
                                            label={opt}
                                            checked={form.transfer === opt}
                                            onChange={() => setForm((f) => ({...f, transfer: opt}))}
                                        />
                                    ))}
                                </div>
                            </FormField>

                            {/* Hosting help */}
                            <FormField label="Хотите ли вы помочь нам в проведении мероприятия и стать одним из ведущих?">
                                <div className="flex flex-col gap-2 mt-1">
                                    {["Да", "Нет"].map((opt) => (
                                        <RadioOption
                                            key={opt}
                                            label={opt}
                                            checked={form.hostingHelp === opt}
                                            onChange={() => setForm((f) => ({...f, hostingHelp: opt}))}
                                        />
                                    ))}
                                </div>
                            </FormField>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-6 py-4 font-caveat font-bold text-base text-white"
                                style={{
                                    background: "#5A8BB4",
                                    border: "none",
                                    borderRadius: 50,
                                    cursor: isSubmitting ? "not-allowed" : "pointer",
                                    opacity: isSubmitting ? 0.75 : 1,
                                    boxShadow: "3px 3px 0 rgba(45,43,110,0.2)",
                                    transition: "transform 0.1s",
                                }}
                                onMouseDown={(e) => {
                                    if (!isSubmitting) e.currentTarget.style.transform = "scale(0.97)";
                                }}
                                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                                Отправить ответы
                            </button>
                            {submitError ? (
                                <p className="font-caveat text-xl text-center text-red-700 mt-4">
                                    {submitError}
                                </p>
                            ) : null}
                        </form>
                    )}
                </Section>

                <WaveDivider flip/>

                {/* ── 5. ТАЙМЕР ───────────────────────────────────────────────────────── */}
                <Section id="zagsCountdown" className="pb-0">
                    <SectionTitle>До загса осталось</SectionTitle>
                    <div
                        className="flex justify-center gap-3 flex-wrap"
                    >
                        {[
                            {value: zagsCountdown.days, label: "дней"},
                            {value: zagsCountdown.hours, label: "часов"},
                            {value: zagsCountdown.minutes, label: "минут"},
                            {value: zagsCountdown.seconds, label: "секунд"},
                        ].map(({value, label}) => (
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
                  style={{color: "#5A8BB4", lineHeight: 1}}
              >
                {String(value).padStart(2, "0")}
              </span>
                                <span className="font-caveat text-base text-foreground opacity-70 mt-1">
                {label}
              </span>
                            </div>
                        ))}
                    </div>
                </Section>

                <Section id="weddingCountdown">
                    <SectionTitle>До свадьбы осталось</SectionTitle>
                    <div
                        className="flex justify-center gap-3 flex-wrap"
                    >
                        {[
                            {value: weddingCountdown.days, label: "дней"},
                            {value: weddingCountdown.hours, label: "часов"},
                            {value: weddingCountdown.minutes, label: "минут"},
                            {value: weddingCountdown.seconds, label: "секунд"},
                        ].map(({value, label}) => (
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
                  style={{color: "#5A8BB4", lineHeight: 1}}
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
                        <Heart className="w-6 h-6"/>
                        <Heart className="w-4 h-4 mt-1"/>
                        <Heart className="w-6 h-6"/>
                    </div>
                </Section>

                <WaveDivider/>

                {/* ── 6. ФИНАЛЬНЫЙ СЛАЙД ───────────────────────────────────────────────── */}
                <section
                    className="w-full max-w-lg mx-auto px-6 py-14 flex flex-col items-center"
                >
                    {/* Top text */}
                    <div className="self-start flex items-start gap-2 mb-2">
                        <Heart className="w-6 h-6 mt-1"/>
                        <Heart className="w-5 h-5 mt-2"/>
                        <FlightBanner rotate={-1} maxWidth={270} padding="12px 18px 13px">
                            <p style={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontSize: 22,
                                color: "#234968",
                                lineHeight: 1.4
                            }}>
                                До скорой встречи!
                            </p>
                            <p style={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontSize: 20,
                                color: "#234968",
                                opacity: 0.7
                            }}>
                                С любовью
                            </p>
                        </FlightBanner>
                    </div>

                    <FlightCable
                        height={38}
                        viewBox="0 0 72 38"
                        path="M36 0 C30 8 43 14 36 23 C31 29 38 34 36 38"
                        knotY={36}
                        style={{marginTop: -2, marginBottom: -4}}
                    />

                    {/* Names */}
                    <FlightBanner rotate={1} maxWidth={360} padding="12px 18px 13px">
                        <h2
                            className="text-foreground text-center"
                            style={{fontFamily: "'Montserrat', sans-serif", fontSize: 32, lineHeight: 1.15}}
                        >
                            Ваши почти муж и жена
                        </h2>
                    </FlightBanner>

                    <FlightCable
                        height={48}
                        viewBox="0 0 72 48"
                        path="M36 0 C39 10 30 18 36 27 C42 36 34 41 36 48"
                        knotY={46}
                        style={{marginTop: -2, marginBottom: -5}}
                    />

                    {/* Polaroid couple photo */}
                    <div className="relative mt-2 w-full flex justify-center">
                        <div
                            style={{
                                background: "#fff",
                                padding: "12px 12px 18px 12px",
                                boxShadow: "6px 6px 20px rgba(45,43,110,0.13)",
                                transform: "rotate(-1.5deg)",
                                width: "72%",
                            }}
                        >
                            <ImageWithFallback
                                src={couplePhoto}
                                alt="Максим и Анфиса"
                                style={{width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block"}}
                            />
                            <p style={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontSize: 20,
                                color: "#234968",
                                opacity: 0.7,
                                transform: "rotate(-1deg)",
                                textAlign: "center",
                                marginTop: 14
                            }}>
                                мы ждём вас
                            </p>
                        </div>
                        {/* Hearts beside polaroid */}
                        <div className="absolute right-4 top-1/2 flex flex-col gap-1"
                             style={{transform: "translateY(-50%)"}}>
                            <Heart className="w-7 h-7"/>
                            <Heart className="w-5 h-5 ml-3"/>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center pb-10">
                    <div className="flex justify-center gap-2 mb-3">
                        {[...Array(5)].map((_, i) => (
                            <Heart key={i} className="w-4 h-4 opacity-40"/>
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

function FormField({label, children}: { label: string; children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <label
                className="block font-caveat font-bold text-xl text-foreground mb-2"
                style={{lineHeight: 1.3}}
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
            <span style={{width: 8, height: 8, borderRadius: "50%", background: "#fff"}}/>
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
                <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      fill="none"/>
            </svg>
        )}
      </span>
            <span className="text-base font-normal text-foreground opacity-80">{label}</span>
        </label>
    );
}

function WaveDivider({flip = false}: { flip?: boolean }) {
    return (
        <svg
            viewBox="0 0 400 30"
            preserveAspectRatio="none"
            className="w-full"
            style={{height: 30, transform: flip ? "scaleY(-1)" : "none"}}
        >
            <path
                d="M0,15 Q50,0 100,15 Q150,30 200,15 Q250,0 300,15 Q350,30 400,15 L400,30 L0,30 Z"
                fill="#ffffff"
                opacity="1"
            />
        </svg>
    );
}
