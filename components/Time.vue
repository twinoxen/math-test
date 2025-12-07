<template>
  <div class="timer">
    <span class="digits">
      {{ ('0' + Math.floor((time / 60000) % 60)).slice(-2) }}:
    </span>
    <span class="digits">
      {{ ('0' + Math.floor((time / 1000) % 60)).slice(-2) }}.
    </span>
    <span class="digits mili-sec">
      {{ ('0' + ((time / 10) % 100)).slice(-2) }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  time: number
}

defineProps<Props>()
</script>

