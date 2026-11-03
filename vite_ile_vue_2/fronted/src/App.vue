<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Sepet from '@/components/sepet.vue'
import Toast from '@/components/toast.vue'
import Footer from '@/components/footer.vue'
import { reactive } from "vue"
import { Modal } from 'bootstrap/dist/js/bootstrap.min';
</script>


<!-- !BODY KISMIMIZ -->
<template>
    <!-- FONT FAMILY OSWALD -->
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap" rel="stylesheet">

    <!-- ! NAVBAR-->
    <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>


        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav  mr-auto mt-2 mt-lg-0">

                <RouterLink to="/">
                    <img src="../src/assets/img/Logo.png" alt="Logo">
                </RouterLink>

                <div class="navbar-left">

                    <li class="nav-item">
                        <RouterLink class="nav-link tab" aria-current="page" to="/">Anasayfa</RouterLink>
                    </li>

                    <li class="nav-item">
                        <RouterLink class="nav-link tab" to="/product">Ürünler
                        </RouterLink>
                    </li>

                    <li class="nav-item">
                        <RouterLink class="nav-link tab" to="/about">
                            Hakkımızda</RouterLink>
                    </li>

                    <li class="nav-item">
                        <RouterLink class="nav-link tab" to="/faq">S.S.S
                        </RouterLink>
                    </li>

                    <li class="nav-item">
                        <RouterLink class="nav-link tab" to="/contact">
                            İletişim</RouterLink>
                    </li>
                </div>

                <div class="navbar-right">

                    <form class="form-inline my-2 my-lg-0 search-form" @submit.prevent="search">
                        <div class="search-wrapper">
                            <input v-model="nav_search" class="form-control mr-sm-2" type="search"
                                placeholder="Ürün Ara..." aria-label="Ürün ara" autocomplete="on">

                            <div v-if="nav_search.trim() && searchResults.length > 0" class="search-results">
                                <div v-for="product in searchResults" :key="product.p_id" class="search-result-item"
                                    @click="goToProduct(product)">
                                    <img :src="`${baseUrl}/uploads/${product.p_images}`" alt="">

                                    <span>{{ product.p_name }}</span>
                                </div>
                            </div>

                            <div v-else-if="nav_search.trim()" class="search-results search-empty">
                                Aradığınız ürün bulunamadı.
                            </div>
                        </div>

                        <button class="btn btn-dark arama-button" type="submit">Arama</button>
                    </form>

                    <li class="nav-item" @click="pageRouter()">
                        <a style="cursor: pointer;" class="nav-link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#0D1217"
                                class="bi bi-person-circle" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                <path fill-rule="evenodd"
                                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                            </svg>
                        </a>
                    </li>

                    <li class="nav-item sepet-buton">
                        <a data-bs-toggle="offcanvas" href="#sepetsidebar" style="cursor: pointer;">
                            <i class="bi bi-cart-fill" style="color: #0D1217; font-size: 24px; "></i>

                            <span v-if="sepet.length > 0" class="sepet-sayi">
                                {{ sepet.length }}
                            </span>
                        </a>
                    </li>
                </div>

            </ul>
        </div>

    </nav>



    <Sepet />

    <Toast :show="toastShow" :message="toastMessage" :type="toastType" />

    <div class="container">
        <!-- !1. PENCERE: GİRİŞ YAP  -->
        <div class="modal fade" id="loginModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <h4 id="examplemodallabel" class="modal-title">Giriş Yap</h4>
                        <button id="loginClose" type="button" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>

                    <!-- !LOGIN MODAL -->
                    <div class="modal-body">
                        <!--!login Form  -->
                        <form @submit.prevent="submitLogin()">
                            <div class="mb-3 text-start">
                                <label class="form-label">E-Mail*</label>
                                <input type="text" class="form-control" v-model="user[0].email"
                                    placeholder="E-Mail Adresinizi Giriniz" required>

                                <div v-if="emailError" style="color: red;">
                                    <small style="color: red;">{{ emailError }}</small>
                                </div>

                            </div>

                            <div class="mb-3 text-start">
                                <label class="form-label">Parola*</label>
                                <input type="password" class="form-control" v-model="user[0].pass"
                                    placeholder="Parolanızı Giriniz" required>

                                <div v-if="passError" style="color: red;">
                                    <small style="color: red;">{{ passError }}</small>
                                </div>

                            </div>
                            <div class="mb-3 form-check text-start">
                                <input type="checkbox" class="form-check-input" v-model="user[0].check">
                                <label @click.self="user[0].check = !user[0].check" style="cursor: pointer;"
                                    class="form-check-label">Gerçekten Robot Değilim</label>
                                <!-- !clickself ekleyerek yazinin ustune tikladiginda da checkboxin isaretlenmesini sagladim (@click.self="user[0].check =!user[0].check") bu kisim ile -->

                                <div v-if="checkError" style="color: red;">
                                    <small style="color: red;">{{ checkError }}</small>
                                </div>

                            </div>

                            <button id="login_button" type="submit" class="login-button">Giriş Yap</button>
                        </form>

                    </div>

                    <div class="modal-footer border-0 justify-content-start">
                        <!--! BURASI ÖNEMLİ: Tıklanınca REGISTERMODALI açar -->
                        <a id="LoginLink" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#kayitModal"
                            style="color: #0d6efd; text-decoration: underline; font-size: 14px;">Hesabın Yoksa Kayıt
                            Olmak
                            İçin Tıkla</a>
                    </div>

                </div>
            </div>
        </div>

        <!--! REGISTER MODAL -->
        <div class="modal fade" id="kayitModal" tabindex="-1" aria-hidden="true">

            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <h4 class="modal-title">Kayıt Ol</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Kapat"></button>
                    </div>
                    <!-- !Register Form -->
                    <div class="modal-body">
                        <form @submit.prevent="submitRegister()">
                            <div class="row">
                                <div class="col-md-6 mb-3 text-start">
                                    <label class="form-label">Ad*</label>
                                    <input type="text" class="form-control" v-model="user[0].firstName">

                                    <div v-if="firstNameError" style="color:red;">
                                        <small>{{ firstNameError }}</small>
                                    </div>

                                    <div>

                                    </div>
                                </div>
                                <div class="col-md-6 mb-3 text-start">
                                    <label class="form-label">Soyad*</label>
                                    <input type="text" class="form-control" v-model="user[0].lastName">
                                    <div v-if="lastNameError" style="color:red;">
                                        <small>{{ lastNameError }}</small>
                                    </div>

                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3 text-start">
                                    <label class="form-label">E-Mail*</label>
                                    <input type="text" class="form-control" v-model="user[0].email"
                                        placeholder="example@hotmail.com">
                                    <div v-if="emailError" style="color:red;">
                                        <small>{{ emailError }}</small>
                                    </div>

                                </div>
                                <div class="col-md-6 mb-3 text-start">
                                    <label class="form-label">Telefon*</label>
                                    <input type="text" class="form-control" v-model="user[0].phone"
                                        placeholder="5xxxxxxxxx">

                                    <div v-if="phoneError" style="color:red;">
                                        <small>{{ phoneError }}</small>
                                    </div>

                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3 text-start">
                                    <label class="form-label">Parola*</label>
                                    <input type="password" class="form-control" v-model="user[0].pass">

                                    <div v-if="passError" style="color:red;">
                                        <small>{{ passError }}</small>
                                    </div>

                                </div>
                                <div class="col-md-6 mb-3 text-start">
                                    <label class="form-label">Parola Tekrar*</label>
                                    <input type="password" class="form-control" v-model="user[0].repeatPass">

                                    <div v-if="repeatPassError" style="color:red;">
                                        <small>{{ repeatPassError }}</small>
                                    </div>

                                </div>
                                <div class="col-md-12 mb-3 text-start">
                                    <label class="form-label">Doğum Tarihi*</label>
                                    <input type="date" class="form-control" v-model="user[0].birthdate">

                                    <div v-if="repeatPassError" style="color:red;">
                                        <small>{{ repeatPassError }}</small>
                                    </div>

                                </div>

                            </div>
                            <div class="mb-3 form-check text-start">
                                <input type="checkbox" v-model="user[0].check" class="form-check-input">

                                <label @click.self="user[0].check = !user[0].check" style="cursor: pointer;"
                                    class="form-check-label" for="checkOnay">Bilgilerimin Doğruluğunu
                                    Onaylıyorum.</label>

                                <div v-if="checkError" style="color:red;">
                                    <small>{{ checkError }}</small>
                                </div>

                            </div>
                            <button type="submit" class="login-button"
                                >Kayıt
                                Ol</button>
                        </form>
                    </div>
                    <div class="modal-footer border-0 justify-content-start">
                        <a href="" id="loginLink" class="navlink" data-bs-toggle="modal"
                            data-bs-target="#loginModal">Giriş Yapmak İçin
                            Tıklayın.</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <RouterView />

    <Footer />







</template>
<script>
// import { Modal } from 'bootstrap'
import {
    validateEmail, validatePassword, validateCheck, validateFirstName, validateLastName, validatePhone, validateRepeatPassword
} from '@/validation.js';

export default {
    data() {
        return {
            baseUrl: "http://localhost:3001",
            nav_search: "",
            searchProducts: [],



            toastShow: false,
            toastMessage: "",
            toastType: "success",

            user: [
                {
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    pass: "",
                    repeatPass: "",
                    birthdate: "",
                    check: false,
                }
            ],
            login: [
                {
                    email: "",
                    pass: "",
                    check: false,
                }
            ],
            emailError: "",
            passError: "",
            checkError: "",
            firstNameError: "",
            lastNameError: "",
            phoneError: "",
            repeatPassError: "",

            users: [],
            //user: "", 

            sepet: reactive([

            ])
        };
    },

    mounted() {
        this.getSearchProducts();

    },
    provide() {//!  Sepet verisini tüm alt componentlerin ortak kullanabilmesi için paylaşır.
        return {
            sepet: this.sepet, //this.sepet verisini alt componentlere gönderir. Böylece tüm sayfalar aynı sepet bilgisini kullanabilir.
            toastShow: this.toastShow,
            toastMessage: this.toastMessage,
            showToast: this.showToast
        }
    },

    watch: {
    },

    computed: {
        searchResults() {
            const searchText = this.nav_search.trim().toLocaleLowerCase("tr-TR");

            if (!searchText) {
                return [];
            }

            return this.searchProducts.filter(product => {
                const productName = (product.p_name || "").toLocaleLowerCase("tr-TR");
                const productDesc = (product.p_desc || "").toLocaleLowerCase("tr-TR");

                return productName.includes(searchText) ||
                    productDesc.includes(searchText);
            }).slice(0, 6);
        }


    },

    methods:
    {

        //NAVBAR ARAMA ICIN EKLENEN KISIM
        async getSearchProducts() {
            try {
                const res = await fetch(`${this.baseUrl}/api/productPage`);

                if (!res.ok) {
                    throw new Error("Ürünler alınamadı.");
                }

                this.searchProducts = await res.json();
            } catch (error) {
                console.log(error.message);
            }
        },

        goToProduct(product) {
            this.$router.push({
                path: "/product",
                query: {
                    search: product.p_name,
                    id: product.p_id
                }
            });

            this.nav_search = "";
        },






        showToast(message, type = "success") {
            this.toastMessage = message;
            this.toastType = type;
            this.toastShow = true;

            setTimeout(() => {
                this.toastShow = false;
            }, 5000);
        },




        async pageRouter() {
            let token = sessionStorage.getItem("token");

            if (!token) {
                const loginModalElement = document.getElementById("loginModal");
                const loginModal = new Modal(loginModalElement);
                loginModal.show();
                return;
            }

            try {
                let res = await fetch(`${this.baseUrl}/api/me`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    const refreshRes = await fetch(`${this.baseUrl}/api/refresh`, {
                        method: "POST",
                        credentials: "include"
                    });

                    if (!refreshRes.ok) {
                        sessionStorage.removeItem("token");

                        const loginModalElement = document.getElementById("loginModal");
                        const loginModal = new Modal(loginModalElement);
                        loginModal.show();
                        return;
                    }

                    const refreshData = await refreshRes.json();
                    token = refreshData.token;

                    sessionStorage.setItem("token", token);

                    res = await fetch(`${this.baseUrl}/api/me`, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                }

                if (!res.ok) {
                    sessionStorage.removeItem("token");

                    const loginModalElement = document.getElementById("loginModal");
                    const loginModal = new Modal(loginModalElement);
                    loginModal.show();
                    return;
                }

                const data = await res.json();

                if (data.u_role == 1) {
                    this.$router.push("/admin");
                } else {
                    this.$router.push("/user");
                }

            } catch (error) {
                alert("Kullanıcı bilgileri alınamadı.");
            }
        },


        //login icin gerekli 
        loginValidation() {
            if (this.user[0].check)
                return true
            else
                return false
        },

        async submitLogin() {
            if (this.loginValidation()) {
                try {

                    const res = await fetch(`${this.baseUrl}/api/login`, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({
                            email: this.user[0].email,
                            pass: this.user[0].pass,
                        })
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.error || "Giriş başarısız");
                    }

                    sessionStorage.clear();
                    sessionStorage.setItem("token", data[0].token);

                    if (data[0].u_role == 1) {
                        this.showToast(
                            "Giriş başarılı! Hoş geldin " +
                            data[0].u_firstName +
                            ", admin yönetim paneline giriş yaptın."
                        );

                        this.$router.push("/admin");
                    } else {
                        this.showToast(
                            "Giriş başarılı! Hoş geldin " +
                            data[0].u_firstName +
                            ", kullanıcı paneline giriş yaptın."
                        );

                        this.$router.push("/user");
                    }

                    this.user[0].email = "";
                    this.user[0].pass = "";
                    this.user[0].check = false;

                    document.getElementById("loginClose")?.click();

                } catch (e) {
                    alert("Giriş Başarısız");
                }
            } else {
                alert("Veriler Yanlış");
            }
        },




        async submitRegister() {

            this.firstNameError = "";
            this.lastNameError = "";
            this.emailError = "";
            this.phoneError = "";
            this.passError = "";
            this.repeatPassError = "";
            this.checkError = "";

            this.firstNameError = validateFirstName(this.user[0].firstName);
            this.lastNameError = validateLastName(this.user[0].lastName);
            this.emailError = validateEmail(this.user[0].email);
            this.phoneError = validatePhone(this.user[0].phone);
            this.passError = validatePassword(this.user[0].pass);
            this.repeatPassError = validateRepeatPassword(this.user[0].pass, this.user[0].repeatPass);
            this.checkError = validateCheck(this.user[0].check);

            if (
                this.firstNameError ||
                this.lastNameError ||
                this.emailError ||
                this.phoneError ||
                this.passError ||
                this.repeatPassError ||
                this.checkError
            ) {
                return;
            }

            try {
                const response = await fetch("http://localhost:3001/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(
                        this.user[0]
                    )

                });

                const data = await response.json();

                if (response.ok) {
                    alert("Kayıt Başarılı!✅");

                } else {
                    alert(data);
                }
                document.getElementById('loginLink')?.click()

            } catch (error) {
                alert("Kayıt Yapılmadı! ❌");
            }
        },


        search() {
            if (!this.nav_search.trim()) {
                return;
            }

            this.$router.push({
                path: "/product",
                query: {
                    search: this.nav_search.trim()
                }
            });
        },

    }
};
</script>

<!-- !BU SAYFAYA OZEL CSS UYGULAYCAKSAN scopede yazmamiz gerekiyor -->
<!-- !scoped yazmazsak buradaki css ler her sayfa da gecerli olur -->
<style scoped>
/* ============================= */
/* ANA BAŞLIK */
/* ============================= */

main {
    width: 100%;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 20px;
    padding-right: 20px;
}


/* ============================= */
/* NAVBAR */
/* ============================= */


/* LOGIN + ARAMA + SEPETİ SAĞA KAYDIRMA */
nav .navbar-nav {
    display: flex;
    justify-content: space-between;
    width: 100vw;
    padding: 0px 60px;
    align-items: center;

}

/* Aktif olan navbar bağlantısının görünümü */
.navbar-left .tab.router-link-active {
    font-weight: 500 !important;
}

/* ============================= */
/* NAVBAR LOGOSU */
/* ============================= */

nav img {
    width: 80px;
    height: auto !important;
    object-fit: cover;
}

/* ============================= */
/* NAVBAR LEFT ITEMS */
/* ============================= */
.navbar-left {
    display: flex;
    width: 100%;
    justify-content: center;
    gap: 32px;
    padding: 0px 100px 0px 100px;
}


/* NAVBAR MENÜ YAZILARI */
nav .tab {
    font-size: 20px;
    font-weight: 300 !important;
    text-transform: none !important;
    color: #0D1217;
    font-family: 'Oswald', sans-serif !important;

}



/* ============================= */
/* NAVBAR RIGHT ITEMS */
/* ============================= */
.navbar-right {
    display: flex;
    align-items: center;
    justify-content: end;
    width: 60%;
    gap: 32px;
}



/* SEARCH */
nav form {
    width: 100%;
    display: flex;
    justify-content: center;
}

nav form input {
    max-width: 100%;
}




/* NAVBAR (SEARCH ICIN) EKLENEN KISIM */
.search-form {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 70%;
}

.search-wrapper {
    position: relative;
    width: 100%;
}

.search-wrapper input {
    width: 100%;
    background-color: #E8E7E7;
    border: none;
    border-radius: 0px;
    outline: none;
    box-shadow: none;



}

.arama-button {
    background-color: #0D1217;
    color: #F5F5F5;
    font-family: 'Oswald', sans-serif;
    font-weight: 400;
    font-size: 18px;
    border: none;
    border-radius: 0px;
    outline: none;
    box-shadow: none;


}

.search-results {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    width: 320px;
    max-width: 85vw;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    z-index: 2000;
    overflow: hidden;
}

.search-result-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    cursor: pointer;
    color: #222;
    text-align: left;
}

.search-result-item:hover {
    background-color: #f2f2f2;
}

.search-result-item img {
    width: 50px;
    height: 50px;
    object-fit: contain;
    flex-shrink: 0;
}

.search-result-item span {
    font-size: 14px;
    font-weight: 600;
}

.search-empty {
    padding: 14px;
    color: #555;
    font-size: 14px;
}



/* ============================= */
/* SEPET BUTONU-MODAL */
/* ============================= */

.container{
    padding: 0px !important;
    margin: 0px !important;
}


.modal-dialog {
    max-width: 45%;
    margin-left: auto;
    margin-right: auto;
}

.sepet-buton {
    position: relative;
}

.sepet-sayi {
    position: absolute;
    top: 0;
    right: 0;
    background-color: red;
    color: white;
    font-size: 11px;
    font-weight: bold;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/*  LOGIN MODAL*/
.login-button {
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

.login-button:hover {
  transform: translateY(-3px) !important;
  background-color: #0047B3;
  box-shadow: 0 8px 50px rgba(0, 0, 0, 0.25);  
}






@media (min-width: 992px) and (max-width: 1199px) {

    nav .navbar-nav {
        display: flex;
        justify-content: space-between;
        width: 100vw;
        align-items: center;
        padding: 0px 24px 0px 24px !important;
    }

    .navbar-left {
        width: fit-content;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 0px;
    }

    .navbar-right {
        width: fit-content !important;
        gap: 8px !important;
        justify-content: end !important;
    }
}


/* ============================= */
/* TABLET */
/* ============================= */

@media (max-width: 991px) {

    .navbar-left {
        width: fit-content;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 0px;
    }

    .navbar-right {
        width: 100%;
        align-items: center;
        justify-content: center;
    }
}

/* ============================= */
/* TELEFON */
/* ============================= */

@media (max-width: 576px) {

    .navbar-left {
        width: fit-content;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 0px;
    }

    .navbar-right {
        width: 100%;
        align-items: center;
        justify-content: center;
    }

    .modal-dialog {
        max-width: 95%;
    }

    .modal-content {
        width: 100%;
    }

}


/* ============================= */
/* ÇOK KÜÇÜK TELEFON */
/* ============================= */

@media (max-width: 400px) {

    .navbar-left {
        width: fit-content;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 0px;
    }

    .navbar-right {
        width: 100%;
        align-items: center;
        justify-content: center;
    }

}

/* 360px ve daha dar ekranlarda navbar arka planını kırmızı yapar. */
@media (max-width: 360px) {

    .navbar-left {
        width: fit-content;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 0px;
    }

    .navbar-right {
        width: 100vw;
        align-items: center;
        justify-content: center;
        display: flex;
        flex-direction: column;

    }
}
</style>
