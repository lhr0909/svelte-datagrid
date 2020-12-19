<script>
  import { onDestroy, onMount } from 'svelte';
  import * as Ops from 'rxjs/operators';

  import RecycledRow from '../RecycledRow/RecycledRow.svelte';

  import { columns, rows as rowCount, cellHeight, cellWidth } from '../../utils/consts';
  import { yCoordsCalc, scrollSubject$ } from '../../utils/subjects';

  export let style;
  // export let y;
  export let cellData = [];
  export let initialX = 0;
  export let initialY = 0;

  let rows = [];
  let width = (columns * cellWidth);
  let height = (rowCount * cellHeight);
  let x = initialX;
  let y = initialY;

  let scrollSubscription;
  let changeSubscription;

  const updateYCoordsCalc = () => {
    yCoordsCalc.changeSubject$
      .pipe(Ops.take(1))
      .subscribe(({ changes }) => {
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
      y = ((initialY || 0) - scrollTop);
    });

    // subscribe updates
    changeSubscription = yCoordsCalc.changeSubject$
      .pipe(Ops.skip(1))
      .subscribe(({ changes }) => {
        const prevRows = rows;
        changes.forEach(({ idx, val }) => {
          const row = prevRows[idx];
          row.y = val;

          const nextCellData = cellData[Math.floor(val / cellWidth)];

          if (nextCellData) row.cellData = nextCellData.slice();
        });

        rows = prevRows;
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
    top: 0;
    left: 0;
  }

  .recycled-grid-items {
    position: relative;
  }

</style>

<div
  class="recycled-grid"
  style="
    z-index: {style.zIndex};
    width: {width}px;
    height: {height}px;
    transform: translate({x}px, {y || 0}px);
  "
>
  <div class="recycled-grid-items">
    {#each rows as row}
      <RecycledRow {...row} style={{ zIndex: style.zIndex }} initialX={0} />
    {/each}
  </div>
</div>
