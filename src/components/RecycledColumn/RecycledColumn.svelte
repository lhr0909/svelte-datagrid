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
      y = ((initialY || 0) - scrollTop);
    });

    // subscribe updates
    changeSubscription = yCoordsCalc.changeSubject$
      .pipe(Ops.skip(1))
      .subscribe(({ changes }) => {
        const prevCells = cells;
        changes.forEach(({ idx, val }) => {
          const cell = prevCells[idx];
          cell.y = val;

          const nextCellData = cellData[Math.floor(val / cellHeight)];

          if (nextCellData) cell.text = nextCellData;
        });

        cells = prevCells;
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
    top: 0;
    left: 0;
  }

  .recycled-column-items {
    position: relative;
  }
</style>

<div
  class="recycled-column"
  style="
    z-index: {style.zIndex};
    width: {cellWidth}px;
    height: {height}px;
    transform: translate({x}px, {y}px);
  "
>
  <div class="recycled-column-items">
    {#each cells as cell, idx}
      <Cell {...cell} style={{ zIndex: style.zIndex }} />
    {/each}
  </div>
</div>
