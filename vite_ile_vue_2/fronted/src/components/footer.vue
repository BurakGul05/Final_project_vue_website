
<template>
    <!-- FOOTER -->
    <footer class="container-fluid py-4 py-md-5 px-4 px-md-5 stryve-footer">

        <div class="row">

            <!-- Site Sahibi / Logo -->
            <div class="col-12 col-md-6 col-lg-3 mb-4">

                <a class="d-inline-flex align-items-center mb-3" href="/">
                    <div class="logo-img">

                        <img src="../assets/img/Logo-2-white.png" alt="STRYVE Logo">

                    </div>
                </a>

                <ul class="list-unstyled small">

                    <li class="mb-2">
                        <strong>STRYVE</strong>
                    </li>

                    <li class="mb-2">
                        Sporun ve hareketin adresi.
                    </li>

                    <li class="mb-2">
                        © 2026 STRYVE
                    </li>

                </ul>

            </div>

            <!-- Bağlantılar -->
            <div class="col-6 col-md-6 col-lg-2 mb-4">

                <h5 class="footer-title">Bağlantılar</h5>

                <ul class="list-unstyled">

                    <li class="mb-2">
                        <RouterLink to="/" class="footer-link">
                            Anasayfa
                        </RouterLink>
                    </li>

                    <li class="mb-2">
                        <RouterLink to="/about" class="footer-link">
                            Hakkımızda
                        </RouterLink>
                    </li>

                    <li class="mb-2">
                        <RouterLink to="/faq" class="footer-link">
                            S.S.S
                        </RouterLink>
                    </li>

                    <li class="mb-2">
                        <RouterLink to="/product" class="footer-link">
                            Ürünler
                        </RouterLink>
                    </li>

                    <li class="mb-2">
                        <RouterLink to="/contact" class="footer-link">
                            İletişim
                        </RouterLink>
                    </li>

                </ul>

            </div>

            <!-- Kategoriler -->
            <div class="col-6 col-md-6 col-lg-2 mb-4">

                <h5 class="footer-title">Kategoriler</h5>

                <ul class="list-unstyled">

                    <li class="mb-2">
                        <RouterLink to="/product" class="footer-link">
                            Spor Giyim
                        </RouterLink>
                    </li>

                    <li class="mb-2">
                        <RouterLink to="/product" class="footer-link">
                            Fitness Ekipmanları
                        </RouterLink>
                    </li>

                    <li class="mb-2">
                        <RouterLink to="/product" class="footer-link">
                            Spor Aksesuarları
                        </RouterLink>
                    </li>

                    <li class="mb-2">
                        <RouterLink to="/product" class="footer-link">
                            Takviyeler
                        </RouterLink>
                    </li>

                </ul>

            </div>

            <!-- Müşteri Hizmetleri -->
            <div class="col-6 col-md-6 col-lg-2 mb-4">

                <h5 class="footer-title">Müşteri Hizmetleri</h5>

                <ul class="list-unstyled">

                    <li class="mb-2">
                        <RouterLink to="/faq" class="footer-link">
                            Yardım ve S.S.S
                        </RouterLink>
                    </li>

                    <li class="mb-2">
                        <RouterLink to="/contact" class="footer-link">
                            Bize Ulaşın
                        </RouterLink>
                    </li>

                    <li class="mb-2">
                        <RouterLink to="/contact" class="footer-link">
                            Destek
                        </RouterLink>
                    </li>

                </ul>

            </div>

            <!-- Sosyal Medya -->
            <div class="col-6 col-md-6 col-lg-3 mb-4">

                <h5 class="footer-title">Bizi Takip Edin</h5>

                <div class="d-flex gap-3">

                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" class="footer-social"
                        aria-label="Instagram">

                        <i class="bi bi-instagram"></i>

                    </a>

                    <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" class="footer-social"
                        aria-label="YouTube">

                        <i class="bi bi-youtube"></i>

                    </a>

                    <a href="https://www.whatsapp.com/" target="_blank" rel="noopener noreferrer" class="footer-social"
                        aria-label="WhatsApp">

                        <i class="bi bi-whatsapp"></i>

                    </a>

                </div>

            </div>

        </div>

        <hr>

        <div class="text-center small footer-bottom">
            STRYVE — Gücünü keşfet, sınırlarını aş.
        </div>

    </footer>
</template>

<script>
import { RouterLink } from "vue-router";

export default {
    components: {
        RouterLink
    }
}
</script>

<style scoped>
.stryve-footer {
    margin-top: 50px;
    background-color: #0D1217;
    color: #F5F5F5;
    
}

.logo-img img{
    width: 72px;
}


.footer-title {
    color: #F5F5F5;
    margin-bottom: 20px;
    font-size: 17px;
    font-weight: 600;
}

.footer-link {
    color: #F5F5F5;
    text-decoration: none;
    transition: color 0.2s ease;
}

.footer-link:hover {
    color: #F5F5F5;
    font-weight: 600;
}

.footer-social {
    color: #212529;
    font-size: 25px;
    text-decoration: none;
    transition: color 0.2s ease;
}

.footer-social i {
    color: #F5F5F5;
}

.footer-social:hover {
    color: #198754;
}

.footer-bottom {
    color: #F5F5F5;
}

@media (max-width: 576px) {
    .stryve-footer {
        margin-top: 50px;
    }
}
</style>
```