<template>
  <div class="page-wrapper">
    <div class="page">
      <div class="title">
        <slot name="title" />
      </div>
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-wrapper {
  width: 72vw;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.title {
  margin-bottom: 32px;
  font-size: 20px;
  font-weight: bold;
}

.page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: white;
  position: relative;
}

</style>
