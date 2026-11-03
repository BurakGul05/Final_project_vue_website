<template>
      <Toast :show="toastShow" :message="toastMessage" :type="toastType" />

      <div class="table-main">
            <div class="table-header">
                  <h3>Mesajlar</h3>
            </div>

            <div class="admin-message-table">

                  <table class="table table-striped">
                        <thead>
                              <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">AD-SOYAD:</th>
                                    <th scope="col">E-MAİL:</th>
                                    <th scope="col">TELEFON:</th>
                                    <th scope="col">KONU:</th>
                                    <th scope="col">MESAJ:</th>
                                    <th scope="col">TARİH:</th>
                                    <th scope="col">DURUMU:</th>
                                    <th scope="col">İŞLEM:</th>
                              </tr>

                        </thead>
                        <tbody>

                              <tr v-for="message, index in messages">
                                    <th>{{ index + 1 }}</th>
                                    <!-- <td><label> {{ message.m_id }} </label></td> -->
                                    <td><label> {{ message.m_firstName }} {{ message.m_lastName }}</label></td>
                                    <td><label> {{ message.m_email }} </label></td>
                                    <td><label> {{ message.m_code }}{{ message.m_phone }}</label></td>
                                    <td><label> {{ message.m_subject }} </label></td>
                                    <td><label> {{ message.m_message }} </label></td>
                                    <td><label> {{ message.m_created_at.split("T")[0] }}</label></td>

                                    <td>
                                          <select :style="message.m_status == 0 ? 'color:red' : 'color:green'"
                                                style="cursor: pointer;" class="form-select" v-model="message.m_status">
                                                <option style="color:black" value=0>Yanıtlanmadı</option>
                                                <option style="color:black" value=1>Yanıtlandı</option>
                                          </select>
                                    </td>

                                    <td class="text-nowrap">
                                          <button class="btn btn-outline-primary btn-sm m-1"
                                                @click="updateMessage(message.m_id, message.m_status)">
                                                Kaydet
                                          </button>
                                          <!-- !?HAZIR BOOTSTRAP TEXT NOWRAP= Metni alt satıra geçirme. -->
                                          <a class="btn-sm m-1 btn btn-outline-success"
                                                :href="`mailto:${message.m_email}`">
                                                Yanıtla
                                          </a>
                                          <!-- !"Yanıtla butonuna basıldığında, mesajı gönderen kişinin e-posta adresini al ve mail uygulamasını o kişiye mail atılacak şekilde aç." -->
                                          <button style="margin-left: 10px;" class="btn-sm btn btn-outline-danger"
                                                @click="deleteMessage(message.m_id)">
                                                Sil
                                          </button>

                                    </td>

                              </tr>
                        </tbody>
                  </table>

            </div>
      </div>

</template>

<!--! Programlama ve fonksiyonların olduğu yer -->
<script>
import Toast from '@/components/toast.vue'

export default {

      components: {
            Toast
      },

      data() {
            return {
                  detailID: 0,
                  messages: [],
                  error: null,

                  toastShow: false,
                  toastMessage: "",
                  toastType: "success",

                  baseUrl: "http://localhost:3001",


                  firstNameError: "",
                  lastNameError: "",
                  emailError: "",
                  telError: "",

            };
      },
      mounted() {
            this.getMessages();
      },



      watch: {


      },

      computed: {
      },

      methods: {
            //ADMIN MESAJLAR KISMI ALERT ICIN EKLENEN TOAST VUE KISMI
            showToast(message, type) {
                  this.toastMessage = message;
                  this.toastType = type;
                  this.toastShow = true;

                  setTimeout(() => {
                        this.toastShow = false;
                  }, 3000);
            },




            // MESAJ LISTELE
            async getMessages() {
                  this.error = null;
                  try {
                        const res = await fetch(`${this.baseUrl}/api/messages`);
                        if (!res.ok) throw new Error("Messages endpoint hatasi");
                        this.messages = await res.json();
                  } catch (e) {
                        this.error = e.message;
                  }
            },

            // PUT- Mesaj Guncelleme
            async updateMessage(m_id, m_status) {
                  try {

                        const res = await fetch(`${this.baseUrl}/api/messages/${m_id}`, {


                              method: "PUT",
                              headers: {

                                    "Content-Type": "application/json"
                              },
                              body: JSON.stringify({

                                    status: m_status
                              })
                        });
                        if (!res.ok) throw new Error("updateMessage endpoint hatasi");

                        const data = await res.json(); //Backend'in gönderdiği cevabı JSON olarak oku.

                        if (data) {
                              this.showToast("Mesajınız düzenlendi.", "edit");
                        }
                        this.getMessages();
                  }
                  catch (e) {
                        console.log(e.message);
                  }
            },

            // MESAJ SIL
            async deleteMessage(m_id) {
                  try {
                        const res = await fetch(`${this.baseUrl}/api/messages/${m_id}`, { //istekte bulunduğumuz yer.
                              method: "DELETE",
                              headers: {
                                    "Content-Type": "application/json",
                              }
                        });
                        if (!res.ok) throw new Error(res.error);
                        const data = await res.json();
                        if (data) {
                              this.showToast("Mesajınız silindi.", "error");
                        }
                        this.getMessages();
                  }
                  catch (error) {
                        console.log(error);
                  }
            },

      }
};
</script>
<style scoped>
/* TABLE MAIN */
.table-main {
      display: flex;
      flex-direction: column;
      height: 88vh;
      padding: 0px 8px 0px 8px;
      background-color: #F0EFEB;
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

.admin-message-table {
      height: 100%;
      overflow-y: scroll;
      overflow-x: auto;
}

.admin-message-table>.table {
      margin-left: 0px !important;
      border-radius: 0px !important;
      margin-top: 0px;
      height: 100%;
      width: 100%;
}

/* TABLO BAŞLIKLARI */
table thead th {
      text-align: center;
      vertical-align: middle;
      white-space: nowrap;
}

/* TABLO İÇERİĞİ */
table tbody td,
table tbody th {
      text-align: center;
      vertical-align: middle;
}

/* AD - SOYAD */
table th:nth-child(2),
table td:nth-child(2) {
      min-width: 140px;
}

/* E-MAIL */
table th:nth-child(3),
table td:nth-child(3) {
      min-width: 180px;
}

/* TELEFON */
table th:nth-child(4),
table td:nth-child(4) {
      min-width: 130px;
      white-space: nowrap;
}

/* KONU */
table th:nth-child(5),
table td:nth-child(5) {
      min-width: 120px;
}

/* MESAJ */
table th:nth-child(6),
table td:nth-child(6) {
      min-width: 200px;
}

/* TARİH */
table th:nth-child(7),
table td:nth-child(7) {
      min-width: 120px;
      white-space: nowrap;
}

/* DURUM SELECT */
table td:nth-child(8) select {
      width: 145px;
      margin: auto;
      text-align: center;
}

/* İŞLEM ALANI */
table th:nth-child(9),
table td:nth-child(9) {
      min-width: 250px;
      text-align: center;
      white-space: nowrap;
}

/* BUTONLAR */
table td:nth-child(9) .btn {
      padding: 5px 10px;
      border-radius: 6px;
}


/* Mesajlar tablosunun dış köşelerini yuvarlar. */
.admin-message-table table {
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 12px;
      overflow: hidden;
}

/* İlk sütunun üst köşesini yuvarlar. */
.admin-message-table table thead tr th:first-child {
      border-top-left-radius: 12px;
}

/* Son sütunun üst köşesini yuvarlar. */
.admin-message-table table thead tr th:last-child {
      border-top-right-radius: 12px;
}

/* Son satırın sol alt köşesini yuvarlar. */
.admin-message-table table tbody tr:last-child th:first-child,
.admin-message-table table tbody tr:last-child td:first-child {
      border-bottom-left-radius: 12px;
}

/* Son satırın sağ alt köşesini yuvarlar. */
.admin-message-table table tbody tr:last-child td:last-child {
      border-bottom-right-radius: 12px;
}


/* Yalnızca telefon ekranlarında mesajlar sayfasının görünümünü düzenler. */
@media (min-width: 576px) and (max-width: 991px) {

      .table-main {
            width: 100%;
            padding: 0px 24px;
      }

      /* Mesajlar başlığını mobil ekranda normal konumuna alır. */
      .table-header {
            position: static;
            top: auto;
            margin-bottom: 12px;
      }


      /* Tablo kapsayıcısının telefon ekranını aşmasını önler ve yatay kaydırma sağlar. */
      .admin-message-table {
            width: 100%;
            max-width: 100%;
            min-width: 0;
            margin: 0;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
      }

      /* Tabloyu sütunlarını sıkıştırmadan yatay kaydırılabilir tutar. */
      .admin-message-table table {
            width: max-content;
            min-width: 100%;
            margin: 0;
      }

      /* Başlığın yukarı kaymasını önler ve sola hizalar. */
      .table-header h3 {
            margin-top: 0 !important;
            margin-bottom: 12px;
            text-align: left !important;
      }


      /* Tablo başlıklarının ve hücrelerinin tek satırda kalmasını sağlar. */
      .admin-message-table th,
      .admin-message-table td {
            white-space: nowrap;
            vertical-align: middle;
      }

      /* Ad-soyad sütununun mevcut genişliğini korur. */
      .admin-message-table th:nth-child(2),
      .admin-message-table td:nth-child(2) {
            min-width: 140px;
      }

      /* E-posta sütununun mevcut genişliğini korur. */
      .admin-message-table th:nth-child(3),
      .admin-message-table td:nth-child(3) {
            min-width: 180px;
      }

      /* Telefon sütununun mevcut genişliğini korur. */
      .admin-message-table th:nth-child(4),
      .admin-message-table td:nth-child(4) {
            min-width: 130px;
      }

      /* Konu sütununun mevcut genişliğini korur. */
      .admin-message-table th:nth-child(5),
      .admin-message-table td:nth-child(5) {
            min-width: 120px;
      }

      /* Mesaj sütununa okunabilir bir genişlik verir. */
      .admin-message-table th:nth-child(6),
      .admin-message-table td:nth-child(6) {
            min-width: 200px;
      }

      /* Tarih sütununun tek satırda kalmasını sağlar. */
      .admin-message-table th:nth-child(7),
      .admin-message-table td:nth-child(7) {
            min-width: 120px;
      }

      /* Durum seçim kutusunun mevcut genişliğini korur. */
      .admin-message-table td:nth-child(8) select {
            width: 145px;
      }

      /* İşlem sütunundaki butonların yan yana kalmasını sağlar. */
      .admin-message-table th:nth-child(9),
      .admin-message-table td:nth-child(9) {
            min-width: 250px;
            white-space: nowrap;
      }
}

@media (min-width: 360px) and (max-width: 600px) {

      .table-main {
            width: 100%;
            padding: 0px 24px;
      }

      /* Mesajlar başlığını mobil ekranda normal konumuna alır. */
      .table-header {
            position: static;
            top: auto;
            margin-bottom: 12px;
      }

      /* Ürün bölümünün kendi genişliğini telefon ekranına göre sınırlar. */
      .admin-product-table {
            width: 100%;
            max-width: 100%;
            min-width: 0;
            margin: 0;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;

      }

      /* Tabloyu sütunları ezmeden yatay kaydırılabilir tutar. */
      .admin-product-table table {
            width: max-content;
            min-width: 100%;
            margin: 0;
      }

      /* Başlığın yukarı kaymasını önler ve sola hizalar. */
      .table-header h3 {
            margin-top: 0 !important;
            margin-bottom: 12px;
            text-align: left !important;
      }
}
</style>