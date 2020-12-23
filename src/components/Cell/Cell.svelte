<script>
  import { cellWidth, cellHeight } from '../../utils/consts';

  export let x;
  export let y;
  export let text;
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

<div class="cell" style="
      width: {cellWidth}px;
      height: {cellHeight}px;
      transform: translate({x}px, {y}px);
    ">
    {text}
</div>
