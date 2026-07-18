import {Children, createContext, useContext, useState, useEffect, useRef} from "react";
import {ImageWithFallback} from "@/app/components/figma/ImageWithFallback";
import {submitRsvp} from "@/api/rsvp";
import groomPhoto from "@/imports/groom.jpg";
import bridePhoto from "@/imports/bride.jpg";
import couplePhoto from "@/imports/photo_5335006619462476917_y.jpg";
import gardenTexture from "@/imports/garden-texture.png";
import gardenTextureDesktop from "@/imports/garden-texture-desktop.png";
import toyAirplane from "@/imports/toy-airplane-detailed.png";
import titleCloud from "@/imports/title-cloud.png";
import cloudHeartDivider from "@/imports/cloud-heart-divider.png";

const RequestedImagesContext = createContext<ReadonlySet<string>>(new Set());

const QueuedImage = ({src, ...props}: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => {
    const requestedImages = useContext(RequestedImagesContext);

    return <img src={requestedImages.has(src) ? src : undefined} {...props}/>;
};

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
    },

    // Общие чаты гостей
    chats: {
        telegramUrl: "https://t.me/anfisamaksim",
        maxUrl: "https://max.ru/join/pfGjMaB8ngjrU5EQwe4Elj4XZCvwj7AYIjl-R72vzww",
    },

    // Анкета гостя — настройки опций
    form: {
        alcoholOptions: ["Шампанское", "Красное вино", "Белое вино", "Пиво", "Водка", "Джин", "Ром", "Коньяк", "Не пью алкоголь"],
        mainCourseOptions: ["Ризотто с ростбифом", "Ризотто карри с лососем и эспуме из угря", "Утиная ножка конфи", "Сибас с пюре из корня сельдерея", "Стейк из телятины со свеклой и черной смородиной", "Рёбра кальки с папоротником", "Стейк Шато Бриан"],
    },
};
// ─────────────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
    {
        question: "Где можно задать вопрос?",
        answer: (
            <>
                Если не нашли ответ ниже, напишите в общем чате. Выберите удобный мессенджер: {" "}
                <a
                    href={CONFIG.chats.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline"
                >
                    Telegram
                </a>{" "}
                или {" "}
                <a
                    href={CONFIG.chats.maxUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline"
                >
                    MAX
                </a>
                .
            </>
        ),
    },
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
                на карте для такси/вашей машины. Мы заранее пришлем вам билет для прохода в парк
                (самому ничего покупать не нужно). По билету вы проходите на территорию, идете прямо
                200 метров, и справа будет ресторан.
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
        question: "Можно ли будет дозаказать блюда по меню?",
        answer: (
            <>
                Конечно, вы можете выбрать блюда и напитки, которые будут вам по душе.{" "}
                <a
                    href="/menu.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline"
                >
                    Посмотреть меню
                </a>
                .
            </>
        ),
    },
    {
        question: "Можно ли принести свои напитки в ресторан?",
        answer: "К сожалению, нет, так как ресторан находится на территории музея-заповедника.",
    },
    {
        question: "Что же вам подарить?",
        answer: "Мы вложили очень много средств и сил на этот праздник, поэтому лучший подарок для нас - это конвертик.",
    },
];

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

const CloudTitle = ({
                        children,
                        as: Heading = "h2",
                        className = "",
                        textClassName = "text-3xl",
                        textStyle = {},
                        rotate = -0.6,
                        maxWidth,
                        padding = "24px 46px",
                    }: {
    children: React.ReactNode;
    as?: "h1" | "h2";
    className?: string;
    textClassName?: string;
    textStyle?: React.CSSProperties;
    rotate?: number;
    maxWidth?: number;
    padding?: string;
}) => (
    <div
        className={`relative mx-auto flex w-fit max-w-full items-center justify-center text-center ${className}`}
        style={{
            transform: `rotate(${rotate}deg)`,
            width: maxWidth ? `min(100%, ${maxWidth}px)` : undefined,
            boxSizing: "border-box",
            padding,
            zIndex: 0,
        }}
    >
        <QueuedImage
            src={titleCloud}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute select-none"
            style={{
                left: "50%",
                top: "-18px",
                width: "calc(100% + 48px)",
                height: "calc(100% + 36px)",
                objectFit: "fill",
                transform: "translateX(-50%)",
                zIndex: 0,
                filter: "drop-shadow(5px 7px 0 rgba(45,43,110,0.10)) drop-shadow(0 10px 18px rgba(35,73,104,0.10))",
            }}
        />
        <Heading
            className={`relative font-caveat font-bold text-foreground text-center ${textClassName}`}
            style={{lineHeight: 1.2, zIndex: 1, ...textStyle}}
        >
            {children}
        </Heading>
    </div>
);

// Cloud-like section title
const SectionTitle = ({children}: { children: React.ReactNode }) => (
    <CloudTitle className="mb-7">
        {children}
    </CloudTitle>
);

const FlightBanner = ({
                          children,
                          rotate = -1,
                          maxWidth = 390,
                          padding = "13px 18px 14px",
                          className = "",
                      }: {
    children: React.ReactNode;
    rotate?: number;
    maxWidth?: number;
    padding?: string;
    className?: string;
}) => (
    <div
        className={`relative text-center ${className}`}
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

const cableShapes = [
    {
        height: 34,
        viewBox: "0 0 72 34",
        path: "M36 0 C30 7 43 13 36 21 C31 26 38 31 36 34",
        knotY: 32,
    },
    {
        height: 42,
        viewBox: "0 0 72 42",
        path: "M36 0 C41 9 30 15 36 24 C43 32 34 37 36 42",
        knotY: 40,
    },
    {
        height: 38,
        viewBox: "0 0 72 38",
        path: "M36 0 C31 8 42 14 36 23 C31 29 38 34 36 38",
        knotY: 36,
    },
];

const FlightBannerStack = ({
                               children,
                               className = "",
                           }: {
    children: React.ReactNode;
    className?: string;
}) => {
    const items = Children.toArray(children);

    return (
        <div className={`flex w-full flex-col items-center ${className}`}>
            {items.map((child, index) => {
                const cable = cableShapes[index % cableShapes.length];

                return (
                    <div key={index} className="flex w-full flex-col items-center">
                        {index > 0 && (
                            <FlightCable
                                {...cable}
                                style={{marginTop: -2, marginBottom: -5}}
                            />
                        )}
                        {child}
                    </div>
                );
            })}
        </div>
    );
};

const HeroFlightBanner = ({names}: { names: string }) => (
    <div className="relative flex w-full flex-col items-center select-none" style={{marginTop: 4}}>
        <QueuedImage
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
        <CloudTitle
            as="h1"
            textStyle={{fontSize: 38, lineHeight: 1.05}}
            rotate={1}
            maxWidth={330}
            padding="26px 34px"
        >
            {names}
        </CloudTitle>
    </div>
);

const DividerImage = ({
                          className = "",
                      }: {
    className?: string;
}) => (
    <div className={`flex w-full justify-center overflow-visible ${className}`} aria-hidden="true">
        <QueuedImage
            src={cloudHeartDivider}
            alt=""
            className="block h-auto max-w-full select-none"
            style={{
                width: 720,
            }}
        />
    </div>
);

// Form state type
type FormData = {
    name: string;
    attending: string;
    alcohol: string[];
    mainCourse: string;
    transfer: string;
    hostingHelp: string;
    website: string;
    submitted: boolean;
};

type SubmitPhase = "idle" | "submitting" | "success";

const preloadImage = (src: string) => new Promise<void>((resolve) => {
    const image = new window.Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;

    if (image.complete) resolve();
});

export default function App() {
    const zagsCountdown = useCountdown(CONFIG.zagsDate);
    const weddingCountdown = useCountdown(CONFIG.weddingDate);
    const backgroundRef = useRef<HTMLDivElement | null>(null);
    const successMessageRef = useRef<HTMLDivElement | null>(null);
    const [requestedImages, setRequestedImages] = useState<ReadonlySet<string>>(() => new Set());

    const [form, setForm] = useState<FormData>({
        name: "",
        attending: "",
        alcohol: [],
        mainCourse: "",
        transfer: "",
        hostingHelp: "",
        website: "",
        submitted: false,
    });
    const [submitPhase, setSubmitPhase] = useState<SubmitPhase>("idle");
    const [submitError, setSubmitError] = useState("");
    const [validationAttempted, setValidationAttempted] = useState(false);
    const isSubmitting = submitPhase !== "idle";
    const isDeclining = form.attending === "К сожалению, не смогу";
    const isFormComplete =
        form.name.trim().length > 0 &&
        form.attending.length > 0 &&
        (isDeclining || (
            form.alcohol.length > 0 &&
            form.mainCourse.length > 0 &&
            form.transfer.length > 0 &&
            form.hostingHelp.length > 0
        ));

    useEffect(() => {
        const loader = document.getElementById("page-loader");
        const startedAt = Number(loader?.dataset.startedAt) || window.performance.now();
        const preferredTexture = window.matchMedia("(min-width: 768px)").matches
            ? gardenTextureDesktop
            : gardenTexture;
        const remainingTexture = preferredTexture === gardenTexture
            ? gardenTextureDesktop
            : gardenTexture;
        const imageQueue = [
            toyAirplane,
            preferredTexture,
            groomPhoto,
            bridePhoto,
            titleCloud,
            cloudHeartDivider,
            couplePhoto,
            remainingTexture,
        ];
        let finished = false;
        let cancelled = false;
        let hideTimer = 0;
        let removeTimer = 0;

        const finishLoading = () => {
            if (finished) return;
            finished = true;

            const releasePage = () => {
                document.documentElement.classList.remove("page-is-loading");
                if (!loader) return;

                if (!loader.classList.contains("is-visible")) {
                    loader.remove();
                    return;
                }

                loader.classList.add("is-leaving");
                removeTimer = window.setTimeout(() => loader.remove(), 450);
            };

            const minimumLoaderDuration = 400;
            const elapsed = window.performance.now() - startedAt;
            hideTimer = window.setTimeout(releasePage, Math.max(0, minimumLoaderDuration - elapsed));
        };

        const loadImagesInOrder = async () => {
            for (const [index, src] of imageQueue.entries()) {
                if (cancelled) return;

                setRequestedImages((current) => {
                    if (current.has(src)) return current;

                    const next = new Set(current);
                    next.add(src);
                    return next;
                });

                // Let React put the current source into the DOM before waiting
                // for the download, so the browser can paint it progressively.
                await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
                if (cancelled) return;

                if (index === 0) finishLoading();

                await preloadImage(src);
                if (cancelled) return;
            }
        };

        void loadImagesInOrder();
        const failsafeTimer = window.setTimeout(finishLoading, 10000);

        return () => {
            cancelled = true;
            window.clearTimeout(failsafeTimer);
            window.clearTimeout(hideTimer);
            window.clearTimeout(removeTimer);
            document.documentElement.classList.remove("page-is-loading");
        };
    }, []);

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

    useEffect(() => {
        if (!form.submitted || !successMessageRef.current) return;

        const frame = window.requestAnimationFrame(() => {
            successMessageRef.current?.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                block: "center",
            });
        });

        return () => window.cancelAnimationFrame(frame);
    }, [form.submitted]);

    const handleAlcohol = (val: string) => {
        setForm((f) => ({
            ...f,
            alcohol: f.alcohol.includes(val)
                ? f.alcohol.filter((a) => a !== val)
                : [...f.alcohol, val],
        }));
    };

    const handleEditResponses = () => {
        setSubmitPhase("idle");
        setSubmitError("");
        setValidationAttempted(false);
        setForm((f) => ({...f, submitted: false}));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSubmitting) return;

        setValidationAttempted(true);

        if (!isFormComplete) {
            setSubmitError("");
            return;
        }

        const website = String(new window.FormData(e.currentTarget).get("website") ?? "");

        setSubmitPhase("submitting");
        setSubmitError("");

        try {
            await Promise.all([
                submitRsvp({
                    name: form.name,
                    i_will_come: form.attending,
                    alcohol: form.alcohol.join(", "),
                    meal: form.mainCourse,
                    need_transfer: form.transfer,
                    hosting_help: form.hostingHelp,
                    website,
                }),
                new Promise<void>((resolve) => window.setTimeout(resolve, 900)),
            ]);
            setSubmitPhase("success");
            await new Promise<void>((resolve) => window.setTimeout(resolve, 1650));
            setForm((f) => ({...f, submitted: true}));
        } catch {
            setSubmitPhase("idle");
            setSubmitError("Не удалось отправить анкету. Попробуйте еще раз.");
        }
    };

    return (
        <RequestedImagesContext.Provider value={requestedImages}>
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
                        backgroundImage: requestedImages.has(gardenTexture) ? `url(${gardenTexture})` : undefined,
                        backgroundPosition: "top center",
                        backgroundRepeat: "repeat",
                        backgroundSize: "390px auto",
                    }}
                />
                <div
                    className="absolute inset-0 hidden md:block"
                    style={{
                        backgroundImage: requestedImages.has(gardenTextureDesktop) ? `url(${gardenTextureDesktop})` : undefined,
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

                    {/* Polaroid photos */}
                    <div className="relative w-full mt-8 px-2" style={{paddingBottom: 48}}>
                        {/* Photos row */}
                        <div className="flex justify-center items-end gap-4">
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
                                <ImageWithFallback
                                    src={requestedImages.has(groomPhoto) ? groomPhoto : undefined}
                                    alt="Жених в детстве"
                                    style={{
                                        width: "100%",
                                        aspectRatio: "3/4",
                                        objectFit: "cover",
                                        objectPosition: "center center",
                                        display: "block"
                                    }}
                                />
                                <p className="font-caveat text-center text-2xl text-foreground mt-2 leading-none">
                                    жених
                                </p>
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
                                    src={requestedImages.has(bridePhoto) ? bridePhoto : undefined}
                                    alt="Невеста в детстве"
                                    style={{
                                        width: "100%",
                                        aspectRatio: "3/4",
                                        objectFit: "cover",
                                        objectPosition: "top center",
                                        display: "block"
                                    }}
                                />
                                <p className="font-caveat text-center text-2xl text-foreground mt-2 leading-none">
                                    невеста
                                </p>
                            </div>
                        </div>
                    </div>

                </section>

                {/* ── WAVE DIVIDER ─────────────────────────────────────────────────────── */}
                <WaveDivider/>

                {/* ── 2. ТАЙМИНГИ ──────────────────────────────────────────────────────── */}
                <Section id="schedule">
                    <SectionTitle>Где и когда?</SectionTitle>

                    <FlightBannerStack>
                        <FlightBanner rotate={-0.75} maxWidth={390} padding="16px 18px 18px">
                            <p className="text-center font-bold text-lg mb-3" style={{color: "#234968"}}>август 2026</p>
                            <div style={{overflow: "hidden"}}>
                                <div className="grid grid-cols-7 mb-2">
                                    {["пн", "вт", "ср", "чт", "пт", "сб", "вс"].map(d => (
                                        <div key={d} className="text-center text-xs font-semibold opacity-40"
                                             style={{color: "#234968"}}>{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-y-1">
                                    {[...Array(5)].map((_, i) => <div key={`e${i}`}/>)}
                                    {[...Array(16)].map((_, i) => {
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
                        </FlightBanner>
                        {CONFIG.schedule.map((item, i) => (
                            <FlightBanner
                                key={i}
                                rotate={i % 2 === 0 ? 0.75 : -0.75}
                                maxWidth={390}
                                padding="14px 18px 16px"
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
                            </FlightBanner>
                        ))}
                    </FlightBannerStack>

                </Section>

                <WaveDivider/>

                {/* ── 3. АНКЕТА ГОСТЯ ──────────────────────────────────────────────────── */}
                <Section id="rsvp" className="pb-16">
                    <SectionTitle>Анкета гостя</SectionTitle>
                    <FlightBannerStack>
                        {!form.submitted ? (
                            <FlightBanner rotate={-0.75} maxWidth={360}>
                                <p className="font-caveat text-xl text-center text-foreground opacity-70">
                                    Заполните, пожалуйста, чтобы мы всё подготовили!
                                </p>
                            </FlightBanner>
                        ) : null}

                        {form.submitted ? (
                            <div ref={successMessageRef} className="flex w-full justify-center">
                                <FlightBanner rotate={0.75} maxWidth={390} padding="32px 24px">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">
                                            {form.attending === "Да, буду!" ? "🎉" : "😔"}
                                        </div>
                                        <p className="font-caveat font-bold text-3xl text-foreground">
                                            Спасибо, {form.name || "дорогой гость"}!
                                        </p>
                                        <p className="font-caveat text-xl text-foreground opacity-70 mt-3">
                                            Ответы сохранены.
                                        </p>
                                        {form.attending === "Да, буду!" ? (
                                            <div
                                                className="mt-6 pt-5"
                                                style={{borderTop: "1.5px dashed rgba(140, 109, 86, 0.42)"}}
                                            >
                                                <p className="font-caveat text-xl text-foreground opacity-80">
                                                    Присоединяйтесь к общему чату — там будут важные новости,
                                                    ответы на вопросы и фотографии после свадьбы.
                                                </p>
                                                <p className="font-caveat font-bold text-xl text-foreground mt-4">
                                                    Выберите удобный мессенджер
                                                </p>
                                                <div className="grid grid-cols-2 gap-3 mt-3">
                                                    <a
                                                        href={CONFIG.chats.telegramUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex min-h-12 items-center justify-center px-3 py-3 font-caveat font-bold text-lg text-white"
                                                        style={{
                                                            background: "#5A8BB4",
                                                            borderRadius: 50,
                                                            textDecoration: "none",
                                                            boxShadow: "3px 3px 0 rgba(45,43,110,0.2)",
                                                        }}
                                                    >
                                                        Telegram
                                                    </a>
                                                    <a
                                                        href={CONFIG.chats.maxUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex min-h-12 items-center justify-center px-3 py-3 font-caveat font-bold text-lg text-white"
                                                        style={{
                                                            background: "#5A8BB4",
                                                            borderRadius: 50,
                                                            textDecoration: "none",
                                                            boxShadow: "3px 3px 0 rgba(45,43,110,0.2)",
                                                        }}
                                                    >
                                                        MAX
                                                    </a>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-5">
                                                <p className="font-caveat text-xl text-foreground opacity-80">
                                                    Нам жаль, что вы не сможете быть с нами.
                                                </p>
                                                <p className="font-caveat text-xl text-foreground opacity-80 mt-3">
                                                    Если передумаете, просто заполните анкету ещё раз.
                                                </p>
                                            </div>
                                        )}
                                        <p className="font-caveat text-lg text-foreground opacity-70 mt-6">
                                            Остались вопросы? {" "}
                                            <a href="#faq" className="font-bold underline">
                                                Посмотрите частые вопросы ниже
                                            </a>
                                            .
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleEditResponses}
                                            className="font-caveat font-bold text-lg text-foreground underline mt-4"
                                            style={{background: "transparent", border: 0, cursor: "pointer"}}
                                        >
                                            {form.attending === "Да, буду!"
                                                ? "Изменить ответы"
                                                : "Заполнить анкету ещё раз"}
                                        </button>
                                    </div>
                                </FlightBanner>
                            </div>
                        ) : (
                            <FlightBanner rotate={0.75} maxWidth={390} padding="28px 24px">
                                <form onSubmit={handleSubmit} className="text-left" noValidate>
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
                            <FormField
                                label="Ваше имя и фамилия"
                                error={validationAttempted && form.name.trim().length === 0}
                            >
                                <input
                                    type="text"
                                    placeholder="Фемистоклюс Манилов"
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({...f, name: e.target.value}))}
                                    aria-invalid={validationAttempted && form.name.trim().length === 0}
                                    className="w-full font-caveat text-xl text-foreground"
                                    style={inputStyle}
                                />
                            </FormField>

                            {/* Attending */}
                            <FormField
                                label="Планируете ли вы присутствовать?"
                                error={validationAttempted && form.attending.length === 0}
                            >
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

                            {isDeclining ? (
                                <p className="font-caveat text-xl text-center text-foreground opacity-75 mt-5">
                                    Остальные вопросы можно пропустить.
                                </p>
                            ) : (
                                <>
                                    {/* Alcohol */}
                                    <FormField
                                        label="Что вы предпочитаете в качестве напитков?"
                                        error={validationAttempted && form.alcohol.length === 0}
                                    >
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
                                    <FormField
                                        label="Что бы вы предпочли в качестве горячего?"
                                        error={validationAttempted && form.mainCourse.length === 0}
                                    >
                                        <div className="flex flex-col gap-2 mt-1">
                                            {CONFIG.form.mainCourseOptions.map((opt) => (
                                                <RadioOption
                                                    key={opt}
                                                    label={opt}
                                                    checked={form.mainCourse === opt}
                                                    onChange={() => setForm((f) => ({...f, mainCourse: opt}))}
                                                />
                                            ))}
                                        </div>
                                    </FormField>

                                    {/* Transfer */}
                                    <FormField
                                        label="Потребуется ли вам трансфер?"
                                        error={validationAttempted && form.transfer.length === 0}
                                    >
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
                                    <FormField
                                        label="Хотите ли вы помочь нам в проведении мероприятия и стать одним из ведущих?"
                                        error={validationAttempted && form.hostingHelp.length === 0}
                                    >
                                        <p className="font-caveat text-lg text-foreground opacity-70 leading-snug mt-1 mb-3">
                                            От вас потребуется сказать несколько фраз по сценарию, либо провести какую-то активность
                                        </p>
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
                                </>
                            )}

                            <button
                                type="submit"
                                className={`submit-button w-full mt-6 py-4 font-caveat font-bold text-base text-white ${
                                    submitPhase === "submitting"
                                        ? "submit-button--busy"
                                        : submitPhase === "success"
                                            ? "submit-button--success"
                                            : ""
                                }`}
                                aria-busy={submitPhase === "submitting"}
                                style={{
                                    background: "#5A8BB4",
                                    border: "none",
                                    borderRadius: 50,
                                    cursor: "pointer",
                                    boxShadow: "3px 3px 0 rgba(45,43,110,0.2)",
                                    transition: "transform 0.1s",
                                }}
                                onMouseDown={(e) => {
                                    e.currentTarget.style.transform = "scale(0.97)";
                                }}
                                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                                {submitPhase === "idle" ? (
                                    <span className="submit-button__idle">Отправить ответы</span>
                                ) : null}
                                {submitPhase === "submitting" ? (
                                    <>
                                        <svg
                                            className="submit-flight-track"
                                            viewBox="0 0 320 56"
                                            preserveAspectRatio="none"
                                            aria-hidden="true"
                                        >
                                            <path d="M-20 40 C75 -5 220 -3 340 30" pathLength="100"/>
                                        </svg>
                                        <span className="submit-plane-runner" aria-hidden="true">
                                            <svg viewBox="0 0 24 24">
                                                <path d="M2 11.5 22 2.5 15.2 21.5 10.8 13.2 2 11.5Z"/>
                                                <path d="m10.8 13.2 11.2-10.7M10.8 13.2l4.4 8.3"/>
                                            </svg>
                                        </span>
                                        <span className="submit-button__status" role="status">
                                            Ответы отправляются…
                                        </span>
                                    </>
                                ) : null}
                                {submitPhase === "success" ? (
                                    <span className="submit-button__success" role="status">
                                        <svg viewBox="0 0 24 22" aria-hidden="true">
                                            <path d="M12 20S2 13 2 7a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 6-10 13-10 13Z"/>
                                        </svg>
                                        Ответы отправлены!
                                    </span>
                                ) : null}
                            </button>
                            {submitError ? (
                                <p className="font-caveat text-xl text-center text-red-700 mt-4">
                                    {submitError}
                                </p>
                            ) : null}
                                </form>
                            </FlightBanner>
                        )}
                    </FlightBannerStack>
                </Section>

                <WaveDivider/>

                {/* ── 4. ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ ─────────────────────────────────────── */}
                <Section id="faq" className="pb-16">
                    <SectionTitle>Часто задаваемые вопросы</SectionTitle>
                    <FlightBannerStack>
                        {FAQ_ITEMS.map(({question, answer}) => (
                            <FlightBanner
                                key={question}
                                rotate={question.length % 2 === 0 ? -0.75 : 0.75}
                                maxWidth={390}
                                padding="16px 20px"
                            >
                                <details className="group">
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
                            </FlightBanner>
                        ))}
                    </FlightBannerStack>
                </Section>

                <WaveDivider/>

                {/* ── 5. ТАЙМЕР ───────────────────────────────────────────────────────── */}
                <Section id="zagsCountdown" className="pb-0">
                    <SectionTitle>До загса осталось</SectionTitle>
                    <FlightBannerStack>
                        <FlightBanner rotate={-0.75} maxWidth={390} padding="18px 16px 20px">
                            <div className="grid grid-cols-4 gap-2">
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
                                            border: "1.5px dashed rgba(140, 109, 86, 0.38)",
                                            borderRadius: 12,
                                            padding: "10px 6px",
                                            minWidth: 0,
                                        }}
                                    >
              <span
                  className="font-caveat font-bold text-4xl sm:text-5xl"
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
                        </FlightBanner>
                    </FlightBannerStack>
                </Section>

                <Section id="weddingCountdown">
                    <SectionTitle>До свадьбы осталось</SectionTitle>
                    <FlightBannerStack>
                        <FlightBanner rotate={0.75} maxWidth={390} padding="18px 16px 20px">
                            <div className="grid grid-cols-4 gap-2">
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
                                            border: "1.5px dashed rgba(140, 109, 86, 0.38)",
                                            borderRadius: 12,
                                            padding: "10px 6px",
                                            minWidth: 0,
                                        }}
                                    >
              <span
                  className="font-caveat font-bold text-4xl sm:text-5xl"
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
                        </FlightBanner>
                    </FlightBannerStack>
                </Section>

                <WaveDivider/>

                {/* ── 6. ФИНАЛЬНЫЙ СЛАЙД ───────────────────────────────────────────────── */}
                <section
                    className="w-full max-w-lg mx-auto px-6 py-14 flex flex-col items-center"
                >
                    {/* Top text */}
                    <div className="self-start flex items-start mb-2">
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
                    <CloudTitle
                        rotate={1}
                        maxWidth={360}
                        textClassName="text-foreground"
                        textStyle={{fontFamily: "'Montserrat', sans-serif", fontSize: 32, lineHeight: 1.15}}
                        padding="25px 34px"
                    >
                        Ваши почти муж и жена
                    </CloudTitle>

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
                                src={requestedImages.has(couplePhoto) ? couplePhoto : undefined}
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
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center pb-10">
                    <p className="font-caveat text-lg text-foreground opacity-50">
                        {CONFIG.groomName} & {CONFIG.brideName} • {new Date(CONFIG.weddingDate).getFullYear()}
                    </p>
                </footer>
            </div>
            </div>
        </RequestedImagesContext.Provider>
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

const formControlActiveColor = "#234968";

function FormField({
                       label,
                       children,
                       error = false,
                   }: {
    label: string;
    children: React.ReactNode;
    error?: boolean;
}) {
    return (
        <div className="mb-6">
            <label
                className="block font-caveat font-bold text-xl text-foreground mb-2"
                style={{lineHeight: 1.3}}
            >
                {label}
            </label>
            {children}
            {error ? (
                <p className="font-caveat text-lg text-red-700 mt-2" role="alert">
                    Пожалуйста, заполните это поле.
                </p>
            ) : null}
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
              background: checked ? formControlActiveColor : "transparent",
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
              background: checked ? formControlActiveColor : "transparent",
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

function WaveDivider() {
    return (
        <DividerImage className="my-1 px-4"/>
    );
}
