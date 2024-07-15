<script setup lang="ts">
defineProps<{
  text?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
}>()
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipContent :side="side">
        <slot name="content">
          {{ text }}
        </slot>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
