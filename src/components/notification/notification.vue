<template></template>

<script>
import swal from "sweetalert";

export default {
  name: "notification",
  data() {
    return {
      socket: new WebSocket(
        `wss://zarmebel-api.crud.uz/ws/connection?token=${localStorage["access_token"]}`
      ),
      data: {
        title: "Yangi Buyurtma",
        body: "Hurmatli foydalanuvchi sizga ID 14 - buyurtma biriktirildi",
        user_id: 99,
      },
    };
  },
  computed: {
    support() {
      if ("Notification" in window) return true;
      else return false;
    },
    permission() {
      return Notification.requestPermission();
    },
  },
  created() {
    // this.socket.onopen = (event) => {
    //   console.log(event);
    // };
    this.socket.onmessage = (event) => {
      this.data = JSON.parse(event.data);
      this.checkSupport();
    };
    this.socket.onclose = () => {
      this.socket = new WebSocket(
        `wss://zarmebel-api.crud.uz/ws/connection?token=${localStorage["access_token"]}`
      );
    };
  },
  methods: {
    checkSupport() {
      if (this.support) this.checkPermission();
      else
        swal({
          icon: "error",
          title: "Ushbu brauzer bildirishnomani qo'llab-quvvatlamaydi !",
          text: " ",
          closeOnEsc: false,
          closeOnClickOutside: false,
          buttons: false,
          timer: 3000,
        });
    },
    checkPermission() {
      this.permission.then((result) => {
        if (result == "denied")
          swal({
            icon: "error",
            title: "Bildirishnomaga ruxsat berilmagan !",
            text: " ",
            closeOnEsc: false,
            closeOnClickOutside: false,
            buttons: false,
            timer: 3000,
          });
        else this.sendNotification();
      });
    },
    sendNotification() {
      const data = this.data;
      new Notification(data.title, {
        body: data.body,
      }).onclick = () => {
        window.open(`https://zarmebel.crud.uz/${this.url(data.title)}`);
      };
    },
    url(title) {
      if (title == "Buyurtma") return "transport";
      else if (title == "Yangi Buyurtma") return "pre-orders";
      else if (title == "Transfer") return "transfer";
      else return "";
    },
  },
};
</script>
