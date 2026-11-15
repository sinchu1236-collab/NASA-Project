const windows=[
 {name:"Window A · Early illumination",time:"T+08h · 14 Nov (sim)",score:82,illum:"High",thermal:"Moderate",comms:"Strong",note:"Best balance in this demo: favorable light and communications, with moderate thermal variation."},
 {name:"Window B · Low thermal swing",time:"T+26h · 15 Nov (sim)",score:76,illum:"Moderate",thermal:"Low",comms:"Moderate",note:"Lower simulated thermal variation, but less illumination and a weaker communications score."},
 {name:"Window C · Extended daylight",time:"T+51h · 16 Nov (sim)",score:68,illum:"High",thermal:"High",comms:"Strong",note:"Longer simulated daylight and strong communications, offset by a higher thermal score."},
 {name:"Window D · Reserve concept",time:"T+68h · 17 Nov (sim)",score:61,illum:"Low",thermal:"Moderate",comms:"Moderate",note:"Reserve-only demo option. Lower illumination makes it less favorable in this toy scoring model."}
];
const sites=[
 {name:"Shackleton Rim",code:"SITE A",slope:"4.2°",illum:"78%",hazards:2,risk:18},
 {name:"Haworth Plateau",code:"SITE B",slope:"6.8°",illum:"71%",hazards:3,risk:27},
 {name:"Malapert Massif",code:"SITE C",slope:"8.1°",illum:"84%",hazards:5,risk:46}
];
let selectedWindow=0,windowCount=3,sortLow=true;
const windowList=document.querySelector("#windowList");
function renderWindows(){windowList.innerHTML=windows.slice(0,windowCount).map((w,i)=>'<button class="window-item '+(i===selectedWindow?'selected':'')+'" data-window="'+i+'"><span class="window-radio"></span><span class="window-main"><b>'+w.name+'</b><small>'+w.time+' · '+w.illum+' illum. · '+w.thermal+' thermal</small></span><span class="window-score"><b>'+w.score+'</b><small>DEMO SCORE</small></span></button>').join('');windowList.querySelectorAll("[data-window]").forEach(b=>b.addEventListener("click",()=>{selectedWindow=Number(b.dataset.window);renderWindows()}));const note=document.querySelector("#windowNote");if(note)note.textContent=windows[selectedWindow].note}
const noteEl=document.createElement("p");noteEl.id="windowNote";noteEl.className="window-note";windowList.after(noteEl);
function renderSites(){const rows=sortLow?[...sites].sort((a,b)=>a.risk-b.risk):[...sites].sort((a,b)=>b.risk-a.risk);document.querySelector("#siteRows").innerHTML=rows.map(s=>'<tr><td><span class="site-name">'+s.name+'</span><span class="site-code">'+s.code+'</span></td><td>'+s.slope+'</td><td>'+s.illum+'</td><td>'+s.hazards+' <span style="color:#778596">features</span></td><td><span class="risk '+(s.risk>25?'medium':'')+'"><i></i>'+s.risk+' / 100</span></td><td><button class="text-btn site-compare" data-site="'+s.code+'">Compare</button></td></tr>').join("");document.querySelectorAll(".site-compare").forEach(b=>b.addEventListener("click",()=>{document.querySelector("#chatInput").value="Compare "+b.dataset.site+" with the other landing sites";document.querySelector("#chatInput").focus();document.querySelector("#assistant").scrollIntoView({behavior:"smooth"})}))}
renderWindows();renderSites();
document.querySelector("#compareWindows").addEventListener("click",()=>{windowCount=windowCount===3?4:3;document.querySelector("#compareWindows").textContent=windowCount===4?"− Show fewer windows":"＋ Compare another window";renderWindows()});
document.querySelector("#sortSites").addEventListener("click",e=>{sortLow=!sortLow;e.currentTarget.textContent="Sort: risk "+(sortLow?"↓":"↑");renderSites()});
document.querySelector("#clockBtn").addEventListener("click",()=>{const b=document.querySelector("#clockBtn");b.textContent="✓";setTimeout(()=>b.textContent="↻",1000)});
document.querySelector("#layerBtn").addEventListener("click",e=>{const layers=["Terrain","Illumination","Hazard overlay"];const n=Number(e.currentTarget.dataset.layer||0);e.currentTarget.dataset.layer=(n+1)%layers.length;e.currentTarget.textContent="Layer: "+layers[(n+1)%layers.length]+"⌄"});
document.querySelector("#surfaceDetails").addEventListener("click",()=>document.querySelector("#sites").scrollIntoView({behavior:"smooth"}));
const messages=document.querySelector("#chatMessages");
function addMessage(text,role){const d=document.createElement("div");d.className="message "+role;if(role==="assistant"){const label=document.createElement("small");label.textContent="LUNARSAFE DEMO ASSISTANT";d.append(label)}d.append(document.createTextNode(text));messages.append(d);messages.scrollTop=messages.scrollHeight}
function responseFor(input){const q=input.toLowerCase();
if(q.includes("compare")&&(q.includes("site")||q.includes("shackleton")||q.includes("haworth")||q.includes("malapert"))){return "Demo site comparison: Shackleton Rim has the lowest illustrative risk score (18/100), 4.2° slope, 78% illumination and 2 mapped demo hazard features. Haworth scores 27/100; Malapert scores 46/100. This toy ranking does not account for validated terrain, vehicle limits, lighting geometry or mission constraints. It cannot establish a safe landing site."}
if(q.includes("site")||q.includes("risk")||q.includes("landing")){return "In this simulated set, Shackleton Rim ranks lowest on the demo risk index (18/100), followed by Haworth Plateau (27) and Malapert Massif (46). The values are illustrative UI data, not measured lunar conditions. Real site selection needs validated elevation and hazard maps, landing system constraints, lighting, communications and expert review."}
if(q.includes("compare")||q.includes("window")||q.includes("launch")||q.includes("time")){const w=windows[selectedWindow];return "Comparing the demo windows: A scores 82, B 76, C 68 and D 61. Window A is the top-ranked illustrative option because its simulated illumination and communications are favorable, with moderate thermal variation. Your selected window is "+w.name+" ("+w.time+"). These are invented scenario scores, not launch opportunities or trajectory calculations. A real launch decision must use validated mission data and authorized flight teams."}
if(q.includes("before")||q.includes("consider")||q.includes("decision")||q.includes("trade")){return "For a real launch decision, teams would verify current ephemerides and trajectory constraints, surface lighting, terrain slope and hazards, communications coverage, thermal limits, vehicle performance, weather and operational readiness. This dashboard has none of those validated inputs; use its comparison only to explore the interface."}
if(q.includes("hello")||q.includes("hi"))return "Hello, Commander. I can compare the demo landing windows and site scores, explain their tradeoffs, or list factors a real mission team would need to review.";
return "I can compare the simulated landing windows and site scores, explain tradeoffs, and outline real-world factors that require mission-team review. Try “compare the windows” or “which site has the lowest demo risk?” This assistant is a local scripted demo, not a connected AI system."}
function speak(text){if(!("speechSynthesis"in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=1;window.speechSynthesis.speak(u)}
function submitMessage(text){const value=(text||document.querySelector("#chatInput").value).trim();if(!value)return;addMessage(value,"user");document.querySelector("#chatInput").value="";const answer=responseFor(value);setTimeout(()=>{addMessage(answer,"assistant");if(document.querySelector("#speakReplies").checked)speak(answer)},260)}
document.querySelector("#chatForm").addEventListener("submit",e=>{e.preventDefault();submitMessage()});
document.querySelectorAll(".suggestion").forEach(b=>b.addEventListener("click",()=>submitMessage(b.textContent)));
addMessage("Welcome. I can compare demo landing windows and sites, explain tradeoffs, and outline factors for human review. What would you like to compare?","assistant");
const form=document.querySelector("#chatForm"),speakLabel=document.createElement("label");speakLabel.className="speak-toggle";speakLabel.innerHTML='<input id="speakReplies" type="checkbox"> Read replies aloud';form.after(speakLabel);
const voiceBtn=document.querySelector("#voiceBtn"),voiceStatus=document.querySelector("#voiceStatus");
const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
if(SpeechRecognition){const recognition=new SpeechRecognition();recognition.lang=navigator.language||"en-US";recognition.interimResults=false;recognition.maxAlternatives=1;voiceBtn.addEventListener("click",()=>{try{recognition.start();voiceStatus.textContent="Listening… speak your question."}catch(e){voiceStatus.textContent="Voice input is already active. Please try again shortly."}});recognition.onresult=e=>{const transcript=e.results[0][0].transcript;document.querySelector("#chatInput").value=transcript;voiceStatus.textContent="Heard: “"+transcript+"”";submitMessage(transcript)};recognition.onerror=e=>{voiceStatus.textContent=e.error==="not-allowed"?"Microphone access was blocked. Allow it in your browser settings to use voice input.":"Voice input ended ("+e.error+"). You can type instead."};recognition.onend=()=>{if(voiceStatus.textContent.startsWith("Listening"))voiceStatus.textContent="Voice input ended. You can tap Talk to try again."}}else{voiceBtn.disabled=true;voiceBtn.title="Speech recognition is not supported in this browser";voiceStatus.textContent="Speech input is not supported in this browser. You can type; replies can still be read aloud."}


// NASA Image and Video Library API: public endpoint, no API key.
const archiveGrid=document.querySelector("#archiveGrid"),archiveStatus=document.querySelector("#archiveStatus"),archiveQuery=document.querySelector("#archiveQuery");
let archivePage=1,archiveTerm="Moon",archiveTotal=0,archiveItems=[];
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderArchive(items){
 archiveItems=items||[];
 if(!archiveItems.length){archiveGrid.innerHTML='<div class="archive-empty">No matching records. Try Moon, Apollo, LRO, or south pole.</div>';return}
 archiveGrid.innerHTML=archiveItems.map(item=>{const d=(item.data&&item.data[0])||{},link=(item.links||[]).find(x=>x.render==="image")||(item.links||[])[0],title=d.title||"NASA archive record",desc=d.description||"No description supplied.",id=d.nasa_id||"NASA record",date=(d.date_created||"Date not listed").slice(0,10),center=d.center||"NASA",img=link&&link.href?link.href:"";return '<article class="archive-item">'+(img?'<img loading="lazy" src="'+escapeHtml(img)+'" alt="'+escapeHtml(title)+'">':'')+'<div class="archive-item-body"><h3>'+escapeHtml(title)+'</h3><p>'+escapeHtml(desc)+'</p><p>'+escapeHtml(center)+' · '+escapeHtml(date)+' · '+escapeHtml(id)+'</p><a href="https://images.nasa.gov/details/'+encodeURIComponent(id)+'" target="_blank" rel="noopener">Open NASA record ↗</a></div></article>'}).join("")
}
async function searchArchive(term,page=1){
 archiveTerm=(term||"Moon").trim()||"Moon";archivePage=page;archiveStatus.textContent="Searching NASA’s public archive…";archiveGrid.innerHTML='<div class="archive-empty">Loading archive results…</div>';
 const params=new URLSearchParams({q:archiveTerm,media_type:"image",page_size:"12",page:String(page)});
 try{const response=await fetch("https://images-api.nasa.gov/search?"+params.toString(),{headers:{Accept:"application/json"}});if(!response.ok)throw Error("NASA archive returned HTTP "+response.status);const json=await response.json(),collection=json.collection||{},items=collection.items||[];archiveTotal=Number(collection.metadata&&collection.metadata.total_hits)||0;renderArchive(items);archiveStatus.textContent=archiveTotal.toLocaleString()+" matching archive records · page "+archivePage+" · NASA API";document.querySelector("#archivePage").textContent="Page "+archivePage;document.querySelector("#archivePrev").disabled=archivePage<=1;document.querySelector("#archiveNext").disabled=!items.length||archivePage*12>=archiveTotal}
 catch(error){archiveStatus.textContent="NASA archive is temporarily unavailable. Check your connection and retry.";archiveGrid.innerHTML='<div class="archive-empty">'+escapeHtml(error.message)+'<br>Live results need an internet connection. Demo comparisons still work.</div>';document.querySelector("#archivePrev").disabled=archivePage<=1;document.querySelector("#archiveNext").disabled=true}
}
document.querySelector("#archiveForm").addEventListener("submit",e=>{e.preventDefault();searchArchive(archiveQuery.value,1)});
document.querySelector("#archivePrev").addEventListener("click",()=>archivePage>1&&searchArchive(archiveTerm,archivePage-1));
document.querySelector("#archiveNext").addEventListener("click",()=>searchArchive(archiveTerm,archivePage+1));
searchArchive("Moon",1);
// For archive questions the scripted assistant reports live search metadata.
const originalSubmitMessage=submitMessage;
submitMessage=function(text){
 const value=(text||document.querySelector("#chatInput").value).trim();if(!value)return;
 if(!/(image|photo|picture|archive|apollo|lro|lunar reconnaissance|south pole|crater|moon data)/i.test(value)){originalSubmitMessage(value);return}
 addMessage(value,"user");document.querySelector("#chatInput").value="";
 const term=value.replace(/^(can you |please |show me |find |search for |search )/i,"").replace(/\b(images?|photos?|pictures?|archive|data|records?)\b/gi,"").trim()||"Moon";
 addMessage("Searching NASA’s public archive for “"+term+"”…","assistant");
 searchArchive(term,1).then(()=>{const titles=archiveItems.slice(0,4).map(x=>(x.data&&x.data[0]&&x.data[0].title)||"NASA record");const answer=archiveTotal?"NASA’s live image archive reports "+archiveTotal.toLocaleString()+" matching records for “"+term+"”. First results: "+titles.join("; ")+". I’ve loaded the current page below. These are archival imagery and metadata, not live telemetry or validated landing data.":"I couldn’t retrieve NASA records just now. Check the archive panel and retry. I can’t interpret imagery or make mission decisions.";addMessage(answer,"assistant");if(document.querySelector("#speakReplies").checked)speak(answer)})
};
