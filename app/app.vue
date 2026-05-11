<template>
  <div>
    <NuxtLayout>
      <!-- <KeepAlive>
        <NuxtPage />
      </KeepAlive> -->
      <NuxtPage v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component"></component>
        </KeepAlive>
      </NuxtPage>
    </NuxtLayout>
  </div>
</template>
