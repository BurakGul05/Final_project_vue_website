<script setup>
import adminProducts from '@/components/admin-products.vue'
import adminOrders from '@/components/admin-orders.vue'
import router from '@/router';
</script>

<template>

      <div class="admin-tablo">

            <div class="left-sidebar">

                  <div class="offcanvas-header">
                        <h5 class="offcanvas-title"> Kullanıcı Yönetim Paneli</h5>
                  </div>

                  <div class="offcanvas-body">

                        <div class="buttons-side">

                              <button @click="secim = 'products'"
                                    :class="secim == 'products' ? 'btn btn-light kullanici-butonu-1' : 'btn btn-outline-light kullanici-butonu-2'">Ürünler</button>

                              <button @click="secim = 'orders'"
                                    :class="secim == 'orders' ? 'btn btn-light kullanici-butonu-1' : 'btn btn-outline-light kullanici-butonu-2'">Siparişler</button>

                              <button @click="secim = 'purchases'"
                                    :class="secim == 'purchases' ? 'btn btn-light kullanici-butonu-1' : 'btn btn-outline-light kullanici-butonu-2'">
                                    Satın Aldıklarım
                              </button>


                              <button @click="secim = 'sales'"
                                    :class="secim == 'sales' ? 'btn btn-light kullanici-butonu-1' : 'btn btn-outline-light kullanici-butonu-2'">
                                    Sattıklarım
                              </button>

                        </div>

                        <div class="bottom-section">

                              <h5 class="user-name">{{ Username }}</h5>

                              <div class="user-tag">{{ UserRole }}</div>

                              <div class="signout-settings-buttons">

                                    <button class=" settings-button" @click="setProfile()">
                                          <i style="padding-right: 4px;" class="bi bi-gear-fill"></i>
                                          Ayarlar
                                    </button>

                                    <button class="btn btn-light logout-button" @click="logout()">
                                          <i style="padding-right: 4px;" class="bi bi-box-arrow-right"></i>
                                          <span>Çıkış Yap</span>
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


                  <!--! Siparişler -->
                  <div v-if="secim == 'orders'">
                        <adminOrders />
                  </div>



                  <!--! Satın Aldıklarım -->
                  <div v-if="secim == 'purchases'" class="table-main">

                        <div class="table-header">
                              <h3>SATIN ALDIKLARIM</h3>
                        </div>

                        <div class="user-purchases-table">
                              <table class="table table-striped">
                                    <thead>
                                          <tr>
                                                <th>Sipariş No:</th>
                                                <th>Ürünler:</th>
                                                <th>Alıcı:</th>
                                                <th>Tutar:</th>
                                                <th>Durum:</th>
                                                <th>Tarih:</th>
                                          </tr>
                                    </thead>

                                    <tbody>
                                          <tr v-for="siparis in purchases" :key="siparis.o_id">
                                                <td>{{ siparis.o_no }}</td>
                                                <td>{{ siparis.o_products }}</td>
                                                <td>{{ siparis.o_person }}</td>
                                                <td>{{ siparis.o_amount }} TL</td>
                                                <td>{{ siparis.o_status }}</td>
                                                <td>{{ formatTarih(siparis.o_created_at) }}</td>
                                          </tr>

                                          <tr v-if="purchases.length == 0">
                                                <td colspan="6" class="text-center">
                                                      Henüz satın alma siparişiniz bulunmuyor.
                                                </td>
                                          </tr>
                                    </tbody>
                              </table>

                        </div>

                  </div>


                  <!--! Sattıklarım -->
                  <div v-if="secim == 'sales'" class="table-main">

                        <div class="table-header">
                              <h3>SATTIKLARIM</h3>
                        </div>

                        <div class="user-sold-table">
                              <table class="table sold table-striped">
                                    <thead>
                                          <tr>
                                                <th>Sipariş No:</th>
                                                <th>Ürünler:</th>
                                                <th>Alıcı:</th>
                                                <th>Tutar:</th>
                                                <th>Durum:</th>
                                                <th>Tarih:</th>
                                          </tr>
                                    </thead>

                                    <tbody>
                                          <tr v-for="siparis in sales" :key="siparis.o_id">
                                                <td>{{ siparis.o_no }}</td>
                                                <td>{{ siparis.o_products }}</td>
                                                <td>{{ siparis.o_person }}</td>
                                                <td>{{ siparis.o_amount }} TL</td>
                                                <td>{{ siparis.o_status }}</td>
                                                <td>{{ formatTarih(siparis.o_created_at) }}</td>
                                          </tr>

                                          <tr v-if="sales.length == 0">
                                                <td colspan="6" class="text-center">
                                                      Henüz satılan ürününüz bulunmuyor.
                                                </td>
                                          </tr>
                                    </tbody>
                              </table>
                        </div>


                  </div>

            </div>

      </div>


</template>


<!--! Programlama ve fonksiyonların olduğu yer -->
<script>
export default {
      inject: ['showToast'],

      data() {
            return {

                  secim: "products",
                  Username: "Test",
                  // Giriş yapan kişinin rolünü ekranda göstermek için kullanılır.
                  UserRole: "Kullanıcı",
                  baseUrl: "http://localhost:3001",
                  purchases: [],
                  sales: [],
            };
      },

      mounted() {
            this.getUsername()
      },

      watch: {
            //satin aldiklarim butonu icin 
            secim(yeniSecim) {
                  if (yeniSecim == 'purchases') {
                        this.getPurchases();
                  }
                  if (yeniSecim == 'sales') {
                        this.getSales();
                  }
            },
      },

      computed: {
      },

      methods: {

            //! SATIN ALDIKLARIM BUTONU FONKSIYONU
            async getPurchases() {
                  try {
                        const token = sessionStorage.getItem("token");

                        if (!token) {
                              this.purchases = [];
                              return;
                        }

                        // JWT üzerinden giriş yapan kullanıcının ID'sini al
                        const userRes = await fetch(`${this.baseUrl}/api/me`, {
                              headers: {
                                    "Authorization": `Bearer ${token}`
                              }
                        });

                        if (!userRes.ok) {
                              throw new Error("Kullanıcı bilgileri alınamadı.");
                        }

                        const user = await userRes.json();
                        const id = user.u_id;

                        // Sadece giriş yapan kullanıcının siparişlerini getir
                        const res = await fetch(
                              `${this.baseUrl}/api/my-purchases/${id}`
                        );

                        if (!res.ok) {
                              throw new Error("Satın alınan siparişler alınamadı.");
                        }

                        this.purchases = await res.json();

                        console.log("Satın Aldıklarım:", this.purchases);

                  } catch (e) {
                        console.log("Satın alma listeleme hatası:", e.message);
                  }
            },

            //SATTIKLARIM BUTON FONKSIYONU
            async getSales() {
                  try {
                        const token = sessionStorage.getItem("token");

                        if (!token) {
                              this.sales = [];
                              return;
                        }

                        // JWT üzerinden giriş yapan kullanıcının ID'sini al
                        const userRes = await fetch(`${this.baseUrl}/api/me`, {
                              headers: {
                                    "Authorization": `Bearer ${token}`
                              }
                        });

                        if (!userRes.ok) {
                              throw new Error("Kullanıcı bilgileri alınamadı.");
                        }

                        const user = await userRes.json();
                        const id = user.u_id;

                        // Giriş yapan kullanıcının sattığı ürünlere ait siparişleri getir
                        const res = await fetch(`${this.baseUrl}/api/my-sales/${id}`);

                        if (!res.ok) {
                              throw new Error("Satışlar getirilemedi.");
                        }

                        this.sales = await res.json();

                        console.log("Sattıklarım:", this.sales);

                  } catch (e) {
                        console.log("Satış listeleme hatası:", e.message);
                  }
            },


            //TURKIYE TARIH SISTEMI EKLEMEK ICIN
            formatTarih(tarih) {
                  if (!tarih) return "";

                  return new Date(tarih).toLocaleString("tr-TR", {
                        timeZone: "Europe/Istanbul",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hourCycle: "h23"
                  });
            },


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
                        // Veritabanındaki role göre Admin veya Kullanıcı yazısını belirler.
                        this.UserRole = Number(data.u_role) === 1 ? "Admin" : "Kullanıcı";

                        this.Username = `${data.u_firstName} ${data.u_lastName}`;

                  } catch (e) {
                        console.log("Kullanıcı adı alınamadı:", e.message);
                  }
            },


            logout() {
                  this.showToast("Kullanıcı yönetim panelinden çıkış yaptınız.", "error")

                  sessionStorage.removeItem("isLoggedIn")
                  sessionStorage.removeItem("role")
                  sessionStorage.removeItem("userId")
                  sessionStorage.removeItem("token") // JWT token'ını da sil

                  router.push("/")
            }

      }
};

</script>

<style scoped>
/* ADMIN TABLOSU */
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


.kullanici-butonu-1 {
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

/* Sadece pasif (outline) durumdaki özel butonunuzu değiştirmek için */
.kullanici-butonu-2 {
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


/*  LEFT SIDEBAR ALTTAKI ISIM, CIKIS YAP BUTONU */
.bottom-section {
      padding: 12px;
      height: fit-content;
      display: flex;
      flex-direction: column;
      justify-content: end;
      gap: 12px;
}


.user-name {
      color: #F5F5F5 !important;
      font-family: 'Oswald', sans-serif;
      font-size: 20px;
      font-weight: 200px;
      text-align: left;

}

.user-tag {
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

.settings-button {
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


/* TABLE MAIN */
.table-main {
      display: flex;
      flex-direction: column;
      height: 88vh;
      padding: 0px 8px 0px 8px;
      background-color: #f0ebeb;
      width: 80vw;
}

/* TABLE HEADER */
.table-header {
      display: flex;
      justify-content: space-between;
      height: fit-content;
      position: relative;
      align-items: center;
      padding: 16px 0px 16px 0px;
}

.table-header>h3 {
      font-family: 'Oswald', sans-serif;
      font-size: 24px;
      font-weight: 400;
      color: #0D1217;
}

.user-sold-table {
      height: 100%;
      overflow-y: scroll;
      overflow-x: auto;
}

.user-sold-table>.table sold {
      margin-left: 0px !important;
      border-radius: 0px !important;
      margin-top: 0px;
      height: 100%;
      width: 100%;
}


.user-purchases-table {
      height: 100%;
      overflow-y: scroll;
      overflow-x: auto;
}

.user-purchases-table>.table {
      margin-left: 0px !important;
      border-radius: 0px !important;
      margin-top: 0px;
      height: 100%;
      width: 100%;
}

/* TABLO BAŞLIKLARINI ORTALAR */
table thead th {
      text-align: center;
      vertical-align: middle;
      white-space: nowrap;
}

/* TABLO İÇERİĞİNİ ORTALAR */
table tbody td {
      text-align: center;
      vertical-align: middle;
}

/* # / ID KOLONU */
table th:first-child,
table td:first-child {
      width: 55px;
      text-align: center;
}

/* SİPARİŞ NO */
table th:nth-child(2),
table td:nth-child(2) {
      min-width: 130px;
      text-align: center;
      white-space: nowrap;
}

/* SİPARİŞ VEREN */
table th:nth-child(3),
table td:nth-child(3) {
      min-width: 150px;
      text-align: center;
}

/* TOPLAM TUTAR */
table th:nth-child(4),
table td:nth-child(4) {
      min-width: 120px;
      text-align: center;
      white-space: nowrap;
}

/* SİPARİŞ TARİHİ */
table th:nth-child(5),
table td:nth-child(5) {
      min-width: 150px;
      text-align: center;
      white-space: nowrap;
}

/* DURUM SELECT */
table td:nth-child(6) select {
      width: 165px;
      margin: auto;
}

/* İŞLEM ALANI */
table th:nth-child(7),
table td:nth-child(7) {
      min-width: 130px;
      text-align: center;
      white-space: nowrap;
}

/* GÜNCELLE BUTONU */
table td:nth-child(7) .btn {
      padding: 5px 12px;
      border-radius: 6px;
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

      .table-main {
            width: 100vw;
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

      .table-main {
            width: 100vw;
      }

}
</style>