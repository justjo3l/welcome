const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const loader = $("#loader");
const loadBar = $("#loadBar");
const loadPercent = $("#loadPercent");
let progress = 0;

function finishLoading() {
  progress = 100;
  loadBar.style.width = "100%";
  loadPercent.textContent = "100%";
  setTimeout(() => loader.classList.add("done"), 180);
}

const loadTimer = setInterval(() => {
  progress = Math.min(96, progress + Math.ceil(Math.random() * 9));
  loadBar.style.width = `${progress}%`;
  loadPercent.textContent = `${String(progress).padStart(2, "0")}%`;
  if (progress >= 96) {
    clearInterval(loadTimer);
    setTimeout(finishLoading, 250);
  }
}, 75);

$("#skipLoader").addEventListener("click", () => {
  clearInterval(loadTimer);
  finishLoading();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });
$$('.reveal').forEach((element) => observer.observe(element));

const cursor = $(".cursor");
if (matchMedia("(pointer:fine)").matches) {
  addEventListener("mousemove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });
  $$('a, button, [tabindex="0"]').forEach((element) => {
    element.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
    element.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
  });
}

const navToggle = $(".nav-toggle");
const navList = $("#navList");
navToggle.addEventListener("click", () => {
  const open = navList.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

const wipe = $(".page-wipe");
const screens = $$(".panel");
document.body.classList.add("screen-mode");

function showScreen(id, updateHistory = true) {
  const target = $(`#${id}`) || $("#home");
  const current = $(".panel.active-screen");
  if (current === target) return;

  wipe.classList.remove("active");
  void wipe.offsetWidth;
  wipe.classList.add("active");
  navList.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");

  setTimeout(() => {
    screens.forEach((screen) => screen.classList.toggle("active-screen", screen === target));
    document.body.dataset.scene = target.id;
    target.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
    if (updateHistory) history.pushState({ screen: target.id }, "", `#${target.id}`);
  }, 440);
}

const initialScreen = location.hash.slice(1) || "home";
const initialTarget = $(`#${initialScreen}`) || $("#home");
initialTarget.classList.add("active-screen");
document.body.dataset.scene = initialTarget.id;

const homeOptions = $$('.game-option[data-preview]');
function selectHomeOption(index, focus = false) {
  const next = (index + homeOptions.length) % homeOptions.length;
  homeOptions.forEach((option, optionIndex) => option.classList.toggle("selected", optionIndex === next));
  if (focus) homeOptions[next].focus({ preventScroll: true });
}
homeOptions.forEach((option, index) => {
  option.addEventListener("mouseenter", () => selectHomeOption(index));
  option.addEventListener("focus", () => selectHomeOption(index));
});

$$('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href").slice(1);
    if (!$(`#${id}`)) return;
    event.preventDefault();
    showScreen(id);
  });
});

addEventListener("popstate", () => showScreen(location.hash.slice(1) || "home", false));

const projectButtons = $$(".project-selector button");
const projects = $$(".project");
function showProject(index) {
  const next = (index + projects.length) % projects.length;
  projectButtons.forEach((button, buttonIndex) => {
    const active = buttonIndex === next;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  projects.forEach((project, projectIndex) => project.classList.toggle("active-project", projectIndex === next));
}
projectButtons.forEach((button) => button.addEventListener("click", () => showProject(Number(button.dataset.project))));

addEventListener("keydown", (event) => {
  if (event.key === "Escape") showScreen("home");
  if ($("#home").classList.contains("active-screen")) {
    const key = event.key.toLowerCase();
    const currentHome = homeOptions.findIndex((option) => option.classList.contains("selected"));
    if (["arrowdown", "arrowright", "s", "d"].includes(key)) {
      event.preventDefault();
      selectHomeOption(currentHome + 1, true);
    }
    if (["arrowup", "arrowleft", "w", "a"].includes(key)) {
      event.preventDefault();
      selectHomeOption(currentHome - 1, true);
    }
    if (key === "enter") {
      event.preventDefault();
      homeOptions[currentHome < 0 ? 0 : currentHome].click();
    }
    return;
  }
  if (!$("#work").classList.contains("active-screen")) return;
  const current = projectButtons.findIndex((button) => button.classList.contains("active"));
  if (["ArrowDown", "ArrowRight"].includes(event.key)) showProject(current + 1);
  if (["ArrowUp", "ArrowLeft"].includes(event.key)) showProject(current - 1);
});

const modes = {
  frontend: {
    name: "FRONTEND",
    description: "Visual systems that feel expressive without sacrificing speed, accessibility or clarity.",
    skills: ["React", "Next.js", "Svelte", "Vue", "Angular", "Tailwind", "Figma"]
  },
  ai: {
    name: "AI / CV",
    description: "Applied intelligence—from LLM workflows to detection and multi-object tracking—with evaluation built in.",
    skills: ["Python", "Gemini", "YOLO", "DeepSORT", "FastAPI", "n8n", "LLM APIs"]
  },
  systems: {
    name: "SYSTEMS",
    description: "Secure, observable product infrastructure designed around queues, data integrity and real deployment constraints.",
    skills: ["AWS", "GCP", "Docker", "PostgreSQL", "Redis", "Prisma", "REST"]
  },
  product: {
    name: "PRODUCT",
    description: "Technical leadership that connects architecture, user needs and delivery into one coherent decision loop.",
    skills: ["Architecture", "Leadership", "Teaching", "Prototyping", "Analytics", "Delivery"]
  }
};

$$('.mode-card').forEach((card) => {
  const activate = () => {
    $$('.mode-card').forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
    const mode = modes[card.dataset.mode];
    $("#modeName").textContent = mode.name;
    $("#modeDescription").textContent = mode.description;
    $("#modeSkills").innerHTML = mode.skills.map((skill) => `<li>${skill}</li>`).join("");
  };
  card.addEventListener("mouseenter", activate);
  card.addEventListener("click", activate);
});

const soundToggle = $("#soundToggle");
soundToggle.addEventListener("click", () => {
  const active = soundToggle.getAttribute("aria-pressed") === "true";
  soundToggle.setAttribute("aria-pressed", String(!active));
  $("b", soundToggle).textContent = active ? "SOUND OFF" : "MUSIC READY";
  soundToggle.title = active ? "Ambient sound coming soon" : "Add your produced track in the next iteration";
});

$("#copyEmail").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  const email = button.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    button.firstChild.textContent = "COPIED ";
  } catch {
    location.href = `mailto:${email}`;
  }
});

$("#year").textContent = new Date().getFullYear();
