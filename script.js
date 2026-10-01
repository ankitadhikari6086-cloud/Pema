
"use strict";

/* ==========================================
   OPERATION: PLEASE DON'T BE ANGRY
   Created by Ankit for Pema ❤️
========================================== */

// ---------- CUSTOMIZATION ----------
const CONFIG = {
  boyfriend: "Ankit",
  girlfriend: "Pema",

  apology: `Hey Pema,

I made this little website because I wanted to do something different to bring a smile to your face.

I know that coding a website cannot magically fix everything, and I don't want to pretend it can.

I'm genuinely sorry for upsetting you. Your feelings matter to me, and I want to understand what hurt you instead of simply trying to make the situation disappear.

I might be good at fixing bugs in HTML, CSS, and JavaScript, but I'm still learning how to handle every situation perfectly. I want to keep learning, listening, and becoming better.

You mean a lot to me, Pema. Even if this website only makes you smile for a second, I'll be happy that I tried.

There's no pressure to stop being upset immediately. Take your time. Whenever you're ready, I'd like to listen.

With love,
Ankit ❤️`
};

// ---------- ELEMENT HELPERS ----------
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const loadingScreen = $("#loadingScreen");
const siteShell = $("#siteShell");
const progressFill = $("#progressFill");
const loadingPercent = $("#loadingPercent");
const loadingMessage = $("#loadingMessage");

let loadingInterval = null;
let soundEnabled = false;
let audioContext = null;
let lastFocusedElement = null;
let secretClicks = 0;
let toastTimeouts = [];

// ---------- LOADING SCREEN ----------
const loadingMessages = [
  "Scanning for boyfriend bugs...",
  "Searching for common sense...",
  "Downloading extra hugs...",
  "Preparing sincere apology...",
  "Compiling romantic messages...",
  "Initializing smile recovery protocol..."
];

let loadingProgress = 0;
let loadingMessageIndex = 0;

function finishLoading() {
  if (loadingInterval) {
    clearInterval(loadingInterval);
    loadingInterval = null;
  }

  loadingProgress = 100;
  progressFill.style.width = "100%";
  loadingPercent.textContent = "100%";
  loadingScreen.classList.add("dismissed");
  siteShell.classList.add("ready");

  window.setTimeout(() => {
    loadingScreen.style.display = "none";
  }, 600);
}

function startLoading() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finishLoading();
    return;
  }

  loadingInterval = window.setInterval(() => {
    loadingProgress += Math.floor(Math.random() * 7) + 3;

    if (loadingProgress > 100) {
      loadingProgress = 100;
    }

    progressFill.style.width = `${loadingProgress}%`;
    loadingPercent.textContent = `${loadingProgress}%`;

    if (loadingProgress >= (loadingMessageIndex + 1) * 16) {
      loadingMessageIndex =
        (loadingMessageIndex + 1) % loadingMessages.length;

      loadingMessage.textContent =
        loadingMessages[loadingMessageIndex];
    }

    if (loadingProgress >= 100) {
      finishLoading();
    }
  }, 110);
}

$("#skipLoading").addEventListener("click", finishLoading);
startLoading();

// ---------- MODAL SYSTEM ----------
const modalBackdrop = $("#modalBackdrop");
const modalTitle = $("#modalTitle");
const modalIcon = $("#modalIcon");
const modalContent = $("#modalContent");
const modalActions = $("#modalActions");
const modalClose = $("#modalClose");

function openModal({
  title = "A little message",
  icon = "💗",
  content = "",
  actions = []
} = {}) {
  lastFocusedElement = document.activeElement;

  modalTitle.textContent = title;
  modalIcon.textContent = icon;
  modalContent.replaceChildren();
  modalActions.replaceChildren();

  if (typeof content === "string") {
    const paragraph = document.createElement("p");
    paragraph.textContent = content;
    modalContent.appendChild(paragraph);
  } else if (content instanceof Node) {
    modalContent.appendChild(content);
  }

  actions.forEach((action) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = `button ${
      action.primary ? "button-primary" : "button-secondary"
    }`;
    button.textContent = action.label;

    button.addEventListener("click", () => {
      if (typeof action.onClick === "function") {
        action.onClick();
      }
    });

    modalActions.appendChild(button);
  });

  modalBackdrop.classList.remove("hidden");
  document.body.classList.add("modal-open");
  modalClose.focus();
}

function closeModal() {
  modalBackdrop.classList.add("hidden");
  document.body.classList.remove("modal-open");

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

modalClose.addEventListener("click", closeModal);

modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalBackdrop.classList.contains("hidden")) {
    closeModal();
  }
});

// ---------- TOAST NOTIFICATIONS ----------
function showToast(message, duration = 3200) {
  const container = $("#toastContainer");
  const toast = document.createElement("div");

  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;

  container.appendChild(toast);

  const timeout = window.setTimeout(() => {
    toast.remove();
  }, duration);

  toastTimeouts.push(timeout);
}

// ---------- NAVIGATION ----------
const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "×" : "☰";
});

$$(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

// Highlight navigation link for the visible section.
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        $$(".nav-links a").forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-25% 0px -60% 0px" }
  );

  $$(".hero, .diagnostics-section, .mood-section, .apology-section").forEach(
    (section) => sectionObserver.observe(section)
  );
}

// ---------- SCROLL ANIMATIONS ----------
const animatedElements = $$(
  ".diagnostic-card, .scan-panel, .mood-card, .apology-layout, " +
  ".court-card, .stat-card, .ending-heart"
);

animatedElements.forEach((element) => {
  element.classList.add("reveal-on-scroll");
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  animatedElements.forEach((element) => revealObserver.observe(element));
} else {
  animatedElements.forEach((element) => element.classList.add("visible"));
}

// ---------- INCIDENT REPORT ----------
$("#incidentButton").addEventListener("click", () => {
  const report = document.createElement("div");

  report.innerHTML = `
    <p><strong>Incident ID:</strong> PEM-001</p>
    <p><strong>Suspect:</strong> ${CONFIG.boyfriend}</p>
    <p><strong>Victim of confusion:</strong> ${CONFIG.boyfriend}'s brain</p>
    <p><strong>Primary cause:</strong> Unidentified boyfriend error</p>
    <p><strong>Recommended action:</strong> Genuine apology, listening, and care.</p>
    <p><strong>Current status:</strong> Under investigation.</p>
  `;

  openModal({
    title: "Official Incident Report",
    icon: "📋",
    content: report,
    actions: [
      {
        label: "Understood 😅",
        primary: true,
        onClick: closeModal
      }
    ]
  });
});

// ---------- DIAGNOSTIC CARDS ----------
const diagnosticMessages = {
  common: {
    title: "COMMON_SENSE.EXE",
    icon: "⌘",
    message:
      "Common sense has temporarily left the building. Recommended fix: " +
      "pause, think, listen, and don't assume you already know everything."
  },
  apology: {
    title: "APOLOGY.DLL",
    icon: "💌",
    message:
      "A sincere apology is ready for deployment. Warning: It must be " +
      "supported by actual understanding and changed behaviour."
  },
  smile: {
    title: "PEMA_SMILE.SYS",
    icon: "😊",
    message:
      "This system cannot control Pema's feelings. Her smile belongs to " +
      "her, and she can take all the time she needs."
  },
  brain: {
    title: "BOYFRIEND_BRAIN.EXE",
    icon: "⚡",
    message:
      "Update available: Better communication, thoughtful listening, " +
      "and fewer questionable decisions. Install update through practice."
  }
};

$$("[data-diagnostic]").forEach((card) => {
  card.addEventListener("click", () => {
    const diagnostic = diagnosticMessages[card.dataset.diagnostic];

    if (!diagnostic) return;

    openModal({
      title: diagnostic.title,
      icon: diagnostic.icon,
      content: diagnostic.message,
      actions: [
        {
          label: "Run another check",
          primary: true,
          onClick: closeModal
        }
      ]
    });
  });
});

// ---------- SYSTEM SCAN ----------
const scanButton = $("#scanButton");
const scanStatus = $("#scanStatus");
const scanOutput = $("#scanOutput");

const scanLines = [
  "> Connecting to relationship repair system...",
  "> Searching for missing common sense...",
  "> Checking apology sincerity...",
  "> Installing communication update...",
  "> Reminder: Listen before responding...",
  "> SYSTEM REPORT: Ankit needs to say sorry properly."
];

let scanning = false;

function runDiagnostics() {
  if (scanning) return;

  scanning = true;
  scanButton.disabled = true;
  scanStatus.textContent = "Scanning...";
  scanOutput.textContent = "";

  let index = 0;

  function nextLine() {
    if (index >= scanLines.length) {
      scanStatus.textContent = "Scan complete ✓";
      scanButton.disabled = false;
      scanning = false;
      showToast("Diagnostics complete. Remember to listen, Ankit. ❤️");
      return;
    }

    scanOutput.textContent +=
      (index === 0 ? "" : "\n") + scanLines[index];

    index += 1;

    if (index === scanLines.length) {
      nextLine();
    } else {
      window.setTimeout(nextLine, 650);
    }
  }

  nextLine();
}

scanButton.addEventListener("click", runDiagnostics);

// ---------- MOOD SELECTOR ----------
const moods = {
  okay: {
    emoji: "🌤️",
    title: "Forecast: A little sunshine",
    message:
      "Glad to hear it. Remember, you can still talk about anything " +
      "that's bothering you."
  },
  annoyed: {
    emoji: "🌥️",
    title: "Forecast: A few clouds",
    message:
      "Acknowledged. Ankit's excuse generator has been switched off. " +
      "Listening mode is now active."
  },
  angry: {
    emoji: "⛈️",
    title: "Forecast: Emotional thunderstorm",
    message:
      "Understood. Your feelings are valid. No pressure to feel better " +
      "on anyone else's schedule."
  },
  space: {
    emoji: "🌙",
    title: "Forecast: Quiet time",
    message:
      "Take the time you need, Pema. Space is okay. This dashboard " +
      "will not send you any more weather alerts."
  },
  talk: {
    emoji: "🌈",
    title: "Forecast: A chance to talk",
    message:
      "Whenever you're ready, Ankit can listen. There's no need to " +
      "solve everything in one conversation."
  }
};

$$("[data-mood]").forEach((button) => {
  button.addEventListener("click", () => {
    const mood = moods[button.dataset.mood];

    if (!mood) return;

    $$(".mood-option").forEach((option) => {
      option.classList.toggle("selected", option === button);
    });

    $("#weatherIllustration").textContent = mood.emoji;
    $("#moodTitle").textContent = mood.title;
    $("#moodMessage").textContent = mood.message;

    showToast("Mood dashboard updated. Thanks for sharing. 💗");
  });
});

// ---------- APOLOGY LETTER ----------
function createLetterContent() {
  const letter = document.createElement("div");

  letter.className = "letter-content";
  letter.textContent = CONFIG.apology;

  return letter;
}

function openApologyLetter() {
  const letter = createLetterContent();

  openModal({
    title: `A Little Letter From ${CONFIG.boyfriend} to ${CONFIG.girlfriend}`,
    icon: "💌",
    content: letter,
    actions: [
      {
        label: "Send a little heart ❤️",
        primary: true,
        onClick: () => {
          createHeartBurst(18);
          playSound("heart");
          showToast("A little heart, just for Pema. ❤️");
        }
      },
      {
        label: "Close letter",
        onClick: closeModal
      }
    ]
  });
}

$("#openApology").addEventListener("click", () => {
  openModal({
    title: "Before you read...",
    icon: "🥺",
    content:
      "This website is a small gesture, not a substitute for a real " +
      "apology. Would you like to read Ankit's letter?",
    actions: [
      {
        label: "Read the letter 💌",
        primary: true,
        onClick: openApologyLetter
      },
      {
        label: "I'm still upset",
        onClick: () => {
          openModal({
            title: "That's okay, Pema",
            icon: "💗",
            content:
              "You don't have to forgive anyone immediately. Take the " +
              "time you need. Your feelings matter, and a real conversation " +
              "can happen whenever you're ready.",
            actions: [
              {
                label: "Close",
                primary: true,
                onClick: closeModal
              }
            ]
          });
        }
      }
    ]
  });
});

$("#envelope").addEventListener("click", () => {
  const envelope = $("#envelope");
  envelope.classList.toggle("opened");

  if (envelope.classList.contains("opened")) {
    playSound("heart");
    window.setTimeout(openApologyLetter, 650);
  }
});

$("#endingLetterButton").addEventListener("click", openApologyLetter);

// ---------- COURTROOM VERDICT ----------
$("#verdictButton").addEventListener("click", () => {
  const verdict = $("#verdictBox");

  verdict.classList.remove("hidden");
  $("#verdictButton").textContent = "Verdict revealed ✓";

  createHeartBurst(10);
  playSound("heart");
});

// ---------- HEART PARTICLES ----------
function createHeartBurst(amount = 12) {
  const container = $("#heartParticles");
  const symbols = ["♥", "♡", "✦", "❤"];

  for (let i = 0; i < amount; i += 1) {
    const heart = document.createElement("span");

    heart.className = "heart-particle";
    heart.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${14 + Math.random() * 23}px`;
    heart.style.animationDuration = `${1.7 + Math.random() * 1.7}s`;
    heart.style.animationDelay = `${Math.random() * 0.5}s`;

    container.appendChild(heart);

    window.setTimeout(() => {
      heart.remove();
    }, 4500);
  }
}

// ---------- OPTIONAL SOUND EFFECTS ----------
function playSound(type = "heart") {
  if (!soundEnabled) return;

  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    if (!audioContext) {
      audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = type === "heart" ? 660 : 520;
    gain.gain.setValueAtTime(0.07, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.18
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    console.warn("Optional sound could not be played.", error);
  }
}

$("#soundToggle").addEventListener("click", async () => {
  soundEnabled = !soundEnabled;

  $("#soundToggle").textContent =
    soundEnabled ? "♫ Sound: On" : "♫ Sound: Off";

  $("#soundToggle").setAttribute(
    "aria-pressed",
    String(soundEnabled)
  );

  if (soundEnabled) {
    playSound("heart");
    showToast("Sound effects enabled. ♫");
  } else {
    showToast("Sound effects disabled.");
  }
});

// ---------- SECRET EASTER EGGS ----------
function revealSecret() {
  const secretMessage = $("#secretMessage");

  secretMessage.classList.remove("hidden");
  secretMessage.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "center"
  });

  createHeartBurst(25);
  playSound("heart");
}

function handleSecretClick() {
  secretClicks += 1;

  if (secretClicks >= 5) {
    secretClicks = 0;
    revealSecret();
  } else {
    showToast(`Secret message unlock: ${secretClicks}/5 ❤️`);
  }
}

$("#footerHeart").addEventListener("click", handleSecretClick);
$("#secretHeart").addEventListener("click", handleSecretClick);

$("#secretHeart").addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handleSecretClick();
  }
});

document.addEventListener("keydown", (event) => {
  const target = event.target;

  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target.isContentEditable ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey
  ) {
    return;
  }

  if (event.key.toLowerCase() === "p") {
    showToast("P is for Pema, the person this website was made for. 💗");
    createHeartBurst(8);
    playSound("heart");
  }
});

// ---------- RESTART EXPERIENCE ----------
$("#restartButton").addEventListener("click", () => {
  closeModal();

  $("#verdictBox").classList.add("hidden");
  $("#verdictButton").textContent = "Reveal the verdict ⚖️";

  $("#envelope").classList.remove("opened");

  $$(".mood-option").forEach((option) => {
    option.classList.remove("selected");
  });

  $("#weatherIllustration").textContent = "🌦️";
  $("#moodTitle").textContent = "Forecast: A little unpredictable";
  $("#moodMessage").textContent =
    "Select an option below, or ignore this silly dashboard entirely.";

  $("#scanStatus").textContent = "Waiting for command...";
  $("#scanOutput").textContent =
    "> Relationship repair system initialized.\n> Awaiting diagnostic command.";

  scanButton.disabled = false;
  scanning = false;
  secretClicks = 0;

  $("#secretMessage").classList.add("hidden");

  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth"
  });

  createHeartBurst(15);
  showToast("Experience restarted. Welcome back, Ankit. ❤️");
});

// ---------- INITIALIZE ----------
document.title =
  `Operation: Please Don't Be Angry | ${CONFIG.boyfriend} & ${CONFIG.girlfriend}`;

console.log(
  "%c❤️ Relationship Repair Department",
  "color: #ec5b91; font-size: 18px; font-weight: bold;"
);
console.log(
  "Developer: Ankit | Special person: Pema | Status: Always learning."
);