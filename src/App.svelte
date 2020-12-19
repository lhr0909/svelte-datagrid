<script>
  import Grid from './components/Grid/Grid.svelte';
  import ScrollContainer from './components/ScrollContainer/ScrollContainer.svelte';
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
  <ScrollContainer />
</div>
