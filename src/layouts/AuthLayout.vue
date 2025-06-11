<template>
  <v-container class="fill-height " fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="2">
          <v-card-title class="text-center">
            <slot name="title" />
          </v-card-title>
          <v-divider />
          <v-card-text>
            <slot />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
// No se necesita lógica adicional por ahora.
</script>

<style scoped>
.auth-background {
  background: linear-gradient(to right, #f0f0f0, #e0e0e0);
}
</style>
