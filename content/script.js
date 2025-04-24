// script.js

// Utility: wait until a DOM selector matches something (up to timeout ms)
function waitForSelector(selector, timeout = 10000) {
	return new Promise((resolve, reject) => {
	  const start = Date.now();
	  const timer = setInterval(() => {
		const el = document.querySelector(selector);
		if (el) {
		  clearInterval(timer);
		  resolve(el);
		} else if (Date.now() - start > timeout) {
		  clearInterval(timer);
		  reject(`Timeout waiting for selector: ${selector}`);
		}
	  }, 200);
	});
  }
  
  // Main entry: inject filters as soon as the Outlook pivot bar is ready
  (async () => {
	try {
	  // 1) wait for the "Focused | Other" tablist to appear
	  const tablist = await waitForSelector('div[role="tablist"]');
  
	  // 2) build our filter‐button container
	  const container = document.createElement('div');
	  container.id = 'email-enhancer-filters';
	  container.style.display = 'flex';
	  container.style.margin = '12px 0';
	  container.style.gap = '8px';
  
	  // 3) define your four filters
	  const filters = [
		{ name: 'Professors', fn: filterProfessors },
		{ name: 'Announcements', fn: filterAnnouncements },
		{ name: 'Promotions', fn: filterPromotions },
		{ name: 'My Priority', fn: filterPriority }
	  ];
  
	  // 4) create buttons for each filter
	  filters.forEach(({name, fn}, idx) => {
		const btn = document.createElement('button');
		btn.textContent = name;
		btn.classList.add('ms-Button', 'ms-Button--command');
		btn.style.flex = 'none';
		btn.addEventListener('click', () => {
		  // clear previous active state
		  container.querySelectorAll('.is-active')
			.forEach(x => x.classList.remove('is-active'));
		  btn.classList.add('is-active');
		  applyFilter(fn);
		});
		// make the first one active by default
		if (idx === 0) btn.classList.add('is-active');
		container.appendChild(btn);
	  });
  
	  // 5) insert our container just above the Outlook pivot
	  tablist.parentElement.insertBefore(container, tablist);
  
	  // 6) kick it off with the default filter
	  applyFilter(filters[0].fn);
  
	} catch (err) {
	  console.error('Email Enhancer:', err);
	}
  })();
  
  // Applies a given filter function to every message row
  function applyFilter(criteriaFn) {
	// each message item is a role="option" with aria-label
	const rows = document.querySelectorAll('[role="option"][aria-label]');
	rows.forEach(row => {
	  const show = criteriaFn(row);
	  row.style.display = show ? '' : 'none';
	});
  }
  
  // Filter #1: Professors → show any email from your stevens.edu faculty
  function filterProfessors(row) {
	const avatar = row.querySelector('.fui-Avatar');
	const sender = avatar && avatar.getAttribute('aria-label') || '';
	// adjust this pattern to match your professors’ addresses or names
	return /@stevens\.edu$/i.test(sender);
  }
  
  // Filter #2: Announcements → show official “Office of…” or “Division of…” senders
  function filterAnnouncements(row) {
	const avatar = row.querySelector('.fui-Avatar');
	const sender = avatar && avatar.getAttribute('aria-label') || '';
	return /Office|Division|Center|Research/i.test(sender);
  }
  
  // Filter #3: Promotions → show external, non-Stevens senders
  function filterPromotions(row) {
	const avatar = row.querySelector('.fui-Avatar');
	const sender = avatar && avatar.getAttribute('aria-label') || '';
	// anything not coming from stevens.edu
	return !/@stevens\.edu$/i.test(sender);
  }
  
  // Filter #4: My Priority → show flagged messages
  function filterPriority(row) {
	// look for the flag button being “pressed”
	const flagBtn = row.querySelector('button[title="Flag this message"]');
	return flagBtn && flagBtn.getAttribute('aria-pressed') === 'true';
  }
  