// Immediately-invoked so we don’t pollute globals
(function() {
	// 1) Create the full-screen overlay host
	const host = document.createElement('div');
	host.id = 'email-enhancer-overlay';
	Object.assign(host.style, {
	  position: 'fixed',
	  top: 0, left: 0,
	  width: '100%', height: '100%',
	  pointerEvents: 'none',       // let clicks pass through
	  zIndex: 9999
	});
	document.body.appendChild(host);
  
	// 2) Option A: use Shadow DOM for true CSS encapsulation
	const shadowRoot = host.attachShadow({ mode: 'open' });
	// inject your CSS and HTML into the shadow
	shadowRoot.innerHTML = `
	  <link rel="stylesheet"
			href="${chrome.runtime.getURL('content/styles.css')}">
	  <div id="enhancer-panel">
		<h3>Email Enhancer</h3>
		<button id="toggle-priority">Toggle Priority</button>
		<!-- more controls here -->
	  </div>
	`;
  
	// 3) Wire up your controls
	shadowRoot.getElementById('toggle-priority').addEventListener('click', e => {
	  // Example: highlight professor emails
	  document.querySelectorAll('.some-email-selector').forEach(el => {
		el.classList.toggle('highlighted');
	  });
	});
  })();
  