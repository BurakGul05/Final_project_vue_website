<template>

      <div v-if="show" class="toast show position-fixed top-0 end-0 m-3" :class="type" role="alert"
            style="z-index: 9999;">

            <div class="toast-header" :class="type">

                  <strong class="me-auto">
                        STRYVE
                  </strong>

                  <small>Bilgi</small>

            </div>

            <div class="toast-body">
                  {{ message }}
            </div>

      </div>

</template>

<script>
export default {

      props: {
            show: Boolean,
            message: String,
            type: {
                  type: String,
                  default: "success"
            }
      }

}
</script>

<style>
/* Checkout sayfasındaki başarı bildirim kutusunun genel görünümü */
.toast {
      min-width: 360px;
      border: none;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
      animation: toastGiris 0.4s ease;
}

/* Checkout başarı bildiriminin üst başlık kısmı */
.toast-header {
      /* background: #198754; */
      color: white;
      border: none;
      padding: 12px 15px;
}

/* Varsayılan başarı bildirimi: yeşil */
.toast-header.success {
    background: #198754;
}

/* Ürün düzenleme bildirimi: mavi */
.toast-header.edit {
    background: #0d6efd;
}

/* Ürün silme bildirimi: kırmızı */
.toast-header.error {
    background: #dc3545;
}


/* Checkout bildirimindeki STRYVE yazısının görünümü */
.toast-header strong {
      font-size: 17px;
}

/* Checkout bildirimindeki "Bildirim" yazısının görünümü */
.toast-header small {
      color: white;
      opacity: 0.85;
}

/* Checkout başarı mesajının yazı ve arka plan görünümü */
.toast-body {
      background: white;
      color: #333;
      font-size: 15px;
      font-weight: 500;
      padding: 16px;
}

/* Varsayılan başarı bildiriminin yeşil onay işareti */
.toast.success .toast-body::before {
    content: "✓";
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    margin-right: 10px;
    border-radius: 50%;
    background: #198754;
    color: white;
    font-weight: bold;
}

/* Ürün düzenleme bildiriminin mavi onay işareti */
.toast.edit .toast-body::before {
    content: "✓";
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    margin-right: 10px;
    border-radius: 50%;
    background: #0d6efd;
    color: white;
    font-weight: bold;
}

/* Ürün silme bildiriminin kırmızı çarpı işareti */
.toast.error .toast-body::before {
    content: "×";
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    margin-right: 10px;
    border-radius: 50%;
    background: #dc3545;
    color: white;
    font-weight: bold;
}

/* Checkout başarı bildiriminin sağ üstten ekrana giriş animasyonu */
@keyframes toastGiris {
      from {
            opacity: 0;
            transform: translateX(80px);
      }

      to {
            opacity: 1;
            transform: translateX(0);
      }
}
</style>