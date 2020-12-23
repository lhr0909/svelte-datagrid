<script>
  import Grid from './components/Grid/Grid.svelte';
  import HorizontalScrollBar from './components/ScrollBar/HorizontalScrollBar.svelte';
  import VeriticalScrollBar from './components/ScrollBar/VeriticalScrollBar.svelte';
</script>

<style>
  .app-container {
    height: 100vh;
    position: relative;
    width: 100vw;
    margin: 0;
    padding: 0;
  }
</style>

<div class="app-container">
  <Grid />
  <HorizontalScrollBar />
  <VeriticalScrollBar />
</div>
