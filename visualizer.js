// Decide which visualizer view to load based on query parameter
const params = new URLSearchParams(window.location.search);
const algo = params.get('algo');

if (algo) {
	// load runner view
	import('./components/visualizer/Runner/Runner.js');
	// create runner element and pass algo attribute
	const runnerEl = document.createElement('algorithm-runner');
	runnerEl.setAttribute('algo', algo);
	document.body.appendChild(runnerEl);
} else {
	import('./components/visualizer/AppShell/AppShell.js');
}

