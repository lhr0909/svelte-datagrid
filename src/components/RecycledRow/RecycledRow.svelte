<script>
  import { onDestroy, onMount } from 'svelte';
  import * as Ops from 'rxjs/operators';

  import Cell from '../Cell/Cell.svelte';

  import { columns, cellHeight, cellWidth } from '../../utils/consts';
  import { xCoordsCalc, scrollSubject$ } from '../../utils/subjects';

  export let style;
  export let y;
  export let cellData = [];
  export let initialX = 0;

  let cells = [];
  let width = (columns * cellWidth);
  let x = initialX;

  let scrollSubscription;
  let changeSubscription;

  const updateXCoordsCalc = () => {
    xCoordsCalc.changeSubject$
      .pipe(Ops.take(1))
      .subscribe(({ changes }) => {
        cells = (changes.map(({ idx, val }) => {
          return {
            x: val,
            y: 0,
            text: cellData[idx],
          };
        }));
      });

    // handle scroll left
    scrollSubscription = scrollSubject$.subscribe(({ scrollLeft }) => {
      x = ((initialX || 0) - scrollLeft);
    });

    // subscribe updates
    changeSubscription = xCoordsCalc.changeSubject$
      .pipe(Ops.skip(1))
      .subscribe(({ changes }) => {
        const prevCells = cells;
        changes.forEach(({ idx, val }) => {
          const cell = prevCells[idx];
          cell.x = val;

          const nextCellData = cellData[Math.floor(val / cellWidth)];

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
    updateXCoordsCalc();
  });

  onDestroy(() => {
    scrollSubscription.unsubscribe();
    changeSubscription.unsubscribe();
  });

</script>

<style>
  .recycled-row {
    position: absolute;
    top: 0;
    left: 0;
  }

  .recycled-row-items {
    position: relative;
  }
</style>

<div
  class="recycled-row"
  style="
    z-index: {style.zIndex};
    width: {width}px;
    height: {cellHeight}px;
    transform: translate({x}px, {y || 0}px);
  "
>
  <div class="recycled-row-items">
    {#each cells as cell, idx}
      <Cell {...cell} style={{ zIndex: style.zIndex }} />
    {/each}
  </div>
</div>
