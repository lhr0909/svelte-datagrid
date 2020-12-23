<script>
  import { columns, cellWidth } from '../../utils/consts';
  import { xScrollSubject$ } from '../../utils/subjects';

  function handleScrollLeft(e) {
    xScrollSubject$.next(e.target.scrollLeft);
  }
</script>

<style>
.horizontal-scroll-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 15px;
  z-index: 9999;
  overflow-x: scroll;
  overflow-y: hidden;
}

.horizontal-scroll-bar-inner {
  height: 1px;
}
</style>

<div class="horizontal-scroll-bar" on:scroll={handleScrollLeft}>
  <div class="horizontal-scroll-bar-inner" style="width: {columns * cellWidth}px"></div>
</div>