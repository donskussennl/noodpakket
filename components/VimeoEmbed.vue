<script setup lang="ts">
// Definieer de props met TypeScript om type-veiligheid te garanderen
interface Props {
  videoId: string;
  title: string;
}

const props = withDefaults(defineProps<Props>(), {
  videoId: '1140837450', // Default ID van de video in het voorbeeld
  title: 'noodpakket-op-maat',
});

// De Vimeo Player API script tag is meestal niet nodig in Vue/Nuxt
// tenzij je de player API actief wilt besturen met JavaScript (wat hier niet het geval is).
</script>

<template>
  <div style="padding: 56.25% 0 0 0; position: relative">
    <iframe
      :src="`https://player.vimeo.com/video/${props.videoId}?badge=0&autopause=0&player_id=0&app_id=58479`"
      :title="props.title"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
    ></iframe>
  </div>
</template>