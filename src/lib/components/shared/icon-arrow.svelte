<script lang="ts">
  export let orientation: string = "rotate-0";
  export let id: string;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="white"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  {id}
  class={`lucide lucide-arrow-up size-6 ${orientation}`}
  ><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg
>
