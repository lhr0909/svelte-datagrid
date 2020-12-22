<script>
  import { onDestroy, onMount } from 'svelte';
  import * as Ops from 'rxjs/operators';

  import Cell from '../Cell/Cell.svelte';

  import { rows, cellHeight, cellWidth } from '../../utils/consts';
  import { yCoordsCalc, scrollSubject$ } from '../../utils/subjects';

  export let style;
  export let x = 0;
  export let cellData = [];
  export let initialY = 0;

  let cells = [];
  let height = (rows * cellHeight);
  let y = initialY;

  let scrollSubscription;
  let changeSubscription;

  const updateYCoordsCalc = () => {
    const recycledColumnRef = document.querySelector('.recycled-column');

    if (!recycledColumnRef) return;

    const recycledColumn = recycledColumnRef;

    recycledColumn.style.height = `${(yCoordsCalc.viewportCount - 1) * cellHeight}px`;

    yCoordsCalc.changeSubject$
      .pipe(Ops.take(1))
      .subscribe(({ changes }) => {
        cells = (changes.map(({ idx, val }) => {
          return {
            x: 0,
            y: val,
            text: cellData[idx],
          };
        }));
      });

    // handle scroll left
    scrollSubscription = scrollSubject$.subscribe(({ scrollTop }) => {
      recycledColumn.scrollTop = scrollTop;
    });

    // subscribe updates
    changeSubscription = yCoordsCalc.changeSubject$
      .pipe(Ops.skip(1))
      .subscribe(({ changes }) => {
        changes.forEach(({ idx, val }) => {
          const cell = cells[idx];
          cell.y = val;

          const nextCellData = cellData[Math.floor(val / cellHeight)];

          if (nextCellData) cell.text = nextCellData;
        });

        cells = cells;
      });
  }


  const initCells = () => {
    cells = ((originalCells) => {
      originalCells.forEach((cell) => {
        cell.text = cellData[Math.floor(cell.x / cellWidth)];
      });

      return originalCells;
    });
  };

  onMount(() => {
    initCells();
    updateYCoordsCalc();
  });

  onDestroy(() => {
    scrollSubscription.unsubscribe();
    changeSubscription.unsubscribe();
  });

</script>

<style>
  .recycled-column {
    position: absolute;
    top: var(--y-val);
    left: 0;
    overflow: hidden;
  }

  .recycled-column-items {
    position: relative;
  }
</style>

<div
  class="recycled-column"
  style="
    --y-val: {initialY}px;
    z-index: {style.zIndex};
  "
>
  <div
    class="recycled-column-items"
    style="
      width: {cellWidth}px;
      height: {height}px;
    "
  >
    {#each cells as cell, idx}
      <Cell {...cell} style={{ zIndex: style.zIndex }} />
    {/each}
  </div>
</div>
