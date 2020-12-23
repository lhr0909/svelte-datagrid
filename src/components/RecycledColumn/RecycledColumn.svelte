<script>
  import { onDestroy, onMount } from 'svelte';
  import { animationFrameScheduler } from 'rxjs';
  import * as Ops from 'rxjs/operators';

  import Cell from '../Cell/Cell.svelte';

  import { cellHeight } from '../../utils/consts';
  import { yCoordsCalc, yScrollSubject$ } from '../../utils/subjects';

  export let cellData = [];

  let recycledColumn;
  let scrollSubscription;

  let cells = yCoordsCalc.changeSubject$.pipe(
    Ops.scan((acc, { changes }) => Object.assign(acc, changes), {}),
    Ops.map(Object.values),
    Ops.map(changes => changes.map(({ idx, val }) => ({
      idx,
      y: val,
      x: 0,
      text: cellData[Math.floor(val / cellHeight)],
    }))),
  );

  const updateYCoordsCalc = () => {
    recycledColumn.style.height = `${(yCoordsCalc.viewportCount - 1) * cellHeight}px`;

    // handle scroll left
    scrollSubscription = yScrollSubject$.pipe(Ops.throttleTime(0, animationFrameScheduler)).subscribe(scrollTop => {
      recycledColumn.scrollTop = scrollTop;
    });
  }

  onMount(() => {
    updateYCoordsCalc();
  });

  onDestroy(() => {
    scrollSubscription && scrollSubscription.unsubscribe();
  });

</script>

<style>
  .recycled-column {
    overflow-y: hidden;
    overflow-x: auto;
  }

  .recycled-column-inner {
    position: relative;
    height: var(--column-height);
    width: calc(var(--cell-width) + 2px);
  }
</style>

<div
  class="recycled-column"
  bind:this={recycledColumn}
>
  <div
    class="recycled-column-inner"
    style="
      --column-height: {cellData.length * cellHeight}px;
    "
  >
    {#each $cells as cell (cell.idx)}
      <Cell x={cell.x} y={cell.y} text={cell.text} />
    {/each}
  </div>
</div>
