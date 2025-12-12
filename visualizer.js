const params = new URLSearchParams(window.location.search);
const algo = params.get('algo');

if (algo) {
	import('./components/visualizer/Runner/Runner.js');
	const runnerEl = document.createElement('algorithm-runner');
	runnerEl.setAttribute('algo', algo);
	document.body.appendChild(runnerEl);
} else {
	import('./components/visualizer/AppShell/AppShell.js');
}

