<template></template>

<script>
export default {
  name: "notification",
  data() {
    return {
      socket: new WebSocket(
        `wss://zarmebel-api.crud.uz/ws/connection?token=${localStorage["access_token"]}`
      ),
    };
  },
  mounted() {
    // this.socket.onopen = (event) => {
    //   console.log(event);
    // };
    // this.socket.onmessage = (event) => {
    //   console.log(event.data);
    // };
  },
};
</script>
