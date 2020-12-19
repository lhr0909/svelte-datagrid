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
    position: relative;
  }
</style>

<div class="grid">
  <Cell text={headers[0]} x={0} y={0} style={{ zIndex: 4 }} />
  <RecycledRow cellData={headers.slice(1)} initialX={cellWidth} style={{ zIndex: 2 }} />
  <RecycledColumn cellData={cellData.map((row) => row[0])} initialY={cellHeight} style={{ zIndex: 3 }} />
  <RecycledGrid cellData={cellData.map((row) => row.slice(1))} initialX={cellWidth} initialY={cellHeight} style={{ zIndex: 1 }} />
</div>
