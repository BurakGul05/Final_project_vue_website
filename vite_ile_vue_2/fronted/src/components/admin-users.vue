<template>
      <Toast :show="toastShow" :message="toastMessage" :type="toastType" />

      <div class="table-main">
            <div class="table-header">
                  <h3>Kullanıcılar</h3>

                  <button type="button" class="kullaniciekle-button" data-bs-toggle="modal" data-bs-target="#adduser">
                        Kullanıcı Ekle
                  </button>
            </div>


            <div class="admin-user-table">

                  <table class="table table-striped">
                        <thead>
                              <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">AD:</th>
                                    <th scope="col">SOYAD:</th>
                                    <th scope="col">E-MAİL:</th>
                                    <th scope="col">TELEFON:</th>
                                    <th scope="col">PAROLA:</th>
                                    <th scope="col">DOĞUM TARİHİ:</th>
                                    <th scope="col">ROL:</th>
                                    <th scope="col">İŞLEM:</th>

                              </tr>
                        </thead>
                        <tbody>
                              <tr v-for="user, index in users">
                                    <th scope="row">{{ index + 1 }}</th>
                                    <td><input class="form-control" type="text" v-model="user.u_firstName"></td>
                                    <td><input class="form-control" type="text" min="0" v-model="user.u_lastName""></td>
                              <td><input class=" form-control" type="text" v-model="user.u_email"></td>
                                    <td><input class=" form-control" type="text" v-model="user.u_phone"></td>
                                    <td><input class=" form-control" type="text" v-model="user.u_pass"></td>
                                    <!-- <td><input class=" form-control" type="text" v-model="user.u_birthdate"></td> -->
                                    <td>{{ new Date(user.u_birthdate).toLocaleDateString() }}</td>
                                    <!--! newDate (tarih) nesnesine dönüştürülür. -->
                                    <!--! toLocaleDateString()=Date nesnesini yerel tarih formatında gösterir. -->
                                    <td>
                                          <select v-model="user.u_role" class="form-select">
                                                <option value=0>Kullanici</option>
                                                <option value=1>Admin</option>
                                          </select>
                                    </td>

                                    <td>


                                          <div class="text-nowrap">
                                                <button class="btn-sm btn btn-outline-primary"
                                                      @click="updateUser(user.u_id, user.u_firstName, user.u_lastName, user.u_email, user.u_phone, user.u_pass, user.u_birthdate, user.u_role)">Kaydet</button>

                                                <button style="margin-left: 10px;" class="btn-sm btn btn-outline-danger"
                                                      @click="deleteUser(user.u_id)">Sil</button>


                                          </div>

                                    </td>
                              </tr>
                        </tbody>
                  </table>
            </div>

      </div>



      <!--! Kullanıcı ekle modal'ı -->
      <div class="modal fade" id="adduser" tabindex="-1">
            <div class="modal-dialog">
                  <div class="modal-content">
                        <div class="modal-header">
                              <h1 class="modal-title fs-5" id="exampleModalLabel">Kullanıcı Ekle</h1>
                              <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <form @submit.prevent="addUser()">
                              <div class="modal-body">
                                    <div class="row">
                                          <div class="col-md-6 mb-3 text-start">
                                                <label class="form-label">Ad*</label>
                                                <input type="text" class="form-control" v-model="newUser[0].u_firstName"
                                                      required>
                                                <div>

                                                </div>
                                          </div>
                                          <div class="col-md-6 mb-3 text-start">
                                                <label class="form-label">Soyad*</label>
                                                <input type="text" class="form-control" v-model="newUser[0].u_lastName"
                                                      required>

                                          </div>
                                    </div>
                                    <div class="row">
                                          <div class="col-md-6 mb-3 text-start">
                                                <label class="form-label">E-Mail*</label>
                                                <input type="email" class="form-control" v-model="newUser[0].u_email"
                                                      placeholder="example@hotmail.com" required>

                                          </div>
                                          <div class="col-md-6 mb-3 text-start">
                                                <label class="form-label">Telefon*</label>
                                                <input type="text" class="form-control" v-model="newUser[0].u_phone"
                                                      placeholder="5xxxxxxxxx" required>

                                          </div>
                                    </div>

                                    <div class="row">
                                          <div class="col-md-6 mb-3 text-start">
                                                <label class="form-label">Parola*</label>
                                                <input type="password" class="form-control" v-model="newUser[0].u_pass"
                                                      required>
                                          </div>

                                          <div class="col-md-6 mb-3 text-start">
                                                <label class="form-label">Rol*</label>
                                                <select v-model="newUser[0].role" class="form-select">
                                                      <option value=0>Kullanıcı</option>
                                                      <option value=1>Admin</option>
                                                </select>
                                          </div>
                                    </div>

                                    <div class="row">
                                          <div class="col-md-12 mb-3 text-start">
                                                <label class="form-label">Doğum Tarihi*</label>
                                                <input type="date" class="form-control" v-model="newUser[0].u_birthdate"
                                                      required>
                                          </div>

                                    </div>





                              </div>
                              <div class="modal-footer">
                                    <button class="btn btn-dark w-100" type="submit">Kullanıcı Ekle</button>
                                    <span> {{ userMessage }}</span>
                              </div>
                        </form>
                  </div>
            </div>
      </div>

</template>

<!--! Programlama ve fonksiyonların olduğu yer -->
<script>
import Toast from '@/components/toast.vue'
export default {
      components: { Toast },
      data() {
            return {

                  toastShow: false,
                  toastMessage: "",
                  toastType: "success",

                  newUser: [
                        {
                              u_firstName: "",
                              u_lastName: "",
                              u_email: "",
                              u_phone: "",
                              u_pass: "",
                              u_repeatPass: "",
                              u_birthdate: "",
                              role: 0,
                              check: true,
                        }
                  ],
                  users: [],
                  userMessage: null,
                  baseUrl: "http://localhost:3001"


            };
      },

      mounted() {
            this.getUsers()
      },

      watch: {
            // this usersta bir degisiklik olursa localstorageyi duzenlesin  
      },

      computed: {
      },

      methods: {

            showToast(message, type) {
                  this.toastMessage = message;
                  this.toastType = type;
                  this.toastShow = true;

                  setTimeout(() => {
                        this.toastShow = false;
                  }, 3000);

            },

            //GET
            async getUsers() {
                  this.error = null;
                  try {
                        const res = await fetch(`${this.baseUrl}/api/users`);
                        if (!res.ok) throw new Error("Users endpoint hatası");
                        this.users = await res.json();
                  } catch (e) {
                        this.error = e.message;
                  }
            },

            async addUser() {
                  try {//!bu kodlari calistirmayi dene eger hata alirsan catche git
                        const res = await fetch(`${this.baseUrl}/api/users`, {
                              method: "POST",
                              headers: { //!Başlık / üst bilgi.HTTP isteğinin yanında gönderilen ek bilgilerdir.

                                    "Content-Type": "application/json" // Content-Type=Gönderdiğim içeriğin türü nedir?
                                    //application/json=Yani backend'e diyoruz ki:"Ben sana JSON formatında veri gönderiyorum."
                                    //genel amaci="Sunucuya gönderdiğim verinin JSON şeklinde olduğunu haber verir."

                              },
                              body: JSON.stringify({//body = asil gonderilen veri demek

                                    //! Benim ürün bilgilerim newProduct dizisinin içindeki ilk elemanda duruyor."
                                    // newProduct dizisinin içindeki ilk ürünün bilgilerini alıp,
                                    // JSON formatına çevirerek backend'e gönderiyoruz.
                                    firstName: this.newUser[0].u_firstName, //Formdaki isim bilgisini al.
                                    lastName: this.newUser[0].u_lastName,//Formdaki stock bilgisini al.
                                    email: this.newUser[0].u_email,//Formdaki price bilgisini al.
                                    phone: this.newUser[0].u_phone,
                                    pass: this.newUser[0].u_pass,
                                    birthdate: this.newUser[0].u_birthdate,
                                    role: this.newUser[0].role

                              })
                        });
                        if (!res.ok) throw new Error("addUser endpoint hatası");

                        const data = await res.json(); //Backend'in gönderdiği cevabı JSON olarak oku.

                        this.userMessage = data; //Backend'den gelen mesajı Vue'daki productMessage değişkenine kaydet.sunucu eklendi dedigi zamam gosterir

                        this.getUsers();// ekledikten sonra birdaha cek demek gerekiyor. her seferinde refresh atmamak icin. Yeni ürün eklendikten sonra backend'deki güncel ürün listesini tekrar çekerek ekranı yeniler.

                        //Kullanıcı yeni ürün ekledikten sonra eski bilgiler kutularda kalmasın diye giriş alanlarını başlangıç değerlerine döndürür.
                        this.newUser[0].u_firstName = "";
                        this.newUser[0].u_lastName = "";
                        this.newUser[0].u_email = "";
                        this.newUser[0].u_phone = "";
                        this.newUser[0].u_pass = "";
                        this.newUser[0].u_birthdate = "";



                  }
                  catch (e) {
                        this.userMessage = e.message;// eger hata alirsa catch calisiyor ve urun ekle butonu altinda urun basariyla eklendi kismina failed yazisi geliyor 
                  }
            },

            // PUT- kullanici Guncelleme
            async updateUser(u_id, u_firstName, u_lastName, u_email, u_phone, u_pass, u_birthdate, u_role) {//"Bana hangi ürün olduğunu id ile söyle, yeni bilgilerini de name, stock ve price olarak ver, ben gidip backend'de güncelleyeyim."

                  try {//!bu kodlari calistirmayi dene eger hata alirsan catche git
                        const res = await fetch(`${this.baseUrl}/api/users/${u_id}`, {
                              //!/${id} //! URL'nin sonuna dinamik olarak gönderilecek ürünün id değerini ekler; hangi ürün üzerinde işlem yapılacağını sunucuya bildirir.

                              method: "PUT",
                              headers: { //!Başlık / üst bilgi.HTTP isteğinin yanında gönderilen ek bilgilerdir.

                                    "Content-Type": "application/json"
                              },
                              body: JSON.stringify({//body = asil gonderilen veri demek

                                    firstName: u_firstName, //Formdaki isim bilgisini al.
                                    lastName: u_lastName,
                                    email: u_email,
                                    phone: u_phone,
                                    pass: u_pass,
                                    birthdate: u_birthdate,
                                    role: u_role

                              })
                        });
                        if (!res.ok) throw new Error("hatali veri");

                        const data = await res.json();

                        if (data) {
                              this.showToast("Kullanıcı bilgileri güncellendi.", "edit")
                        }
                        this.getUsers();
                  }
                  catch (e) {
                        console.log(e.message);
                  }
            },


            //DELETE kullanici SIL
            async deleteUser(u_id) {
                  try {
                        const res = await fetch(`${this.baseUrl}/api/users/${u_id}`, {

                              method: "DELETE",
                              headers: { //!Başlık / üst bilgi.HTTP isteğinin yanında gönderilen ek bilgilerdir.

                                    "Content-Type": "application/json" // Content-Type=Gönderdiğim içeriğin türü nedir?
                              },
                        });
                        if (!res.ok) throw new Error(res.error);

                        const data = await res.json(); //Backend'in gönderdiği cevabı JSON olarak oku.

                        if (data) {
                              this.showToast("Kullanıcı silindi.", "error")
                        }
                        this.getUsers();//guncelle isleminden sonra tekrardan verileri cek
                  }
                  catch (e) {
                        console.log(e.message);
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

/* KULLANICI EKLE BUTONU(MODALIN) */
.kullaniciekle-button {
      background-color: #0D1217;
      color: #F5F5F5;
      font-family: 'Oswald', sans-serif;
      font-size: 20px;
      font-weight: 400;
      width: fit-content;
      height: fit-content;
      padding: 8px 16px 8px 16px;
      outline: none !important;
      box-shadow: none !important;
      border-radius: 0px;
}

.admin-user-table {
      height: 100%;
      overflow-y: scroll;
      overflow-x: auto;
}

.admin-user-table>.table {
      margin-left: 0px !important;
      border-radius: 0px !important;
      margin-top: 0px;
      height: 100%;
      width: 100%;
}


/* TABLOYU ADMIN PANELİ İLE EKRAN ARASINDA DENGELİ YERLEŞTİRİR */
table {
      margin-top: -15px;
      margin-left: 20px;
      width: calc(100% - 40px);
}

/* TABLO BAŞLIKLARINI ORTALAR */
table th {
      text-align: center;
      vertical-align: middle;
      white-space: nowrap;
}

/* TABLO HÜCRELERİNİ ORTALAR */
table td {
      text-align: center;
      vertical-align: middle;
}

/* ID KOLONUNU DAR TUTAR */
table th:first-child {
      width: 55px;
}

/* AD INPUT'U */
table td:nth-child(2) input {
      width: 130px;
      margin: auto;
}

/* SOYAD INPUT'U */
table td:nth-child(3) input {
      width: 130px;
      margin: auto;
}

/* EMAIL INPUT'U */
table td:nth-child(4) input {
      width: 190px;
      margin: auto;
}

/* TELEFON INPUT'U */
table td:nth-child(5) input {
      width: 130px;
      margin: auto;
}

/* PAROLA INPUT'U */
table td:nth-child(6) input {
      width: 120px;
      margin: auto;
}

/* DOĞUM TARİHİ */
table td:nth-child(7) {
      width: 130px;
      white-space: nowrap;
}

/* ROL SELECT */
table td:nth-child(8) select {
      width: 115px;
      margin: auto;
}

/* İŞLEM ALANI */
table td:nth-child(9) {
      min-width: 165px;
      white-space: nowrap;
}

/* GÜNCELLE VE SİL BUTONLARI */
table td:nth-child(9) .btn {
      padding: 5px 9px;
      border-radius: 6px;
}

/* MODAL INPUTLARI */
.modal .form-control,
.modal .form-select {
      border-radius: 7px;
}

/* MODAL KULLANICI EKLE BUTONU */
.modal-footer .btn-success {
      border-radius: 8px;
}


/* Kullanıcı tablosunun köşelerini yuvarlar. */
.admin-user-table table {
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 12px;
}

/* İlk sütunun üst sol köşesini yuvarlar. */
.admin-user-table table thead tr th:first-child {
      border-top-left-radius: 12px;
}

/* Son sütunun üst sağ köşesini yuvarlar. */
.admin-user-table table thead tr th:last-child {
      border-top-right-radius: 12px;
}

/* Son satırın sol alt köşesini yuvarlar. */
.admin-user-table table tbody tr:last-child th:first-child,
.admin-user-table table tbody tr:last-child td:first-child {
      border-bottom-left-radius: 12px;
}

/* Son satırın sağ alt köşesini yuvarlar. */
.admin-user-table table tbody tr:last-child td:last-child {
      border-bottom-right-radius: 12px;
}



/* Yalnızca telefon ekranlarında kullanıcılar sayfasının görünümünü düzenler. */
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

      /* Kullanıcı tablosunun kendi alanında yatay kaydırılmasını sağlar. */
      .admin-user-table {
            width: 100%;
            max-width: 100%;
            min-width: 0;
            margin: 0;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
      }

      /* Tabloyu sütunları sıkıştırmadan yatay kaydırılabilir tutar. */
      .admin-user-table table {
            width: max-content;
            min-width: 100%;
            margin: 0;
      }

      /* Kullanıcılar başlığını mobilde normal akışa alır ve beyaz gösterir. */
      h3 {
            margin-top: 0 !important;
            margin-bottom: 12px;
            text-align: left !important;
      }

      /* Kullanıcı ekleme butonunun sağ ve alt boşluklarını mobil ekrana uyarlar. */
      button[data-bs-target="#adduser"] {
            margin-right: 0;
            margin-bottom: 10px;
      }

      /* Tablo başlıklarının ve hücrelerinin daralıp birbirine girmesini önler. */
      .admin-user-table th,
      .admin-user-table td {
            white-space: nowrap;
            vertical-align: middle;
      }

      /* Ad ve soyad alanlarının okunabilir genişliğini korur. */
      .admin-user-table td:nth-child(2) input,
      .admin-user-table td:nth-child(3) input {
            width: 130px;
      }

      /* E-posta alanının genişliğini koruyarak yatay kaydırmaya izin verir. */
      .admin-user-table td:nth-child(4) input {
            width: 190px;
      }

      /* Telefon alanının genişliğini korur. */
      .admin-user-table td:nth-child(5) input {
            width: 130px;
      }

      /* Parola alanının genişliğini korur. */
      .admin-user-table td:nth-child(6) input {
            width: 120px;
      }

      /* Rol seçim alanının genişliğini korur. */
      .admin-user-table td:nth-child(8) select {
            width: 115px;
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