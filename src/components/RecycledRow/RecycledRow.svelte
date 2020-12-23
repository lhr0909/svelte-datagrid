<script>
  import { onDestroy, onMount } from 'svelte';
  import { animationFrameScheduler } from 'rxjs';
  import * as Ops from 'rxjs/operators';

  import Cell from '../Cell/Cell.svelte';

  import { cellWidth } from '../../utils/consts';
  import { xCoordsCalc, xScrollSubject$ } from '../../utils/subjects';

  export let y;
  export let cellData = [];
  export let absolute = false;

  let recycledRow;
  let scrollSubscription;

  let cells = xCoordsCalc.changeSubject$.pipe(
    Ops.scan((acc, { changes }) => Object.assign(acc, changes), {}),
    Ops.map(Object.values),
    Ops.map(changes => changes.map(({ idx, val }) => ({
      idx,
      x: val,
      y: 0,
      text: cellData[Math.floor(val / cellWidth)].slice(),
    }))),
  );

  const updateXCoordsCalc = () => {
    recycledRow.style.width = `${(xCoordsCalc.viewportCount - 1) * cellWidth}px`;

    // handle scroll left
    scrollSubscription = xScrollSubject$.pipe(Ops.throttleTime(0, animationFrameScheduler)).subscribe(scrollLeft => {
      recycledRow.scrollLeft = scrollLeft;
    });
  }

  onMount(() => {
    updateXCoordsCalc();
  });

  onDestroy(() => {
    scrollSubscription && scrollSubscription.unsubscribe();
  });
</script>

<style>
  .recycled-row {
    overflow-x: hidden;
    overflow-y: auto;
  }

  .absolute {
    position: absolute;
  }

  .recycled-row-inner {
    position: relative;
    width: var(--row-width);
    height: calc(var(--cell-height) + 2px);
  }
</style>

<div
  class="recycled-row"
  class:absolute
  bind:this={recycledRow}
  style="
    transform: translateY({y}px);
  "
>
  <div
    class="recycled-row-inner"
    style="
      --row-width: {cellData.length * cellWidth}px;
    "
  >
    {#each $cells as cell (cell.idx)}
      <Cell x={cell.x} y={cell.y} text={cell.text} />
    {/each}
  </div>
</div>
