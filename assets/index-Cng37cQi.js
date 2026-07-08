(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const d of a.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function n(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(s){if(s.ep)return;s.ep=!0;const a=n(s);fetch(s.href,a)}})();const r={data:null,audit:null,selectedId:null,review:{},filters:{q:"",category:[],stage:[],survivor:[],lock:[]},locale:"en"},k="rorr-unlockables-review:v1",b="rorr-unlockables-ui:v1",l={auditBadge:document.querySelector("#auditBadge"),locale:document.querySelector("#locale"),search:document.querySelector("#search"),category:document.querySelector("#category"),stage:document.querySelector("#stage"),survivor:document.querySelector("#survivor"),lock:document.querySelector("#lock"),activeTags:document.querySelector("#activeTags"),summary:document.querySelector("#summary"),list:document.querySelector("#list"),detail:document.querySelector("#detail")};async function E(){const[e,t]=await Promise.all([fetch("./data.json").then(n=>n.json()),fetch("./audit.json").then(n=>n.json())]);r.data=e,r.audit=t,r.locale=Z(),r.review=X(),ee(w()),te(),r.selectedId||=e.unlockables[0]?.id||null,l.locale.value=r.locale,l.search.value=r.filters.q,H(),u()}function H(){S(),l.search.addEventListener("input",()=>{r.filters.q=l.search.value.trim().toLowerCase(),u()}),l.locale.addEventListener("change",()=>{r.locale=l.locale.value,S(),u()}),document.addEventListener("click",e=>{e.target.closest(".filter-dropdown")||I()})}function u(){const e=U();e.some(t=>t.id===r.selectedId)||(r.selectedId=e[0]?.id||null),_(),O(e),Q(),W(),x(e),M(e.find(t=>t.id===r.selectedId)||null),ne()}function _(){const e=r.audit?.summary?.issues||0;l.auditBadge.textContent=e?`${e} audit issues`:"Audit clean",l.auditBadge.className=e?"audit-badge bad":"audit-badge ok"}function O(e){const t=r.data.unlockables,n=re(e,a=>a.category),o=e.filter(a=>a.achievement_id).length,s=r.data.unlockables.filter(a=>g(a).unlocked).length;l.summary.innerHTML=`
    <div><strong>${e.length}</strong><span>shown</span></div>
    <div><strong>${t.length}</strong><span>total</span></div>
    <div><strong>${Object.keys(n).length}</strong><span>categories</span></div>
    <div><strong>${o}</strong><span>achievements</span></div>
    <div><strong>${s}</strong><span>unlocked</span></div>
  `}function x(e){l.list.innerHTML=e.map(t=>`
    <div class="row ${t.id===r.selectedId?"active":""}" data-id="${i(t.id)}">
      <button class="row-main" type="button" data-select="${i(t.id)}">
        ${q(t,"row-icon")}
        <span>${i(h(t).name||t.id)}</span>
        <small>${i(c("category",t.category))}${t.achievement_id?" · achievement":""}${f(t).length?` · ${i(f(t).map(n=>c("survivor",n)).join(", "))}`:""}${t.needs_detail?" · needs detail":""}</small>
      </button>
      <button class="row-lock ${g(t).unlocked?"active":""}" type="button" data-lock="${i(t.id)}">${g(t).unlocked?"Unlocked":"Locked"}</button>
    </div>
  `).join(""),l.list.querySelectorAll("[data-select]").forEach(t=>{t.addEventListener("click",()=>{r.selectedId=t.dataset.select,u()})}),l.list.querySelectorAll("[data-lock]").forEach(t=>{t.addEventListener("click",()=>{V(t.dataset.lock),u()})})}function M(e){if(!e){l.detail.innerHTML="<p>No matching unlockable.</p>";return}const t=h(e),n=r.locale==="en"?e.text["zh-Hans"]:e.text.en;l.detail.innerHTML=`
    <div class="detail-head">
      ${q(e,"detail-icon")}
      <div>
        <h2>${i(t.name||e.id)}</h2>
        <p>${i([n?.name,e.id].filter(Boolean).join(" · "))}</p>
      </div>
      <span>${i(c("category",e.category))}</span>
    </div>
    <p class="summary-text">${i(t.summary||"")}</p>
    ${N(e)}
    ${B(e)}
    ${C(t)}
    ${F(t)}
    ${z(e)}
    <dl>
      <div><dt>Action</dt><dd>${i(e.action)}</dd></div>
      <div><dt>Achievement</dt><dd>${e.achievement_id?i(e.achievement_id):"no"}</dd></div>
      <div><dt>Priority</dt><dd>${e.priority}</dd></div>
      <div><dt>Opportunity</dt><dd>${e.opportunity_boost}</dd></div>
      <div><dt>Effort</dt><dd>${e.effort}</dd></div>
      <div><dt>Risk</dt><dd>${e.risk}</dd></div>
      <div><dt>Quality</dt><dd>${i(e.precision)} / ${i(e.confidence)}</dd></div>
      ${t.location?`<div><dt>Location</dt><dd>${i(t.location)}</dd></div>`:""}
      <div><dt>Needs Detail</dt><dd>${e.needs_detail?"yes":"no"}</dd></div>
    </dl>
  `}function q(e,t){if(e.icon)return`<img class="${t}" src="./${i(e.icon)}" alt="" loading="lazy" />`;const n=h(e).name||e.id||"?";return`<div class="${t} icon-fallback" aria-hidden="true">${i(String(n).slice(0,1).toUpperCase())}</div>`}function N(e){const t=[...(e.hard.survivors||[]).map(n=>`survivor:${c("survivor",n)}`),...(e.soft.items||[]).map(n=>`item:${n}`)];return t.length?`<div class="tags">${t.map(n=>`<span>${i(n)}</span>`).join("")}</div>`:""}function B(e){return e.stage.length?`<section><h3>Stages</h3><ul>${e.stage.map(t=>`
    <li>${i(c("stage",t.id))} ${t.variants.length?`variant ${i(t.variants.join(", "))}`:""} <small>${i(t.role)}</small></li>
  `).join("")}</ul></section>`:""}function C(e){return e.notes.length?`<section><h3>Notes</h3><ul>${e.notes.map(t=>`<li>${i(t)}</li>`).join("")}</ul></section>`:""}function F(e){return e.steps.length?`<section><h3>Steps</h3><ol>${e.steps.map(t=>`<li>${i(t)}</li>`).join("")}</ol></section>`:""}function z(e){return e.source.length?`<section><h3>Sources</h3><ul>${e.source.map(t=>`
    <li>${P(t)}</li>
  `).join("")}</ul></section>`:""}function P(e){const t=e.label||e.type||"Source",n=e.note||"";return e.url?`<a href="${i(e.url)}" target="_blank" rel="noreferrer">${i(t)}</a>${n?` <small>${i(n)}</small>`:""}`:`<span>${i(t)}</span>${n?` <small>${i(n)}</small>`:""}`}function U(){return r.data.unlockables.filter(e=>{const t=r.filters.q;if(t&&!D(e).includes(t)||!m(r.filters.category,[e.category])||!m(r.filters.stage,e.stage.map(o=>o.id))||!J(e))return!1;const n=g(e);return!!m(r.filters.lock,[n.unlocked?"unlocked":"locked"])}).sort(K)}function h(e){return e.text?.[r.locale]||e.text?.en||{name:e.id,summary:"",location:"",steps:[],notes:[]}}function D(e){const t=[e.id,e.category,e.target,e.icon,e.achievement_id];t.push(c("category",e.category),...e.stage.map(n=>c("stage",n.id)),...f(e),...f(e).map(n=>c("survivor",n)));for(const n of Object.values(e.text||{}))t.push(n.name,n.summary,n.location,...n.steps||[],...n.notes||[]);return t.filter(Boolean).join(" ").toLowerCase()}function g(e){return{unlocked:!!r.review[e.id]?.unlocked}}function f(e){return Array.isArray(e.facets?.survivors)?e.facets.survivors:[]}function L(e){return Array.isArray(e.facets?.owner_survivors)?e.facets.owner_survivors:[]}function A(e){return Array.isArray(e.facets?.required_survivors)?e.facets.required_survivors:[]}function R(e){return Array.isArray(e.facets?.recommended_survivors)?e.facets.recommended_survivors:[]}function J(e){const t=r.filters.survivor;if(t.length===0)return!0;const n=L(e);if(n.length)return v(n,t);const o=A(e);return o.length?v(o,t):!0}function K(e,t){if(r.filters.survivor.length){const n=$(e)-$(t);if(n)return n}return t.priority-e.priority||e.id.localeCompare(t.id)}function $(e){const t=r.filters.survivor;return v(L(e),t)?0:v(A(e),t)?1:v(R(e),t)?2:f(e).length===0?3:4}function m(e,t){return e.length===0||t.some(n=>e.includes(n))}function v(e,t){return e.some(n=>t.includes(n))}function V(e){const t=r.data.unlockables.find(n=>n.id===e);t&&(g(t).unlocked?delete r.review[e]:r.review[e]={unlocked:!0},Y())}function j(){return{category:p(r.data.unlockables.map(e=>e.category)),stage:p(r.data.unlockables.flatMap(e=>e.stage.map(t=>t.id))),survivor:p(r.data.unlockables.flatMap(f)),lock:["locked","unlocked"]}}function S(){const e=j();for(const t of["category","stage","survivor","lock"])G(t,e[t])}function G(e,t){const n=r.filters[e],o=[...t].sort((s,a)=>c(e,s).localeCompare(c(e,a)));l[e].innerHTML=`
    <div class="filter-dropdown" data-filter-root="${i(e)}">
      <button type="button" class="filter-trigger" data-filter-toggle="${i(e)}">
        <span>${i(T(e))}</span>
        <strong>${i(y(n.length))}</strong>
      </button>
      <div class="filter-menu">
        <button type="button" class="filter-option clear ${n.length===0?"active":""}" data-filter="${i(e)}" data-value="">${i(y(0))}</button>
        ${o.map(s=>`<button type="button" class="filter-option ${n.includes(s)?"active":""}" data-filter="${i(e)}" data-value="${i(s)}">${i(c(e,s))}</button>`).join("")}
      </div>
    </div>
  `,l[e].querySelector("[data-filter-toggle]").addEventListener("click",s=>{s.stopPropagation();const a=s.currentTarget.closest(".filter-dropdown"),d=a.classList.contains("open");I(),a.classList.toggle("open",!d)}),l[e].querySelectorAll("[data-filter]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.value;a?r.filters[e].includes(a)?r.filters[e]=r.filters[e].filter(d=>d!==a):r.filters[e]=[...r.filters[e],a]:r.filters[e]=[],u()})})}function Q(){for(const e of["category","stage","survivor","lock"]){const t=r.filters[e],n=l[e].querySelector(".filter-trigger strong");n&&(n.textContent=y(t.length)),l[e].querySelectorAll("[data-value]").forEach(o=>{const s=o.dataset.value;o.classList.toggle("active",s?r.filters[e].includes(s):r.filters[e].length===0)})}}function W(){const e=[];for(const t of["category","stage","survivor","lock"])for(const n of r.filters[t])e.push({key:t,value:n});if(!e.length){l.activeTags.innerHTML="";return}l.activeTags.innerHTML=e.map(t=>`
    <button type="button" class="active-tag" data-remove-filter="${i(t.key)}" data-remove-value="${i(t.value)}">
      <span>${i(T(t.key))}: ${i(c(t.key,t.value))}</span>
      <strong aria-hidden="true">x</strong>
    </button>
  `).join(""),l.activeTags.querySelectorAll("[data-remove-filter]").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.removeFilter,o=t.dataset.removeValue;r.filters[n]=r.filters[n].filter(s=>s!==o),u()})})}function I(){document.querySelectorAll(".filter-dropdown.open").forEach(e=>e.classList.remove("open"))}function c(e,t){const n=e==="lock"?"status":e,o=r.data.lookups?.[n]?.[t];return o?.[r.locale]||o?.en||t}function T(e){const t={category:{en:"Category","zh-Hans":"分类"},stage:{en:"Stage","zh-Hans":"关卡"},survivor:{en:"Survivor","zh-Hans":"幸存者"},lock:{en:"Status","zh-Hans":"状态"}};return t[e]?.[r.locale]||t[e]?.en||e}function y(e){return e?r.locale==="zh-Hans"?`已选 ${e}`:`${e} selected`:r.locale==="zh-Hans"?"全部":"all"}function X(){try{const e=JSON.parse(sessionStorage.getItem(k)||"{}");return e&&typeof e=="object"?e:{}}catch{return{}}}function Y(){sessionStorage.setItem(k,JSON.stringify(r.review))}function Z(){const e=r.data.locales||[];if(e.includes(navigator.language))return navigator.language;const t=navigator.language.split("-")[0];return e.find(n=>n.split("-")[0]===t)||"en"}function w(){try{const e=JSON.parse(sessionStorage.getItem(b)||"{}");return e&&typeof e=="object"?e:{}}catch{return{}}}function ee(e){if(typeof e.selectedId=="string"&&(r.selectedId=e.selectedId),r.data.locales?.includes(e.locale)&&(r.locale=e.locale),!(!e.filters||typeof e.filters!="object")){r.filters.q=typeof e.filters.q=="string"?e.filters.q.trim().toLowerCase():"";for(const t of["category","stage","survivor","lock"])Array.isArray(e.filters[t])&&(r.filters[t]=p(e.filters[t]))}}function te(){const e=j();for(const t of["category","stage","survivor","lock"]){const n=new Set(e[t]);r.filters[t]=r.filters[t].filter(o=>n.has(o))}r.data.unlockables.some(t=>t.id===r.selectedId)||(r.selectedId=null)}function ne(){sessionStorage.setItem(b,JSON.stringify({selectedId:r.selectedId,locale:r.locale,filters:r.filters}))}function p(e){return[...new Set(e.filter(Boolean))].sort()}function re(e,t){return e.reduce((n,o)=>{const s=t(o);return n[s]=(n[s]||0)+1,n},{})}function i(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}E().catch(e=>{document.body.innerHTML=`<pre>${i(e.stack||e.message)}</pre>`});
