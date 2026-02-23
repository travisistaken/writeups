/* writeups.travisteo.com — main.js */

const WRITEUPS = [
  {id:1, type:'lab', platform:'OverTheWire', diff:'Easy', date:'2025-01',
   title:'Bandit Wargame — Level 0 → 15',
   body:'Worked through Bandit: SSH basics, file system navigation, hidden files, setuid binaries, and Bash scripting. Each level built on the last — the challenge isn\'t individual commands, it\'s connecting them.',
   detail:`<h2>Bandit Wargame — Level 0 → 15</h2><div class="msub">OverTheWire · January 2025</div><div class="mlabel">What I Practised</div><p>Worked through the first 15 levels of Bandit, covering SSH login, hidden files, directory navigation, file permissions, and setuid binaries.</p><div class="mlabel">Commands Used</div><p>ssh, ls -la, cat, find, grep, sort, uniq, strings, base64, tr, xxd, nc, openssl, chmod</p><div class="mlabel">Key Takeaway</div><p>chmod, find, and file permissions are exactly the misconfigurations I look for in vulnerability assessments. Understanding the attacker perspective made my Nessus documentation at ST Engineering significantly more detailed.</p>`,
   tags:['Linux','Bash','SSH','File Permissions']},
  {id:2, type:'lab', platform:'HackTheBox', diff:'Medium', date:'2025-03',
   title:'Network Enumeration &amp; Service Discovery',
   body:'Practised identifying open ports, running services, and entry points across multiple machines. Framed each finding in terms of actual business risk rather than just technical detail.',
   detail:`<h2>Network Enumeration & Service Discovery</h2><div class="msub">HackTheBox · March 2025</div><div class="mlabel">What I Practised</div><p>Systematic network enumeration with nmap across multiple HackTheBox machines. Focus on identifying exposed services and documenting findings clearly.</p><div class="mlabel">Tools Used</div><p>nmap, netcat, enum4linux, smbclient, gobuster</p><div class="mlabel">Key Takeaway</div><p>Framing every finding in terms of impact — "what could an attacker do with this?" — made my Nessus reports at ST Engineering significantly more actionable for remediation teams.</p>`,
   tags:['nmap','SMB','Enumeration','Risk Framing']},
  {id:3, type:'course', platform:'Cisco NetAcad', diff:'Course', date:'2024-11',
   title:'Intro to Cybersecurity — Key Concepts',
   body:'Personal notes from the Cisco Introduction to Cybersecurity course. CIA triad, social engineering, cryptography basics, and how they connect to real-world threats.',
   detail:`<h2>Intro to Cybersecurity — Key Concepts</h2><div class="msub">Cisco Networking Academy · November 2024</div><div class="mlabel">What I Covered</div><p>After completing the Cisco course, I wrote a personal summary of core concepts — CIA triad, types of attacks (DoS, phishing, MitM), social engineering, and basic symmetric/asymmetric cryptography.</p><div class="mlabel">Key Takeaway</div><p>Every security decision maps back to one question: does this protect Confidentiality, Integrity, or Availability?</p>`,
   tags:['CIA Triad','Cryptography','Social Engineering']},
  {id:4, type:'event', platform:'BuildingBloCS', diff:'Conference', date:'2025-06',
   title:'BuildingBloCS 2025 — AI &amp; Machine Learning',
   body:'Computing conference at SUTD focused on AI and ML. Zero background going in — enrolled in the beginner pathway with Python, TensorFlow, PyCaret, and neural network workshops.',
   detail:`<h2>BuildingBloCS 2025</h2><div class="msub">SUTD Singapore · June 2025</div><div class="mlabel">What I Attended</div><p>Enrolled in the beginner pathway at BuildingBloCS. Workshops covered Python basics applied to ML, TensorFlow and PyCaret, and sessions on Neural Networks and LLMs.</p><div class="mlabel">Key Takeaway</div><p>Sparked genuine curiosity about where AI and cybersecurity intersect — particularly AI-powered threat detection.</p>`,
   tags:['AI','Machine Learning','Python','TensorFlow']},
  {id:5, type:'lab', platform:'Self-Directed', diff:'In Progress', date:'2026-01',
   title:'SOC Home Lab — Planning Stage',
   body:'Planning a personal SOC environment: Windows VM monitored by Wazuh SIEM, simulated attacks from Kali Linux. Goal is to write custom detection rules and generate real alerts.',
   detail:`<h2>SOC Home Lab</h2><div class="msub">Self-directed · In Progress</div><div class="mlabel">Planned Setup</div><p>Windows 10 VM as endpoint, Wazuh SIEM on Ubuntu collecting logs, Kali Linux as attacker machine. Goal: write custom detection rules and generate real alerts.</p><div class="mlabel">Why I'm Building This</div><p>Hands-on SIEM experience is the most commonly required skill for SOC Analyst entry-level roles in Singapore.</p>`,
   tags:['SIEM','Wazuh','Kali Linux','Detection Engineering']},
];

function onPageReady() {
  const list    = document.getElementById('wu-list');
  const pag     = document.getElementById('wu-pag');
  const filters = document.querySelectorAll('[data-wf]');
  if (!list) return;

  let active = 'all', page = 1;
  const PER_PAGE = 6;

  function filtered() {
    return [...WRITEUPS].sort((a,b)=>b.date.localeCompare(a.date))
      .filter(w => active === 'all' || w.type === active);
  }
  function render() {
    const data  = filtered();
    const total = Math.ceil(data.length / PER_PAGE);
    page = Math.min(page, total||1);
    list.innerHTML = '';
    data.slice((page-1)*PER_PAGE, page*PER_PAGE).forEach(w => {
      const d = document.createElement('div');
      d.className = 'wu-full-card';
      d.innerHTML = `
        <div class="wu-card-header">
          <div class="wu-card-badges">
            <span class="tag" style="text-transform:uppercase;letter-spacing:0.8px;">${escHtml(w.platform)}</span>
            <span class="tag">${escHtml(w.diff)}</span>
          </div>
          <span class="wu-card-date">${escHtml(w.date)}</span>
        </div>
        <div class="wu-card-title">${w.title}</div>
        <p class="wu-card-body">${w.body}</p>
        <div class="tag-row">${w.tags.map(t=>`<span class="tag">${escHtml(t)}</span>`).join('')}</div>
        <button class="proj-btn" style="margin-top:12px;">Read more ↗</button>
      `;
      d.querySelector('.proj-btn').addEventListener('click', () => {
        window._openModal && window._openModal(w.detail + `<div class="tag-row" style="margin-top:18px">${w.tags.map(t=>`<span class="tag">${escHtml(t)}</span>`).join('')}</div>`);
      });
      list.appendChild(d);
    });
    if (pag) {
      pag.innerHTML = '';
      for (let i=1; i<=total; i++) {
        const b = document.createElement('button');
        b.className = 'page-btn' + (i===page?' active':'');
        b.textContent = i;
        b.addEventListener('click', ()=>{page=i; render(); list.scrollIntoView({behavior:'smooth'});});
        pag.appendChild(b);
      }
    }
  }
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    active = btn.dataset.wf; page = 1; render();
  }));
  render();
}
