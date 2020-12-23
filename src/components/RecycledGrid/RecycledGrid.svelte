<script>
  import { onDestroy, onMount } from 'svelte';
  import { animationFrameScheduler } from 'rxjs';
  import * as Ops from 'rxjs/operators';

  import RecycledRow from '../RecycledRow/RecycledRow.svelte';

  import { cellHeight, cellWidth } from '../../utils/consts';
  import { yCoordsCalc, yScrollSubject$ } from '../../utils/subjects';

  export let cellData = [];

  let recycledColumn;
  let scrollSubscription;

  let rows = yCoordsCalc.changeSubject$.pipe(
    Ops.scan((acc, { changes }) => Object.assign(acc, changes), {}),
    Ops.map(Object.values),
    Ops.map(changes => changes.map(({ idx, val }) => ({
      idx,
      y: val,
      data: cellData[Math.floor(val / cellHeight)] && cellData[Math.floor(val / cellHeight)].slice() || [],
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
  .recycled-grid {
    overflow-y: hidden;
    overflow-x: auto;
  }

  .recycled-grid-inner {
    position: relative;
    height: var(--column-height);
    width: var(--row-width);
  }
</style>

<div
  class="recycled-grid"
  bind:this={recycledColumn}
>
  <div
    class="recycled-grid-inner"
    style="
      --column-height: {cellData.length * cellHeight}px;
      --row-width: {(cellData[0] && cellData[0].length || 0) * cellWidth}px;
    "
  >
    {#each $rows as row (row.idx)}
      <RecycledRow y={row.y} cellData={row.data} absolute={true} />
    {/each}
  </div>
</div>
