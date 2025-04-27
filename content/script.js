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
  
  // Main entry: inject filters in a full-width box above the message pane
  (async () => {
	try {
	  // 1) wait for any pivot tab to load
	  await waitForSelector('[role="tab"]', 15000);
  
	  // 2) find the "Focused" tab by its visible text
	  const tabElements = document.querySelectorAll('[role="tab"]');
	  const focusedTab = Array.from(tabElements).find(tab => tab.textContent.trim() === 'Focused');
	  if (!focusedTab) throw new Error("Couldn't find the 'Focused' pivot tab");
  
	  // 3) ensure message pane (role="main") is ready
	  const mainPane = await waitForSelector('[role="main"]', 15000);
  
	  // 4) build our filter container
	  const container = document.createElement('div');
	  container.id = 'email-enhancer-filters';
	  Object.assign(container.style, {
		display: 'flex',
		gap: '12px',
		width: '100%',
		boxSizing: 'border-box',
		padding: '8px 16px',
		background: 'rgba(255, 255, 255, 0.98)',
		borderBottom: '1px solid #ccc',
		justifyContent: 'space-evenly',
		zIndex: '1000'
	  });
  
	  // 5) define our four filters with pastel colors
	  const filters = [
		{ name: 'Professors', fn: filterProfessors, color: '#e57373' },   // light red
		{ name: 'Announcements', fn: filterAnnouncements, color: '#64b5f6' }, // light blue
		{ name: 'Promotions', fn: filterPromotions, color: '#81c784' },     // light green
		{ name: 'My Priority', fn: filterPriority, color: '#ffb74d' }       // light orange
	  ];
  
	  // 6) create and append buttons
	  filters.forEach((filter, idx) => {
		const btn = document.createElement('button');
		btn.textContent = filter.name;
		btn.classList.add('ms-Button', 'ms-Button--command');
		// set background and text color
		btn.style.backgroundColor = filter.color;
		btn.style.color = 'white';
		btn.style.border = 'none';
		btn.style.flex = '1';
		btn.style.padding = '8px 0';
		btn.style.cursor = 'pointer';
		btn.style.borderRadius = '6px';
  
		btn.addEventListener('click', () => {
		  // clear previous active state
		  container.querySelectorAll('.is-active').forEach(el => el.classList.remove('is-active'));
		  btn.classList.add('is-active');
		  applyFilter(filter.fn);
		});
		if (idx === 0) btn.classList.add('is-active');
		container.appendChild(btn);
	  });
  
	  // 7) insert our container at the top of the main pane, above the message toolbar
	  mainPane.insertBefore(container, mainPane.firstElementChild);
  
	  // 8) apply default filter
	  applyFilter(filters[0].fn);
  
	} catch (err) {
	  console.error('Email Enhancer:', err);
	}
  })();
  
  // Applies a given filter function to every message row
  function applyFilter(criteriaFn) {
	const rows = document.querySelectorAll('[role="option"][aria-label]');
	rows.forEach(row => {
	  const show = criteriaFn(row);
	  row.style.display = show ? '' : 'none';
	});
  }
  
  // Filter #1: Professors → show any email from your stevens.edu faculty
  function filterProfessors(row) {
	const avatar = row.querySelector('.fui-Avatar');
	const sender = (avatar && avatar.getAttribute('aria-label')) || '';
	return /@stevens\.edu$/i.test(sender);
  }
  
  // Filter #2: Announcements → show official “Office of…” or “Division of…” senders
  function filterAnnouncements(row) {
	const avatar = row.querySelector('.fui-Avatar');
	const sender = (avatar && avatar.getAttribute('aria-label')) || '';
	return /Office|Division|Center|Research/i.test(sender);
  }
  
  // Filter #3: Promotions → show external, non-Stevens senders
  function filterPromotions(row) {
	const avatar = row.querySelector('.fui-Avatar');
	const sender = (avatar && avatar.getAttribute('aria-label')) || '';
	return !/@stevens\.edu$/i.test(sender);
  }
  
  // Filter #4: My Priority → show flagged messages
  function filterPriority(row) {
	const flagBtn = row.querySelector('button[title="Flag this message"]');
	return flagBtn && flagBtn.getAttribute('aria-pressed') === 'true';
  }