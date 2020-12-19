<script>
  import { onMount } from 'svelte';
  import { cellHeight, columns, cellWidth, rows } from '../../utils/consts';
  import { scrollSubject$, resizeSubject$ } from '../../utils/subjects';

  const handleScroll = () => {
    const scrollContainerRef = document.querySelector('.scroll-container');
    const scrollWrapperRef = document.querySelector('.scroll-wrapper');

    if (!scrollContainerRef || !scrollWrapperRef) return;

    const scrollWrapper = scrollWrapperRef;
    const scrollContainer = scrollContainerRef;

    /**
     * Handle scroll
     */
    scrollWrapper.style.top = cellHeight + 'px';
    scrollContainer.style.width = columns * cellWidth + 'px';
    scrollContainer.style.height = rows * cellHeight + 'px';

    scrollWrapper.addEventListener('scroll', (e) => {
      const { scrollLeft, scrollTop } = e.target;
      scrollSubject$.next({ scrollLeft, scrollTop });
    });
  };


  onMount(() => {
    handleScroll();
  });

</script>

<style>
  .scroll-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: scroll;
    z-index: 9999;
  }

  .scroll-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

</style>


<div class="scroll-wrapper">
  <div class="scroll-container"></div>
</div>
