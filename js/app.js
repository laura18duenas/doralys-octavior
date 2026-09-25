// =========================================
// ELEMENTOS PRINCIPALES
// =========================================

const coverEnvelope = document.getElementById("coverEnvelope");
const envelope = document.getElementById("envelope");
const screen1 = document.getElementById("screen1");
const screen2 = document.getElementById("screen2");

const flap = document.getElementById("flap");
const seal = document.getElementById("seal");
const letter = document.getElementById("letter");

const background = document.querySelector(".background");
const transitionOverlay = document.querySelector(".transition-overlay");


// =========================================
// CUENTA REGRESIVA
// =========================================

const countdownBox = document.querySelector(".countdown-box");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const countdownTarget = new Date(
    countdownBox?.dataset.target || "2026-12-11T15:00:00"
);


// =========================================
// ANIMACIONES AOS
// =========================================

const revealElements = document.querySelectorAll(".reveal-section");
const aosElements = document.querySelectorAll("[data-aos]");


// =========================================
// MÚSICA
// =========================================

const audio = new Audio("./aud/song.mp3");

audio.loop = true;
audio.volume = 0.5;
audio.preload = "auto";


// =========================================
// BOTÓN DE MÚSICA
// =========================================

const musicControl = document.getElementById("musicControl");
const musicAnimation = document.getElementById("musicAnimation");

let musicLottie = null;


// =========================================
// CARGAR ANIMACIÓN LOTTIE
// =========================================

if (
    musicAnimation &&
    typeof lottie !== "undefined"
) {

    musicLottie = lottie.loadAnimation({

        container: musicAnimation,

        renderer: "svg",

        loop: true,

        autoplay: false,

        path: "./img/music-player-icon.json"

    });

}


// =========================================
// ACTUALIZAR ESTADO DEL BOTÓN
// =========================================

function updateMusicButton() {

    if (!musicControl) return;


    if (audio.paused) {

        // -----------------------------
        // MÚSICA PAUSADA
        // -----------------------------

        musicControl.classList.remove("playing");


        if (musicLottie) {
            musicLottie.pause();
        }


    } else {

        // -----------------------------
        // MÚSICA REPRODUCIÉNDOSE
        // -----------------------------

        musicControl.classList.add("playing");


        if (musicLottie) {
            musicLottie.play();
        }

    }

}


// =========================================
// MOSTRAR BOTÓN DE MÚSICA
// =========================================

function showMusicButton() {

    if (!musicControl) return;

    musicControl.classList.add("show");

}


// =========================================
// OCULTAR BOTÓN DE MÚSICA
// =========================================

function hideMusicButton() {

    if (!musicControl) return;

    musicControl.classList.remove("show");

}


// =========================================
// BOTÓN PLAY / PAUSE
// =========================================

if (musicControl) {

    musicControl.addEventListener(
        "click",
        function (event) {

            // Evita que el clic se propague
            // hacia otros elementos
            event.stopPropagation();


            // -----------------------------
            // SI ESTÁ PAUSADA
            // -----------------------------

            if (audio.paused) {

                audio.play()
                    .then(() => {

                        updateMusicButton();

                    })
                    .catch((error) => {

                        console.log(
                            "No se pudo reproducir la música:",
                            error
                        );

                    });


            }

            // -----------------------------
            // SI ESTÁ REPRODUCIÉNDOSE
            // -----------------------------

            else {

                audio.pause();

                updateMusicButton();

            }

        }
    );

}


// =========================================
// EVENTOS DEL AUDIO
// =========================================

audio.addEventListener(
    "play",
    function () {

        updateMusicButton();

    }
);


audio.addEventListener(
    "pause",
    function () {

        updateMusicButton();

    }
);


// =========================================
// REPRODUCIR MÚSICA AL ABRIR INVITACIÓN
// =========================================

function playInvitationAudio() {

    if (!audio) return;


    const tryPlay = () => {

        audio.play()
            .then(() => {

                updateMusicButton();

            })
            .catch(() => {

                /*
                 * Algunos navegadores bloquean
                 * la reproducción automática.
                 *
                 * Como esta función se ejecuta
                 * después de tocar el sobre,
                 * normalmente el navegador permitirá
                 * reproducir la canción.
                 */

            });

    };


    // Primer intento
    tryPlay();


    // Intentos adicionales para celulares
    setTimeout(
        tryPlay,
        200
    );


    setTimeout(
        tryPlay,
        600
    );


    // -----------------------------------------
    // DESBLOQUEAR AUDIO CON INTERACCIÓN
    // -----------------------------------------

    const unlock = () => {

        tryPlay();


        document.removeEventListener(
            "click",
            unlock
        );


        document.removeEventListener(
            "touchstart",
            unlock
        );


        document.removeEventListener(
            "keydown",
            unlock
        );

    };


    document.addEventListener(
        "click",
        unlock,
        { once: true }
    );


    document.addEventListener(
        "touchstart",
        unlock,
        { once: true }
    );


    document.addEventListener(
        "keydown",
        unlock,
        { once: true }
    );

}


// =========================================
// REVEAL DE SECCIONES
// =========================================

function revealSections() {

    revealElements.forEach(
        (element, index) => {

            element.classList.add(
                "is-visible"
            );


            element.style.opacity = "1";


            element.style.transform =
                "scale(1)";


            element.style.transitionDelay =
                `${index * 0.12}s`;

        }
    );

}


// =========================================
// FALLBACK PARA AOS
// =========================================

function startAosFallback() {

    if (!aosElements.length) return;


    const observer =
        new IntersectionObserver(

            (entries, obs) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        const element =
                            entry.target;


                        const duration =
                            parseInt(
                                element.getAttribute(
                                    "data-aos-duration"
                                ),
                                10
                            ) || 1200;


                        const delay =
                            parseInt(
                                element.getAttribute(
                                    "data-aos-delay"
                                ),
                                10
                            ) || 0;


                        element.style.transitionDuration =
                            `${duration}ms`;


                        element.style.transitionDelay =
                            `${delay}ms`;


                        element.classList.add(
                            "aos-animate"
                        );


                        obs.unobserve(
                            element
                        );

                    }
                );

            },

            {
                threshold: 0.15,

                rootMargin:
                    "0px 0px -5% 0px"
            }

        );


    aosElements.forEach(
        (element) => {

            element.classList.remove(
                "aos-animate"
            );


            observer.observe(
                element
            );

        }
    );

}


// =========================================
// ESTADOS DE LA INVITACIÓN
// =========================================

const state = {

    INTRO: "intro",

    TRANSITION: "transition",

    ENVELOPE: "envelope",

    INVITATION: "invitation"

};


let currentState = state.INTRO;

let opened = false;


// =========================================
// OCULTAR BOTÓN AL INICIO
// =========================================

hideMusicButton();


// =========================================
// EVENTOS DEL SOBRE
// =========================================

if (coverEnvelope) {

    coverEnvelope.addEventListener(
        "click",
        startTransition
    );

}


if (envelope) {

    envelope.addEventListener(
        "click",
        openEnvelope
    );

}


// =========================================
// INICIAR TRANSICIÓN
// =========================================

function startTransition() {

    if (
        currentState !== state.INTRO
    ) {
        return;
    }


    // -----------------------------------------
    // REPRODUCIR MÚSICA
    // -----------------------------------------

    playInvitationAudio();


    // -----------------------------------------
    // CAMBIAR ESTADO
    // -----------------------------------------

    currentState =
        state.TRANSITION;


    // -----------------------------------------
    // TIMELINE GSAP
    // -----------------------------------------

    const tl = gsap.timeline({

        onComplete: () => {


            // ---------------------------------
            // CAMBIAR A ESTADO SOBRE
            // ---------------------------------

            currentState =
                state.ENVELOPE;


            // ---------------------------------
            // OCULTAR PRIMERA PANTALLA
            // ---------------------------------

            if (screen1) {

                screen1.style.display =
                    "none";

            }


            // ---------------------------------
            // MOSTRAR SEGUNDA PANTALLA
            // ---------------------------------

            if (screen2) {

                screen2.classList.add(
                    "active"
                );

            }


            // ---------------------------------
            // MOSTRAR BOTÓN DE MÚSICA
            // ---------------------------------

            setTimeout(
                () => {

                    showMusicButton();

                },
                300
            );


            // ---------------------------------
            // INICIAR ANIMACIONES
            // ---------------------------------

            setTimeout(
                () => {

                    startAosFallback();

                    revealSections();

                    openEnvelope();

                },
                600
            );

        }

    });


    // =========================================
    // PEQUEÑO MOVIMIENTO DEL SOBRE
    // =========================================

    tl.to(
        coverEnvelope,
        {

            duration: 0.15,

            scale: 0.95,

            ease: "power2.out"

        }
    );


    // =========================================
    // REGRESAR A TAMAÑO NORMAL
    // =========================================

    tl.to(
        coverEnvelope,
        {

            duration: 0.2,

            scale: 1,

            ease: "back.out(1.8)"

        }
    );


    // =========================================
    // OVERLAY BLANCO
    // =========================================

    tl.to(
        transitionOverlay,
        {

            duration: 0.7,

            opacity: 1,

            ease: "power2.inOut"

        }
    );


    // =========================================
    // OCULTAR SCREEN 1
    // =========================================

    tl.to(
        screen1,
        {

            duration: 0.8,

            opacity: 0,

            ease: "power2.inOut"

        },

        "-=0.2"
    );


    // =========================================
    // ZOOM DEL FONDO
    // =========================================

    tl.to(
        background,
        {

            duration: 2,

            scale: 1.08,

            ease: "power2.out"

        },

        "<"
    );


    // =========================================
    // QUITAR OVERLAY
    // =========================================

    tl.to(
        transitionOverlay,
        {

            duration: 0.5,

            opacity: 0,

            ease: "power2.inOut"

        },

        "+=0.1"
    );

}


// =========================================
// ABRIR SOBRE
// =========================================

function openEnvelope() {

    if (
        currentState !== state.ENVELOPE ||
        opened
    ) {
        return;
    }


    opened = true;


    currentState =
        state.INVITATION;


    // -----------------------------------------
    // COMPROBAR ELEMENTOS
    // -----------------------------------------

    if (
        !seal ||
        !flap ||
        !letter
    ) {
        return;
    }


    // -----------------------------------------
    // TIMELINE
    // -----------------------------------------

    const tl = gsap.timeline();


    // =========================================
    // DESAPARECER SELLO
    // =========================================

    tl.to(
        seal,
        {

            duration: 0.35,

            scale: 0,

            rotation: 720,

            opacity: 0,

            ease: "back.in(2)"

        }
    );


    // =========================================
    // ABRIR SOLAPA
    // =========================================

    tl.to(
        flap,
        {

            duration: 0.8,

            rotationX: -180,

            transformOrigin:
                "top center",

            ease: "power2.out"

        },

        "-=0.1"
    );


    // =========================================
    // SACAR CARTA
    // =========================================

    tl.to(
        letter,
        {

            duration: 1,

            y: -140,

            ease: "power3.out"

        }
    );

}


// =========================================
// CUENTA REGRESIVA
// =========================================

function updateCountdown() {

    if (
        !daysEl ||
        !hoursEl ||
        !minutesEl ||
        !secondsEl
    ) {
        return;
    }


    const now =
        new Date();


    const diff =
        countdownTarget - now;


    // -----------------------------------------
    // SI YA LLEGÓ LA FECHA
    // -----------------------------------------

    if (diff <= 0) {

        daysEl.textContent = "00";

        hoursEl.textContent = "00";

        minutesEl.textContent = "00";

        secondsEl.textContent = "00";

        return;

    }


    // -----------------------------------------
    // DÍAS
    // -----------------------------------------

    const days =
        Math.floor(
            diff /
            (1000 * 60 * 60 * 24)
        );


    // -----------------------------------------
    // HORAS
    // -----------------------------------------

    const hours =
        Math.floor(

            (
                diff %
                (1000 * 60 * 60 * 24)
            )

            /

            (1000 * 60 * 60)

        );


    // -----------------------------------------
    // MINUTOS
    // -----------------------------------------

    const minutes =
        Math.floor(

            (
                diff %
                (1000 * 60 * 60)
            )

            /

            (1000 * 60)

        );


    // -----------------------------------------
    // SEGUNDOS
    // -----------------------------------------

    const seconds =
        Math.floor(

            (
                diff %
                (1000 * 60)
            )

            /

            1000

        );


    // -----------------------------------------
    // MOSTRAR
    // -----------------------------------------

    daysEl.textContent =
        String(days)
            .padStart(2, "0");


    hoursEl.textContent =
        String(hours)
            .padStart(2, "0");


    minutesEl.textContent =
        String(minutes)
            .padStart(2, "0");


    secondsEl.textContent =
        String(seconds)
            .padStart(2, "0");

}


// =========================================
// INICIAR CUENTA REGRESIVA
// =========================================

updateCountdown();


setInterval(
    updateCountdown,
    1000
);