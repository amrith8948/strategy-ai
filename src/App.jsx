import { useState, useEffect, useRef } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Sans:ital,wght@0,400;0,500;1,400&display=swap');
:root {
  --bg:#060810; --s1:#0d1017; --s2:#141720; --s3:#1c2030;
  --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.12);
  --a1:#ff6b35; --a2:#ff3e6c; --a3:#ffb800; --a4:#00e5a0;
  --text:#eceef4; --muted:#6b7280; --muted2:#9ca3af;
}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--text);font-family:'Instrument Sans',sans-serif;min-height:100vh;}
.app{min-height:100vh;position:relative;overflow:hidden;}
.bg-orbs{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;}
.orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:0.12;animation:drift 20s ease-in-out infinite alternate;}
.orb1{width:600px;height:600px;background:var(--a1);top:-200px;right:-100px;}
.orb2{width:400px;height:400px;background:var(--a2);bottom:-100px;left:-100px;animation-delay:-7s;}
.orb3{width:300px;height:300px;background:#5b6fff;top:40%;left:30%;animation-delay:-14s;}
@keyframes drift{from{transform:translate(0,0) scale(1)}to{transform:translate(40px,30px) scale(1.1)}}
.noise{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0.03;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat:repeat;background-size:128px 128px;}
.content{position:relative;z-index:2;max-width:1000px;margin:0 auto;padding:0 24px 80px;}
.header{padding:52px 24px 0;position:relative;z-index:2;max-width:1000px;margin:0 auto;}
.header-eyebrow{display:inline-flex;align-items:center;gap:10px;background:rgba(255,107,53,0.08);border:1px solid rgba(255,107,53,0.2);color:var(--a1);padding:6px 14px;border-radius:100px;font-size:11px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:24px;}
.pulse-dot{width:7px;height:7px;border-radius:50%;background:var(--a1);animation:p 1.6s ease infinite;}
@keyframes p{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.7)}}
.header h1{font-family:'Cabinet Grotesk',sans-serif;font-size:clamp(32px,6vw,58px);font-weight:900;line-height:1.05;letter-spacing:-0.03em;color:#fff;margin-bottom:16px;}
.header h1 .gradient{background:linear-gradient(135deg,var(--a1),var(--a2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.header-sub{color:var(--muted2);font-size:15px;max-width:560px;line-height:1.75;font-style:italic;margin-bottom:44px;}
.mode-toggle{display:flex;gap:4px;background:var(--s1);border:1px solid var(--border2);border-radius:12px;padding:4px;margin-bottom:24px;}
.mode-btn{flex:1;padding:10px 16px;border:none;border-radius:8px;font-family:'Instrument Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;background:transparent;color:var(--muted);}
.mode-btn.active{background:var(--s2);color:var(--text);box-shadow:0 1px 4px rgba(0,0,0,.4);}
.mode-btn:hover:not(.active){color:var(--text);}
.setup-banner{background:linear-gradient(135deg,rgba(255,107,53,0.08),rgba(255,62,108,0.05));border:1px solid rgba(255,107,53,0.25);border-radius:14px;padding:20px 24px;margin-bottom:20px;}
.setup-banner-title{font-family:'Cabinet Grotesk',sans-serif;font-size:15px;font-weight:800;margin-bottom:6px;color:#fff;}
.setup-banner-desc{font-size:13px;color:var(--muted2);line-height:1.7;margin-bottom:14px;}
.setup-row{display:flex;gap:10px;align-items:center;}
.setup-row input{flex:1;background:var(--s2);border:1px solid var(--border2);color:var(--text);border-radius:10px;font-family:'Instrument Sans',sans-serif;font-size:13px;padding:10px 14px;outline:none;}
.setup-row input:focus{border-color:rgba(255,107,53,0.4);}
.save-key-btn{background:linear-gradient(135deg,var(--a1),var(--a2));border:none;color:#fff;padding:10px 18px;border-radius:10px;font-family:'Cabinet Grotesk',sans-serif;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .2s;}
.save-key-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(255,107,53,0.3);}
.key-saved{display:inline-flex;align-items:center;gap:6px;background:rgba(0,229,160,0.1);border:1px solid rgba(0,229,160,0.25);color:var(--a4);padding:6px 12px;border-radius:8px;font-size:12px;font-weight:500;}
.form-card{background:var(--s1);border:1px solid var(--border2);border-radius:20px;padding:32px;box-shadow:0 0 80px rgba(255,107,53,0.06);margin-bottom:24px;}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;}
@media(max-width:640px){.form-grid{grid-template-columns:1fr;}}
.field-group{display:flex;flex-direction:column;gap:6px;}
.field-group.full{grid-column:1/-1;}
label{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted2);}
input,textarea,select{background:var(--s2);border:1px solid var(--border);color:var(--text);border-radius:10px;font-family:'Instrument Sans',sans-serif;font-size:14px;padding:12px 14px;outline:none;width:100%;transition:border-color .2s,box-shadow .2s;}
input:focus,textarea:focus,select:focus{border-color:rgba(255,107,53,0.4);box-shadow:0 0 0 3px rgba(255,107,53,0.08);}
textarea{resize:vertical;min-height:80px;line-height:1.6;}
select option{background:var(--s2);}
.url-input-wrap{position:relative;}
.url-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:16px;pointer-events:none;}
.url-row{display:flex;gap:8px;align-items:center;margin-bottom:8px;}
.url-row .url-input-wrap{flex:1;}
.remove-btn{background:var(--s3);border:1px solid var(--border2);color:var(--muted);width:38px;height:38px;border-radius:8px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0;}
.remove-btn:hover{border-color:var(--a2);color:var(--a2);}
.add-url-btn{display:inline-flex;align-items:center;gap:6px;background:var(--s3);border:1px solid var(--border2);color:var(--muted2);padding:8px 14px;border-radius:8px;cursor:pointer;font-size:13px;transition:all .15s;margin-top:6px;}
.add-url-btn:hover{border-color:var(--a1);color:var(--a1);}
.scrape-btn{width:100%;padding:14px;border:1px solid rgba(0,229,160,0.3);border-radius:12px;background:rgba(0,229,160,0.06);color:var(--a4);font-family:'Cabinet Grotesk',sans-serif;font-size:15px;font-weight:800;cursor:pointer;transition:all .2s;margin-top:8px;display:flex;align-items:center;justify-content:center;gap:10px;}
.scrape-btn:hover:not(:disabled){background:rgba(0,229,160,0.12);border-color:rgba(0,229,160,0.5);transform:translateY(-1px);}
.scrape-btn:disabled{opacity:0.5;cursor:not-allowed;}
.autofill-notice{background:rgba(0,229,160,0.06);border:1px solid rgba(0,229,160,0.2);border-radius:10px;padding:12px 16px;font-size:13px;color:var(--a4);display:flex;align-items:center;gap:10px;margin-bottom:16px;}
.scraped-preview{background:var(--s2);border:1px solid rgba(0,229,160,0.2);border-radius:14px;padding:20px;margin-top:16px;margin-bottom:16px;}
.scraped-title{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--a4);font-weight:600;margin-bottom:14px;}
.profile-cards{display:flex;flex-direction:column;gap:10px;}
.profile-card{background:var(--s1);border:1px solid var(--border2);border-radius:10px;padding:14px 16px;display:flex;gap:14px;align-items:flex-start;}
.profile-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--a1),var(--a2));display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.profile-name{font-size:14px;font-weight:600;color:#fff;margin-bottom:3px;}
.profile-handle{font-size:12px;color:var(--muted);margin-bottom:6px;}
.profile-bio{font-size:12px;color:var(--muted2);line-height:1.5;}
.profile-stats{display:flex;gap:12px;margin-top:8px;}
.p-stat{font-size:12px;color:var(--muted2);}
.p-stat strong{color:var(--text);font-size:13px;}
.profile-tag{display:inline-flex;align-items:center;gap:4px;font-size:10px;padding:2px 8px;border-radius:4px;font-weight:600;margin-bottom:6px;}
.platform-chips{display:flex;gap:8px;flex-wrap:wrap;}
.platform-chip{display:inline-flex;align-items:center;gap:7px;background:var(--s2);border:1px solid var(--border);border-radius:8px;padding:8px 14px;font-size:13px;cursor:pointer;transition:all .15s;font-weight:500;}
.platform-chip.sel-ig{background:rgba(188,24,136,0.1);border-color:#bc1888;color:#f472b6;}
.platform-chip.sel-fb{background:rgba(24,119,242,0.1);border-color:#1877f2;color:#60a5fa;}
.platform-chip.sel-yt{background:rgba(255,0,0,0.1);border-color:#ff0000;color:#f87171;}
.platform-chip.sel-tk{background:rgba(0,0,0,0.3);border-color:#69c9d0;color:#69c9d0;}
.platform-chip.sel-li{background:rgba(10,102,194,0.1);border-color:#0a66c2;color:#93c5fd;}
.comp-chip{display:inline-flex;align-items:center;gap:6px;background:var(--s3);border:1px solid var(--border2);border-radius:8px;padding:6px 12px;font-size:13px;cursor:pointer;transition:all .15s;}
.comp-chip:hover{border-color:var(--a2);color:var(--a2);}
.add-comp{display:flex;gap:8px;margin-top:8px;}
.add-btn{background:var(--s3);border:1px solid var(--border2);color:var(--muted2);padding:12px 16px;border-radius:10px;cursor:pointer;font-size:18px;transition:all .15s;flex-shrink:0;}
.add-btn:hover{border-color:var(--a1);color:var(--a1);}
.gen-btn{width:100%;padding:16px;border:none;border-radius:12px;background:linear-gradient(135deg,var(--a1),var(--a2));color:#fff;font-family:'Cabinet Grotesk',sans-serif;font-size:16px;font-weight:800;cursor:pointer;transition:all .2s;margin-top:8px;}
.gen-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 30px rgba(255,107,53,0.35);}
.gen-btn:disabled{opacity:0.6;cursor:not-allowed;}
.btn-inner{display:flex;align-items:center;justify-content:center;gap:10px;}
.loading-card{background:var(--s1);border:1px solid var(--border2);border-radius:20px;padding:48px 32px;text-align:center;margin-bottom:24px;}
.loading-icon{font-size:40px;margin-bottom:20px;animation:spin 3s linear infinite;display:inline-block;}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.loading-title{font-family:'Cabinet Grotesk',sans-serif;font-size:22px;font-weight:800;margin-bottom:8px;}
.loading-steps{display:flex;flex-direction:column;gap:10px;margin-top:24px;max-width:400px;margin-left:auto;margin-right:auto;}
.loading-step{display:flex;align-items:center;gap:12px;background:var(--s2);border:1px solid var(--border);border-radius:10px;padding:10px 16px;font-size:13px;color:var(--muted2);transition:all .3s;}
.loading-step.active{border-color:var(--a1);color:var(--text);background:rgba(255,107,53,0.05);}
.loading-step.done{border-color:var(--a4);color:var(--a4);}
.results{display:flex;flex-direction:column;gap:20px;}
.result-section{background:var(--s1);border:1px solid var(--border2);border-radius:20px;overflow:hidden;animation:slideUp .4s ease both;}
@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.result-header{padding:20px 28px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;}
.result-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.result-title{font-family:'Cabinet Grotesk',sans-serif;font-size:17px;font-weight:800;}
.result-subtitle{font-size:12px;color:var(--muted);margin-top:2px;}
.result-body{padding:24px 28px;}
.score-row{display:flex;align-items:center;gap:12px;margin-bottom:12px;}
.score-label{font-size:13px;font-weight:500;width:120px;flex-shrink:0;}
.score-bar-wrap{flex:1;height:8px;background:var(--s3);border-radius:4px;overflow:hidden;}
.score-bar-fill{height:100%;border-radius:4px;transition:width 1.2s cubic-bezier(.4,0,.2,1);}
.score-val{font-size:12px;color:var(--muted2);width:36px;text-align:right;flex-shrink:0;}
.tag{font-size:12px;padding:4px 10px;border-radius:6px;font-weight:500;border:1px solid;}
.tag-orange{background:rgba(255,107,53,0.1);border-color:rgba(255,107,53,0.3);color:var(--a1);}
.tag-green{background:rgba(0,229,160,0.08);border-color:rgba(0,229,160,0.25);color:var(--a4);}
.tag-yellow{background:rgba(255,184,0,0.08);border-color:rgba(255,184,0,0.25);color:var(--a3);}
.tag-red{background:rgba(255,62,108,0.08);border-color:rgba(255,62,108,0.25);color:var(--a2);}
.tag-muted{background:var(--s3);border-color:var(--border2);color:var(--muted2);}
.strat-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
@media(max-width:580px){.strat-grid{grid-template-columns:1fr}}
.strat-cell{background:var(--s2);border:1px solid var(--border);border-radius:12px;padding:18px;}
.strat-cell-title{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;}
.strat-cell ul{padding-left:0;list-style:none;display:flex;flex-direction:column;gap:7px;}
.strat-cell li{font-size:13px;color:var(--muted2);line-height:1.6;padding-left:14px;position:relative;}
.strat-cell li::before{content:'›';position:absolute;left:0;color:var(--a1);font-weight:700;}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;}
@media(max-width:560px){.cal-grid{grid-template-columns:repeat(4,1fr)}}
.cal-day{background:var(--s2);border:1px solid var(--border);border-radius:10px;padding:10px 8px;}
.cal-day-name{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:8px;text-align:center;}
.cal-tasks{display:flex;flex-direction:column;gap:4px;}
.cal-task{font-size:10px;padding:3px 6px;border-radius:4px;line-height:1.4;text-align:center;}
.ct-reel{background:rgba(255,62,108,0.15);color:#f472b6;}
.ct-post{background:rgba(0,229,160,0.1);color:var(--a4);}
.ct-story{background:rgba(255,184,0,0.1);color:var(--a3);}
.ct-ad{background:rgba(255,107,53,0.12);color:var(--a1);}
.kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;}
@media(max-width:580px){.kpi-row{grid-template-columns:1fr 1fr}}
.kpi{background:var(--s2);border:1px solid var(--border);border-radius:12px;padding:16px;text-align:center;}
.kpi-val{font-family:'Cabinet Grotesk',sans-serif;font-size:26px;font-weight:900;}
.kpi-lbl{font-size:11px;color:var(--muted);margin-top:4px;line-height:1.4;}
.highlight-box{background:linear-gradient(135deg,rgba(255,107,53,0.06),rgba(255,62,108,0.04));border:1px solid rgba(255,107,53,0.2);border-radius:12px;padding:16px 20px;margin-bottom:16px;font-size:13px;color:var(--muted2);line-height:1.7;}
.highlight-box strong{color:var(--a1);font-weight:500;}
.comp-table{width:100%;border-collapse:collapse;}
.comp-table th{font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);padding:8px 12px;text-align:left;border-bottom:1px solid var(--border);}
.comp-table td{padding:12px;border-bottom:1px solid var(--border);font-size:13px;vertical-align:top;}
.comp-table tr:last-child td{border-bottom:none;}
.comp-table tr:hover td{background:var(--s2);}
.priority-list{display:flex;flex-direction:column;gap:10px;}
.priority-item{display:flex;align-items:flex-start;gap:14px;background:var(--s2);border:1px solid var(--border);border-radius:12px;padding:14px 16px;}
.priority-num{width:28px;height:28px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-family:'Cabinet Grotesk',sans-serif;font-size:13px;font-weight:900;background:linear-gradient(135deg,var(--a1),var(--a2));}
.priority-title{font-size:14px;font-weight:500;margin-bottom:4px;}
.priority-desc{font-size:13px;color:var(--muted2);line-height:1.6;}
.sect-divider{height:1px;background:var(--border);margin:20px 0;}
.reset-btn{background:var(--s2);border:1px solid var(--border2);color:var(--muted2);padding:12px 24px;border-radius:10px;cursor:pointer;font-family:'Instrument Sans',sans-serif;font-size:14px;transition:all .15s;margin-top:8px;}
.reset-btn:hover{border-color:var(--a1);color:var(--a1);}
.err-box{background:rgba(255,62,108,0.08);border:1px solid rgba(255,62,108,0.25);border-radius:10px;padding:12px 16px;font-size:13px;color:var(--a2);margin-bottom:12px;}
.brief-upload{background:linear-gradient(135deg,rgba(91,111,255,0.08),rgba(91,111,255,0.04));border:2px dashed rgba(91,111,255,0.3);border-radius:14px;padding:20px 24px;margin-bottom:20px;transition:all .2s;}
.brief-upload:hover{border-color:rgba(91,111,255,0.5);background:linear-gradient(135deg,rgba(91,111,255,0.12),rgba(91,111,255,0.06));}
.brief-upload-title{font-family:"Cabinet Grotesk",sans-serif;font-size:15px;font-weight:800;color:#fff;margin-bottom:6px;}
.brief-upload-desc{font-size:13px;color:var(--muted2);margin-bottom:14px;line-height:1.6;}
.brief-textarea{background:var(--s2);border:1px solid var(--border2);color:var(--text);border-radius:10px;font-family:"Instrument Sans",sans-serif;font-size:13px;padding:12px 14px;outline:none;width:100%;resize:vertical;min-height:120px;line-height:1.6;transition:border-color .2s;}
.brief-textarea:focus{border-color:rgba(91,111,255,0.5);box-shadow:0 0 0 3px rgba(91,111,255,0.08);}
.parse-btn{background:linear-gradient(135deg,#5b6fff,#a78bfa);border:none;color:#fff;padding:10px 18px;border-radius:10px;font-family:"Cabinet Grotesk",sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;margin-top:10px;display:inline-flex;align-items:center;gap:8px;}
.parse-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(91,111,255,0.3);}
.parse-btn:disabled{opacity:0.5;cursor:not-allowed;}
.brief-parsed{background:rgba(0,229,160,0.06);border:1px solid rgba(0,229,160,0.2);border-radius:10px;padding:10px 14px;font-size:13px;color:var(--a4);display:flex;align-items:center;gap:8px;margin-top:10px;}
.pdf-upload-btn{display:inline-flex;align-items:center;gap:7px;background:var(--s2);border:1px solid var(--border2);color:var(--muted2);padding:9px 16px;border-radius:10px;cursor:pointer;font-size:13px;font-family:"Instrument Sans",sans-serif;transition:all .15s;}
.pdf-upload-btn:hover{border-color:rgba(91,111,255,0.5);color:#a78bfa;}
.pdf-name{display:inline-flex;align-items:center;gap:6px;background:rgba(91,111,255,0.1);border:1px solid rgba(91,111,255,0.25);color:#a78bfa;padding:5px 10px;border-radius:7px;font-size:12px;}
.upload-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px;}
.age-row{display:flex;gap:10px;align-items:center;}
.age-row input{text-align:center;}
.age-sep{font-size:13px;color:var(--muted);flex-shrink:0;}
.section-label{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--a1);margin-bottom:12px;margin-top:4px;display:flex;align-items:center;gap:8px;}
.find-comp-btn{background:linear-gradient(135deg,rgba(91,111,255,0.15),rgba(167,139,250,0.15));border:1px solid rgba(91,111,255,0.35);color:#a78bfa;padding:9px 16px;border-radius:10px;cursor:pointer;font-size:13px;font-family:"Cabinet Grotesk",sans-serif;font-weight:700;transition:all .2s;display:inline-flex;align-items:center;gap:8px;}
.find-comp-btn:hover:not(:disabled){background:linear-gradient(135deg,rgba(91,111,255,0.25),rgba(167,139,250,0.25));transform:translateY(-1px);}
.find-comp-btn:disabled{opacity:0.5;cursor:not-allowed;}
.comp-suggestions{display:flex;flex-direction:column;gap:8px;margin-top:12px;}
.comp-suggestion{background:var(--s2);border:1px solid var(--border2);border-radius:10px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:12px;transition:border-color .2s;}
.comp-suggestion:hover{border-color:rgba(91,111,255,0.4);}
.comp-sug-left{display:flex;align-items:center;gap:10px;}
.comp-sug-handle{font-weight:700;font-size:13px;color:#fff;}
.comp-sug-reason{font-size:12px;color:var(--muted2);margin-top:2px;}
.comp-sug-link{font-size:11px;color:#5b6fff;text-decoration:none;}
.comp-sug-link:hover{text-decoration:underline;}
.comp-sug-remove{background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;padding:0 4px;}
.comp-sug-remove:hover{color:var(--a2);}
.comp-confirmed{background:rgba(0,229,160,0.06);border:1px solid rgba(0,229,160,0.2);border-radius:10px;padding:10px 14px;font-size:13px;color:var(--a4);display:flex;align-items:center;gap:8px;margin-top:8px;}
.section-label::after{content:"";flex:1;height:1px;background:rgba(255,107,53,0.15);}
.content-tabs{display:flex;gap:4px;background:var(--s2);border:1px solid var(--border);border-radius:10px;padding:4px;margin-bottom:20px;overflow-x:auto;}
.content-tab{flex:1;padding:8px 12px;border:none;border-radius:7px;font-family:"Instrument Sans",sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;background:transparent;color:var(--muted);white-space:nowrap;}
.content-tab.active{background:var(--s1);color:var(--text);box-shadow:0 1px 4px rgba(0,0,0,.4);}
.content-tab:hover:not(.active){color:var(--text);}
.script-card{background:var(--s2);border:1px solid var(--border2);border-radius:14px;padding:20px;margin-bottom:14px;}
.script-label{font-size:10px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;margin-bottom:10px;display:flex;align-items:center;gap:8px;}
.script-title{font-family:"Cabinet Grotesk",sans-serif;font-size:16px;font-weight:800;color:#fff;margin-bottom:10px;}
.script-body{font-size:13px;color:var(--muted2);line-height:1.8;white-space:pre-wrap;}
.script-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;}
.copy-btn{display:inline-flex;align-items:center;gap:6px;background:var(--s3);border:1px solid var(--border2);color:var(--muted2);padding:6px 12px;border-radius:7px;cursor:pointer;font-size:12px;transition:all .15s;font-family:"Instrument Sans",sans-serif;}
.copy-btn:hover{border-color:var(--a4);color:var(--a4);}
.copy-btn.copied{border-color:var(--a4);color:var(--a4);background:rgba(0,229,160,0.08);}
.gen-content-btn{width:100%;padding:14px;border:1px solid rgba(91,111,255,0.4);border-radius:12px;background:rgba(91,111,255,0.08);color:#a78bfa;font-family:"Cabinet Grotesk",sans-serif;font-size:15px;font-weight:800;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:10px;margin-top:4px;}
.gen-content-btn:hover:not(:disabled){background:rgba(91,111,255,0.14);transform:translateY(-1px);}
.gen-content-btn:disabled{opacity:0.5;cursor:not-allowed;}

/* ── DELIVERABLES PLANNER ── */
.deliv-wrap{background:linear-gradient(135deg,rgba(255,184,0,0.07),rgba(255,107,53,0.04));border:1px solid rgba(255,184,0,0.22);border-radius:20px;padding:28px 32px;margin-bottom:24px;}
.deliv-head{font-family:'Cabinet Grotesk',sans-serif;font-size:16px;font-weight:800;color:#fff;margin-bottom:4px;}
.deliv-sub{font-size:13px;color:var(--muted2);margin-bottom:20px;line-height:1.6;}
.deliv-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px;}
@media(max-width:640px){.deliv-grid{grid-template-columns:1fr 1fr;}}
.deliv-card{background:var(--s1);border:1px solid var(--border2);border-radius:12px;padding:14px 14px 10px;}
.deliv-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
.deliv-card-label{font-size:12px;font-weight:600;color:var(--text);display:flex;align-items:center;gap:6px;}
.deliv-card-note{font-size:10px;color:var(--muted);margin-top:2px;line-height:1.3;}
.dcounter{display:flex;align-items:center;gap:5px;}
.dcounter-btn{width:26px;height:26px;border-radius:6px;border:1px solid var(--border2);background:var(--s2);color:var(--muted2);font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0;line-height:1;}
.dcounter-btn:hover{border-color:var(--a3);color:var(--a3);}
.dcounter-val{font-family:'Cabinet Grotesk',sans-serif;font-size:20px;font-weight:900;color:var(--text);min-width:22px;text-align:center;}
.deliv-custom-row{display:flex;gap:8px;margin-top:2px;}
.deliv-custom-row input{flex:1;font-size:13px;padding:9px 12px;}
.deliv-scope{background:var(--s2);border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin-top:14px;}
.deliv-scope-title{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--a3);font-weight:700;margin-bottom:10px;}
.deliv-scope-tags{display:flex;flex-wrap:wrap;gap:6px;}
.dtag{display:inline-flex;align-items:center;gap:4px;background:rgba(255,184,0,0.09);border:1px solid rgba(255,184,0,0.22);color:var(--a3);padding:4px 10px;border-radius:6px;font-size:12px;font-weight:500;}
.dtag-off{opacity:0.25;filter:grayscale(1);}

/* ── EXPORT BAR ── */
.export-bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;background:var(--s1);border:1px solid var(--border2);border-radius:16px;padding:18px 24px;margin-bottom:16px;}
.export-bar-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--muted2);flex-shrink:0;}
.export-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:10px;font-family:'Cabinet Grotesk',sans-serif;font-size:14px;font-weight:800;cursor:pointer;transition:all .2s;border:none;white-space:nowrap;}
.ebtn-pdf{background:linear-gradient(135deg,#e03e3e,#b02020);color:#fff;}
.ebtn-pdf:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(224,62,62,0.35);}
.ebtn-word{background:linear-gradient(135deg,#1a73e8,#0d55c0);color:#fff;}
.ebtn-word:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(26,115,232,0.35);}
.export-btn:disabled{opacity:0.55;cursor:not-allowed;}
`;

const PLATFORMS = [
  {id:"instagram",label:"Instagram",emoji:"📸"},
  {id:"facebook",label:"Facebook",emoji:"👤"},
  {id:"youtube",label:"YouTube",emoji:"▶️"},
  {id:"tiktok",label:"TikTok",emoji:"🎵"},
  {id:"linkedin",label:"LinkedIn",emoji:"💼"},
];
const INDUSTRIES = ["Real Estate","Education / EdTech","Healthcare / Clinic","E-commerce / Retail","Food & Restaurant","Fashion / Apparel","Finance / BFSI","Travel & Tourism","Fitness / Wellness","Software / SaaS","Automobile","Interior Design","Other"];
const platformColor = {instagram:"#bc1888",facebook:"#1877f2",youtube:"#ff0000",tiktok:"#69c9d0",linkedin:"#0a66c2"};
const platformSelClass = {instagram:"sel-ig",facebook:"sel-fb",youtube:"sel-yt",tiktok:"sel-tk",linkedin:"sel-li"};
const taskClass = {reel:"ct-reel",post:"ct-post",story:"ct-story",ad:"ct-ad"};

const DELIVERABLE_TYPES = [
  {id:"reels",       emoji:"🎬", label:"Reels",         note:"Short-form video scripts"},
  {id:"statics",     emoji:"🖼", label:"Static Posts",  note:"Feed images / graphics"},
  {id:"carousels",   emoji:"📑", label:"Carousels",     note:"Multi-slide swipe posts"},
  {id:"stories",     emoji:"💫", label:"Stories",       note:"24hr story frames"},
  {id:"adCreatives", emoji:"💰", label:"Ad Creatives",  note:"Paid ads (Meta / Google)"},
  {id:"whatsapp",    emoji:"💬", label:"WhatsApp Msgs", note:"Broadcast / follow-up"},
];

const SCRAPE_STEPS = [
  {icon:"🔗",label:"Connecting to Instagram via Apify…"},
  {icon:"📥",label:"Scraping client profile & posts…"},
  {icon:"📊",label:"Scraping competitor profiles…"},
  {icon:"🧠",label:"AI analysing patterns & gaps…"},
  {icon:"🎯",label:"Generating maximum-output strategy…"},
];
const MANUAL_STEPS = [
  {icon:"🔍",label:"Analysing client objectives & niche…"},
  {icon:"📊",label:"Scanning competitor strategies…"},
  {icon:"🎬",label:"Identifying top content patterns…"},
  {icon:"🧠",label:"Running platform comparison…"},
  {icon:"🎯",label:"Generating maximum-output strategy…"},
];

function CopyBtn({ text, label }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button className={"copy-btn " + (copied ? "copied" : "")} onClick={handleCopy}>
      {copied ? "✅ Copied!" : "📋 " + label}
    </button>
  );
}

export default function App() {
  const [mode, setMode] = useState("url");
  const [apifyKey, setApifyKey] = useState(() => localStorage.getItem("apify_key") || "");
  const [apifyInput, setApifyInput] = useState("");
  const [anthropicKey, setAnthropicKey] = useState(() => localStorage.getItem("anthropic_key") || "");
  const [anthropicInput, setAnthropicInput] = useState("");
  const [keySaved, setKeySaved] = useState({apify:!!localStorage.getItem("apify_key"),anthropic:!!localStorage.getItem("anthropic_key")});
  const [clientUrl, setClientUrl] = useState("");
  const [competitorUrls, setCompetitorUrls] = useState(["",""]);
  const [suggestedCompetitors, setSuggestedCompetitors] = useState([]);
  const [findingCompetitors, setFindingCompetitors] = useState(false);
  const [competitorsConfirmed, setCompetitorsConfirmed] = useState(false);
  const [scrapedData, setScrapedData] = useState(null);
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState("");
  const [form, setForm] = useState({
    clientName:"", industry:"Real Estate", objective:"", usp:"",
    ageMin:"16", ageMax:"45", gender:"All", location:"", incomeLevel:"", educationLevel:"",
    budget:"", currentPlatforms:["instagram","facebook"], competitors:[], compInput:""
  });
  const [briefText, setBriefText] = useState("");
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefParsed, setBriefParsed] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const pdfInputRef = useRef(null);
  const [phase, setPhase] = useState("input");
  const [loadStep, setLoadStep] = useState(0);
  const [result, setResult] = useState(null);
  const [contentKit, setContentKit] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentTab, setContentTab] = useState("reels");
  const resultsRef = useRef(null);

  // Deliverables planner
  const [deliverables, setDeliverables] = useState(() => Object.fromEntries(DELIVERABLE_TYPES.map(d=>[d.id,0])));
  const [delivCustomInput, setDelivCustomInput] = useState("");
  const [delivCustomItems, setDelivCustomItems] = useState([]);

  // Export
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingWord, setExportingWord] = useState(false);

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = css;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  useEffect(() => {
    if (phase === "results" && resultsRef.current)
      setTimeout(() => resultsRef.current.scrollIntoView({behavior:"smooth",block:"start"}), 100);
  }, [phase]);

  function saveApifyKey() { localStorage.setItem("apify_key", apifyInput); setApifyKey(apifyInput); setKeySaved(k=>({...k,apify:true})); }
  function saveAnthropicKey() { localStorage.setItem("anthropic_key", anthropicInput); setAnthropicKey(anthropicInput); setKeySaved(k=>({...k,anthropic:true})); }
  function togglePlatform(id) { setForm(f=>({...f,currentPlatforms:f.currentPlatforms.includes(id)?f.currentPlatforms.filter(p=>p!==id):[...f.currentPlatforms,id]})); }
  function addComp() { const v=form.compInput.trim(); if(v&&!form.competitors.includes(v)) setForm(f=>({...f,competitors:[...f.competitors,v],compInput:""})); }
  function removeComp(c) { setForm(f=>({...f,competitors:f.competitors.filter(x=>x!==c)})); }

  // ── Deliverables helpers ──
  function setDeliv(id,val){ setDeliverables(d=>({...d,[id]:Math.max(0,Math.min(20,val))})); }
  function addCustomDeliv(){
    const v=delivCustomInput.trim();
    if(v){ setDelivCustomItems(a=>[...a,{label:v,qty:1}]); setDelivCustomInput(""); }
  }
  function setCustomQty(i,val){ setDelivCustomItems(a=>a.map((x,j)=>j===i?{...x,qty:Math.max(0,val)}:x)); }
  function removeCustomDeliv(i){ setDelivCustomItems(a=>a.filter((_,j)=>j!==i)); }
  function getClientName(){ return form.clientName||scrapedData?.[0]?.fullName||"Client"; }
  function getDelivSummaryText(){
    const parts=[];
    DELIVERABLE_TYPES.forEach(d=>{ if(deliverables[d.id]>0) parts.push(`${deliverables[d.id]}x ${d.label}`); });
    delivCustomItems.forEach(c=>{ if(c.qty>0) parts.push(`${c.qty}x ${c.label}`); });
    return parts.length ? parts.join(" · ") : null;
  }

  // ── Build flat lines for PDF/Word export ──
  function buildReportLines(){
    const r=result;
    const lines=[];
    const add=(text,style)=>lines.push({text,style});
    add("COMPETITOR ANALYSIS & STRATEGY REPORT","title");
    add(`Client: ${getClientName()}  ·  ${new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}`,"meta");
    add("","gap");
    const delivSummary=getDelivSummaryText();
    if(delivSummary){
      add("CLIENT DELIVERABLES — THIS MONTH","heading");
      add(delivSummary,"body");
      delivCustomItems.filter(c=>c.qty>0).forEach(c=>add(`  + ${c.qty}x ${c.label}`,"body"));
      add("","gap");
    }
    if(r.inferredObjective){
      add("AI-INFERRED PROFILE ANALYSIS","heading");
      add(`Detected Objective: ${r.inferredObjective}`,"body");
      add(`Detected Industry: ${r.inferredIndustry}`,"body");
      add(`Target Audience: ${r.inferredAudience}`,"body");
      add("","gap");
    }
    add("STRATEGIC OVERVIEW","heading");
    add(`Strategy Score: ${r.objectiveScore}/100`,"subheading");
    add(r.overview||"","body");
    add("","gap");
    add("Key Performance Targets:","label");
    add(`  • Expected CPL Reduction: ${r.kpis?.expectedCPLDrop}`,"body");
    add(`  • Content Output Multiplier: ${r.kpis?.contentOutputMultiplier}`,"body");
    add(`  • Lead Response Target: ${r.kpis?.leadResponseTime}`,"body");
    add(`  • Projected Conversion Lift: ${r.kpis?.projectedConversionLift}`,"body");
    add("","gap");
    if(r.competitorPatterns?.length){
      add("COMPETITOR PATTERN ANALYSIS","heading");
      r.competitorPatterns.forEach(c=>{
        add(c.name,"subheading");
        add(`  Style: ${c.contentStyle}`,"body");
        add(`  Strength: ${c.strength}`,"body");
        add(`  Gap to Exploit: ${c.weakness}`,"body");
        add(`  Ad Pattern: ${c.adPattern}`,"body");
      });
      add("","gap");
    }
    add("WINNING CONTENT PATTERNS","heading");
    add("Top Formats:","label");
    r.contentPatterns?.topFormats?.forEach(f=>add(`  • ${f}`,"body"));
    add("Best Hooks:","label");
    r.contentPatterns?.bestHooks?.forEach(h=>add(`  • ${h}`,"body"));
    add("Viral Triggers:","label");
    r.contentPatterns?.viralTriggers?.forEach(t=>add(`  • ${t}`,"body"));
    add(`Posting Frequency: ${r.contentPatterns?.postingFrequency}`,"body");
    add(`Best Times: ${r.contentPatterns?.bestTimes}`,"body");
    add("","gap");
    add("PLATFORM STRATEGY","heading");
    add(`Primary: ${r.platformStrategy?.primary}`,"subheading");
    add(r.platformStrategy?.primaryReason||"","body");
    add(`Secondary: ${r.platformStrategy?.secondary}`,"subheading");
    add(r.platformStrategy?.secondaryReason||"","body");
    add(`Deprioritise: ${r.platformStrategy?.avoid}`,"subheading");
    add(r.platformStrategy?.avoidReason||"","body");
    add("","gap");
    add("4-PILLAR CAMPAIGN STRATEGY","heading");
    ["awareness","engagement","conversion","retention"].forEach(p=>{
      add(`${p.charAt(0).toUpperCase()+p.slice(1)}:`,"label");
      r.strategyPillars?.[p]?.forEach(item=>add(`  • ${item}`,"body"));
    });
    add("","gap");
    add("TOP PRIORITIES — RANKED BY IMPACT","heading");
    r.topPriorities?.forEach((p,i)=>{
      add(`${i+1}. ${p.title} [${p.impact} Impact]`,"subheading");
      add(`   ${p.desc}`,"body");
    });
    add("","gap");
    add("WEEKLY CONTENT CALENDAR","heading");
    r.weeklyCalendar?.forEach(day=>add(`  ${day.day}: ${day.tasks?.map(t=>t.label).join(", ")}`,"body"));
    add("","gap");
    add("BUDGET ALLOCATION & QUICK WINS","heading");
    if(r.budgetAllocation){
      add("Budget Split:","label");
      Object.entries(r.budgetAllocation).forEach(([k,v])=>add(`  • ${k.charAt(0).toUpperCase()+k.slice(1)}: ${v}%`,"body"));
    }
    add("","gap");
    add("Do These This Week:","label");
    r.quickWins?.forEach((w,i)=>add(`  ${i+1}. ${w}`,"body"));
    if(contentKit){
      add("","gap");
      add("CONTENT & SCRIPT KIT","heading");
      contentKit.reels?.forEach((reel,i)=>{
        add(`Reel ${i+1}: ${reel.title}`,"subheading");
        add(`Hook: ${reel.hook}`,"label");
        add(reel.script||"","body");
        add(`CTA: ${reel.cta}`,"body");
        add(`Hashtags: ${reel.hashtags}`,"body");
        add("","gap");
      });
      contentKit.carousels?.forEach((c,i)=>{
        add(`Carousel ${i+1}: ${c.title}`,"subheading");
        add(`Hook: ${c.hook}`,"label");
        c.slides?.forEach((s,j)=>add(`  Slide ${j+1}: ${s}`,"body"));
        add(`Caption: ${c.caption}`,"body");
        add("","gap");
      });
      contentKit.adCopies?.forEach((a,i)=>{
        add(`Ad ${i+1}: ${a.headline} [${a.format}]`,"subheading");
        add(a.primaryText||"","body");
        add(`CTA: ${a.cta}  ·  Target: ${a.targetingNote}`,"body");
        add("","gap");
      });
      contentKit.captions?.forEach(c=>{
        add(`${c.type} Caption`,"subheading");
        add(`Best for: ${c.bestFor}`,"label");
        add(c.caption||"","body");
        add("","gap");
      });
      contentKit.whatsappMessages?.forEach(w=>{
        add(`WhatsApp — ${w.type}`,"subheading");
        add(w.message||"","body");
        add("","gap");
      });
    }
    return lines;
  }

  // ── PDF Export ──
  async function exportToPDF(){
    setExportingPdf(true);
    try{
      if(!window.jspdf){
        await new Promise((res,rej)=>{
          const s=document.createElement("script");
          s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          s.onload=res; s.onerror=rej; document.head.appendChild(s);
        });
      }
      const {jsPDF}=window.jspdf;
      const doc=new jsPDF({unit:"mm",format:"a4"});
      const pageW=210,margin=18,contentW=pageW-margin*2;
      let y=margin;
      const ORANGE=[255,107,53],DARK=[14,16,23],WHITE=[255,255,255],MUTED=[108,117,128],LINE=[40,44,58];
      function checkPage(n=10){if(y+n>282){doc.addPage();y=margin;}}
      function secHeading(text){
        checkPage(14);
        doc.setFillColor(...ORANGE);doc.roundedRect(margin,y,contentW,9,2,2,"F");
        doc.setTextColor(...WHITE);doc.setFont("helvetica","bold");doc.setFontSize(9);
        doc.text(text,margin+4,y+6.2);y+=14;
      }
      function subHead(text){
        checkPage(10);if(!text)return;
        doc.setTextColor(...ORANGE);doc.setFont("helvetica","bold");doc.setFontSize(10);
        doc.text(String(text),margin,y);y+=6;
      }
      function lbl(text){
        checkPage(8);if(!text)return;
        doc.setTextColor(180,100,30);doc.setFont("helvetica","bolditalic");doc.setFontSize(9);
        doc.text(String(text),margin,y);y+=5;
      }
      function body(text){
        if(!text)return;
        doc.setTextColor(55,60,78);doc.setFont("helvetica","normal");doc.setFontSize(9.5);
        doc.splitTextToSize(String(text),contentW).forEach(line=>{checkPage(5.5);doc.text(line,margin,y);y+=5;});
      }
      function divider(){checkPage(5);doc.setDrawColor(...LINE);doc.setLineWidth(0.25);doc.line(margin,y,pageW-margin,y);y+=4;}
      // Header block
      doc.setFillColor(...DARK);doc.rect(0,0,pageW,46,"F");
      doc.setFillColor(...ORANGE);doc.rect(0,0,5,46,"F");
      doc.setTextColor(...WHITE);doc.setFont("helvetica","bold");doc.setFontSize(17);
      doc.text("COMPETITOR ANALYSIS & STRATEGY",margin+2,17);
      doc.setFontSize(9.5);doc.setFont("helvetica","normal");doc.setTextColor(...MUTED);
      doc.text(`Client: ${getClientName()}   ·   ${new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}`,margin+2,27);
      const ds=getDelivSummaryText();
      if(ds){doc.setTextColor(255,184,0);doc.setFontSize(8.5);doc.text(`📦 ${ds}`,margin+2,37);}
      y=56;
      buildReportLines().forEach(({text,style})=>{
        if(!text&&style==="gap"){y+=3;return;}
        if(style==="title"||style==="meta")return;
        if(style==="heading"){divider();secHeading(text);}
        else if(style==="subheading")subHead(text);
        else if(style==="label")lbl(text);
        else body(text);
      });
      const total=doc.internal.getNumberOfPages();
      for(let i=1;i<=total;i++){
        doc.setPage(i);
        doc.setFillColor(...DARK);doc.rect(0,289,pageW,8,"F");
        doc.setTextColor(...MUTED);doc.setFontSize(7);doc.setFont("helvetica","normal");
        doc.text(`AI Strategy Report · ${getClientName()}`,margin,294);
        doc.text(`Page ${i} of ${total}`,pageW-margin,294,{align:"right"});
      }
      doc.save(`Strategy-${getClientName().replace(/\s+/g,"-")}.pdf`);
    }catch(e){console.error(e);alert("PDF export failed: "+e.message);}
    finally{setExportingPdf(false);}
  }

  // ── Word Export ──
  async function exportToWord(){
    setExportingWord(true);
    try{
      if(!window.docx){
        await new Promise((res,rej)=>{
          const s=document.createElement("script");
          s.src="https://unpkg.com/docx@8.5.0/build/index.js";
          s.onload=res;s.onerror=rej;document.head.appendChild(s);
        });
      }
      const {Document,Packer,Paragraph,TextRun,ShadingType}=window.docx;
      const clientName=getClientName();
      const children=[];
      const P=(runs,spacing={before:40,after:40},shading)=>{
        const cfg={children:runs,spacing};
        if(shading)cfg.shading=shading;
        return new Paragraph(cfg);
      };
      const T=(text,opts={})=>new TextRun({text:String(text||""),font:"Arial",...opts});
      children.push(P([T("COMPETITOR ANALYSIS & STRATEGY REPORT",{bold:true,size:36,color:"FFFFFF"})],{before:0,after:80},{type:ShadingType.CLEAR,fill:"0D1017"}));
      children.push(P([T(`Client: ${clientName}   ·   ${new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}`,{size:19,color:"9CA3AF"})],{before:0,after:80},{type:ShadingType.CLEAR,fill:"0D1017"}));
      const ds=getDelivSummaryText();
      children.push(P([T(ds?`📦 Deliverables: ${ds}`:"",{size:18,color:"FFB800",bold:!!ds})],{before:0,after:360}));
      buildReportLines().forEach(({text,style})=>{
        if(style==="title"||style==="meta")return;
        if(style==="gap"){children.push(P([T("")],{before:60,after:60}));return;}
        if(style==="heading"){
          children.push(P([T(text||"",{bold:true,size:21,color:"FFFFFF"})],{before:280,after:140},{type:ShadingType.CLEAR,fill:"FF6B35"}));
        }else if(style==="subheading"){
          children.push(P([T(text||"",{bold:true,size:20,color:"FF6B35"})],{before:140,after:60}));
        }else if(style==="label"){
          children.push(P([T(text||"",{bold:true,italics:true,size:18,color:"CC5500"})],{before:100,after:40}));
        }else{
          String(text||"").split("\n").forEach(line=>{
            children.push(P([T(line,{size:18,color:"3C4150"})],{before:30,after:30}));
          });
        }
      });
      const doc=new Document({sections:[{properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440}}},children}]});
      const blob=await Packer.toBlob(doc);
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");a.href=url;a.download=`Strategy-${clientName.replace(/\s+/g,"-")}.docx`;a.click();
      URL.revokeObjectURL(url);
    }catch(e){console.error(e);alert("Word export failed: "+e.message);}
    finally{setExportingWord(false);}
  }

  async function handlePdfUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("pdf") && !file.name.endsWith(".pdf")) {
      alert("Please upload a PDF file.");
      return;
    }
    setPdfLoading(true);
    try {
      // Load PDF.js from CDN dynamically
      if (!window.pdfjsLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      }

      // Read file as ArrayBuffer
      const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });

      // Parse PDF with PDF.js
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        fullText += pageText + "\n\n";
      }

      if (fullText.trim()) {
        setBriefText(fullText.trim());
        setBriefParsed(false);
      } else {
        alert("Could not extract text. This PDF may be image-based (scanned). Try copy-pasting the text manually.");
      }
    } catch(err) {
      console.error(err);
      alert("PDF reading failed: " + err.message);
    } finally {
      setPdfLoading(false);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
    }
  }

  async function parseBrief() {
    if (!briefText.trim()) return;
    setBriefLoading(true);
    setBriefParsed(false);
    try {
      const res = await fetch("/api/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: "You are a data extraction assistant. Extract structured information from a client brief document. Respond ONLY with valid JSON, no preamble, no backticks.",
          messages: [{ role: "user", content: `Extract all available info from this client brief and return JSON:
{
  "clientName": "institute or brand name",
  "industry": "one of: Real Estate / Education / EdTech / Healthcare / Clinic / E-commerce / Retail / Food & Restaurant / Fashion / Apparel / Finance / BFSI / Travel & Tourism / Fitness / Wellness / Software / SaaS / Automobile / Interior Design / Other",
  "objective": "main marketing goal inferred from the brief",
  "usp": "key differentiators and unique selling points (combine all into one paragraph)",
  "ageMin": "minimum age number only",
  "ageMax": "maximum age number only",
  "gender": "All or Male or Female",
  "location": "target geography",
  "incomeLevel": "income or economic segment if mentioned",
  "educationLevel": "education level of target audience",
  "budget": "ad budget if mentioned, else empty string",
  "competitors": ["competitor1", "competitor2"],
  "keyStats": "important numbers like placement rate, pass rate, salary packages etc as a single string"
}

Brief:
${briefText}` }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/\`\`\`json|\`\`\`/g, "").trim());
      setForm(f => ({
        ...f,
        clientName: parsed.clientName || f.clientName,
        industry: parsed.industry || f.industry,
        objective: parsed.objective || f.objective,
        usp: parsed.usp || f.usp,
        ageMin: parsed.ageMin || f.ageMin,
        ageMax: parsed.ageMax || f.ageMax,
        gender: parsed.gender || f.gender,
        location: parsed.location || f.location,
        incomeLevel: parsed.incomeLevel || f.incomeLevel,
        educationLevel: parsed.educationLevel || f.educationLevel,
        budget: parsed.budget || f.budget,
        competitors: parsed.competitors?.length ? parsed.competitors : f.competitors,
      }));
      if (parsed.keyStats) setBriefText(prev => prev + "\n\nKEY STATS: " + parsed.keyStats);
      setBriefParsed(true);
    } catch(e) {
      console.error(e);
      alert("Could not parse brief. Please check your Anthropic key.");
    } finally {
      setBriefLoading(false);
    }
  }

  async function findCompetitors() {
    if (!anthropicKey) { setScrapeError("Save your Anthropic key first."); return; }
    if (!clientUrl.trim()) { setScrapeError("Enter your client's Instagram URL first."); return; }
    setFindingCompetitors(true);
    setScrapeError("");
    setCompetitorsConfirmed(false);
    // Extract username from URL
    const cleanUrl = clientUrl.split("?")[0].split("#")[0].replace(/\/$/, "");
    const username = cleanUrl.split("/").pop().replace("@", "").toLowerCase().trim();
    try {
      const res = await fetch("/api/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [{ role: "user", content:
            `You are a social media research expert. Find the top 3 Instagram competitor accounts for this client.

CLIENT INSTAGRAM: @${username}
INDUSTRY: ${form.industry}
LOCATION: ${form.location || "Kerala, India"}
CLIENT BRIEF: ${briefText ? briefText.slice(0, 600) : "not provided"}

Task: Identify the 3 most relevant Instagram competitor accounts in the same industry and region. These should be real, active Instagram accounts that compete for the same target audience.

Return ONLY a JSON array, no explanation, no backticks:
[
  {"handle":"instagramusername1","name":"Brand Name 1","reason":"why they are a competitor"},
  {"handle":"instagramusername2","name":"Brand Name 2","reason":"why they are a competitor"},
  {"handle":"instagramusername3","name":"Brand Name 3","reason":"why they are a competitor"}
]

Rules:
- Return only real Instagram handles (no @ symbol, just the username)
- Prefer accounts with 5k–500k followers in the same niche
- For education in Kerala: think of institutes like xylem, brilliantpala, entri, topper, unacademy etc
- For real estate in Kerala: think of local builders/agents with active Instagram presence
- Match the geography (${form.location || "Kerala"}) as closely as possible`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const jsonStart = text.indexOf("[");
      const jsonEnd = text.lastIndexOf("]");
      if (jsonStart === -1) throw new Error("Could not find competitors. Try adding them manually.");
      const suggestions = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
      setSuggestedCompetitors(suggestions);
      // Pre-fill competitor URLs with suggestions
      setCompetitorUrls(suggestions.map(s => "https://instagram.com/" + s.handle));
    } catch(e) {
      setScrapeError("Could not auto-find competitors: " + e.message);
    } finally {
      setFindingCompetitors(false);
    }
  }

  async function scrapeProfiles() {
    if (!apifyKey) { setScrapeError("Save your Apify API key first."); return; }
    if (!clientUrl.trim()) { setScrapeError("Enter your client's Instagram URL."); return; }
    setScraping(true); setScrapeError(""); setScrapedData(null);
    const urls = [clientUrl,...competitorUrls].filter(u=>u.trim());
    const usernames = urls.map(u => {
      const clean = u.split('?')[0].split('#')[0].replace(/\/$/, '');
      return clean.split('/').pop().replace('@', '').toLowerCase().trim();
    });
    try {
      const runRes = await fetch(`https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs?token=${apifyKey}`,{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({usernames, resultsType:"details", resultsLimit:1})
      });
      if (!runRes.ok) { const e=await runRes.json(); throw new Error(e.error?.message||"Apify run failed. Check your API key."); }
      const runData = await runRes.json();
      const runId = runData.data?.id;
      if (!runId) throw new Error("Could not start Apify run.");
      let status="RUNNING", attempts=0;
      while(status==="RUNNING"||status==="READY") {
        await new Promise(r=>setTimeout(r,3000));
        if(++attempts>30) throw new Error("Scraping timed out. Try again.");
        const s=await (await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${apifyKey}`)).json();
        status=s.data?.status;
      }
      if(status!=="SUCCEEDED") throw new Error(`Scraping failed: ${status}`);
      const datasetId=runData.data?.defaultDatasetId;
      const profiles=await (await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${apifyKey}`)).json();
      if(!profiles||profiles.length===0) throw new Error("No profile data returned. Check the URLs.");

      // Map profiles by username to preserve correct client/competitor order
      const profileByUsername = {};
      profiles.forEach(p => {
        if (p.username) profileByUsername[p.username.toLowerCase()] = p;
      });

      const mapped = usernames.map((uname, i) => {
        const p = profileByUsername[uname] || profiles[i] || {};
        return {
          isClient: i === 0,
          username: p.username || uname,
          fullName: p.fullName || p.username || uname,
          bio: p.biography || "",
          followers: p.followersCount || 0,
          posts: p.postsCount || 0,
          recentPosts: (p.latestPosts || []).slice(0, 5).map(x => ({
            caption: x.caption || "",
            likes: x.likesCount || 0,
            type: x.type || "image",
            hashtags: (x.hashtags || []).slice(0, 5)
          }))
        };
      });

      setScrapedData(mapped);
      setForm(f=>({...f,clientName:mapped[0].fullName||mapped[0].username,competitors:mapped.slice(1).map(c=>c.username)}));
    } catch(e) { setScrapeError(e.message||"Scraping failed."); }
    finally { setScraping(false); }
  }

  async function handleGenerate() {
    const canGo = mode==="url" ? scrapedData : form.objective.trim();
    if(!canGo) return;
    setPhase("loading"); setLoadStep(0);
    const steps = mode==="url" ? SCRAPE_STEPS : MANUAL_STEPS;
    for(let i=0;i<steps.length;i++){await new Promise(r=>setTimeout(r,800+Math.random()*500));setLoadStep(i+1);}
    const prompt = mode==="url" ? buildScrapedPrompt() : buildManualPrompt();
    try {
      const res = await fetch("/api/v1/messages",{
        method:"POST",
        headers:{
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens: 2000,
          system:`You are an expert social media strategist for Indian marketing agencies. Respond ONLY with valid JSON, no preamble, no backticks. Use this exact structure: {"overview":"string","inferredObjective":"string","inferredIndustry":"string","inferredAudience":"string","objectiveScore":80,"platformScores":{"instagram":85,"facebook":70,"youtube":60,"tiktok":50,"linkedin":40},"competitorPatterns":[{"name":"string","strength":"string","weakness":"string","adPattern":"string","contentStyle":"string","followerCount":"string","engagementInsight":"string"}],"contentPatterns":{"topFormats":["f1","f2","f3"],"bestHooks":["h1","h2","h3"],"postingFrequency":"string","bestTimes":"string","viralTriggers":["t1","t2","t3"]},"platformStrategy":{"primary":"string","primaryReason":"string","secondary":"string","secondaryReason":"string","avoid":"string","avoidReason":"string"},"strategyPillars":{"awareness":["a1","a2","a3"],"engagement":["e1","e2","e3"],"conversion":["c1","c2","c3"],"retention":["r1","r2","r3"]},"topPriorities":[{"title":"string","desc":"string","impact":"High"},{"title":"string","desc":"string","impact":"High"},{"title":"string","desc":"string","impact":"Medium"}],"weeklyCalendar":[{"day":"Mon","tasks":[{"label":"Reel","type":"reel"}]},{"day":"Tue","tasks":[{"label":"Post","type":"post"}]},{"day":"Wed","tasks":[{"label":"Story","type":"story"},{"label":"Ad","type":"ad"}]},{"day":"Thu","tasks":[{"label":"Reel","type":"reel"}]},{"day":"Fri","tasks":[{"label":"Post","type":"post"},{"label":"Ad","type":"ad"}]},{"day":"Sat","tasks":[{"label":"Story","type":"story"}]},{"day":"Sun","tasks":[{"label":"Post","type":"post"}]}],"kpis":{"expectedCPLDrop":"string","contentOutputMultiplier":"string","leadResponseTime":"string","projectedConversionLift":"string"},"budgetAllocation":{"content":25,"paidAds":50,"tools":10,"influencer":15},"quickWins":["win1","win2","win3"]}`,
          messages:[{role:"user",content:prompt}]
        })
      });
      const data=await res.json();
      const text=data.content?.map(b=>b.text||"").join("")||"";
      window._lastRawText = text;
      console.log("API response preview:", text.slice(0,200));
      const clean=text.replace(/```json|```/g,"").trim();
      // Find JSON boundaries in case there is extra text
      const jsonStart = clean.indexOf("{");
      const jsonEnd = clean.lastIndexOf("}");
      const jsonOnly = jsonStart !== -1 && jsonEnd !== -1 ? clean.slice(jsonStart, jsonEnd+1) : clean;
      setResult(JSON.parse(jsonOnly)); setPhase("results");
    } catch(e) {
      console.error("Strategy generation error:", e);
      console.error("Raw text was:", window._lastRawText || "not captured");
      setResult(getFallback());
      setPhase("results");
    }
  }

  function buildScrapedPrompt() {
    const client=scrapedData[0], comps=scrapedData.slice(1);
    return `Analyse these real Instagram profiles and generate a complete strategy.

CLIENT: @${client.username} | Name: ${client.fullName} | Bio: "${client.bio}" | Followers: ${client.followers?.toLocaleString()} | Posts: ${client.posts}
Recent post captions: ${client.recentPosts?.map(p=>`"${p.caption?.slice(0,80)}"`).join(" | ")}
Content types: ${client.recentPosts?.map(p=>p.type).join(", ")}
Top hashtags: ${client.recentPosts?.flatMap(p=>p.hashtags).slice(0,8).join(", ")}

${comps.map((c,i)=>`COMPETITOR ${i+1}: @${c.username} | Bio: "${c.bio}" | Followers: ${c.followers?.toLocaleString()} | Captions: ${c.recentPosts?.map(p=>`"${p.caption?.slice(0,60)}"`).join(" | ")} | Types: ${c.recentPosts?.map(p=>p.type).join(", ")}`).join("\n")}

INDUSTRY (confirmed by user): ${form.industry}
TARGET AUDIENCE:
- Age: ${form.ageMin||"16"}–${form.ageMax||"45"}
- Gender: ${form.gender||"All"}
- Location: ${form.location||"Kerala, India"}
- Income Level: ${form.incomeLevel||"detect from profile"}
- Education: ${form.educationLevel||"detect from profile"}
Platforms to analyse: ${form.currentPlatforms.join(", ")}
Budget: ${form.budget||"not specified"}
Client USP: ${form.usp||"detect from profile"}
Client Brief: ${briefText ? briefText.slice(0, 2500) : "not provided"}

Use the confirmed industry above — do NOT override it. Analyse competitor gaps from real profile data and build complete strategy JSON.`;
  }

  function buildManualPrompt() {
    return `Analyse this client for a data-driven social media strategy:
CLIENT: ${form.clientName||"Agency Client"}
INDUSTRY: ${form.industry}
OBJECTIVE: ${form.objective}
TARGET AUDIENCE: Age ${form.ageMin||"16"}–${form.ageMax||"45"} | Gender: ${form.gender||"All"} | Location: ${form.location||"India"} | Income: ${form.incomeLevel||"middle income"} | Education: ${form.educationLevel||"graduates"}
BUDGET: ${form.budget||"Not specified"}
USP: ${form.usp||"Not specified"}
PLATFORMS: ${form.currentPlatforms.join(", ")}
COMPETITORS: ${form.competitors.join(", ")||"Generic Indian industry competitors"}
CLIENT BRIEF: ${briefText ? briefText.slice(0, 2500) : "not provided"}`;
  }

  async function generateContentKit() {
    setContentLoading(true);

    const clientName = form.clientName || scrapedData?.[0]?.fullName || "Client";
    const industry = result.inferredIndustry || form.industry;
    const objective = form.objective || result.inferredObjective || "generate leads and admissions";
    const usp = form.usp || "";
    const ageRange = (form.ageMin||"19") + "–" + (form.ageMax||"26");
    const location = form.location || "Kerala";
    const education = form.educationLevel || "";
    const gaps = (result.competitorPatterns||[]).map(c => c.name + " weakness: " + c.weakness).join("; ");
    const hooks = (result.contentPatterns?.bestHooks||[]).join(", ");
    const triggers = (result.contentPatterns?.viralTriggers||[]).join(", ");
    const briefSnippet = briefText ? briefText.slice(0, 1500) : "";
    const clientBio = scrapedData?.[0]?.bio || "";
    const recentCaptions = scrapedData?.[0]?.recentPosts?.map(p=>p.caption?.slice(0,60)).filter(Boolean).join(" | ") || "";

    // Detect if location suggests a regional language
    const isKerala = (location||"").toLowerCase().includes("kerala");
    const isTamil = (location||"").toLowerCase().includes("tamil") || (location||"").toLowerCase().includes("chennai");
    const isHindi = (location||"").toLowerCase().includes("delhi") || (location||"").toLowerCase().includes("mumbai") || (location||"").toLowerCase().includes("hindi");
    const regionalLang = isKerala ? "Malayalam" : isTamil ? "Tamil" : isHindi ? "Hindi" : null;
    const regionalLangNote = regionalLang
      ? `The audience speaks ${regionalLang} as their mother tongue. Weave short ${regionalLang} phrases (with English translation in brackets) at the most emotionally important moments — the hook opening, the moment of empathy, and the CTA. Do NOT translate entire scripts. Use the regional language the way people actually think in their heart language — 1 to 3 phrases per script, placed where emotion peaks.`
      : `Write in clear, warm English. If the location suggests a regional culture, reflect local values and references naturally.`;

    // Build the full prompt as a plain string — no nested template literal issues
    const fullPrompt = [
      "You are an expert social media content writer who specialises in emotionally intelligent, human-first storytelling for Indian brands.",
      "",
      "=== YOUR WRITING PHILOSOPHY ===",
      "You write like a thoughtful human being, not a marketing machine. Your scripts make people feel seen before they feel sold to.",
      "The best content you write follows this emotional arc:",
      "  1. MIRROR — Reflect the audience's exact reality back at them. Name their specific pain, dream, or daily experience so precisely that they think 'how did they know?'",
      "  2. VALIDATE — Make them feel understood, not judged. Never lecture. Never push.",
      "  3. SHIFT — Offer a new way of seeing their situation. One insight that changes how they feel.",
      "  4. INVITE — Gently offer the next step. Never a hard sell. An open door, not a pushed button.",
      "",
      "=== TONE RULES ===",
      "- Write the way a trusted friend would talk — direct, warm, honest, never corporate",
      "- Short sentences. White space. Breathing room.",
      "- Never use these words: 'amazing', 'incredible', 'skyrocket', 'transform your life', 'limited time', 'don't miss out'",
      "- Never start with a brag about the brand. Start with the audience's world.",
      "- Specific beats generic ALWAYS. 'The mother who cooked at 5am for her son's exam' beats 'hardworking parents'",
      "- Vulnerability is more powerful than confidence in this niche. Write accordingly.",
      "- Every script should have ONE moment that could make someone pause mid-scroll and feel something.",
      "",
      "=== BILINGUAL GUIDANCE ===",
      regionalLangNote,
      "",
      "=== REEL SCRIPT FORMAT ===",
      "Each reel script must follow this structure:",
      "- Hook line (the first 3 seconds — a question, a truth, or a scene that names the audience's reality)",
      "- Story or scene (30-60 seconds — a specific human moment, not abstract claims)",
      "- The shift (one insight or reframe that makes them feel differently)",
      "- Soft CTA (an invitation, not a command)",
      "Scripts should be 150-250 words. Written as if spoken aloud. No bullet points inside the script itself.",
      "",
      "=== CAROUSEL FORMAT ===",
      "Each slide should be a standalone moment — a single truth, a myth busted, a specific scenario.",
      "Slide 1 is the hook (a question or bold statement). Last slide is a gentle CTA.",
      "Tone: like a good friend sharing something they wish someone had told them earlier.",
      "",
      "=== WHATSAPP MESSAGE FORMAT ===",
      "WhatsApp messages must feel like they were written by a real human, not a chatbot.",
      "First response: acknowledge the courage it took to reach out. Ask one open question. No list of services yet.",
      "Follow-up: low pressure, warm, no guilt-tripping. Leave the door open.",
      "Broadcast: feels like a check-in from someone who cares, not a promotion blast.",
      "",
      "=== AD COPY FORMAT ===",
      "Lead with empathy, not features. The first sentence must name a specific feeling or situation.",
      "Middle: one specific proof point (stat, story snippet, or social proof).",
      "End: clear CTA that feels like relief, not pressure.",
      "",
      "=== COMPETITOR GAPS TO EXPLOIT ===",
      gaps || "Generic competitors — focus on being more human and specific than average industry content",
      "",
      "=== VIRAL HOOKS THAT WORK IN THIS NICHE ===",
      hooks || "Questions that name a specific audience reality",
      "",
      "=== VIRAL TRIGGERS ===",
      triggers || "Specific local/cultural references, human stories, counterintuitive truths",
      "",
      "=== CLIENT DETAILS ===",
      "Brand: " + clientName,
      "Industry: " + industry,
      "Core Objective: " + objective,
      "Target Audience: Age " + ageRange + " | " + location + (education ? " | " + education : ""),
      "USP & Key Stats: " + (usp || "see brief below"),
      "Instagram Bio: " + clientBio,
      "Recent content topics: " + recentCaptions,
      "",
      "=== CLIENT BRIEF (extract specific names, numbers, stories, services from here) ===",
      briefSnippet || "No brief provided — use USP and industry context above",
      "",
      "=== IMPORTANT ===",
      "Every single line of content must be specific to THIS brand. If the content could work for a competitor, rewrite it.",
      "Use real details from the brief: doctor names, service names, stats, location names, specific audience types.",
      "Return ONLY valid JSON — no markdown, no explanation, no preamble.",
      "",
      "JSON Schema:",
      "{\"reels\":[{\"title\":\"\",\"hook\":\"\",\"script\":\"\",\"cta\":\"\",\"hashtags\":\"\",\"whyItWorks\":\"\"},{\"title\":\"\",\"hook\":\"\",\"script\":\"\",\"cta\":\"\",\"hashtags\":\"\",\"whyItWorks\":\"\"},{\"title\":\"\",\"hook\":\"\",\"script\":\"\",\"cta\":\"\",\"hashtags\":\"\",\"whyItWorks\":\"\"}],\"carousels\":[{\"title\":\"\",\"hook\":\"\",\"slides\":[\"\",\"\",\"\",\"\",\"\"],\"caption\":\"\",\"hashtags\":\"\"},{\"title\":\"\",\"hook\":\"\",\"slides\":[\"\",\"\",\"\",\"\",\"\"],\"caption\":\"\",\"hashtags\":\"\"}],\"adCopies\":[{\"format\":\"Click-to-WhatsApp\",\"headline\":\"\",\"primaryText\":\"\",\"cta\":\"\",\"targetingNote\":\"\"},{\"format\":\"Lead Generation\",\"headline\":\"\",\"primaryText\":\"\",\"cta\":\"\",\"targetingNote\":\"\"},{\"format\":\"Retargeting\",\"headline\":\"\",\"primaryText\":\"\",\"cta\":\"\",\"targetingNote\":\"\"}],\"captions\":[{\"type\":\"Educational\",\"caption\":\"\",\"bestFor\":\"\"},{\"type\":\"Social Proof\",\"caption\":\"\",\"bestFor\":\"\"},{\"type\":\"Promotional\",\"caption\":\"\",\"bestFor\":\"\"},{\"type\":\"Engagement\",\"caption\":\"\",\"bestFor\":\"\"}],\"whatsappMessages\":[{\"type\":\"First Response\",\"message\":\"\"},{\"type\":\"Follow-up Day 1\",\"message\":\"\"},{\"type\":\"Broadcast\",\"message\":\"\"}]}"
    ].join("\n");

    try {
      const res = await fetch("/api/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8000,
          messages: [{ role: "user", content: fullPrompt }]
        })
      });
      const data = await res.json();
      console.log("Stop reason:", data.stop_reason, "| Error:", data.error?.message);
      const text = data.content?.map(b => b.text || "").join("") || "";
      console.log("Content kit preview:", text.slice(0, 500));
      if (!text) throw new Error(data.error?.message || "Empty API response");
      const clean = text.replace(/```json|```/g, "").trim();
      const jsonStart = clean.indexOf("{");
      const jsonEnd = clean.lastIndexOf("}");
      if (jsonStart === -1) throw new Error("No JSON returned. Check console.");
      let jsonStr = clean.slice(jsonStart, jsonEnd + 1);
      // If cut off mid-stream, attempt to close open arrays/objects
      try {
        setContentKit(JSON.parse(jsonStr));
      } catch(parseErr) {
        console.warn("JSON truncated, attempting repair...");
        // Count open braces/brackets and close them
        let opens = 0, openBrackets = 0;
        for (const ch of jsonStr) {
          if (ch === "{") opens++;
          else if (ch === "}") opens--;
          else if (ch === "[") openBrackets++;
          else if (ch === "]") openBrackets--;
        }
        // Trim to last complete object
        const lastGood = Math.max(jsonStr.lastIndexOf("},\n    {"), jsonStr.lastIndexOf("}\n  ]"));
        if (lastGood > 100) {
          // Close the JSON structure
          let repaired = jsonStr.slice(0, jsonStr.lastIndexOf("}") + 1);
          // Close any open arrays and objects
          for (let i = 0; i < openBrackets; i++) repaired += "]";
          for (let i = 0; i < opens; i++) repaired += "}";
          setContentKit(JSON.parse(repaired));
        } else {
          throw parseErr;
        }
      }
    } catch(e) {
      console.error("Content kit error:", e);
      alert("Content generation failed: " + e.message + "\n\nCheck F12 Console for the raw response.");
      setContentKit(getContentFallback(clientName, industry, "Age " + ageRange + ", " + location));
    } finally {
      setContentLoading(false);
    }
  }

  function getContentFallback(clientName, industry, audience) {
    const nl = "\n";
    const r1script = "[Open with creator — direct to camera]" + nl + nl +
      "Hook: 90% of students make this mistake..." + nl + nl +
      "[Cut to text overlay]" + nl +
      "Most people think studying harder is the answer." + nl + nl +
      "But here is what actually works:" + nl + nl +
      "[Point 1] Focus on concept clarity, not memorisation" + nl +
      "[Point 2] Practice previous year papers daily" + nl +
      "[Point 3] Join a structured program with mentors" + nl + nl +
      "[End card] Want the full strategy? Link in bio";

    const r2script = "[Start with result — show achievement]" + nl + nl +
      "From failing to top rank in 90 days." + nl + nl +
      "His situation 3 months ago:" + nl +
      "No structured plan" + nl +
      "Wasting hours on wrong topics" + nl +
      "No mentor guidance" + nl + nl +
      "What changed:" + nl +
      "Got a personalised study plan" + nl +
      "Daily doubt-clearing sessions" + nl +
      "Mock tests every week" + nl + nl +
      "Result? Top 500 rank." + nl + nl +
      "DM START to begin your transformation";

    const r3script = "[Direct to camera, confident tone]" + nl + nl +
      "3 things nobody tells you about cracking exams..." + nl + nl +
      "[Tip 1] Most study materials are outdated." + nl +
      "Always check the exam pattern from last 3 years." + nl + nl +
      "[Tip 2] Group study does not work for everyone." + nl +
      "Find YOUR best study style first." + nl + nl +
      "[Tip 3] The secret is not studying more hours." + nl +
      "It is eliminating low-yield topics." + nl + nl +
      "Want our full topic priority list? Comment LIST below";

    const cap1 = "Most students work hard but still do not get results." + nl + nl +
      "The problem is not effort — it is strategy." + nl + nl +
      "Swipe through to see the 5 mistakes and exactly how to fix them." + nl + nl +
      "Save this post — you will need it before your next exam!" + nl + nl +
      "#StudyTips #ExamPrep #Students #Education #" + clientName;

    const cap2 = "Quick wins that actually work!" + nl + nl +
      "Save this for tonight's study session!" + nl + nl +
      "Double tap if you found this helpful" + nl + nl +
      "#QuickTips #StudyMotivation #ExamPrep #StudentLife #Education";

    const capEdu = "Did you know? Students who solve previous year papers score 40% higher on average." + nl + nl +
      "Here is why it works:" + nl +
      "You understand the pattern" + nl +
      "You stop wasting time on irrelevant topics" + nl +
      "Your confidence goes up" + nl + nl +
      "Try it for 7 days and see the difference." + nl + nl +
      "Save this post and share with a friend who needs to hear this!" + nl + nl +
      "#StudyTips #ExamPrep #Education #" + clientName + " #Students";

    const capSocial = "A student went from 45% to 87% in just 2 months." + nl + nl +
      "No magic. No shortcuts." + nl +
      "Just the right strategy + consistent effort." + nl + nl +
      "Want the same results?" + nl +
      "DM us RESULTS and we will show you exactly how." + nl + nl +
      "#SuccessStory #StudentResults #" + clientName + " #Motivation";

    const capPromo = "Limited seats available!" + nl + nl +
      "Our new batch starts this Monday." + nl + nl +
      "What you get:" + nl +
      "Live classes with expert mentors" + nl +
      "Daily doubt-clearing sessions" + nl +
      "Weekly mock tests" + nl +
      "Personalised feedback" + nl + nl +
      "First 20 registrations get 30% off." + nl + nl +
      "DM JOIN now or click the link in bio" + nl + nl +
      "#NewBatch #" + clientName + " #Education #LimitedSeats";

    const capEngage = "Quick question for you!" + nl + nl +
      "What is your biggest challenge with exam prep right now?" + nl + nl +
      "A) Not enough time to study" + nl +
      "B) Cannot focus / too many distractions" + nl +
      "C) Do not know where to start" + nl +
      "D) Weak in specific subjects" + nl + nl +
      "Comment your answer below — we read every single one!" + nl + nl +
      "#StudentLife #ExamPrep #" + clientName + " #Community";

    const wa1 = "Hi [Name]!" + nl + nl +
      "Thank you for reaching out to " + clientName + "!" + nl + nl +
      "I will personally help you with your query." + nl + nl +
      "To give you the best advice, could you tell me:" + nl +
      "1. Which exam are you preparing for?" + nl +
      "2. When is your exam?" + nl +
      "3. What is your biggest challenge right now?" + nl + nl +
      "Reply and I will get back to you within 15 minutes!";

    const wa2 = "Hi [Name]!" + nl + nl +
      "Just checking in — did you get a chance to look at the details I shared?" + nl + nl +
      "Many students in your situation improved their scores significantly after joining our program." + nl + nl +
      "I have 2 slots left this week for a free 15-minute strategy call. Want to grab one?" + nl + nl +
      "Just reply YES and I will send you the booking link!";

    const wa3 = "Special announcement for our community!" + nl + nl +
      "For the next 48 hours only, we are offering:" + nl +
      "Free study plan consultation" + nl +
      "30% off on our premium program" + nl +
      "Bonus: Access to our question bank" + nl + nl +
      "This offer ends [Date] at midnight." + nl + nl +
      "Reply INTERESTED to claim your spot!" + nl + nl +
      "— Team " + clientName;

    return {
      reels: [
        {
          title: "The Problem Hook Reel",
          hook: "90% of " + audience + " make this mistake... Are you one of them?",
          script: r1script,
          cta: "Comment GUIDE and we will send you our free study plan",
          hashtags: "#Education #StudyTips #Students #India #ExamPrep",
          whyItWorks: "Opens with a provocative question that stops the scroll immediately"
        },
        {
          title: "Before / After Transformation",
          hook: "This student went from failing to top rank in 90 days. Here is exactly how:",
          script: r2script,
          cta: "DM START to get your personalised plan",
          hashtags: "#SuccessStory #StudentLife #Motivation #Education #Results",
          whyItWorks: "Before/after stories are the highest-converting content format — creates hope and urgency"
        },
        {
          title: "Competitor Gap Reel — Value Bomb",
          hook: "3 things your coaching centre will never tell you:",
          script: r3script,
          cta: "Comment LIST for our free topic priority guide",
          hashtags: "#StudyHacks #ExamTips #Education #FreeResources #Knowledge",
          whyItWorks: "Positions the brand as the honest transparent option vs competitors — builds trust fast"
        }
      ],
      carousels: [
        {
          title: "5 Mistakes Students Make",
          hook: "5 mistakes that are killing your exam score (Slide 2 will surprise you)",
          slides: [
            "Slide 1: 5 Mistakes Killing Your Score — Swipe to see all",
            "Slide 2: Mistake 1 — Studying without a schedule. Fix: Block 3 study sessions daily with specific topics.",
            "Slide 3: Mistake 2 — Skipping previous year papers. Fix: Solve last 5 years papers before any new chapter.",
            "Slide 4: Mistake 3 — No revision plan. Fix: Revise every topic within 24 hours of learning it.",
            "Slide 5: Want a personalised study plan? DM us PLAN and we will send it free"
          ],
          caption: cap1,
          hashtags: "#StudyTips #ExamPrep #Students #Education #Motivation"
        },
        {
          title: "Quick Win Tips Carousel",
          hook: "Do these 5 things tonight and score better tomorrow",
          slides: [
            "Slide 1: Do these 5 things tonight for better results tomorrow",
            "Slide 2: 1. Review today's notes for 10 minutes",
            "Slide 3: 2. Solve 5 practice questions from each topic",
            "Slide 4: 3. Write down your 3 weakest areas",
            "Slide 5: 4. Plan tomorrow's study session tonight. 5. Sleep by 10 PM — rest is part of prep. Follow us for daily tips!"
          ],
          caption: cap2,
          hashtags: "#QuickTips #StudyMotivation #ExamPrep #StudentLife"
        }
      ],
      adCopies: [
        {
          format: "Click-to-WhatsApp",
          headline: "Free Study Plan for " + audience.slice(0, 25),
          primaryText: "Struggling with your exam prep? Get a FREE personalised study plan from our expert mentors. Over 500+ students improved their scores last month. You are next.",
          cta: "Chat on WhatsApp",
          targetingNote: "Age 16-45, interests: education, competitive exams, parenting"
        },
        {
          format: "Lead Generation",
          headline: "Score Higher in 30 Days — Guaranteed",
          primaryText: "Join " + clientName + " structured program. Expert mentors. Daily doubt sessions. Proven results. Limited seats — Register free today.",
          cta: "Register for Free",
          targetingNote: "Lookalike audience of past leads, age 16-45, education and parenting interest"
        },
        {
          format: "Retargeting",
          headline: "Still thinking about it? Here is what you will miss:",
          primaryText: "You visited our page but did not register yet. 47 students joined this week. Do not let another week pass without a plan.",
          cta: "Claim Your Spot",
          targetingNote: "Website visitors last 30 days + 50% video viewers"
        }
      ],
      captions: [
        { type: "Educational", caption: capEdu, bestFor: "Educational posts, Monday-Wednesday mornings" },
        { type: "Social Proof", caption: capSocial, bestFor: "Testimonial posts, Thursday-Friday" },
        { type: "Promotional", caption: capPromo, bestFor: "Offer/launch posts, Friday-Sunday" },
        { type: "Engagement Bait", caption: capEngage, bestFor: "Engagement posts, Tuesday or Saturday evenings" }
      ],
      whatsappMessages: [
        { type: "First Response (Auto-reply)", message: wa1 },
        { type: "Follow-up Day 1", message: wa2 },
        { type: "Broadcast / Offer", message: wa3 }
      ]
    };
  }

  function getFallback() {
    return {
      overview:`The highest-ROI strategy combines Instagram Reels with Click-to-WhatsApp ad campaigns. Competitors rely on static ads — clear content gap to exploit with consistent video and community-building.`,
      inferredObjective:"Generate qualified leads and increase brand awareness in the Indian market",
      inferredIndustry:form.industry,
      inferredAudience:"Students and parents, 16–45, urban and semi-urban India",
      objectiveScore:82,
      platformScores:{instagram:92,facebook:78,youtube:65,tiktok:55,linkedin:40},
      competitorPatterns:[
        {name:"Competitor A",strength:"Strong testimonials",weakness:"Zero video content",adPattern:"Static image + discount",contentStyle:"Formal, text-heavy",followerCount:"12K",engagementInsight:"Low — 0.8%"},
        {name:"Competitor B",strength:"High ad spend",weakness:"No WhatsApp funnel",adPattern:"Inconsistent video",contentStyle:"Product showcase only",followerCount:"28K",engagementInsight:"Medium — 1.4%"},
      ],
      contentPatterns:{topFormats:["Short Reels (15–30s)","Carousel storytelling","Behind-the-scenes"],bestHooks:["Problem → Solution opener","Surprising stat in 2 seconds","\"Most people don't know this...\""],postingFrequency:"5–7 posts/week",bestTimes:"7–9 AM and 7–10 PM IST",viralTriggers:["Hinglish content","Before/After results","Client testimonials"]},
      platformStrategy:{primary:"Instagram",primaryReason:"Highest engagement for this niche in India. Reels algorithm rewards consistency.",secondary:"Facebook",secondaryReason:"Best for lead form campaigns, lower CPL for service businesses.",avoid:"TikTok",avoidReason:"Uncertain regulatory status in India. Audience overlap with Reels."},
      strategyPillars:{awareness:["3 Reels/week cold targeting","Boost top posts ₹200/day","Niche hashtag strategy"],engagement:["Reply to comments within 2hrs","Weekly Stories poll","UGC campaign with hashtag"],conversion:["Click-to-WhatsApp ads","Retarget 50%+ video viewers","Instant WhatsApp follow-up on leads"],retention:["Weekly value content","WhatsApp community","Monthly result showcases"]},
      topPriorities:[
        {title:"Launch Click-to-WhatsApp Ads",desc:"Meta ads with WhatsApp CTA. Typically cuts CPL by 35–50% vs landing pages.",impact:"High"},
        {title:"Start 3 Reels Per Week",desc:"Competitors are static. Any consistent Reels strategy immediately wins on organic reach.",impact:"High"},
        {title:"Build TeleCRM Follow-Up Sequence",desc:"Day 0 → Day 1 → Day 3 follow-ups ensures 100% lead contact rate.",impact:"High"},
        {title:"Competitor Swipe File",desc:"Check Meta Ads Library weekly. Log ads running 3+ months — those are profitable.",impact:"Medium"},
        {title:"Looker Studio Auto-Reports",desc:"Auto weekly client reports from Meta Ads + TeleCRM data.",impact:"Medium"},
      ],
      weeklyCalendar:[
        {day:"Mon",tasks:[{label:"Reel",type:"reel"},{label:"Story poll",type:"story"}]},
        {day:"Tue",tasks:[{label:"Carousel",type:"post"}]},
        {day:"Wed",tasks:[{label:"Reel",type:"reel"},{label:"Launch ad",type:"ad"}]},
        {day:"Thu",tasks:[{label:"Testimonial",type:"post"}]},
        {day:"Fri",tasks:[{label:"Reel",type:"reel"},{label:"Story CTA",type:"story"}]},
        {day:"Sat",tasks:[{label:"Boost post",type:"ad"}]},
        {day:"Sun",tasks:[{label:"Value post",type:"post"}]},
      ],
      kpis:{expectedCPLDrop:"40%",contentOutputMultiplier:"3x",leadResponseTime:"2 min",projectedConversionLift:"25%"},
      budgetAllocation:{content:25,paidAds:50,tools:10,influencer:15},
      quickWins:["Connect Meta Lead Form → TeleCRM via Zapier today (free)","Schedule 2 weeks of posts in Meta Business Suite this week","Set up WhatsApp auto-reply for new DMs in 24 hours"],
    };
  }

  const steps = mode==="url" ? SCRAPE_STEPS : MANUAL_STEPS;

  return (
    <div className="app">
      <div className="bg-orbs"><div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/></div>
      <div className="noise"/>
      <div className="header">
        <div className="header-eyebrow"><span className="pulse-dot"/>AI Strategy Engine · Claude + Apify</div>
        <h1>Competitor Analysis &<br/><span className="gradient">Strategy Generator</span></h1>
        <p className="header-sub">Paste Instagram URLs — AI scrapes profiles, analyses competitor patterns, and builds your complete campaign strategy automatically.</p>
      </div>
      <div className="content">

        {/* API KEYS */}
        {phase==="input" && <>
          <div className="setup-banner">
            <div className="setup-banner-title">🤖 Anthropic API Key</div>
            <div className="setup-banner-desc">Get from <strong>console.anthropic.com</strong> → API Keys → Create Key</div>
            {keySaved.anthropic ? <span className="key-saved">✅ Anthropic key saved</span> : (
              <div className="setup-row">
                <input type="password" placeholder="sk-ant-api03-..." value={anthropicInput} onChange={e=>setAnthropicInput(e.target.value)}/>
                <button className="save-key-btn" onClick={saveAnthropicKey}>Save Key</button>
              </div>
            )}
          </div>
          {mode==="url" && (
            <div className="setup-banner">
              <div className="setup-banner-title">🔑 Apify API Key (Instagram scraping)</div>
              <div className="setup-banner-desc">
                1. Go to <strong>apify.com</strong> → Sign up free<br/>
                2. Profile → <strong>Settings</strong> → <strong>Integrations</strong><br/>
                3. Copy API Token (starts with <code style={{background:"rgba(255,255,255,0.08)",padding:"1px 6px",borderRadius:4}}>apify_api_...</code>)
              </div>
              {keySaved.apify ? <span className="key-saved">✅ Apify key saved</span> : (
                <div className="setup-row">
                  <input type="password" placeholder="apify_api_..." value={apifyInput} onChange={e=>setApifyInput(e.target.value)}/>
                  <button className="save-key-btn" onClick={saveApifyKey}>Save Key</button>
                </div>
              )}
            </div>
          )}
        </>}

        {/* CLIENT BRIEF UPLOAD */}
        {phase==="input" && (
          <div className="brief-upload">
            <div className="brief-upload-title">📄 Client Brief / Document (Optional but Recommended)</div>
            <div className="brief-upload-desc">
              Upload a PDF or paste your client intake form. The AI reads it and auto-fills all fields — client name, industry, USP, audience, competitors, key stats.
            </div>

            {/* PDF UPLOAD ROW */}
            <div className="upload-row">
              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf,application/pdf"
                style={{display:"none"}}
                onChange={handlePdfUpload}
              />
              <button
                className="pdf-upload-btn"
                onClick={() => pdfInputRef.current?.click()}
                disabled={pdfLoading || !anthropicKey}
              >
                {pdfLoading
                  ? <><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⚙️</span> Reading PDF…</>
                  : <><span>📎</span> Upload PDF</>
                }
              </button>
              {!anthropicKey && <span style={{fontSize:12,color:"var(--muted)"}}>Save Anthropic key first to enable PDF upload</span>}
              {briefText && !pdfLoading && <span className="pdf-name">✅ Content loaded — review below</span>}
              <span style={{fontSize:12,color:"var(--muted)"}}>or paste text below</span>
            </div>

            <textarea
              className="brief-textarea"
              placeholder={"Paste client brief here...\n\nExample:\nClient: Invisor Learning\nCourses: CMA USA, ACCA, EA USA\nTarget: B.Com graduates, 19–26 years, Kerala\nUSP: 75% pass rate vs 40% industry average, IMA Gold Partner\nPlacements: 230 last year, avg 4.5 LPA..."}
              value={briefText}
              onChange={e => setBriefText(e.target.value)}
            />
            <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",marginTop:10}}>
              <button className="parse-btn" onClick={parseBrief} disabled={briefLoading || !briefText.trim() || !anthropicKey}>
                {briefLoading ? <><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⚙️</span> Parsing…</> : <><span>🧠</span> Auto-Fill All Fields from Brief</>}
              </button>
              {briefText && <button onClick={()=>{setBriefText("");setBriefParsed(false);}} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:12}}>✕ Clear</button>}
            </div>
            {briefParsed && <div className="brief-parsed">✅ All fields auto-filled from brief! Review below and adjust if needed.</div>}
          </div>
        )}

        {/* DELIVERABLES PLANNER */}
        {phase==="input" && (
          <div className="deliv-wrap">
            <div className="deliv-head">📦 Client Deliverables Planner</div>
            <div className="deliv-sub">Set how many of each content type you're delivering this month. This appears in the final report and shapes the content kit to match your exact scope.</div>
            <div className="deliv-grid">
              {DELIVERABLE_TYPES.map(d=>(
                <div className="deliv-card" key={d.id}>
                  <div className="deliv-card-top">
                    <div className="deliv-card-label">{d.emoji} {d.label}</div>
                    <div className="dcounter">
                      <button className="dcounter-btn" onClick={()=>setDeliv(d.id,deliverables[d.id]-1)}>−</button>
                      <div className="dcounter-val">{deliverables[d.id]}</div>
                      <button className="dcounter-btn" onClick={()=>setDeliv(d.id,deliverables[d.id]+1)}>+</button>
                    </div>
                  </div>
                  <div className="deliv-card-note">{d.note}</div>
                </div>
              ))}
            </div>
            <div className="deliv-custom-row">
              <input placeholder="Add custom deliverable (e.g. YouTube Shorts, LinkedIn Article…)" value={delivCustomInput} onChange={e=>setDelivCustomInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustomDeliv()}/>
              <button className="add-btn" onClick={addCustomDeliv}>+</button>
            </div>
            {delivCustomItems.map((c,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
                <span style={{flex:1,fontSize:13,color:"var(--muted2)"}}>✦ {c.label}</span>
                <div className="dcounter">
                  <button className="dcounter-btn" onClick={()=>setCustomQty(i,c.qty-1)}>−</button>
                  <div className="dcounter-val">{c.qty}</div>
                  <button className="dcounter-btn" onClick={()=>setCustomQty(i,c.qty+1)}>+</button>
                </div>
                <button className="comp-sug-remove" onClick={()=>removeCustomDeliv(i)}>✕</button>
              </div>
            ))}
            <div className="deliv-scope">
              <div className="deliv-scope-title">📋 This Month's Scope</div>
              <div className="deliv-scope-tags">
                {DELIVERABLE_TYPES.map(d=>(
                  <span key={d.id} className={"dtag"+(deliverables[d.id]===0?" dtag-off":"")}>{d.emoji} {deliverables[d.id]}× {d.label}</span>
                ))}
                {delivCustomItems.map((c,i)=>(
                  <span key={i} className={"dtag"+(c.qty===0?" dtag-off":"")}>✦ {c.qty}× {c.label}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODE TOGGLE */}
        {phase==="input" && (
          <div className="mode-toggle">
            <button className={`mode-btn ${mode==="url"?"active":""}`} onClick={()=>setMode("url")}>🔗 Paste Instagram URLs (Auto-Scrape)</button>
            <button className={`mode-btn ${mode==="manual"?"active":""}`} onClick={()=>setMode("manual")}>✍️ Enter Details Manually</button>
          </div>
        )}

        {/* LOADING */}
        {phase==="loading" && (
          <div className="loading-card">
            <div className="loading-icon">⚙️</div>
            <div className="loading-title">{mode==="url"?"Scraping & Analysing Profiles":"Generating Your Strategy"}</div>
            <p style={{color:"var(--muted)",fontSize:13}}>This takes 20–40 seconds in scraping mode…</p>
            <div className="loading-steps">
              {steps.map((s,i)=>(
                <div key={i} className={`loading-step ${i<loadStep?"done":i===loadStep?"active":""}`}>
                  <span>{i<loadStep?"✅":s.icon}</span><span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* URL MODE */}
        {phase==="input" && mode==="url" && (
          <div className="form-card">
            <div className="field-group" style={{marginBottom:16}}>
              <label>📍 Client's Instagram URL</label>
              <div className="url-input-wrap">
                <span className="url-icon">📸</span>
                <input placeholder="https://instagram.com/yourclienthandle" value={clientUrl} onChange={e=>setClientUrl(e.target.value)} style={{paddingLeft:40}}/>
              </div>
            </div>
            <div className="field-group" style={{marginBottom:16}}>
              <label>🎯 Competitor Accounts</label>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,flexWrap:"wrap"}}>
                <button
                  className="find-comp-btn"
                  onClick={findCompetitors}
                  disabled={findingCompetitors || !clientUrl.trim()}
                >
                  {findingCompetitors
                    ? <><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>🔍</span> Finding competitors…</>
                    : <><span>🤖</span> Auto-Find Competitors with AI</>}
                </button>
                <span style={{fontSize:12,color:"var(--muted)"}}>or add manually below</span>
              </div>

              {suggestedCompetitors.length > 0 && (
                <div className="comp-suggestions">
                  {suggestedCompetitors.map((c,i) => (
                    <div className="comp-suggestion" key={i}>
                      <div className="comp-sug-left">
                        <span style={{fontSize:20}}>🏢</span>
                        <div>
                          <div className="comp-sug-handle">@{c.handle}</div>
                          <div className="comp-sug-reason">{c.reason}</div>
                          <a className="comp-sug-link" href={"https://instagram.com/"+c.handle} target="_blank" rel="noreferrer">instagram.com/{c.handle} ↗</a>
                        </div>
                      </div>
                      <button className="comp-sug-remove" onClick={()=>{
                        const updated = suggestedCompetitors.filter((_,j)=>j!==i);
                        setSuggestedCompetitors(updated);
                        setCompetitorUrls(updated.map(s=>"https://instagram.com/"+s.handle));
                      }}>×</button>
                    </div>
                  ))}
                </div>
              )}

              {suggestedCompetitors.length === 0 && (
                <>
                  {competitorUrls.map((url,i)=>(
                    <div className="url-row" key={i}>
                      <div className="url-input-wrap" style={{flex:1}}>
                        <span className="url-icon">🔍</span>
                        <input placeholder={`https://instagram.com/competitor${i+1}`} value={url} onChange={e=>{const u=[...competitorUrls];u[i]=e.target.value;setCompetitorUrls(u);}} style={{paddingLeft:40}}/>
                      </div>
                      <button className="remove-btn" onClick={()=>setCompetitorUrls(competitorUrls.filter((_,j)=>j!==i))}>×</button>
                    </div>
                  ))}
                  {competitorUrls.length<3 && <button className="add-url-btn" onClick={()=>setCompetitorUrls([...competitorUrls,""])}>+ Add Manually</button>}
                </>
              )}
            </div>
            <div className="field-group" style={{marginBottom:16}}>
              <label>Platforms to Analyse</label>
              <div className="platform-chips">
                {PLATFORMS.map(p=><div key={p.id} className={`platform-chip ${form.currentPlatforms.includes(p.id)?platformSelClass[p.id]:""}`} onClick={()=>togglePlatform(p.id)}>{p.emoji} {p.label}</div>)}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              <div className="field-group">
                <label>Industry / Niche</label>
                <select value={form.industry} onChange={e=>setForm(f=>({...f,industry:e.target.value}))}>
                  {INDUSTRIES.map(i=><option key={i}>{i}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label>Monthly Ad Budget (optional)</label>
                <input placeholder="e.g. ₹25,000/month" value={form.budget} onChange={e=>setForm(f=>({...f,budget:e.target.value}))}/>
              </div>
            </div>
            <div className="section-label">👥 Target Audience</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <div className="field-group">
                <label>Age Range</label>
                <div className="age-row">
                  <input placeholder="16" value={form.ageMin} onChange={e=>setForm(f=>({...f,ageMin:e.target.value}))} style={{width:70}}/>
                  <span className="age-sep">to</span>
                  <input placeholder="45" value={form.ageMax} onChange={e=>setForm(f=>({...f,ageMax:e.target.value}))} style={{width:70}}/>
                </div>
              </div>
              <div className="field-group">
                <label>Gender</label>
                <select value={form.gender} onChange={e=>setForm(f=>({...f,gender:e.target.value}))}>
                  <option>All</option><option>Male</option><option>Female</option>
                </select>
              </div>
              <div className="field-group">
                <label>Location / Geography</label>
                <input placeholder="e.g. Kerala, North India" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))}/>
              </div>
              <div className="field-group">
                <label>Income Level</label>
                <select value={form.incomeLevel} onChange={e=>setForm(f=>({...f,incomeLevel:e.target.value}))}>
                  <option value="">Select...</option>
                  <option>Lower income</option><option>Lower-middle income</option>
                  <option>Middle income</option><option>Upper-middle income</option>
                  <option>High income</option>
                </select>
              </div>
              <div className="field-group" style={{gridColumn:"1/-1"}}>
                <label>Education Level</label>
                <select value={form.educationLevel} onChange={e=>setForm(f=>({...f,educationLevel:e.target.value}))}>
                  <option value="">Select...</option>
                  <option>High school / Plus Two</option><option>Undergraduate / Degree</option>
                  <option>Postgraduate</option><option>Working professional</option><option>Mixed</option>
                </select>
              </div>
            </div>
            {scrapeError && <div className="err-box">⚠️ {scrapeError}</div>}
            {scrapedData && (
              <>
                <div className="autofill-notice">✅ Profiles scraped & auto-filled! Review below then generate strategy.</div>
                <div className="scraped-preview">
                  <div className="scraped-title">📊 Scraped Profile Data</div>
                  <div className="profile-cards">
                    {scrapedData.map((p,i)=>(
                      <div className="profile-card" key={i}>
                        <div className="profile-avatar">{i===0?"👤":"🔍"}</div>
                        <div style={{flex:1}}>
                          <div className="profile-tag" style={i===0?{background:"rgba(255,107,53,0.15)",color:"var(--a1)",border:"1px solid rgba(255,107,53,0.3)"}:{background:"rgba(255,62,108,0.1)",color:"var(--a2)",border:"1px solid rgba(255,62,108,0.25)"}}>{i===0?"★ Client":`Competitor ${i}`}</div>
                          <div className="profile-name">{p.fullName}</div>
                          <div className="profile-handle">@{p.username}</div>
                          {p.bio && <div className="profile-bio">{p.bio.slice(0,100)}{p.bio.length>100?"…":""}</div>}
                          <div className="profile-stats">
                            <span className="p-stat"><strong>{p.followers?.toLocaleString()}</strong> followers</span>
                            <span className="p-stat"><strong>{p.posts}</strong> posts</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {!scrapedData
              ? <button className="scrape-btn" onClick={scrapeProfiles} disabled={scraping||!clientUrl.trim()}>{scraping?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⚙️</span> Scraping…</>:<><span>🔍</span> Scrape & Auto-Analyse Profiles</>}</button>
              : <button className="gen-btn" onClick={handleGenerate}><div className="btn-inner"><span>🚀</span><span>Generate Full Strategy from Scraped Data</span></div></button>
            }
          </div>
        )}

        {/* MANUAL MODE */}
        {phase==="input" && mode==="manual" && (
          <div className="form-card">
            <div className="form-grid">
              <div className="field-group"><label>Client / Brand Name</label><input placeholder="e.g. Prestige Homes Kochi" value={form.clientName} onChange={e=>setForm(f=>({...f,clientName:e.target.value}))}/></div>
              <div className="field-group"><label>Industry / Niche</label><select value={form.industry} onChange={e=>setForm(f=>({...f,industry:e.target.value}))}>{INDUSTRIES.map(i=><option key={i}>{i}</option>)}</select></div>
              <div className="field-group full"><label>Client Objective *</label><textarea placeholder="e.g. Generate 50 qualified leads/month for luxury apartment sales in Kochi. Target professionals aged 30–50. Reduce CPC from ₹120 to ₹60." value={form.objective} onChange={e=>setForm(f=>({...f,objective:e.target.value}))}/></div>
              <div className="field-group"><label>Monthly Ad Budget</label><input placeholder="e.g. ₹30,000/month" value={form.budget} onChange={e=>setForm(f=>({...f,budget:e.target.value}))}/></div>
              <div className="field-group full"><label>Client USP / Key Differentiators</label><textarea placeholder="e.g. 75% pass rate vs 40% industry avg, IMA Gold Partner, 230 placements last year, lowest fees, Infopark campus" value={form.usp} onChange={e=>setForm(f=>({...f,usp:e.target.value}))} style={{minHeight:70}}/></div>
              <div className="field-group full"><div className="section-label" style={{marginBottom:4}}>👥 Target Audience</div></div>
              <div className="field-group">
                <label>Age Range</label>
                <div className="age-row">
                  <input placeholder="16" value={form.ageMin} onChange={e=>setForm(f=>({...f,ageMin:e.target.value}))} style={{width:70}}/>
                  <span className="age-sep">to</span>
                  <input placeholder="45" value={form.ageMax} onChange={e=>setForm(f=>({...f,ageMax:e.target.value}))} style={{width:70}}/>
                </div>
              </div>
              <div className="field-group">
                <label>Gender</label>
                <select value={form.gender} onChange={e=>setForm(f=>({...f,gender:e.target.value}))}>
                  <option>All</option><option>Male</option><option>Female</option>
                </select>
              </div>
              <div className="field-group">
                <label>Location / Geography</label>
                <input placeholder="e.g. Kerala, North India" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))}/>
              </div>
              <div className="field-group">
                <label>Income Level</label>
                <select value={form.incomeLevel} onChange={e=>setForm(f=>({...f,incomeLevel:e.target.value}))}>
                  <option value="">Select...</option>
                  <option>Lower income</option><option>Lower-middle income</option>
                  <option>Middle income</option><option>Upper-middle income</option>
                  <option>High income</option>
                </select>
              </div>
              <div className="field-group full">
                <label>Education Level</label>
                <select value={form.educationLevel} onChange={e=>setForm(f=>({...f,educationLevel:e.target.value}))}>
                  <option value="">Select...</option>
                  <option>High school / Plus Two</option><option>Undergraduate / Degree</option>
                  <option>Postgraduate</option><option>Working professional</option><option>Mixed</option>
                </select>
              </div>
              <div className="field-group full">
                <label>Platforms to Analyse</label>
                <div className="platform-chips">{PLATFORMS.map(p=><div key={p.id} className={`platform-chip ${form.currentPlatforms.includes(p.id)?platformSelClass[p.id]:""}`} onClick={()=>togglePlatform(p.id)}>{p.emoji} {p.label}</div>)}</div>
              </div>
              <div className="field-group full">
                <label>Competitors</label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:6}}>{form.competitors.map(c=><div key={c} className="comp-chip" onClick={()=>removeComp(c)}>{c} ✕</div>)}</div>
                <div className="add-comp"><input placeholder="Competitor name or @handle" value={form.compInput} onChange={e=>setForm(f=>({...f,compInput:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addComp()}/><button className="add-btn" onClick={addComp}>+</button></div>
              </div>
            </div>
            <button className="gen-btn" onClick={handleGenerate} disabled={!form.objective.trim()}><div className="btn-inner"><span>🚀</span><span>Analyse & Generate Strategy</span></div></button>
          </div>
        )}

        {/* RESULTS */}
        {phase==="results" && result && (
          <div className="results" ref={resultsRef}>

            {mode==="url" && result.inferredObjective && (
              <div className="result-section" style={{animationDelay:"0s"}}>
                <div className="result-header"><div className="result-icon" style={{background:"rgba(0,229,160,0.1)"}}>🧠</div><div><div className="result-title">AI-Inferred Profile Analysis</div><div className="result-subtitle">Auto-detected from scraped Instagram data</div></div></div>
                <div className="result-body">
                  <div className="strat-grid">
                    <div className="strat-cell"><div className="strat-cell-title" style={{color:"var(--a4)"}}>🎯 Detected Objective</div><p style={{fontSize:13,color:"var(--muted2)",lineHeight:1.7}}>{result.inferredObjective}</p></div>
                    <div className="strat-cell"><div className="strat-cell-title" style={{color:"var(--a3)"}}>🏢 Detected Industry</div><p style={{fontSize:13,color:"var(--muted2)",lineHeight:1.7}}>{result.inferredIndustry}</p></div>
                    <div className="strat-cell" style={{gridColumn:"1/-1"}}><div className="strat-cell-title" style={{color:"var(--a1)"}}>👥 Inferred Target Audience</div><p style={{fontSize:13,color:"var(--muted2)",lineHeight:1.7}}>{result.inferredAudience}</p></div>
                  </div>
                </div>
              </div>
            )}

            <div className="result-section" style={{animationDelay:".04s"}}>
              <div className="result-header">
                <div className="result-icon" style={{background:"rgba(255,107,53,0.1)"}}>🎯</div>
                <div><div className="result-title">Strategic Overview</div><div className="result-subtitle">{form.clientName||scrapedData?.[0]?.fullName||"Client"}</div></div>
                <div style={{marginLeft:"auto",textAlign:"right"}}><div style={{fontFamily:"'Cabinet Grotesk',sans-serif",fontSize:28,fontWeight:900,color:"var(--a4)"}}>{result.objectiveScore}<span style={{fontSize:14,color:"var(--muted)"}}>/100</span></div><div style={{fontSize:11,color:"var(--muted)"}}>Strategy Score</div></div>
              </div>
              <div className="result-body">
                <div className="highlight-box"><strong>AI Analysis: </strong>{result.overview}</div>
                <div className="kpi-row">
                  <div className="kpi"><div className="kpi-val" style={{color:"var(--a4)"}}>{result.kpis.expectedCPLDrop}</div><div className="kpi-lbl">Expected CPL Reduction</div></div>
                  <div className="kpi"><div className="kpi-val" style={{color:"var(--a1)"}}>{result.kpis.contentOutputMultiplier}</div><div className="kpi-lbl">Content Output Multiplier</div></div>
                  <div className="kpi"><div className="kpi-val" style={{color:"var(--a3)"}}>{result.kpis.leadResponseTime}</div><div className="kpi-lbl">Lead Response Target</div></div>
                  <div className="kpi"><div className="kpi-val" style={{color:"var(--a2)"}}>{result.kpis.projectedConversionLift}</div><div className="kpi-lbl">Conversion Lift</div></div>
                </div>
                <div style={{marginBottom:8}}><label style={{fontSize:12,color:"var(--muted2)",letterSpacing:".06em",textTransform:"uppercase"}}>Platform Fit Scores</label></div>
                {form.currentPlatforms.map(pid=>{
                  const score=result.platformScores?.[pid]??50;
                  const p=PLATFORMS.find(x=>x.id===pid);
                  return(<div className="score-row" key={pid}><span className="score-label">{p?.emoji} {p?.label}</span><div className="score-bar-wrap"><div className="score-bar-fill" style={{width:`${score}%`,background:`linear-gradient(90deg,${platformColor[pid]},${platformColor[pid]}88)`}}/></div><span className="score-val">{score}%</span></div>);
                })}
              </div>
            </div>

            <div className="result-section" style={{animationDelay:".08s"}}>
              <div className="result-header"><div className="result-icon" style={{background:"rgba(255,62,108,0.1)"}}>🔍</div><div><div className="result-title">Competitor Pattern Analysis</div><div className="result-subtitle">Real profile data + AI pattern recognition</div></div></div>
              <div className="result-body">
                <table className="comp-table">
                  <thead><tr><th>Competitor</th><th>Strength</th><th>Gap to Exploit</th><th>Ad Pattern</th></tr></thead>
                  <tbody>{result.competitorPatterns?.map((c,i)=>(
                    <tr key={i}>
                      <td><strong style={{color:"var(--text)"}}>{c.name}</strong><br/><span style={{fontSize:11,color:"var(--muted)"}}>{c.contentStyle}</span>{c.followerCount&&<><br/><span style={{fontSize:11,color:"var(--a3)"}}>{c.followerCount} followers</span></>}</td>
                      <td><span style={{color:"var(--a3)",fontSize:12}}>✓ {c.strength}</span>{c.engagementInsight&&<><br/><span style={{fontSize:11,color:"var(--muted)"}}>{c.engagementInsight}</span></>}</td>
                      <td><span style={{color:"var(--a4)",fontSize:12}}>⚡ {c.weakness}</span></td>
                      <td><span className="tag tag-muted">{c.adPattern}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>

            <div className="result-section" style={{animationDelay:".16s"}}>
              <div className="result-header"><div className="result-icon" style={{background:"rgba(0,229,160,0.1)"}}>🎬</div><div><div className="result-title">Winning Content Patterns</div><div className="result-subtitle">What drives maximum reach in your niche</div></div></div>
              <div className="result-body">
                <div className="strat-grid">
                  <div className="strat-cell"><div className="strat-cell-title" style={{color:"var(--a1)"}}>🏆 Top Formats</div><ul>{result.contentPatterns?.topFormats?.map((f,i)=><li key={i}>{f}</li>)}</ul></div>
                  <div className="strat-cell"><div className="strat-cell-title" style={{color:"var(--a2)"}}>🎣 Best Hooks</div><ul>{result.contentPatterns?.bestHooks?.map((h,i)=><li key={i}>{h}</li>)}</ul></div>
                  <div className="strat-cell"><div className="strat-cell-title" style={{color:"var(--a4)"}}>⚡ Viral Triggers</div><ul>{result.contentPatterns?.viralTriggers?.map((t,i)=><li key={i}>{t}</li>)}</ul></div>
                  <div className="strat-cell"><div className="strat-cell-title" style={{color:"var(--a3)"}}>📅 Posting Intel</div><ul><li><strong style={{color:"var(--text)"}}>Frequency:</strong> {result.contentPatterns?.postingFrequency}</li><li><strong style={{color:"var(--text)"}}>Best Times:</strong> {result.contentPatterns?.bestTimes}</li></ul></div>
                </div>
              </div>
            </div>

            <div className="result-section" style={{animationDelay:".24s"}}>
              <div className="result-header"><div className="result-icon" style={{background:"rgba(255,184,0,0.1)"}}>📱</div><div><div className="result-title">Platform Strategy</div><div className="result-subtitle">Where to invest and where not to</div></div></div>
              <div className="result-body">
                <div className="strat-grid">
                  <div className="strat-cell" style={{border:"1px solid rgba(0,229,160,0.3)",background:"rgba(0,229,160,0.04)"}}><div className="strat-cell-title" style={{color:"var(--a4)"}}>✅ Primary: {result.platformStrategy?.primary}</div><p style={{fontSize:13,color:"var(--muted2)",lineHeight:1.6}}>{result.platformStrategy?.primaryReason}</p></div>
                  <div className="strat-cell"><div className="strat-cell-title" style={{color:"var(--a3)"}}>🥈 Secondary: {result.platformStrategy?.secondary}</div><p style={{fontSize:13,color:"var(--muted2)",lineHeight:1.6}}>{result.platformStrategy?.secondaryReason}</p></div>
                  <div className="strat-cell" style={{gridColumn:"1/-1",border:"1px solid rgba(255,62,108,0.2)"}}><div className="strat-cell-title" style={{color:"var(--a2)"}}>⛔ Deprioritise: {result.platformStrategy?.avoid}</div><p style={{fontSize:13,color:"var(--muted2)",lineHeight:1.6}}>{result.platformStrategy?.avoidReason}</p></div>
                </div>
              </div>
            </div>

            <div className="result-section" style={{animationDelay:".32s"}}>
              <div className="result-header"><div className="result-icon" style={{background:"rgba(91,111,255,0.1)"}}>🧠</div><div><div className="result-title">4-Pillar Campaign Strategy</div><div className="result-subtitle">Full-funnel plan for maximum output</div></div></div>
              <div className="result-body">
                <div className="strat-grid">
                  <div className="strat-cell"><div className="strat-cell-title" style={{color:"#a78bfa"}}>👁 Awareness</div><ul>{result.strategyPillars?.awareness?.map((a,i)=><li key={i}>{a}</li>)}</ul></div>
                  <div className="strat-cell"><div className="strat-cell-title" style={{color:"var(--a3)"}}>💬 Engagement</div><ul>{result.strategyPillars?.engagement?.map((a,i)=><li key={i}>{a}</li>)}</ul></div>
                  <div className="strat-cell"><div className="strat-cell-title" style={{color:"var(--a4)"}}>💰 Conversion</div><ul>{result.strategyPillars?.conversion?.map((a,i)=><li key={i}>{a}</li>)}</ul></div>
                  <div className="strat-cell"><div className="strat-cell-title" style={{color:"var(--a1)"}}>🔁 Retention</div><ul>{result.strategyPillars?.retention?.map((a,i)=><li key={i}>{a}</li>)}</ul></div>
                </div>
              </div>
            </div>

            <div className="result-section" style={{animationDelay:".40s"}}>
              <div className="result-header"><div className="result-icon" style={{background:"rgba(255,107,53,0.1)"}}>⚡</div><div><div className="result-title">Top Priorities — Ranked by Impact</div><div className="result-subtitle">Execute in order for fastest results</div></div></div>
              <div className="result-body">
                <div className="priority-list">{result.topPriorities?.map((p,i)=>(
                  <div className="priority-item" key={i}>
                    <div className="priority-num">{i+1}</div>
                    <div><div className="priority-title">{p.title} <span className={`tag ${p.impact==="High"?"tag-orange":"tag-yellow"}`} style={{marginLeft:8,fontSize:11}}>{p.impact} Impact</span></div><div className="priority-desc">{p.desc}</div></div>
                  </div>
                ))}</div>
              </div>
            </div>

            <div className="result-section" style={{animationDelay:".48s"}}>
              <div className="result-header"><div className="result-icon" style={{background:"rgba(255,184,0,0.1)"}}>📅</div><div><div className="result-title">Weekly Content Calendar</div><div className="result-subtitle">Repeatable rhythm for consistent output</div></div></div>
              <div className="result-body">
                <div className="cal-grid">{result.weeklyCalendar?.map((day,i)=>(
                  <div className="cal-day" key={i}>
                    <div className="cal-day-name">{day.day}</div>
                    <div className="cal-tasks">{day.tasks?.map((t,j)=><div key={j} className={`cal-task ${taskClass[t.type]||"ct-post"}`}>{t.label}</div>)}</div>
                  </div>
                ))}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>
                  <span className="tag tag-red" style={{fontSize:11}}>🎬 Reel</span>
                  <span className="tag tag-green" style={{fontSize:11}}>📸 Post</span>
                  <span className="tag tag-yellow" style={{fontSize:11}}>💫 Story</span>
                  <span className="tag tag-orange" style={{fontSize:11}}>💰 Ad</span>
                </div>
              </div>
            </div>

            <div className="result-section" style={{animationDelay:".56s"}}>
              <div className="result-header"><div className="result-icon" style={{background:"rgba(0,229,160,0.1)"}}>💡</div><div><div className="result-title">Budget Allocation & Quick Wins</div><div className="result-subtitle">Where to spend and what to do today</div></div></div>
              <div className="result-body">
                <div className="strat-grid" style={{marginBottom:20}}>
                  {result.budgetAllocation&&Object.entries(result.budgetAllocation).map(([k,v])=>(
                    <div className="kpi" key={k}><div className="kpi-val" style={{color:"var(--a1)",fontSize:22}}>{v}%</div><div className="kpi-lbl" style={{textTransform:"capitalize"}}>{k}</div></div>
                  ))}
                </div>
                <div className="sect-divider"/>
                <div style={{marginBottom:10}}><label style={{fontSize:12,color:"var(--muted2)",letterSpacing:".06em",textTransform:"uppercase"}}>⚡ Do These This Week</label></div>
                <div className="priority-list">{result.quickWins?.map((w,i)=>(
                  <div className="priority-item" key={i} style={{padding:"10px 14px"}}>
                    <div className="priority-num" style={{width:24,height:24,fontSize:11}}>{i+1}</div>
                    <div className="priority-desc" style={{fontSize:13}}>{w}</div>
                  </div>
                ))}</div>
              </div>
            </div>

            {/* CONTENT KIT SECTION */}
            {!contentKit && (
              <div className="result-section" style={{animationDelay:".64s"}}>
                <div className="result-header">
                  <div className="result-icon" style={{background:"rgba(91,111,255,0.1)"}}>✍️</div>
                  <div><div className="result-title">Content &amp; Script Generator</div><div className="result-subtitle">Generate ready-to-use Reels scripts, carousels, ad copy &amp; WhatsApp templates</div></div>
                </div>
                <div className="result-body">
                  <div className="highlight-box"><strong>Powered by strategy analysis:</strong> Scripts and copy are tailored to the competitor gaps, viral triggers, and audience insights identified above — not generic templates.</div>
                  <button className="gen-content-btn" onClick={generateContentKit} disabled={contentLoading}>
                    {contentLoading ? <><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⚙️</span> Generating content kit…</> : <><span>✍️</span> Generate Full Content Kit</>}
                  </button>
                </div>
              </div>
            )}

            {contentKit && (
              <div className="result-section" style={{animationDelay:".64s"}}>
                <div className="result-header">
                  <div className="result-icon" style={{background:"rgba(91,111,255,0.1)"}}>✍️</div>
                  <div><div className="result-title">Content &amp; Script Kit</div><div className="result-subtitle">Ready-to-use — copy, paste, and post</div></div>
                </div>
                <div className="result-body">
                  <div className="content-tabs">
                    {[["reels","🎬 Reels Scripts"],["carousels","🖼 Carousels"],["adCopies","💰 Ad Copy"],["captions","📝 Captions"],["whatsappMessages","💬 WhatsApp"]].map(([id,label])=>(
                      <button key={id} className={"content-tab " + (contentTab===id?"active":"")} onClick={()=>setContentTab(id)}>{label}</button>
                    ))}
                  </div>

                  {/* REELS */}
                  {contentTab==="reels" && contentKit.reels?.map((r,i)=>(
                    <div className="script-card" key={i}>
                      <div className="script-label" style={{color:"#f472b6"}}>🎬 REEL {i+1}</div>
                      <div className="script-title">{r.title}</div>
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:".06em",color:"var(--a2)",marginBottom:6,fontWeight:600}}>⚡ Hook (First 3 seconds)</div>
                        <div style={{background:"rgba(255,62,108,0.08)",border:"1px solid rgba(255,62,108,0.2)",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#f9a8d4",fontStyle:"italic"}}>{r.hook}</div>
                      </div>
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:".06em",color:"var(--muted2)",marginBottom:6,fontWeight:600}}>📜 Full Script</div>
                        <div className="script-body" style={{background:"var(--s1)",border:"1px solid var(--border)",borderRadius:8,padding:"12px 14px"}}>{r.script}</div>
                      </div>
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:".06em",color:"var(--a4)",marginBottom:6,fontWeight:600}}>🎯 CTA</div>
                        <div style={{fontSize:13,color:"var(--a4)"}}>{r.cta}</div>
                      </div>
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:".06em",color:"var(--muted)",marginBottom:6,fontWeight:600}}>#️⃣ Hashtags</div>
                        <div style={{fontSize:12,color:"var(--muted2)"}}>{r.hashtags}</div>
                      </div>
                      <div style={{background:"rgba(0,229,160,0.06)",border:"1px solid rgba(0,229,160,0.15)",borderRadius:8,padding:"8px 12px",fontSize:12,color:"var(--a4)",marginBottom:12}}>💡 {r.whyItWorks}</div>
                      <CopyBtn text={r.hook + "\n\n" + r.script + "\n\nCTA: " + r.cta + "\n" + r.hashtags} label="Copy Full Script" />
                    </div>
                  ))}

                  {/* CAROUSELS */}
                  {contentTab==="carousels" && contentKit.carousels?.map((c,i)=>(
                    <div className="script-card" key={i}>
                      <div className="script-label" style={{color:"var(--a3)"}}>🖼 CAROUSEL {i+1}</div>
                      <div className="script-title">{c.title}</div>
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:".06em",color:"var(--a3)",marginBottom:6,fontWeight:600}}>⚡ Slide 1 Hook</div>
                        <div style={{background:"rgba(255,184,0,0.08)",border:"1px solid rgba(255,184,0,0.2)",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#fde68a",fontStyle:"italic"}}>{c.hook}</div>
                      </div>
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:".06em",color:"var(--muted2)",marginBottom:8,fontWeight:600}}>📋 All Slides</div>
                        <div style={{display:"flex",flexDirection:"column",gap:6}}>
                          {c.slides?.map((s,j)=>(
                            <div key={j} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                              <div style={{width:24,height:24,borderRadius:6,background:"linear-gradient(135deg,var(--a1),var(--a2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,flexShrink:0}}>{j+1}</div>
                              <div style={{fontSize:13,color:"var(--muted2)",lineHeight:1.6,paddingTop:3}}>{s}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:".06em",color:"var(--muted2)",marginBottom:6,fontWeight:600}}>📝 Caption</div>
                        <div className="script-body" style={{background:"var(--s1)",border:"1px solid var(--border)",borderRadius:8,padding:"12px 14px",fontSize:13}}>{c.caption}</div>
                      </div>
                      <CopyBtn text={c.hook + "\n\n" + c.slides?.join("\n") + "\n\nCaption:\n" + c.caption} label="Copy All Slides + Caption" />
                    </div>
                  ))}

                  {/* AD COPIES */}
                  {contentTab==="adCopies" && contentKit.adCopies?.map((a,i)=>(
                    <div className="script-card" key={i}>
                      <div className="script-label" style={{color:"var(--a1)"}}>💰 {a.format.toUpperCase()} AD</div>
                      <div className="script-title">{a.headline}</div>
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:6,fontWeight:600}}>Ad Body Copy</div>
                        <div className="script-body" style={{background:"var(--s1)",border:"1px solid var(--border)",borderRadius:8,padding:"12px 14px",fontSize:13}}>{a.primaryText}</div>
                      </div>
                      <div style={{display:"flex",gap:10,marginBottom:10,flexWrap:"wrap"}}>
                        <div style={{background:"rgba(0,229,160,0.08)",border:"1px solid rgba(0,229,160,0.2)",borderRadius:8,padding:"8px 12px",fontSize:12,color:"var(--a4)"}}>CTA Button: <strong>{a.cta}</strong></div>
                      </div>
                      <div style={{fontSize:12,color:"var(--muted)",marginBottom:12}}>🎯 Target: {a.targetingNote}</div>
                      <CopyBtn text={"Headline: " + a.headline + "\n\n" + a.primaryText + "\n\nCTA: " + a.cta + "\nTarget: " + a.targetingNote} label="Copy Ad Copy" />
                    </div>
                  ))}

                  {/* CAPTIONS */}
                  {contentTab==="captions" && contentKit.captions?.map((c,i)=>(
                    <div className="script-card" key={i}>
                      <div className="script-label" style={{color:"var(--a4)"}}>📝 {c.type.toUpperCase()} CAPTION</div>
                      <div style={{fontSize:12,color:"var(--muted)",marginBottom:10}}>Best for: {c.bestFor}</div>
                      <div className="script-body" style={{background:"var(--s1)",border:"1px solid var(--border)",borderRadius:8,padding:"14px",fontSize:13,marginBottom:12}}>{c.caption}</div>
                      <CopyBtn text={c.caption} label="Copy Caption" />
                    </div>
                  ))}

                  {/* WHATSAPP */}
                  {contentTab==="whatsappMessages" && contentKit.whatsappMessages?.map((w,i)=>(
                    <div className="script-card" key={i}>
                      <div className="script-label" style={{color:"#4ade80"}}>💬 {w.type.toUpperCase()}</div>
                      <div className="script-body" style={{background:"var(--s1)",border:"1px solid var(--border)",borderRadius:8,padding:"14px",fontSize:13,marginBottom:12}}>{w.message}</div>
                      <CopyBtn text={w.message} label="Copy Message" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DELIVERABLES SUMMARY IN RESULTS */}
            {getDelivSummaryText() && (
              <div style={{background:"var(--s1)",border:"1px solid rgba(255,184,0,0.25)",borderRadius:16,padding:"20px 24px",marginBottom:16}}>
                <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:".08em",color:"var(--a3)",fontWeight:700,marginBottom:10}}>📦 Deliverables Scope — This Month</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {DELIVERABLE_TYPES.filter(d=>deliverables[d.id]>0).map(d=>(
                    <span key={d.id} className="dtag">{d.emoji} {deliverables[d.id]}× {d.label}</span>
                  ))}
                  {delivCustomItems.filter(c=>c.qty>0).map((c,i)=>(
                    <span key={i} className="dtag">✦ {c.qty}× {c.label}</span>
                  ))}
                </div>
              </div>
            )}

            {/* EXPORT BAR */}
            <div className="export-bar">
              <span className="export-bar-label">📤 Export Report</span>
              <button className="export-btn ebtn-pdf" onClick={exportToPDF} disabled={exportingPdf}>
                {exportingPdf?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⚙️</span> Generating…</>:<>📄 Save as PDF</>}
              </button>
              <button className="export-btn ebtn-word" onClick={exportToWord} disabled={exportingWord}>
                {exportingWord?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⚙️</span> Generating…</>:<>📝 Save as Word</>}
              </button>
            </div>

            <button className="reset-btn" onClick={()=>{setPhase("input");setResult(null);setLoadStep(0);setScrapedData(null);setScrapeError("");setContentKit(null);setBriefParsed(false);setSuggestedCompetitors([]);setCompetitorUrls(["",""]);setCompetitorsConfirmed(false);}}>← Analyse Another Client</button>
          </div>
        )}
      </div>
    </div>
  );
}
