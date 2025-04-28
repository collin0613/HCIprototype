// content/script.js

// 1) Helper to wait for a selector
function waitForSelector(sel, timeout = 10000) {
	return new Promise((res, rej) => {
	  const start = Date.now();
	  const iv = setInterval(() => {
		const el = document.querySelector(sel);
		if (el) {
		  clearInterval(iv);
		  res(el);
		} else if (Date.now() - start > timeout) {
		  clearInterval(iv);
		  rej(new Error(`Timeout waiting for ${sel}`));
		}
	  }, 200);
	});
  }
  
  // 2) Lighten hex color by pct (0–100)
  function lightenColor(hex, pct) {
	const num = parseInt(hex.replace('#', ''), 16);
	const r = (num >> 16) & 0xFF;
	const g = (num >> 8) & 0xFF;
	const b = num & 0xFF;
	const nr = Math.min(255, Math.round(r + (255 - r) * pct / 100));
	const ng = Math.min(255, Math.round(g + (255 - g) * pct / 100));
	const nb = Math.min(255, Math.round(b + (255 - b) * pct / 100));
	return '#' + ((1 << 24) + (nr << 16) + (ng << 8) + nb).toString(16).slice(1);
  }
  
  // 3) Main injection
  (async () => {
	try {
	  // 3a) Wait for Outlook's main pane
	  await waitForSelector('[role="tab"]');
	  const mainPane = await waitForSelector('[role="main"]');
  
	  // 3b) Build file-input & Load button
	  const fileInput = document.createElement('input');
	  fileInput.type = 'file';
	  fileInput.accept = '.olm,.zip';
	  fileInput.style.display = 'none';
	  document.body.appendChild(fileInput);
  
	  // 3c) Containers: filter bar + results
	  const filterBar = document.createElement('div');
	  filterBar.id = 'email-enhancer-filters';
	  Object.assign(filterBar.style, {
		display: 'flex',
		gap: '8px',
		padding: '8px',
		background: '#fff',
		borderBottom: '1px solid #ccc'
	  });
  
	  const outputDiv = document.createElement('div');
	  outputDiv.id = 'email-enhancer-output';
	  Object.assign(outputDiv.style, {
		padding: '8px',
		background: '#fafafa',
		maxHeight: '400px',
		overflowY: 'auto'
	  });
  
	  // 3d) Helper to parse the OLM via JSZip
	  async function parseOlm(file) {
		const blob = await file.arrayBuffer();
		const zip = await JSZip.loadAsync(blob);
		const emails = [];
		for (const path of Object.keys(zip.files)) {
		  if (path.includes('/com.microsoft.__Messages/Inbox/message_') && path.endsWith('.xml')) {
			const xmlText = await zip.files[path].async('string');
			const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
			const subject = doc.querySelector('OPFMessageCopyThreadTopic')?.textContent || '(no subject)';
			const date = doc.querySelector('OPFMessageCopyReceivedTime')?.textContent || '';
			const fromElem = doc.querySelector('OPFMessageCopyFromAddresses emailAddress');
			const from = fromElem?.getAttribute('OPFContactEmailAddressAddress')?.trim() || '';
			const name = fromElem?.getAttribute('OPFContactEmailAddressName')?.trim() || '';
			emails.push({ from, name, subject, date });
		  }
		}
		return emails;
	  }
  
	  // 3e) Define filters and icons
	  const filters = [
		{
		  name: 'University/Faculty',
		  fn: e => /@stevens\.edu\b/i.test(e.from)
					 && !/^(?:donotreply|ducklink|studentbelonging|racs|newspoints)@stevens\.edu$/i.test(e.from),
		  color: '#e57373',
		  icon: null // dynamic based on name
		},
		{
		  name: 'Campus LMS',
		  fn: e => /@instructure\.com\b/i.test(e.from),
		  color: '#64b5f6',
		  icon: '📢'
		},
		{
		  name: 'Campus Events',
		  fn: e => /^(?:donotreply|ducklink|studentbelonging|racs|newspoints)@stevens\.edu$/i.test(e.from)
					|| /@(?:engage\.)?academicimpressions\.com\b/i.test(e.from),
		  color: '#81c784',
		  icon: '🗓️'
		},
		{
		  name: 'External Resources',
		  fn: e => !filters[0].fn(e) && !filters[1].fn(e) && !filters[2].fn(e),
		  color: '#ffb74d',
		  icon: '🔔'
		}
	  ];
  
	  let allEmails = [];
  
	  // 3f) Render list into outputDiv with emojis
	  function render(list, filter, color) {
		outputDiv.innerHTML = '';
		outputDiv.style.background = lightenColor(color, 20);
		if (!list.length) {
		  const msg = document.createElement('div');
		  msg.textContent = 'No messages in this category.';
		  outputDiv.appendChild(msg);
		  return;
		}
		const now = Date.now();
		list.forEach(e => {
		  const row = document.createElement('div');
		  const dateMs = new Date(e.date).getTime();
		  const isRecent = now - dateMs <= 24 * 60 * 60 * 1000;
		  // Determine icon
		  let icon = filter.icon;
		  if (filter.name === 'University/Faculty') {
			const words = e.name.split(/\s+/).filter(w => w);
			icon = words.length === 2 ? '👤' : '🏫';
		  }
		  if (isRecent) row.style.fontWeight = 'bold';
		  const text = `${icon} [${e.from}] ${e.name ? `(${e.name}) ` : ''}${e.subject} — ${new Date(e.date).toLocaleString()}`;
		  row.textContent = text;
		  Object.assign(row.style, { padding: '4px 0', borderBottom: '1px solid #ddd' });
		  outputDiv.appendChild(row);
		});
	  }
  
	  // 3g) Load button
	  const loadBtn = document.createElement('button');
	  loadBtn.textContent = '📂 Load OLM…';
	  Object.assign(loadBtn.style, { flex: '0 0 auto', padding: '8px', cursor: 'pointer' });
	  loadBtn.addEventListener('click', () => fileInput.click());
	  filterBar.appendChild(loadBtn);
  
	  // 3h) Create filter buttons
	  const filterButtons = filters.map((f, idx) => {
		const btn = document.createElement('button');
		btn.textContent = f.name;
		Object.assign(btn.style, {
		  flex: '1', padding: '8px', background: f.color,
		  color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: '0.5'
		});
		btn.disabled = true;
		btn.addEventListener('click', () => {
		  filterButtons.forEach(b => b.style.opacity = '0.5');
		  btn.style.opacity = '1';
		  const matches = allEmails
			.filter(f.fn)
			.sort((a, b) => new Date(b.date) - new Date(a.date));
		  render(matches, f, f.color);
		});
		filterBar.appendChild(btn);
		return btn;
	  });
  
	  // 3i) File selection handling
	  fileInput.addEventListener('change', async () => {
		if (!fileInput.files.length) return;
		allEmails = await parseOlm(fileInput.files[0]);
		filterButtons.forEach(btn => { btn.disabled = false; btn.style.opacity = '0.5'; });
		filterButtons[0].click();
	  });
  
	  // 3j) Inject UI into page
	  mainPane.insertBefore(filterBar, mainPane.firstElementChild);
	  mainPane.insertBefore(outputDiv, filterBar.nextSibling);
  
	} catch (e) {
	  console.error('Email Enhancer:', e);
	}
  })();
  