/* ==========================================================
   D & S WEDDING INVITATION — EDIT HERE
   Change the WEDDING object to personalize the invitation.
   ========================================================== */

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

const $ = id => document.getElementById(id);
const set = (id, value) => { if ($(id)) $(id).textContent = value; };

[
  ["openVerse", WEDDING.verse.text], ["openRef", "— " + WEDDING.verse.reference],
  ["heroVerse", WEDDING.verse.text], ["heroRef", WEDDING.verse.reference],
  ["closeVerse", WEDDING.verse.text], ["closeRef", WEDDING.verse.reference],
  ["brideHero", WEDDING.bride.name], ["groomHero", WEDDING.groom.name],
  ["brideName", WEDDING.bride.name], ["groomName", WEDDING.groom.name],
  ["brideParents", WEDDING.bride.parents], ["groomParents", WEDDING.groom.parents],
  ["heroDate", WEDDING.displayDate + " · " + WEDDING.displayTime],
  ["dateText", WEDDING.displayDate], ["timeText", WEDDING.displayTime],
  ["venueText", WEDDING.venue.name], ["addressText", WEDDING.venue.address],
  ["footerDate", WEDDING.displayDate]
].forEach(([id,v]) => set(id,v));

$("mapsLink").href = WEDDING.venue.mapsUrl;
$("footerYear").textContent = new Date().getFullYear();

// Date pieces
const weddingDate = new Date(WEDDING.dateTime);
set("dayNum", String(weddingDate.getDate()).padStart(2,"0"));
set("monthName", weddingDate.toLocaleString("en-US",{month:"short"}).toUpperCase());
set("yearNum", weddingDate.getFullYear());

// Opening transition
window.addEventListener("load", () => {
  setTimeout(() => $("loader").classList.add("hide"), 700);
});

$("openButton").addEventListener("click", () => {
  $("openScreen").classList.add("opened");
  $("site").hidden = false;
  $("footer").hidden = false;
  $("siteHeader").classList.add("show");
  document.body.classList.add("invitation-open");
  window.scrollTo({top:0,behavior:"smooth"});
  setTimeout(() => $("openScreen").style.display="none", 850);
});

// Countdown
const target = weddingDate.getTime();
function countdown() {
  const diff = target - Date.now();
  if (diff <= 0) {
    ["days","hours","minutes","seconds"].forEach(id=>set(id,"00"));
    return;
  }
  set("days", String(Math.floor(diff/86400000)).padStart(2,"0"));
  set("hours", String(Math.floor(diff/3600000)%24).padStart(2,"0"));
  set("minutes", String(Math.floor(diff/60000)%60).padStart(2,"0"));
  set("seconds", String(Math.floor(diff/1000)%60).padStart(2,"0"));
}
countdown(); setInterval(countdown,1000);

// Scratch card
const canvas = $("scratchCanvas");
const ctx = canvas.getContext("2d");
let scratching = false, revealed = false;
function resizeCanvas() {
  const r = canvas.getBoundingClientRect();
  canvas.width = Math.round(r.width * devicePixelRatio);
  canvas.height = Math.round(r.height * devicePixelRatio);
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  ctx.globalCompositeOperation = "source-over";
  const g = ctx.createLinearGradient(0,0,r.width,r.height);
  g.addColorStop(0,"#3f7779"); g.addColorStop(1,"#1e555a");
  ctx.fillStyle=g; ctx.fillRect(0,0,r.width,r.height);
  ctx.fillStyle="rgba(255,248,233,.9)";
  ctx.font='600 14px Montserrat, sans-serif';
  ctx.textAlign="center";
  ctx.fillText("SCRATCH HERE",r.width/2,r.height/2-4);
  ctx.font='400 10px Montserrat, sans-serif';
  ctx.fillStyle="rgba(255,248,233,.7)";
  ctx.fillText("Reveal our special day",r.width/2,r.height/2+17);
}
resizeCanvas(); window.addEventListener("resize",resizeCanvas);

function scratch(x,y){
  if(revealed) return;
  ctx.globalCompositeOperation="destination-out";
  ctx.beginPath(); ctx.arc(x,y,24,0,Math.PI*2); ctx.fill();
  // Reveal after roughly 35% of card is cleared
  const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
  let clear=0;
  for(let i=3;i<data.length;i+=32) if(data[i]<30) clear++;
  if(clear/(data.length/32)>.34){
    revealed=true; canvas.style.opacity="0"; canvas.style.pointerEvents="none";
  }
}
function pointerPos(e){
  const r=canvas.getBoundingClientRect();
  const p=e.touches ? e.touches[0] : e;
  return {x:p.clientX-r.left,y:p.clientY-r.top};
}
canvas.addEventListener("pointerdown",e=>{scratching=true; const p=pointerPos(e); scratch(p.x,p.y)});
canvas.addEventListener("pointermove",e=>{if(scratching){const p=pointerPos(e);scratch(p.x,p.y)}});
window.addEventListener("pointerup",()=>scratching=false);

// Calendar
$("calendarBtn").addEventListener("click",()=>{
  const start=new Date(WEDDING.dateTime);
  const end=new Date(start.getTime()+2*60*60*1000);
  const icsDate=d=>d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z");
  const text=[
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//D and S Wedding//EN","BEGIN:VEVENT",
    `DTSTART:${icsDate(start)}`,`DTEND:${icsDate(end)}`,
    `SUMMARY:Wedding of ${WEDDING.bride.name} & ${WEDDING.groom.name}`,
    `LOCATION:${WEDDING.venue.name}, ${WEDDING.venue.address}`,
    `DESCRIPTION:Wedding invitation for ${WEDDING.bride.name} & ${WEDDING.groom.name}.`,
    "END:VEVENT","END:VCALENDAR"
  ].join("\r\n");
  const blob=new Blob([text],{type:"text/calendar;charset=utf-8"});
  const url=URL.createObjectURL(blob), a=document.createElement("a");
  a.href=url;a.download="D-and-S-Wedding.ics";a.click();URL.revokeObjectURL(url);
});
