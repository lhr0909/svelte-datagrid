<script>
  import { onMount } from 'svelte';

  import { cellWidth, cellHeight } from '../../utils/consts';

  export let x;
  export let y;
  export let text;

  let cell;

  onMount(() => {
    cell.style.width = `${cellWidth}px`;
    cell.style.height = `${cellHeight}px`;
  });

</script>

<style>
  .cell {
    position: absolute;
    background-color: white;
    top: 0;
    left: 0;
    border: 1px solid black;
    text-align: center;
  }
</style>

<div
  class="cell"
  bind:this={cell}
  style="
    transform: translate({x}px, {y}px);
  "
>
  {text}
</div>
