/* D & S WEDDING INVITATION
   Edit the WEDDING object below to change your details.
*/
const WEDDING = {
  bride: {
    name: "Dr. Salivendra Deevena",
    parents: "D/o Dr. Kishore Kumar and Mrs. Emily"
  },
  groom: {
    name: "Dr. Manukonda Sasi Preetham",
    parents: "S/o Mr. M.V.V. Satyanarayana and Mrs. Santha Kumari"
  },
  verse: {
    text: "The steadfast love of the Lord never ceases.",
    reference: "Lamentations 3:22"
  },
  dateTime: "2026-11-23T10:00:00+05:30",
  displayDate: "November 23, 2026",
  displayTime: "10:00 AM",
  venue: {
    name: "Adabala Gardens",
    address: "Saibaba Temple Rd, Palakollu, Andhra Pradesh 534260",
    mapsUrl: "https://maps.app.goo.gl/LtFcmX7WESMcbg2h9"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);
  const set = (id, value) => {
    const el = $(id);
    if (el) el.textContent = value;
  };

  // Fill invitation content
  [
    ["openVerse", WEDDING.verse.text],
    ["openRef", "— " + WEDDING.verse.reference],
    ["heroVerse", WEDDING.verse.text],
    ["heroRef", WEDDING.verse.reference],
    ["closeVerse", WEDDING.verse.text],
    ["closeRef", WEDDING.verse.reference],
    ["brideHero", WEDDING.bride.name],
    ["groomHero", WEDDING.groom.name],
    ["brideName", WEDDING.bride.name],
    ["groomName", WEDDING.groom.name],
    ["brideParents", WEDDING.bride.parents],
    ["groomParents", WEDDING.groom.parents],
    ["heroDate", WEDDING.displayDate + " · " + WEDDING.displayTime],
    ["dateText", WEDDING.displayDate],
    ["timeText", WEDDING.displayTime],
    ["venueText", WEDDING.venue.name],
    ["addressText", WEDDING.venue.address],
    ["footerDate", WEDDING.displayDate]
  ].forEach(([id, value]) => set(id, value));

  const mapsLink = $("mapsLink");
  if (mapsLink) mapsLink.href = WEDDING.venue.mapsUrl;

  set("footerYear", new Date().getFullYear());

  // Date pieces
  const weddingDate = new Date(WEDDING.dateTime);
  set("dayNum", String(weddingDate.getDate()).padStart(2, "0"));
  set("monthName", weddingDate.toLocaleString("en-US", {month: "short"}).toUpperCase());
  set("yearNum", weddingDate.getFullYear());

  // Loader
  const loader = $("loader");
  if (loader) setTimeout(() => loader.classList.add("hide"), 500);

  // IMPORTANT: opening screen
  const openButton = $("openButton");
  const openScreen = $("openScreen");
  const site = $("site");
  const footer = $("footer");
  const siteHeader = $("siteHeader");

  function openInvitation(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (openScreen) openScreen.classList.add("opened");
    if (site) {
      site.hidden = false;
      site.removeAttribute("hidden");
    }
    if (footer) {
      footer.hidden = false;
      footer.removeAttribute("hidden");
    }
    if (siteHeader) siteHeader.classList.add("show");
    document.body.classList.add("invitation-open");
    window.scrollTo(0, 0);

    // Keep the transition simple and reliable on GitHub Pages.
    setTimeout(() => {
      if (openScreen) {
        openScreen.style.display = "none";
        openScreen.setAttribute("aria-hidden", "true");
      }
    }, 700);
  }

  if (openButton) {
    openButton.addEventListener("click", openInvitation);
    // Keyboard accessibility
    openButton.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") openInvitation(e);
    });
  }

  // Countdown
  const target = weddingDate.getTime();
  function countdown() {
    const diff = target - Date.now();
    if (diff <= 0) {
      ["days", "hours", "minutes", "seconds"].forEach(id => set(id, "00"));
      return;
    }
    set("days", String(Math.floor(diff / 86400000)).padStart(2, "0"));
    set("hours", String(Math.floor(diff / 3600000) % 24).padStart(2, "0"));
    set("minutes", String(Math.floor(diff / 60000) % 60).padStart(2, "0"));
    set("seconds", String(Math.floor(diff / 1000) % 60).padStart(2, "0"));
  }
  countdown();
  setInterval(countdown, 1000);

  // Scratch card
  const canvas = $("scratchCanvas");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let scratching = false;
    let revealed = false;

    function resizeCanvas() {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";

      const g = ctx.createLinearGradient(0, 0, r.width, r.height);
      g.addColorStop(0, "#3f7779");
      g.addColorStop(1, "#1e555a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, r.width, r.height);

      ctx.fillStyle = "rgba(255,248,233,.9)";
      ctx.font = '600 14px Montserrat, sans-serif';
      ctx.textAlign = "center";
      ctx.fillText("SCRATCH HERE", r.width / 2, r.height / 2 - 4);
      ctx.font = '400 10px Montserrat, sans-serif';
      ctx.fillStyle = "rgba(255,248,233,.7)";
      ctx.fillText("Reveal our special day", r.width / 2, r.height / 2 + 17);
    }

    function scratch(x, y) {
      if (revealed) return;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();

      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0;
      for (let i = 3; i < data.length; i += 32) {
        if (data[i] < 30) clear++;
      }
      if (clear / (data.length / 32) > 0.34) {
        revealed = true;
        canvas.style.opacity = "0";
        canvas.style.pointerEvents = "none";
      }
    }

    function pointerPos(e) {
      const r = canvas.getBoundingClientRect();
      return {x: e.clientX - r.left, y: e.clientY - r.top};
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    canvas.addEventListener("pointerdown", e => {
      scratching = true;
      canvas.setPointerCapture?.(e.pointerId);
      const p = pointerPos(e);
      scratch(p.x, p.y);
    });

    canvas.addEventListener("pointermove", e => {
      if (!scratching) return;
      const p = pointerPos(e);
      scratch(p.x, p.y);
    });

    canvas.addEventListener("pointerup", () => scratching = false);
    canvas.addEventListener("pointercancel", () => scratching = false);
  }

  // Calendar
  const calendarBtn = $("calendarBtn");
  if (calendarBtn) {
    calendarBtn.addEventListener("click", () => {
      const start = new Date(WEDDING.dateTime);
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
      const icsDate = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
      const text = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//D and S Wedding//EN",
        "BEGIN:VEVENT",
        `DTSTART:${icsDate(start)}`,
        `DTEND:${icsDate(end)}`,
        `SUMMARY:Wedding of ${WEDDING.bride.name} & ${WEDDING.groom.name}`,
        `LOCATION:${WEDDING.venue.name}, ${WEDDING.venue.address}`,
        `DESCRIPTION:Wedding invitation for ${WEDDING.bride.name} & ${WEDDING.groom.name}.`,
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([text], {type: "text/calendar;charset=utf-8"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "D-and-S-Wedding.ics";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }
});
