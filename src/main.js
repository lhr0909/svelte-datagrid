import App from './App.svelte';

import { resizeSubject$ } from './utils/subjects';

const resize = () => {
  resizeSubject$.next({ width: window.innerWidth, height: window.innerHeight });
};

window.addEventListener('resize', resize);
resize();

const app = new App({
  target: document.body,
});

window.app = app;

export default app;
