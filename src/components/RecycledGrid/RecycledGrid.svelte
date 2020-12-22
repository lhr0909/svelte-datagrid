<script>
  import { onDestroy, onMount } from 'svelte';
  import * as Ops from 'rxjs/operators';

  import RecycledRow from '../RecycledRow/RecycledRow.svelte';

  import { columns, rows as rowCount, cellHeight, cellWidth } from '../../utils/consts';
  import { yCoordsCalc, scrollSubject$, xCoordsCalc } from '../../utils/subjects';

  export let style;
  // export let y;
  export let cellData = [];
  export let initialX = 0;
  export let initialY = 0;

  let rows = [];

  let scrollSubscription;
  let changeSubscription;

  const updateYCoordsCalc = () => {
    const recycledGridRef = document.querySelector('.recycled-grid');

    if (!recycledGridRef) return;

    const recycledGrid = recycledGridRef;

    recycledGrid.style.width = `${(xCoordsCalc.viewportCount - 1) * cellWidth}px`;
    recycledGrid.style.height = `${(yCoordsCalc.viewportCount - 1) * cellHeight}px`;

    yCoordsCalc.changeSubject$
      .pipe(Ops.take(1))
      .toPromise()
      .then(({ changes }) => {
        rows = (changes.map(({ idx, val }) => {
          return {
            y: val,
            cellData: (cellData[idx] || []).slice(),
            // text: cellData[idx],
          };
        }));
      });

    // handle scroll left
    scrollSubscription = scrollSubject$.subscribe(({ scrollTop }) => {
      recycledGrid.scrollTop = scrollTop;
    });

    // subscribe updates
    changeSubscription = yCoordsCalc.changeSubject$
      .pipe(Ops.skip(1))
      .subscribe(({ changes }) => {
        changes.forEach(({ idx, val }) => {
          const row = rows[idx];
          row.y = val;

          const nextCellData = cellData[Math.floor(val / cellWidth)];

          if (nextCellData) row.cellData = nextCellData.slice();
        });

        rows = rows;
      });
  }

  onMount(() => {
    updateYCoordsCalc();
  });

  onDestroy(() => {
    scrollSubscription.unsubscribe();
    changeSubscription.unsubscribe();
  });

</script>

<style>
  .recycled-grid {
    position: absolute;
    top: var(--y-val);
    left: var(--x-val);
    overflow: hidden;
  }

  .recycled-grid-items {
    position: relative;
    width: 100%;
    height: 100%;
  }

</style>

<div
  class="recycled-grid"
  style="
    --x-val: {initialX}px;
    --y-val: {initialY}px;
    z-index: {style.zIndex};
  "
>
  <div
    class="recycled-grid-items"
    style="
      width: {columns * cellWidth}px;
      height: {rowCount * cellHeight}px;
    "
  >
    {#each rows as row}
      <RecycledRow {...row} style={{ zIndex: style.zIndex }} initialX={0} />
    {/each}
  </div>
</div>
