<template>
  <div class="BUTTONS">
    <div class="OVERLAY"></div>
    <button
      v-for="(item, index) in tab_buttons"
      :key="item"
      :name="tab_slots[index]"
      @click="setTab($event, index)"
    >
      {{ item }}
    </button>
  </div>
  <transition name="tab" mode="out-in">
    <div class="CONTENT" v-if="active_slot">
      <slot :name="active_slot" />
    </div>
  </transition>
</template>

<script>
export default {
  name: "tabs",
  props: ["buttons", "slots"],
  data() {
    return {
      active_tab: this.$props.buttons[0],
      active_slot: this.$props.slots[0],
      timeout: null,
    };
  },
  computed: {
    tab_buttons() {
      return this.$props.buttons;
    },
    tab_slots() {
      return this.$props.slots;
    },
    overlay() {
      return document.querySelector(".OVERLAY");
    },
  },
  mounted() {
    const button = document.querySelector(`[name="${this.tab_slots[0]}"]`);
    this.overlay.style.width = `${button.offsetWidth}px`;
    this.overlay.style.height = `${button.offsetHeight}px`;
  },
  methods: {
    setTab(event, index) {
      this.timeout = null;
      clearTimeout(this.timeout);

      this.active_tab = null;
      this.active_slot = null;

      this.overlay.style.width = `${event.target.offsetWidth}px`;
      this.overlay.style.height = `${event.target.offsetHeight}px`;
      this.overlay.style.translate = `${event.clientX - event.offsetX - 9}px 0`;

      this.timeout = setTimeout(() => {
        this.active_tab = this.tab_buttons[index];
        this.active_slot = this.tab_slots[index];
      }, 100);
    },
  },
};
</script>

<style scoped>
:root {
  --blue: rgb(13, 110, 253);
  --indigo: rgb(102, 16, 242);
  --purple: rgb(111, 66, 193);
  --pink: rgb(214, 51, 132);
  --red: rgb(220, 53, 69);
  --orange: rgb(253, 126, 20);
  --yellow: rgb(255, 193, 7);
  --green: rgb(25, 135, 84);
  --teal: rgb(32, 201, 151);
  --cyan: rgb(13, 202, 240);
  --color: rgb(245, 245, 245);
  --background: rgb(40, 40, 40);
}

.BUTTONS {
  position: relative;
  margin: 0 0 5px 0;
  padding: 5px;
  display: flex;
  background: whitesmoke;
  border: 1px solid var(--blue);
  border-radius: 10px;
  box-shadow: 0 5px 10px -5px var(--blue);
}

.OVERLAY {
  position: absolute;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 5px -1px gray;
  transition: all 0.5s;
}

button {
  position: relative;
  flex: 1 1 0;
  padding: 3px 5px;
  border: none;
  color: black;
  background: initial;
}

.CONTENT {
  padding: 10px;
  border: 1px solid var(--blue);
  border-radius: 10px;
  background: white;
  box-shadow: 0 5px 10px -5px var(--blue);
}

.tab-enter-active {
  transform-origin: top;
  animation: changeTab 0.2s ease;
}
.tab-leave-active {
  animation: changeTab 0.2s ease reverse;
}

@keyframes changeTab {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
