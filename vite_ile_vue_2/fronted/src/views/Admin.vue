<script setup>
import adminProducts from '@/components/admin-products.vue'
import adminUsers from '@/components/admin-users.vue';
import adminOrders from '@/components/admin-orders.vue'
import adminMessages from '@/components/admin-messages.vue';
import router from '@/router';
</script>


<template>

      <div class="admin-tablo">

            <div class="left-sidebar">

                  <div class="offcanvas-header">
                        <h5 class="offcanvas-title"> Admin Yönetim Paneli</h5>
                  </div>

                  <div class="offcanvas-body">

                        <div class="buttons-side">

                              <button @click="secim = 'products'"
                                    :class="secim == 'products' ? 'btn btn-light kullanici-butonu' : 'btn btn-outline-light kullanici-butonu'">Ürünler</button>

                              <button @click="secim = 'users'"
                                    :class="secim == 'users' ? 'btn btn-light kullanici-butonu' : 'btn btn-outline-light kullanici-butonu'">Kullanıcılar</button>

                              <button @click="secim = 'orders'"
                                    :class="secim == 'orders' ? 'btn btn-light kullanici-butonu' : 'btn btn-outline-light kullanici-butonu'">Siparişler</button>

                              <button @click="secim = 'messages'"
                                    :class="secim == 'messages' ? 'btn btn-light  kullanici-butonu' : 'btn btn-outline-light  kullanici-butonu'">Mesajlar</button>
                        </div>

                        <div class="bottom-section">

                              <h5 class="admin-name">{{ Username }}</h5>

                              <div class="admin-tag">{{ UserRole }}</div>

                              <div class="signout-settings-buttons">

                                    <button class="settings-button" @click="setProfile()">
                                          <i style="padding-right: 4px;" class="bi bi-gear-fill">
                                          </i>
                                          Ayarlar
                                    </button>

                                    <button class=" logout-button" @click="logout()">
                                          <i style="padding-right: 4px;" class="bi bi-box-arrow-right"></i>
                                          Çıkış Yap
                                    </button>
                              </div>

                        </div>

                  </div>

            </div>

            <div class="admin-content">

                  <!--! Ürünlerimiz -->
                  <div v-if="secim == 'products'">
                        <adminProducts />
                  </div>

                  <!--! Kullanıcılar -->
                  <div v-if="secim == 'users'">
                        <adminUsers />
                  </div>

                  <!--! Siparişler -->
                  <div v-if="secim == 'orders'">
                        <adminOrders />
                  </div>

                  <!--! Mesajlar -->
                  <div v-if="secim == 'messages'">
                        <adminMessages />
                  </div>

            </div>

      </div>

</template>



<!--! Programlama ve fonksiyonların olduğu yer -->
<script>
export default {
      data() {
            return {

                  secim: "products",
                  Username: "Test",
                  UserRole: "Admin",
                  baseUrl: "http://localhost:3001",
            };
      },

      mounted() {
            this.getUsername()
      },

      watch: {
      },

      computed: {
      },

      methods: {
            async getUsername() {
                  const token = sessionStorage.getItem("token");

                  if (!token) {
                        this.Username = "";
                        return;
                  }

                  try {
                        const res = await fetch(`${this.baseUrl}/api/me`, {
                              headers: {
                                    "Authorization": `Bearer ${token}`
                              }
                        });

                        if (!res.ok) {
                              throw new Error("Kullanıcı bilgileri alınamadı.");
                        }

                        const data = await res.json();

                        // Veritabanındaki role göre panelde gösterilecek yazıyı belirler.
                        this.UserRole = Number(data.u_role) === 1 ? "Admin" : "Kullanıcı";

                        this.Username = `${data.u_firstName} ${data.u_lastName}`;

                  } catch (e) {
                        console.log("Kullanıcı adı alınamadı:", e.message);
                  }
            },


            logout() {
                  sessionStorage.setItem("logoutMessage", "Admin yönetim panelinden çıkış yaptınız.")
                  sessionStorage.setItem("logoutType", "error")
                  sessionStorage.removeItem("isLoggedIn")
                  sessionStorage.removeItem("role")
                  sessionStorage.removeItem("userId")
                  sessionStorage.removeItem("token")


                  router.push("/")
            }

      }
};
</script>


<style scoped>
.admin-tablo {
      position: relative;
      display: flex;
}


/* SOLDAKI SIDEBAR (PANEL) CSS LERI */
.admin-tablo>.left-sidebar {
      height: 88vh;
      width: 20vw;
      overflow-x: hidden;
      overflow-y: hidden;
      background-color: #0D1217;
}

/* ADMIN YONETIM PANELI HEADER CSS */
.offcanvas-header {
      height: 5%;
      padding: 16px 12px 16px 12px;
      background-color: #0D1217;
}

/* ADMIN YONETIM PANELI YAZISI VE BASLIK ICIN CSS */
.offcanvas-title {
      color: #F5F5F5 !important;
      font-family: 'Oswald', sans-serif;
      font-size: 20px;
      font-weight: 200;
      text-align: left;
}

.offcanvas-body {
      width: 100%;
      height: 95%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
}

/* LEFT SIDEBAR BUTTONS */
.buttons-side {
      width: 100%;
      height: fit-content;
      display: flex;
      flex-direction: column;
      padding-right: 20px;
}


/* Sadece pasif (outline) durumdaki özel butonunuzu değiştirmek için */
.buttons-side>.btn-outline-light.kullanici-butonu {
      background-color: #0D1217;
      color: #F5F5F5 !important;
      font-family: 'Oswald', sans-serif;
      font-size: 20px;
      font-weight: 200px;
      padding: 10px;
      width: 100%;
      height: fit-content;
      text-align: left;
      cursor: pointer;
      border-style: solid;
      border-width: 2px;
      outline: none;
      box-shadow: none;
      border-radius: 0px !important;
}

.buttons-side>.btn-light.kullanici-butonu {
      background-color: #0661F6;
      color: #F5F5F5 !important;
      font-family: 'Oswald', sans-serif;
      font-size: 20px;
      font-weight: 200px;
      padding: 10px;
      width: 100%;
      height: fit-content;
      text-align: left;
      cursor: pointer;
      border: none;
      outline: none;
      box-shadow: none;
      border-radius: 0px !important;
}

/*  LEFT SIDEBAR ALTTAKI ISIM, CIKIS YAP BUTONU */
.bottom-section {
      padding: 12px;
      height: fit-content;
      display: flex;
      flex-direction: column;
      justify-content: end;
      gap: 12px;
}


.admin-name {
      color: #F5F5F5 !important;
      font-family: 'Oswald', sans-serif;
      font-size: 20px;
      font-weight: 200px;
      text-align: left;

}

.admin-tag {
      color: #F5F5F5 !important;
      font-family: 'Oswald', sans-serif;
      font-size: 20px;
      font-weight: 200px;
      text-align: left;
}

.signout-settings-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;

}

.signout-settings-buttons>.settings-button {
      color: #F5F5F5;
      font-size: 20px;
      font-family: 'Oswald', sans-serif;
      font-weight: 200;
      width: 100%;
      height: fit-content;
      text-align: left;
      padding: 15px 10px 15px 10px;
      cursor: pointer;
      border: none;
      outline: none;
      box-shadow: none;
      background-color: #0D1217;

}

.signout-settings-buttons>.logout-button {
      color: #F5F5F5;
      font-size: 20px;
      font-family: 'Oswald', sans-serif;
      font-weight: 200;
      width: 100%;
      height: fit-content;
      text-align: left;
      padding: 15px 10px 15px 10px;
      box-shadow: none;
      border: none;
      outline: none;
      background-color: #0D1217;
}

/* ========================= */
/* RESPONSIVE GORUNUMLER */
/* ========================= */


@media (min-width: 992px) and (max-width: 1199px) {
      .admin-tablo {
            display: flex;
      }

      .buttons-side {
            padding-left: 12px;

      }

}

@media (min-width: 576px) and (max-width: 991px) {

      /* ADMIN TABLOSU */
      .admin-tablo {
            display: flex;
            flex-direction: column;
      }

      .admin-tablo>.left-sidebar {
            height: fit-content;
            width: 100vw;
            overflow-x: hidden;
            overflow-y: hidden;
            background-color: #0D1217;
            padding: 24px 24px;
      }
}

@media (min-width: 360px) and (max-width: 600px) {

      /* ADMIN TABLOSU */
      .admin-tablo {
            display: flex;
            flex-direction: column;
      }

      .admin-tablo>.left-sidebar {
            height: fit-content;
            width: 100vw;
            overflow-x: hidden;
            overflow-y: hidden;
            background-color: #0D1217;
            padding: 24px 24px;
      }

}
</style>