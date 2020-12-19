<script>
  import { cellWidth, cellHeight } from '../../utils/consts';

  export let style;
  export let x;
  export let y;
  export let text;
</script>

<style>
  .cell {
    background-color: white;
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid black;
  }
</style>

<div class="cell" style="
      z-index: {style.zIndex};
      width: {cellWidth}px;
      height: {cellHeight}px;
      transform: translate({x}px, {y}px);
    ">
    {text}
</div>
