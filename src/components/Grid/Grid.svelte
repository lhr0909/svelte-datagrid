<script>
  import { cellWidth, cellHeight, columns, rows } from '../../utils/consts';

  import Cell from '../../components/Cell/Cell.svelte';
  import RecycledRow from '../../components/RecycledRow/RecycledRow.svelte';
  import RecycledColumn from '../../components/RecycledColumn/RecycledColumn.svelte';
  import RecycledGrid from '../../components/RecycledGrid/RecycledGrid.svelte';

  let headers = [];
  let cellData = [];

  function initData() {
    console.time('data loaded');

    for (let i = 0; i < columns; i++) {
      headers.push(`Header ${i + 1}`);
    }
    headers = headers;

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        row.push(`${(j + 1) * 100000 + (i + 1)}`);
      }
      cellData.push(row);
    }
    cellData = cellData;

    console.timeEnd('data loaded');
  }

  initData();
</script>

<style>
  .grid {
    display: block;
    width: calc(100vw - 15px);
    height: calc(100vh - 15px);
    line-height: var(--cell-height);
  }

  .grid-inner {
    position: relative;
    width: var(--total-width);
    height: var(--total-height);
  }

  .pinned-top-left {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 4;
  }

  .pinned-top {
    position: absolute;
    top: 0;
    left: var(--cell-width);
    z-index: 3;
  }

  .pinned-left {
    position: absolute;
    left: 0;
    top: var(--cell-height);
    z-index: 2;
  }

  .recycled-container {
    position: absolute;
    left: var(--cell-width);
    top: var(--cell-height);
    width: calc(100vw - var(--cell-width));
    height: calc(100vh - var(--cell-height));
    z-index: 1;
  }
</style>

<div
  class="grid"
  style="
    --cell-height: {cellHeight}px;
    --cell-width: {cellWidth}px;
    --total-width: {columns * cellWidth}px;
    --total-height: {rows * cellHeight}px;
  "
>
  <div
    class="grid-inner"
  >
    <div class="pinned-top-left">
      <Cell text={headers[0]} x={0} y={0} />
    </div>
    <div class="pinned-top">
      <RecycledRow cellData={headers.slice(1)} y={0} />
    </div>
    <div class="pinned-left">
      <RecycledColumn cellData={cellData.map((row) => row[0])} />
    </div>
    <div class="recycled-container">
      <RecycledGrid cellData={cellData.map((row) => row.slice(1))} />
    </div>
  </div>
</div>
