<script>
  import { rows, cellHeight } from '../../utils/consts';
  import { yScrollSubject$ } from '../../utils/subjects';

  function handleScrollTop(e) {
    yScrollSubject$.next(e.target.scrollTop);
  }
</script>

<style>
.vertical-scroll-bar {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 15px;
  z-index: 9999;
  overflow-y: scroll;
  overflow-x: hidden;
}

.vertical-scroll-bar-inner {
  width: 1px;
}
</style>

<div class="vertical-scroll-bar" on:scroll={handleScrollTop}>
  <div class="vertical-scroll-bar-inner" style="height: {rows * cellHeight}px"></div>
</div>