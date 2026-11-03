<template>
      <!-- !CONTACT ICERIK -->
      <div class="content">
            <h1 style="color: white;">BİZE MESAJ GÖNDERİN !</h1>


            <div class="form-card">
                  <h2>İLETİŞİM FORMU</h2>
                  <!--!  CONTACT FORM ALANI -->
                  <form @submit.prevent="sendMessage()">
                        <div class="form-group">
                              <label class="form-label">AD </label>
                              <input v-model="newMessage[0].firstName" type="text" class="form-control"
                                    placeholder="Adınızı Giriniz" required>

                              <div v-if="firstNameError" class="alert alert-warning mt-2">
                                    <small style="color: red;">{{ firstNameError }}</small>

                              </div>


                        </div>
                        <div class="form-group">
                              <label> SOYAD</label>
                              <input v-model="newMessage[0].lastName" type="text" class="form-control"
                                    placeholder=" Soyadınızı Giriniz" required>

                              <div v-if="lastNameError" class="alert alert-warning mt-2">
                                    <small style="color: red;">{{ lastNameError }}</small>

                              </div>
                        </div>
                        <div class="form-group">
                              <label>E-MAİL</label>
                              <input v-model="newMessage[0].email" type="text" class="form-control"
                                    placeholder="example@hotmail.com" required>

                              <div v-if="emailError" class="alert alert-warning mt-2">
                                    <small style="color: red;">{{ emailError }}</small>

                              </div>

                        </div>

                        <div class="form-group">
                              <label>ÜLKE</label>
                              <select v-model="newMessage[0].code" required>
                                    <option value="+90" selected>TR (+90)</option>
                                    <option value="+971">BAE (+971)</option>
                                    <option value="+34">ES (+34)</option>
                              </select>

                        </div>

                        <div class="form-group">
                              <label>TELEFON</label>
                              <input v-model="newMessage[0].phone" type="text" class="form-control" required>
                              <div v-if="phoneError" class="alert alert-warning mt-2">
                                    <small style="color: red;">{{ phoneError }}</small>
                              </div>

                        </div>

                        <div class="form-group">
                              <label>MESAJ İÇERİĞİ</label>
                              <select v-model="newMessage[0].subject" required>
                                    <option value="Teşekkür ">Teşekkür</option>
                                    <option value="Öneri">Öneri</option>
                                    <option value="Şikayet">Şikayet</option>
                              </select>
                              <br><br>
                              <textarea v-model="newMessage[0].message" class="form-control" placeholder="MESAJ"
                                    required></textarea>
                        </div>

                        <div class="check-group">
                              <input v-model="newMessage[0].check" type="checkbox" required>
                              <label for="c">Paylaştığım Verilerin İşlenmesini Ve Saklanmasını Kabul Ediyorum.</label>

                        </div>
                        <div v-if="status != 'isleniyor'">
                              <button type="submit" class="btn btn-primary">GÖNDER</button>
                        </div>


                        <!-- !MESAJ STATUS -->
                        <div class="row">

                              <!-- ?GONDERILDIYSE -->
                              <div v-if="status == 'basarili'"
                                    class="alert alert-success alert-dismissible fade show mt-3 " role="alert">
                                    MEŞAJ BAŞARIYLA GÖNDERİLDİ✅
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    </button>
                              </div>

                              <!-- ?GONDERILMEDIYSE -->
                              <div v-if="status == 'basarisiz'"
                                    class="alert alert-danger alert-dismissible fade show mt-3 " role="alert">
                                    MEŞAJ GÖNDERİLEMEDİ❌
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    </button>
                              </div>

                        </div>

                  </form>
            </div>
      </div>





</template>


<script>
import { validateFirstName, validateLastName, validateEmail, validatePhone } from '@/validation.js';

export default {
      data() {
            return {
                  newMessage: [
                        { firstName: "", lastName: "", email: "", code: "+90", phone: "", subject: "Tesekkur", message: "", check: false, }
                  ],

                  status: "",
                  firstNameError: "",
                  lastNameError: "",
                  emailError: "",
                  phoneError: "",

                  messages: [],
                  baseUrl: "http://localhost:3001"
            };
      },
      mounted() {

      },

      unmounted() {

      },

      watch: {
      },
      computed: {
      },
      methods: {

            // POST- MESAJ GONDER
            async sendMessage() {
                  try {
                        this.status = "isleniyor";
                        this.firstNameError = "";
                        this.lastNameError = "";
                        this.emailError = "";
                        this.phoneError = "";

                        this.firstNameError = validateFirstName(this.newMessage[0].firstName);
                        this.lastNameError = validateLastName(this.newMessage[0].lastName);
                        this.emailError = validateEmail(this.newMessage[0].email);
                        this.phoneError = validatePhone(this.newMessage[0].phone);

                        if (
                              this.firstNameError ||
                              this.lastNameError ||
                              this.emailError ||
                              this.phoneError
                        ) {
                              this.status = "";
                              return;
                        }

                        const res = await fetch(`${this.baseUrl}/api/contact`, {
                              method: "POST",
                              headers: {
                                    "Content-Type": "application/json"
                              },
                              body: JSON.stringify({

                                    firstName: this.newMessage[0].firstName,
                                    lastName: this.newMessage[0].lastName,
                                    email: this.newMessage[0].email,
                                    code: this.newMessage[0].code,
                                    phone: this.newMessage[0].phone,
                                    subject: this.newMessage[0].subject,
                                    message: this.newMessage[0].message,
                              })
                        });

                        const data = await res.json();

                        if (!res.ok) {
                              throw new Error(data);
                        }

                        this.status = "basarili"; //!burada normalde this.status= data yaziyordu ama hata aldigim icin bsarili yaptim contact sayfasinda mesaj gonderdikten sonra ekrana mesaj gonderildi bildirimi verebilmek icin

                        this.newMessage[0].firstName = "";
                        this.newMessage[0].lastName = "";
                        this.newMessage[0].email = "";
                        this.newMessage[0].code = "+90";
                        this.newMessage[0].phone = "";
                        this.newMessage[0].subject = "Tesekkur";
                        this.newMessage[0].message = "";
                        this.newMessage[0].check = false;
                  }
                  catch (e) {
                        this.status = "Mesaj Gonderilemedi";
                        console.log(e.message);
                  }
            },
      }
};
</script>


<style scoped>
/* ================================
   CONTACT - MODERN CLEAN
   ================================ */

.content {
      padding: 50px 20px;
}

.content h1 {
      text-align: center;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 35px;
      color: #222;
}

.form-card {
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
      padding: 35px 40px;
      background: #ffffff;
      border-radius: 18px;
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);
      border: 1px solid #eeeeee;
}

.form-card h2 {
      color: #0D1217;
      font-size: 36px;
      font-family: 'Oswald', sans-serif;
      font-weight: 400;
      text-align: center;
}

.form-group {
      margin-bottom: 20px;
}

.form-group label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      letter-spacing: 0.3px;
}

.form-control,
.form-group select {
      width: 100%;
      min-height: 48px;
      padding: 12px 15px;
      border: 1px solid #dddddd;
      border-radius: 10px;
      background: #ffffff;
      color: #333;
      font-size: 15px;
      transition: all 0.2s ease;
      box-shadow: none;
}

.form-control:focus,
.form-group select:focus {
      border-color: #222;
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.07);
      outline: none;
}

.form-control::placeholder {
      color: #999;
}

textarea.form-control {
      min-height: 140px;
      resize: vertical;
}

/* Checkbox */
.check-group {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin: 25px 0;
}

.check-group input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin-top: 2px;
      cursor: pointer;
}

.check-group label {
      font-size: 13px;
      line-height: 1.5;
      color: #555;
      cursor: pointer;
}

/* Gönder butonu */
.form-card .btn-primary {
      background-color: #0D1217;
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

.form-card .btn-primary:hover {
      background-color: #0661F6;
      transition: background-color 0.4s ease;

}

.form-card .btn-primary:active {
      transform: translateY(0);
}

/* Başarı / hata mesajları */
.form-card .alert {
      border-radius: 10px;
      border: none;
      margin-top: 20px;
}
</style>