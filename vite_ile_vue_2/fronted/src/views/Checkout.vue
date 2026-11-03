<template>

      <div class="main-container">

            <div class="header-container">

                  <!-- MEVCUT ÖDEME BAŞLIĞI -->
                  <div class="header-container-title">
                        <h1>ÖDEME SAYFASI</h1>
                  </div>


                  <!-- KAYITLI ADRESLER BÖLÜMÜ -->
                  <div class="adreslerim-bolumu">

                        <div class="adress-main-title">
                              <h4>Adreslerim</h4>

                              <button type="button" class="adress-button" @click="adresModalAc()">
                                    <i class="bi bi-plus-lg"></i>
                                    Adres Ekle
                              </button>
                        </div>

                        <div class="adresses-container">

                              <div class="no-adress-text" v-if="adresler.length === 0">
                                    Henüz kayıtlı adresiniz bulunmuyor.
                              </div>

                              <div v-else class="adress-box">
                                    <div v-for="adres in adresler" :key="adres.address_id"
                                          class="col-12 col-sm-6 col-lg-4 adress-card-container">
                                          <div class="card h-100 shadow-sm adress-card">
                                                <div class="card-body">
                                                      <h5 class="card-title">
                                                            <i class="bi bi-geo-alt-fill text-success"></i>
                                                            {{ adres.address_title }}
                                                      </h5>

                                                      <p class="mb-1">
                                                            {{ adres.first_name }} {{ adres.last_name }}
                                                      </p>

                                                      <p class="mb-1">{{ adres.address }}</p>
                                                      <p class="mb-1">{{ adres.state }}, {{ adres.country }}</p>
                                                      <p class="mb-1">{{ adres.zip }}</p>


                                                      <p class="mb-1">{{ adres.phone }}</p>
                                                      <p class="mb-0">{{ adres.email }}</p>

                                                      <div class="mt-3">
                                                            <button type="button" class="btn w-100" :class="seciliAdresId === adres.address_id
                                                                  ? 'btn-success'
                                                                  : 'btn-outline-success'" @click="adresSec(adres)">
                                                                  <i class="bi" :class="seciliAdresId === adres.address_id
                                                                        ? 'bi-check-circle-fill'
                                                                        : 'bi-plus-circle'"></i>

                                                                  {{ seciliAdresId === adres.address_id
                                                                        ? 'Adres Seçildi'
                                                                        : 'Bu Adresi Kullan' }}
                                                            </button>
                                                      </div>

                                                </div>
                                          </div>
                                    </div>
                              </div>

                        </div>

                  </div>

            </div>

            <div class="bottom-container">

                  <!-- ADRES EKLEME MODALI -->
                  <div v-if="adresModalGoster" class="adres-modal-arka-plan" @click.self="adresModalGoster = false">
                        <div class="adres-modal-kutu">

                              <div class="new-adress-container">
                                    <h4>Yeni Adres Ekle</h4>

                                    <button type="button" class="btn-close" aria-label="Kapat"
                                          @click="adresModalGoster = false"></button>
                              </div>

                              <form @submit.prevent="adresKaydet()">

                                    <div class="mb-3">
                                          <label class="form-label">Adres Başlığı</label>
                                          <select class="form-select" v-model="yeniAdres.address_title" required>
                                                <option value="Ev">Ev</option>
                                                <option value="İş">İş</option>
                                                <option value="Okul">Okul</option>
                                          </select>
                                    </div>

                                    <div class="row g-3">
                                          <div class="col-sm-6">
                                                <label class="form-label">Ad</label>
                                                <input type="text" class="form-control" v-model="yeniAdres.first_name"
                                                      required />
                                          </div>

                                          <div class="col-sm-6">
                                                <label class="form-label">Soyad</label>
                                                <input type="text" class="form-control" v-model="yeniAdres.last_name"
                                                      required />
                                          </div>

                                          <div class="col-12">
                                                <label class="form-label">E-posta</label>
                                                <input type="email" class="form-control" v-model="yeniAdres.email"
                                                      required />
                                          </div>

                                          <div class="col-12">
                                                <label class="form-label">Telefon</label>
                                                <input type="text" class="form-control" v-model="yeniAdres.phone"
                                                      required />
                                          </div>

                                          <div class="col-12">
                                                <label class="form-label">Açık Adres</label>
                                                <textarea class="form-control" rows="3" v-model="yeniAdres.address"
                                                      required></textarea>
                                          </div>

                                          <div class="col-sm-6">
                                                <label class="form-label">Ülke</label>
                                                <select class="form-select" v-model="yeniAdres.country" required>
                                                      <option value="Türkiye">Türkiye</option>
                                                      <option value="ABD">ABD</option>
                                                </select>
                                          </div>

                                          <div class="col-sm-6">
                                                <label class="form-label">Şehir</label>
                                                <select class="form-select" v-model="yeniAdres.state" required>
                                                      <option value="Ankara">Ankara</option>
                                                      <option value="İstanbul">İstanbul</option>
                                                      <option value="İzmir">İzmir</option>
                                                </select>
                                          </div>

                                          <div class="col-12">
                                                <label class="form-label">Posta Kodu</label>
                                                <input type="text" class="form-control" v-model="yeniAdres.zip" />
                                          </div>
                                    </div>

                                    <div class="d-flex justify-content-end gap-2 mt-4">
                                          <button type="button" class="btn btn-secondary"
                                                @click="adresModalGoster = false">
                                                İptal
                                          </button>

                                          <button type="submit" class="btn btn-success">
                                                Adresi Kaydet
                                          </button>
                                    </div>

                              </form>

                        </div>
                  </div>

                  <div class="left-side-container">
                        <!-- !Form Kısmı -->
                        <div class="left-side">
                              <h4 class="mb-3">Sipariş Bilgileri</h4>
                              <form class="needs-validation" @submit.prevent="checkOut()">
                                    <div class="row g-3">

                                          <div class="col-sm-12">
                                                <label class="form-label">T.C. Kimlik No:</label>
                                                <input type="text" class="form-control"
                                                      placeholder="Fatura için gereklidir." v-model="order[0].TC"
                                                      required />

                                                <div v-if="TCError" class="alert alert-warning mt-2">
                                                      <small style="color: red;">{{ TCError }}</small>
                                                </div>

                                          </div>
                                          <div class="col-sm-6">
                                                <label class="form-label">Ad:</label>
                                                <input type="text" class="form-control" placeholder=""
                                                      v-model="order[0].firstName" required />

                                                <div v-if="firstNameError" class="alert alert-warning mt-2">
                                                      <small style="color: red;">{{ firstNameError }}</small>
                                                </div>

                                          </div>
                                          <div class="col-sm-6">
                                                <label class="form-label">Soyad:</label>
                                                <input type="text" class="form-control" placeholder=""
                                                      v-model="order[0].lastName" required />

                                                <div v-if="lastNameError" class="alert alert-warning mt-2">
                                                      <small style="color: red;">{{ lastNameError }}</small>
                                                </div>

                                          </div>
                                          <div class="col-6">
                                                <label class="form-label">E-mail:</label>
                                                <input type="email" class="form-control" v-model="order[0].email"
                                                      placeholder="ornek@example.com" />

                                                <div v-if="emailError" class="alert alert-warning mt-2">
                                                      <small style="color: red;">{{ emailError }}</small>
                                                </div>

                                          </div>
                                          <div class="col-6">
                                                <label class="form-label">Telefon:</label>
                                                <input type="text" class="form-control" v-model="order[0].phone"
                                                      placeholder="5XXXXXXXXX" />

                                                <div v-if="phoneError" class="alert alert-warning mt-2">
                                                      <small style="color: red;">{{ phoneError }}</small>
                                                </div>

                                          </div>
                                          <div class="col-12">
                                                <label class="form-label">Adres:</label>
                                                <textarea class="form-control" v-model="order[0].address"
                                                      placeholder="Mahalle,sokak,apartman bilgileri"
                                                      required></textarea>

                                                <div v-if="addressError" class="alert alert-warning mt-2">
                                                      <small style="color: red;">{{ addressError }}</small>
                                                </div>

                                          </div>
                                          <div class="col-md-5">
                                                <label class="form-label">Ülke:</label>
                                                <select v-model="order[0].country" class="form-select" required>
                                                      <option value="Türkiye">Türkiye</option>
                                                      <option value="ABD">ABD</option>
                                                </select>
                                          </div>
                                          <div class="col-md-4">
                                                <label class="form-label">Şehir:</label>
                                                <select v-model="order[0].state" class="form-select" required>
                                                      <option value="İstanbul" selected>İstanbul</option>
                                                      <option value="Ankara">Ankara</option>
                                                      <option value="İzmir">İzmir</option>
                                                </select>
                                          </div>
                                          <div class="col-md-3">
                                                <label class="form-label">Posta Kodu:</label>
                                                <input type="text" class="form-control" v-model="order[0].zip"
                                                      placeholder="" required />

                                                <div v-if="zipError" class="alert alert-warning mt-2">
                                                      <small style="color: red;">{{ zipError }}</small>
                                                </div>

                                                <!-- <div class="invalid-feedback">Zip code required.</div> -->
                                          </div>
                                    </div>
                                    <hr class="my-4" />
                                    <div class="form-check">
                                          <input type="checkbox" class="form-check-input" />
                                          <label class="form-check-label">Sipariş Adresim İle Fatura Adresim
                                                Aynı</label>
                                    </div>
                                    <div class="form-check">
                                          <input type="checkbox" class="form-check-input" />
                                          <label class="form-check-label">Bilgilerimi Sonraki Siparişlerim İçin
                                                Kaydet</label>
                                    </div>
                                    <hr class="my-4" />

                                    <!--! Kart Bilgileri  -->
                                    <h4 class="mb-3">Ödeme Bilgileri</h4>
                                    <div class="row gy-3">
                                          <div class="col-md-6">
                                                <label class="form-label">Kart Sahibi:</label>
                                                <input v-model="payment[0].name" type="text" class="form-control"
                                                      placeholder="Kartın Üzerindeki İsmi Eksiksiz Girin." required />
                                                <!-- <small class="text-body-secondary">Kartın Üzerindeki İsmi Eksiksi Girin.</small> -->

                                                <div v-if="cardNameError" class="alert alert-warning mt-2">
                                                      <small style="color: red;">{{ cardNameError }}</small>
                                                </div>

                                          </div>
                                          <div class="col-md-6">
                                                <label class="form-label">Kart Numarası:</label>
                                                <input v-model="payment[0].number" type="text" class="form-control"
                                                      placeholder="" required />

                                                <div v-if="cardNumberError" class="alert alert-warning mt-2">
                                                      <small style="color: red;">{{ cardNumberError }}</small>
                                                </div>

                                          </div>

                                          <div class="col-md-3">
                                                <label class="form-label">Son Kullanma Tarihi:</label>

                                                <input type="text" v-model="payment[0].exp" @input="formatCardExp"
                                                      class="form-control" placeholder="AA/YY" maxlength="5" required />

                                                <div v-if="cardExpError" class="alert alert-warning mt-2">
                                                      <small style="color: red;">{{ cardExpError }}</small>
                                                </div>

                                          </div>

                                          <div class="col-md-3">
                                                <label class="form-label">CVV:</label>
                                                <input type="text" v-model="payment[0].cvv" class="form-control"
                                                      placeholder="" required />

                                                <div v-if="CVVError" class="alert alert-warning mt-2">
                                                      <small style="color: red;">{{ CVVError }}</small>
                                                </div>

                                          </div>

                                    </div>
                                    <hr class="my-4" />
                                    <button class="checkout-button" type="submit">
                                          Siparişi Tamamla
                                    </button>



                              </form>
                        </div>
                  </div>

                  <!-- !Sepet Kısmı -->
                  <div class="col-md-5 col-lg-4 order-md-last right-side">
                        <h4 class="d-flex justify-content-between align-items-center mb-3">
                              <span class="text">Sepet</span>
                              <span class="text">{{ sepet.length }} ürün mevcut</span>
                        </h4>
                        <ul class="list-group mb-3">
                              <li class="list-group-item d-flex justify-content-between lh-sm">
                                    <div>
                                          <!-- !2:57:42 -->
                                          <h6 class="my-0">Ürün Adı</h6>
                                    </div>
                                    <h6 class="text-body-secondary">Fiyat(₺)</h6>
                              </li>
                              <!-- !sepeti döndürücez -->
                              <li v-for="value, index in sepet"
                                    class="list-group-item d-flex justify-content-between lh-sm">
                                    <div>
                                          <!-- <h6 class="my-0">{{ value.p_name }}</h6> -->
                                          <h6 class="my-0">{{ value.p_name }} &nbsp; × {{ value.quantity }}
                                          </h6>

                                          <small class="text-body-secondary">{{ value.p_desc }}</small>
                                    </div>
                                    <span class="text-body-secondary">
                                          {{ value.p_price }}₺
                                          <div class="col-1">
                                                <i style="cursor: pointer;" @click.self="deleteItem(index)"
                                                      class="bi bi-trash3"></i>
                                          </div>
                                    </span>
                              </li>

                              <li class="list-group-item d-flex justify-content-between">
                                    <span>Toplam Tutar:</span> <strong>{{ Math.round(toplamTutar * 100) /
                                          100
                                    }}
                                          ₺</strong>
                              </li>


                              <li class="list-group-item d-flex justify-content-between">
                                    <span>KDV (%20):</span> <strong>{{ Math.round(toplamTutar * 0.2 * 100) /
                                          100 }}
                                          ₺</strong>
                              </li>
                              <li class="list-group-item d-flex justify-content-between">
                                    <span>KDV liToplam Tutar:</span> <strong>{{ Math.round(toplamTutar * 1.2
                                          *
                                          100) / 100 }}
                                          ₺</strong>
                              </li>
                        </ul>
                  </div>

            </div>

      </div>

</template>

<script>

import {
      validateFirstName,
      validateLastName,
      validateEmail,
      validatePhone,
      validateTC,
      validateAddress,
      validateZip,
      validateCardName,
      validateCardNumber,
      validateCardExp,
      validateCVV
} from '@/validation.js';

export default {
      inject: ['sepet', 'showToast'],
      data() {
            return {
                  baseUrl: "http://localhost:3001",
                  toplam: 0,

                  // ADRES KAYIT SİSTEMİ
                  adresler: [],
                  adresModalGoster: false,
                  seciliAdresId: null,

                  yeniAdres: {
                        address_title: "Ev",
                        first_name: "",
                        last_name: "",
                        email: "",
                        phone: "",
                        address: "",
                        country: "Türkiye",
                        state: "Ankara",
                        zip: ""
                  },




                  order: [{ TC: "", firstName: "", lastName: "", email: "", phone: "", address: "", country: "Turkiye", state: "Istanbul", zip: "" }],

                  payment: [{ name: "", number: "", exp: "", cvv: "" }],

                  firstNameError: "",
                  lastNameError: "",
                  emailError: "",
                  phoneError: "",
                  TCError: "",
                  addressError: "",
                  zipError: "",
                  cardNameError: "",
                  cardNumberError: "",
                  cardExpError: "",
                  CVVError: "",

                  orderSuccess: false,

            };
      },
      mounted() {
            this.getAddresses();

      },
      computed: {
            // toplamTutar() {
            //       this.toplam = this.sepet.reduce(
            //             (toplam, urun) => toplam + Number(urun.p_price), 0
            //       )
            //       return Math.round(this.toplam * 100) / 100
            // }



            toplamTutar() {
                  this.toplam = this.sepet.reduce(
                        (toplam, urun) => toplam + Number(urun.p_price) * Number(urun.quantity), 0
                  )
                  return Math.round(this.toplam * 100) / 100
            }

      },
      methods: {

            adresModalAc() {
                  this.adresModalGoster = true;
            },

            //ADRES EKLEME INPUTA DIREK GIRIS YAPMAK ICIN EKLENEN KISIM
            adresSec(adres) {
                  this.seciliAdresId = adres.address_id;

                  this.order[0].firstName = adres.first_name;
                  this.order[0].lastName = adres.last_name;
                  this.order[0].email = adres.email;
                  this.order[0].phone = adres.phone;
                  this.order[0].address = adres.address;
                  this.order[0].country = adres.country;
                  this.order[0].state = adres.state;
                  this.order[0].zip = adres.zip || "";
            },


            //ADRES EKLE MODALI ICIN EKLENEN FONKSIYON
            async getAddresses() {
                  try {
                        const token = sessionStorage.getItem("token");

                        if (!token) {
                              this.adresler = [];
                              console.log("Giriş tokenı bulunamadı.");
                              return;
                        }

                        const userRes = await fetch(`${this.baseUrl}/api/me`, {
                              headers: {
                                    "Authorization": `Bearer ${token}`
                              }
                        });

                        if (!userRes.ok) {
                              throw new Error("Kullanıcı bilgileri alınamadı.");
                        }

                        const user = await userRes.json();
                        const userId = user.u_id;

                        const res = await fetch(
                              `${this.baseUrl}/api/addresses/${userId}`
                        );

                        if (!res.ok) {
                              throw new Error("Adresler alınamadı.");
                        }

                        this.adresler = await res.json();

                  } catch (err) {
                        console.log("ADRES LİSTELEME HATASI:", err.message);
                  }
            },


            async adresKaydet() {
                  try {
                        const token = sessionStorage.getItem("token");

                        if (!token) {
                              this.showToast("Adres kaydetmek için giriş yapmalısınız.");
                              return;
                        }

                        const userRes = await fetch(`${this.baseUrl}/api/me`, {
                              headers: {
                                    "Authorization": `Bearer ${token}`
                              }
                        });

                        if (!userRes.ok) {
                              throw new Error("Kullanıcı bilgileri alınamadı.");
                        }

                        const user = await userRes.json();
                        const userId = user.u_id;

                        const res = await fetch(`${this.baseUrl}/api/addresses`, {
                              method: "POST",
                              headers: {
                                    "Content-Type": "application/json"
                              },
                              body: JSON.stringify({
                                    userId: Number(userId),
                                    ...this.yeniAdres
                              })
                        });

                        const data = await res.json();

                        if (!res.ok) {
                              throw new Error(data.error || "Adres kaydedilemedi.");
                        }

                        await this.getAddresses();

                        this.adresModalGoster = false;

                        this.yeniAdres = {
                              address_title: "Ev",
                              first_name: "",
                              last_name: "",
                              email: "",
                              phone: "",
                              address: "",
                              country: "Türkiye",
                              state: "Ankara",
                              zip: ""
                        };

                        this.showToast("Adresiniz başarıyla kaydedildi.");

                  } catch (err) {
                        console.log("ADRES KAYDETME HATASI:", err.message);
                        this.showToast(err.message);
                  }
            },











            //BURADA KART ODEME TARIH KISMI ICIN "/" EKLEMEYI YAPTIM
            formatCardExp(event) {

                  let value = event.target.value.replace(/[^0-9]/g, "");

                  if (value.length > 2) {
                        value = value.substring(0, 2) + "/" + value.substring(2, 4);
                  }

                  this.payment[0].exp = value;
            },

            async checkOut() {

                  this.firstNameError = "";
                  this.lastNameError = "";
                  this.emailError = "";
                  this.phoneError = "";
                  this.TCError = "";
                  this.addressError = "";
                  this.zipError = "";
                  this.cardNameError = "";
                  this.cardNumberError = "";
                  this.cardExpError = "";
                  this.CVVError = "";

                  this.firstNameError = validateFirstName(this.order[0].firstName);
                  this.lastNameError = validateLastName(this.order[0].lastName);
                  this.emailError = validateEmail(this.order[0].email);
                  this.phoneError = validatePhone(this.order[0].phone);
                  this.TCError = validateTC(this.order[0].TC);
                  this.addressError = validateAddress(this.order[0].address);
                  this.zipError = validateZip(this.order[0].zip);

                  this.cardNameError = validateCardName(this.payment[0].name);
                  this.cardNumberError = validateCardNumber(this.payment[0].number);
                  this.cardExpError = validateCardExp(this.payment[0].exp);
                  this.CVVError = validateCVV(this.payment[0].cvv);

                  if (
                        this.firstNameError ||
                        this.lastNameError ||
                        this.emailError ||
                        this.phoneError ||
                        this.TCError ||
                        this.addressError ||
                        this.zipError ||
                        this.cardNameError ||
                        this.cardNumberError ||
                        this.cardExpError ||
                        this.CVVError
                  ) {
                        return;
                  }

                  try {
                        // 1. Önce giriş yapan kullanıcının token bilgisini alıyoruz.
                        const token = sessionStorage.getItem("token");

                        if (!token) {
                              this.showToast("Sipariş vermek için giriş yapmalısınız.");
                              return;
                        }

                        // 2. Token üzerinden giriş yapan kullanıcının bilgilerini alıyoruz.
                        const userRes = await fetch(`${this.baseUrl}/api/me`, {
                              headers: {
                                    "Authorization": `Bearer ${token}`
                              }
                        });

                        if (!userRes.ok) {
                              throw new Error("Kullanıcı bilgileri alınamadı.");
                        }

                        const user = await userRes.json();

                        // 3. Siparişi backend'e gönderiyoruz.
                        const res = await fetch(`${this.baseUrl}/api/orders`, {
                              method: "POST",
                              headers: {
                                    "Content-Type": "application/json"
                              },
                              body: JSON.stringify({
                                    sepet: this.sepet,
                                    order: this.order,
                                    amount: Math.round(this.toplamTutar * 1.2),
                                    userId: user.u_id
                              })
                        });

                        // 4. Backend'den gelen cevabı okuyoruz.
                        const data = await res.json();

                        if (!res.ok) {
                              throw new Error(data.error || "Sipariş oluşturulamadı.");
                        }

                        // 5. Sipariş başarılıysa sepeti temizliyoruz.
                        if (data) {
                              this.sepet.splice(0, this.sepet.length);
                              this.orderSuccess = true;

                              this.showToast("Ödeme alındı. Siparişiniz başarıyla oluşturuldu.");

                              this.order[0] = {
                                    TC: "",
                                    firstName: "",
                                    lastName: "",
                                    email: "",
                                    phone: "",
                                    address: "",
                                    country: "Türkiye",
                                    state: "İstanbul",
                                    zip: ""
                              };

                              this.payment[0] = {
                                    name: "",
                                    number: "",
                                    exp: "",
                                    cvv: ""
                              };
                        }

                  } catch (e) {
                        console.log("SİPARİŞ HATASI:", e.message);
                        this.showToast(e.message);
                  }
            },



            deleteItem(index) {
                  this.sepet.splice(index, 1);
            },
      },
};
</script>

<style scoped>
.main-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
}

.header-container {
      display: flex;
      flex-direction: column;
      align-items: center;
}

.header-container-title {
      height: fit-content;
      padding: 0px !important;
      margin: 0px !important;
}

.header-container-title h1 {
      color: #0D1217;
      font-size: 36px;
      font-family: 'Oswald', sans-serif;
      font-weight: 400;
      text-align: left;
}

.adreslerim-bolumu {
      padding: 0px !important;
      margin: 0px !important;
      width: 100%;
      height: fit-content;
      display: flex;
      flex-direction: column;
      gap: 12px;
      justify-content: center;
      align-items: center;
}

.adress-main-title {
      display: flex;
      justify-content: space-between;
      width: 50%;
      align-items: center;
}

.adress-main-title h4 {
      color: #0D1217;
      font-size: 24px;
      font-family: 'Oswald', sans-serif;
      font-weight: 400;
      text-align: left;
}

.adresses-container {
      display: flex;
      flex-direction: column;
}

.no-adress-text {
      color: #0D1217;
      font-size: 16px;
      font-family: 'Helvetica', sans-serif;
      font-weight: 200;
      text-align: left;
}

.adress-box {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      width: 100%;
}

.adress-card-container {
      width: 100%;
}

.adress-card {
      width: 100%;
}

.bottom-container {
      display: flex;
      justify-content: center;
      gap: 50px;
}

.left-side-container {
      padding: 24px !important;
      display: flex;
      width: 40%;
      background-color: #D8D7D3;
}

.right-side {
      padding: 24px 24px 0px 24px !important;
      height: 100%;
      width: 30%;
      background-color: #D8D7D3;
}

/* ================================= */
/* =============================== */

/* Form etiketlerini düzenler. */
.form-label {
      color: #333333;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 7px;
}

/* Input ve select alanlarını açık renkte gösterir. */
.form-control,
.form-select {
      background-color: #ffffff;
      color: #222222;
      border: 1px solid #d8d8d8;
      border-radius: 9px;
      min-height: 44px;
      padding: 10px 13px;
      transition: 0.2s ease;
}

/* Placeholder yazılarını gri gösterir. */
.form-control::placeholder {
      color: #999999;
}

/* Input seçildiğinde yeşil odak efekti verir. */
.form-control:focus,
.form-select:focus {
      background-color: #ffffff;
      color: #222222;
      border-color: #0661F6;
      box-shadow: 0 0 0 3px rgba(127, 255, 0, 0.12);
}

/* Pasif input alanlarını açık gri gösterir. */
.form-control:disabled,
.form-control[readonly] {
      background-color: #eeeeee;
      color: #777777;
}

/* Form bölümlerini ince çizgiyle ayırır. */
hr {
      border-color: #e3e3e3;
      opacity: 1;
      margin-top: 25px;
      margin-bottom: 25px;
}

/* Checkbox alanlarını açık gri kutular haline getirir. */
.form-check {
      background: #fafafa;
      border: 1px solid #e5e5e5;
      border-radius: 9px;
      padding: 12px 15px 12px 40px;
      margin-bottom: 10px;
}

/* Checkbox yazılarını koyu gri gösterir. */
.form-check-label {
      color: #444444;
      font-size: 14px;
}

/* Seçilen checkbox'ı yeşil yapar. */
.form-check-input:checked {
      background-color: #0661F6;
      border-color: #0661F6;
}

/* Sepet listesinin kenarlarını yuvarlatır. */
.list-group {
      border-radius: 12px;
      overflow: hidden;
}

/* Sepetteki ürün satırlarını beyaz gösterir. */
.list-group-item {
      background-color: #ffffff;
      color: #333333;
      border-color: #e5e5e5;
      padding: 16px;
}

/* Sepetteki ürün isimlerini belirgin gösterir. */
.list-group-item h6 {
      color: #222222;
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 4px;
}

/* Sepet ürünlerinin küçük açıklamalarını düzenler. */
.list-group-item small {
      color: #888888;
}

/* Sepet fiyatlarını koyu gri gösterir. */
.list-group-item span {
      color: #333333;
      font-weight: 600;
}

/* Sepetin toplam satırını hafif griyle öne çıkarır. */
.list-group-item:last-child {
      background-color: #f5f5f5;
      color: #222222;
      font-size: 17px;
      font-weight: 800;
}

/* Sepetteki silme ikonunu kırmızı gösterir. */
.list-group-item .bi-trash3 {
      color: #dc3545;
      cursor: pointer;
      transition: 0.2s ease;
}

/* Silme ikonunun üzerine gelince büyütür. */
.list-group-item .bi-trash3:hover {
      transform: scale(1.15);
}

/* Sepet miktar inputlarını açık renkte gösterir. */
.list-group-item input {
      background-color: #ffffff;
      color: #222222;
      border: 1px solid #cccccc;
      border-radius: 6px;
      text-align: center;
}

/* Sepet fiyatlarının gri görünümünü düzenler. */
.list-group-item .text-body-secondary {
      color: #555555 !important;
}

/* Hata mesajlarını açık sarı kutu haline getirir. */
.alert.alert-warning {
      background-color: #fff8df;
      border: 1px solid #f0d77a;
      border-radius: 8px;
      color: #8a6d00;
      padding: 9px 12px;
      font-size: 13px;
}

.checkout-button {
      background-color: #0661F6;
      color: #F5F5F5;
      font-family: 'Oswald', sans-serif;
      font-size: 20px;
      font-weight: 400;
      width: 100%;
      height: fit-content;
      padding: 8px 0px 8px 0px;
      border: none;
      outline: none;
      box-shadow: none;

}

.checkout-button:hover {
      transform: translateY(-3px) !important;
      background-color: #0047B3;
      box-shadow: 0 8px 50px rgba(0, 0, 0, 0.25);
}

/* Bootstrap ayırıcı alanının stilini korur. */
.b-example-divider {
      width: 100%;
      height: 3rem;
      background-color: rgba(0, 0, 0, .1);
      border: solid rgba(0, 0, 0, .15);
      border-width: 1px 0;
      box-shadow:
            inset 0 .5em 1.5em rgba(0, 0, 0, .1),
            inset 0 .125em .5em rgba(0, 0, 0, .15);
}

/* Bootstrap dikey ayırıcısını düzenler. */
.b-example-vr {
      flex-shrink: 0;
      width: 1.5rem;
      height: 100vh;
}


/* Giris basarili alert yazisi icin CSS kismi */
.order-success {
      background-color: #e8ffd6;
      border: 1px solid chartreuse;
      color: #2f5f00;
      border-radius: 10px;
      padding: 14px 18px;
      margin-bottom: 20px;
      font-weight: 700;
      text-align: center;
}


/* ============================== */
/* Modal arka planı */
/* ============================== */

.adres-modal-arka-plan {
      position: fixed;
      inset: 0;
      z-index: 1055;

      display: flex;
      justify-content: center;
      align-items: center;

      width: 100%;
      height: 100%;
      height: 100dvh;

      padding: clamp(10px, 3vw, 28px);

      background: rgba(10, 15, 12, 0.72);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);

      overflow-x: hidden;
      overflow-y: auto;
      overscroll-behavior: contain;
}

/* Modal kutusu */
.adres-modal-kutu {
      position: relative;

      width: min(100%, 680px);
      min-width: 0;
      max-height: calc(100dvh - 40px);

      padding: clamp(16px, 3.5vw, 32px);

      overflow-x: hidden;
      overflow-y: auto;
      overscroll-behavior: contain;

      background: #ffffff;
      color: #212529;

      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: clamp(12px, 2vw, 20px);

      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

      animation: adresModalAcilis 0.22s ease-out;
} 

/* Modal başlığı */
.adres-modal-kutu h4 {
      min-width: 0;
      margin: 0;

      color: #202820;
      font-size: clamp(1.1rem, 2.5vw, 1.45rem);
      font-weight: 750;
      line-height: 1.35;

      overflow-wrap: anywhere;
}

/* Başlık ve kapatma butonu */
.adres-modal-kutu form {
      width: 100%;
      min-width: 0;
}

.adres-modal-kutu .btn-close {
      flex-shrink: 0;
      padding: 10px;
}

/* Form alanlarının bulunduğu satırlar */
.adres-modal-kutu .mb-3 {
      width: 100%;
      min-width: 0;
      margin-bottom: 16px !important;
}

/* Etiketler */
.adres-modal-kutu .form-label {
      display: block;
      margin-bottom: 7px;

      color: #303830;
      font-size: 0.94rem;
      font-weight: 650;
      line-height: 1.4;

      overflow-wrap: anywhere;
}


.adress-button {
      background-color: #0661F6;
      color: #F5F5F5;
      font-family: 'Oswald', sans-serif;
      font-size: 20px;
      font-weight: 400;
      width: fit-content;
      height: fit-content;
      padding: 8px 8px 8px 8px;
      border: none;
      outline: none;
      box-shadow: none;

}

.adress-button:hover {
      transform: translateY(-3px) !important;
      background-color: #0047B3;
      box-shadow: 0 8px 50px rgba(0, 0, 0, 0.25);
}



/* Input ve select alanları */
.adres-modal-kutu .form-control,
.adres-modal-kutu .form-select {
      display: block;

      width: 100%;
      max-width: 100%;
      min-width: 0;
      min-height: 46px;

      padding: 10px 12px;

      color: #212529;
      background-color: #ffffff;

      border: 1px solid #d1d8d2;
      border-radius: 9px;

      font-size: 16px;
      line-height: 1.4;

      box-shadow: none;
}

/* Telefonda alan seçildiğinde belirgin görünüm */
.adres-modal-kutu .form-control:focus,
.adres-modal-kutu .form-select:focus {
      border-color: #198754;
      outline: 0;
      box-shadow: 0 0 0 3px rgba(25, 135, 84, 0.14);
}


/* Kaydet / İptal satırı */
.adres-modal-kutu form>.d-flex {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
}


.btn-success{
      background-color: #0661F6;
      color: #F5F5F5;
      font-family: 'Oswald', sans-serif;
      font-size: 20px;
      font-weight: 400;
      width: fit-content;
      height: fit-content;
      padding: 8px 8px 8px 8px;
      border: none;
      outline: none;
      box-shadow: none;
}

.new-adress-container{
      display: flex;
      justify-content: space-between;
      
}


/* Açılış animasyonu */
@keyframes adresModalAcilis {
      from {
            opacity: 0;
            transform: translateY(12px) scale(0.99);
      }

      to {
            opacity: 1;
            transform: translateY(0) scale(1);
      }
}


/* ========================= */
/* RESPONSIVE GORUNUMLER */
/* ========================= */

@media (min-width: 992px) and (max-width: 1199px) {

      .adress-main-title {
            width: 95%;
      }

      .adresses-container {
            padding: 0px 24px;

      }

      .bottom-container {
            gap: 24px;
            padding: 0px 24px;
      }

      .left-side-container {
            width: 60%;
      }

      .right-side {
            width: 40%;
      }

}

@media (min-width: 576px) and (max-width: 991px) {

      .adress-main-title {
            width: 95%;
      }

      .bottom-container {
            padding: 0px 24px;
      }

      .left-side-container {
            width: 100%;
      }

      .right-side {
            width: 100%;
            padding: 0px 24px;
      }
}

@media (min-width: 360px) and (max-width: 600px) {

      .adress-main-title {
            width: 96%;
      }

      .adress-box {
            display: grid;
            grid-template-columns: repeat(1, 1fr);
      }

      .bottom-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 24px;
      }

      .left-side-container {
            width: 100%;
      }

      .right-side {
            width: 100%;
            padding: 0px 24px;
      }
}
</style>