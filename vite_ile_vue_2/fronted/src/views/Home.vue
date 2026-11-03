<template>
  <Toast :show="toastShow" :message="toastMessage" :type="toastType" />




  <main class="container text-center">

    <!-- !SECTION 1: HERO SECTION -->
    <div class="home-slider">

      <!-- !BURASI URUNLER BUTON KISMI -->
      <div class="hero-section-content">
        <h1 class="hero-title">GÜCÜNÜ KEŞFET, HEDEFİNE ULAŞ.</h1>
        <p>HEDEFLERİNE UYGUN-EN İYİ EKİPMANLARLA TANIŞ-</p>
        <button class="explore" @click="$router.push('/product')">
          ALIŞVERİŞE BAŞLA
        </button>
      </div>

      <div class="home-track">
        <div class="home-slide">
          <img src="../assets/img/img1.png" alt="Home 1">
          <img src="../assets/img/img2.jpg" alt="Home 2">
          <img src="../assets/img/img3.jpg" alt="Home 3">
          <img src="../assets/img/img4.png" alt="Home 4">
          <img src="../assets/img/img5.png" alt="Home 5">
          <img src="../assets/img/img6.jpg" alt="Home 6">
          <img src="../assets/img/img7.jpg" alt="Home 7">
          <img src="../assets/img/img8.png" alt="Home 8">
          <img src="../assets/img/img9.jpeg" alt="Home 9">
          <img src="../assets/img/img10.jpeg" alt="Home 10">
          <img src="../assets/img/img1.png" alt="Home 1">
          <img src="../assets/img/img2.jpg" alt="Home 2">
          <img src="../assets/img/img3.jpg" alt="Home 3">
          <img src="../assets/img/img4.png" alt="Home 4">
          <img src="../assets/img/img5.png" alt="Home 5">
          <img src="../assets/img/img6.jpg" alt="Home 6">
          <img src="../assets/img/img7.jpg" alt="Home 7">
          <img src="../assets/img/img8.png" alt="Home 8">
          <img src="../assets/img/img9.jpeg" alt="Home 9">
          <img src="../assets/img/img10.jpeg" alt="Home 10">
          <img src="../assets/img/img1.png" alt="Home 1">
          <img src="../assets/img/img2.jpg" alt="Home 2">
          <img src="../assets/img/img3.jpg" alt="Home 3">
          <img src="../assets/img/img4.png" alt="Home 4">
          <img src="../assets/img/img5.png" alt="Home 5">
          <img src="../assets/img/img6.jpg" alt="Home 6">
          <img src="../assets/img/img7.jpg" alt="Home 7">
          <img src="../assets/img/img8.png" alt="Home 8">
          <img src="../assets/img/img9.jpeg" alt="Home 9">
          <img src="../assets/img/img10.jpeg" alt="Home 10">
        </div>
      </div>

    </div>

    <!-- !SECTION 2: İNDİRİMLİ ÜRÜNLER VE ÖNE ÇIKAN ÜRÜNLER -->
    <section v-for="section in ['discounted', 'featured']" :key="section" class="homepage-section">

      <div class="section-title-container">
        <h2 class="homepage-section-title">
          {{ section === 'discounted' ? 'İNDİRİMLİ ÜRÜNLER' : 'ÖNE ÇIKAN ÜRÜNLER' }}
        </h2>
      </div>

      <div v-if="homepageProducts.some(product => product.section_type === section)" class="homepage-products">

        <div v-for="product in homepageProducts.filter(item => item.section_type === section)"
          :key="product.homepage_id" class="product-card-container">

          <div class="card product-card homepage-product-card">

            <div class="product-image">
              <img :src="`${baseUrl}/uploads/${product.p_images}`" :alt="product.p_name">
            </div>

            <div class="card-body">

              <div class="card-title-container">
                <h5 class="card-title">
                  {{ product.p_name }}
                </h5>
              </div>

              <div class="stars">★★★★★</div>

              <div class="product-desc-container">
                <p class="card-text product-desc">
                  {{ product.p_desc }}
                </p>
              </div>

              <div class="product-stock-container">
                <p class="product-stock">
                  Stok: {{ product.p_stock }}
                </p>
              </div>


              <div class="homepage-price">
                <template v-if="
                  Number(product.p_disc) > 0 &&
                  Number(product.p_disc) < Number(product.p_price)
                ">
                  <span class="old-price">
                    {{ Number(product.p_price).toFixed(2) }} ₺
                  </span>

                  <span class="discount-price">
                    {{ Number(product.p_disc).toFixed(2) }} ₺
                  </span>
                </template>

                <span v-else class="product-price">
                  {{ Number(product.p_price).toFixed(2) }} ₺
                </span>
              </div>

              <div v-if="Number(product.p_stock) > 0" class="quantity-box">

                <div class="quantity-child1">
                  <label>Adet:</label>
                </div>

                <div class="quantity-child2">

                  <button class="minus-button" type="button" @click="product.quantity > 1 ? product.quantity-- : null">
                    -
                  </button>

                  <div class="number-container">
                    <span>{{ product.quantity || 1 }}</span>
                  </div>

                  <button class="plus-button" type="button" @click="
                    product.quantity < Number(product.p_stock)
                      ? product.quantity++
                      : null
                    ">
                    +
                  </button>

                </div>

              </div>

              <div v-else class="homepage-stock-empty">
                Stok Yok!
              </div>

              <div class="homepage-card-buttons">
                <button v-if="Number(product.p_stock) > 0" type="button" class="sepet-button" @click="addCart(product)">
                  Sepete Ekle
                </button>

                <button v-else type="button" class="btn btn-secondary" disabled>
                  Stok Yok!
                </button>

                <button type="button" class="incele-button" @click="goToProducts">
                  İncele
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <p v-else class="homepage-empty">
        Bu bölümde henüz ürün bulunmuyor.
      </p>

    </section>

  </main>
</template>


<script setup>

import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'

import Toast from '@/components/toast.vue'

const toastShow = ref(false)
const toastMessage = ref('')
const toastType = ref('error')
const homepageProducts = ref([])

const sepet = inject('sepet')
const showToast = inject('showToast')

const router = useRouter()
const goToProducts = () => {
  router.push('/product')
}

const baseUrl = 'http://localhost:3001'



//ANASAYFA URUNLER ICIN EKLENEN KISIM
const addCart = (product) => {
  const cartProduct = sepet.find(item => item.p_id == product.p_id)

  const quantity = Number(product.quantity) || 1

  if (cartProduct) {
    if (Number(cartProduct.quantity) + quantity > Number(product.p_stock)) {
      showToast('Stok miktarını aşamazsınız.', 'error')
      return
    }

    cartProduct.quantity = Number(cartProduct.quantity) + quantity
  } else {
    if (quantity > Number(product.p_stock)) {
      showToast('Stok miktarını aşamazsınız.', 'error')
      return
    }

    sepet.push({
      ...product,
      quantity: quantity
    })
  }

  showToast(`${product.p_name} sepete eklendi.`, 'success')
}










//INDIRIMLI URUNLER ICIN EKLEME
const getHomepageProducts = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/homepage-products`)

    if (!res.ok) {
      throw new Error('Ana sayfa ürünleri getirilemedi.')
    }

    homepageProducts.value = await res.json()

    homepageProducts.value.forEach(product => {
      product.quantity = 1
    })


  } catch (error) {
    console.error('Ana sayfa ürünlerini getirme hatası:', error.message)
  }
}






onMounted(() => {

  getHomepageProducts()


  const message = sessionStorage.getItem('logoutMessage')
  const type = sessionStorage.getItem('logoutType')

  if (message) {
    toastMessage.value = message
    toastType.value = type || 'error'
    toastShow.value = true

    sessionStorage.removeItem('logoutMessage')
    sessionStorage.removeItem('logoutType')

    setTimeout(() => {
      toastShow.value = false
    }, 3000)
  }
})



</script>


<style scoped>
/* Ana sayfanın genişliğini, ortalanmasını ve kenar boşluklarını düzenler. */
main {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.home-slider {
  width: 100vw;
  height: 100vh;
  max-width: none;
  margin-left: calc(50% - 50vw);
  padding-left: 0;
  padding-right: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow: hidden;
  align-items: stretch;

}


/* Resimleri yatay sıraya dizer ve mevcut otomatik hareketi korur. */
.home-track {
  display: flex;
  align-items: center;
  gap: 8px;
  animation: sliderHareket 50s linear infinite;
  width: 100vw;
  height: 100vh;
  margin-left: calc(50% - 50vw);
  padding-left: 0;
  padding-right: 0;
  box-sizing: border-box;
}

/* Her slider resminin genişliğini ve yüksekliğini ekran boyutuna uyarlar. */
.home-slide {
  flex: 0 0 auto;
  width: auto;
  height: 100%;
  display: flex;
  flex-direction: row;
}

/* Resimlerin oranını koruyarak kart alanını doldurmasını sağlar. */
.home-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Slider resimlerini mevcut animasyon mantığıyla yatay hareket ettirir. */
@keyframes sliderHareket {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-2700px);
  }
}

/* ANASAYFA ICERIKLERI(Hero) */
.hero-section-content {
  position: absolute;
  z-index: 2;
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Ana başlığın yazı boyutunu, hizasını ve satır düzenini kontrol eder. */
main h1 {
  max-width: 80%;
  font-family: 'Oswald', sans-serif;
  color: #f5f5f5;
  font-size: clamp(56px, 4.5vw, 96px);
  line-height: 1.1;
  text-align: center;
  white-space: normal;
  overflow-wrap: break-word;
}

/* Ana sayfadaki paragrafların görünümünü ve taşmasını kontrol eder. */
main p {
  max-width: 900px;
  margin: 20px auto;
  color: #F5F5F5;
  font-family: 'Oswald', sans-serif;
  font-size: clamp(24px, 2.2vw, 36px);
  line-height: 1.3;
  text-align: center;
  overflow-wrap: break-word;
}

/* Ürünler butonunun boyutunu, kenarlığını ve görünümünü düzenler. */
.explore {
  display: inline-block;
  max-width: fit-content;
  max-height: fit-content;
  box-sizing: border-box;
  padding: 20px 60px;
  color: #F5F5F5;
  background-color: #0661F6;
  font-family: 'Oswald', sans-serif;
  font-weight: 500;
  font-size: clamp(18px, 1.2vw, 32px);
  text-align: center;
  text-decoration: none;
  overflow-wrap: break-word;
  border-radius: 50px;
  cursor: pointer;
  border: none;
  outline: none;
  box-shadow: none;

}

/* Fareyle Ürünler butonunun üzerine gelindiğinde görsel efekt uygular. */
.explore:hover {
  transform: translateY(-3px);
  background-color: #0047B3;
  box-shadow: 0 8px 50px rgba(0, 0, 0, 0.25);
}

/* İndirimli ve öne çıkan ürün bölümlerinin genişliğini ve aralıklarını düzenler. */
.homepage-section {
  width: 100%;
  max-width: 1200px;
  margin: 55px  auto;
  box-sizing: border-box;
}

/* HOME SAYFASI INDIRIMLI URUNLER YAZISI CSS*/
.homepage-section-title {
  color: #0D1217;
  font-size: 36px;
  font-family: 'Oswald', sans-serif;
  font-weight: 400;
  text-align: start;

}

/* Ürün bulunmayan bölümlerdeki mesajı ortalar. */
.homepage-empty {
  max-width: 100%;
  font-size: 16px;
  overflow-wrap: anywhere;
}

/* Dört ürün kartının arasına yatay boşluk koyar. */
.homepage-products {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
}

.product-card-container {
  width: 100%;
  min-width: 0;

}

/* HOME SAYFASI KARTLARIN EN DIS RENK CSS LERI */
.homepage-product-card {
  background-color: #F0EFEB;
  width: 100%;
  height: fit-content;
  border-radius: 0px !important;
  border: none;
  outline: none;
  box-shadow: none;
  padding-bottom: 24px;
}

/* HOME SAYFASI IMG CSS LERI */
.product-image {
  width: 100%;
  height: 240px;
  padding: 8px;
  overflow: hidden;
}

.product-image img {
  width: fit-content;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

/* HOME SAYFASI URUN KARTLARI RESIM ALTINDA EKLENENLERIN CSS LERI */
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: start;
  padding: 0px 24px 0px 24px;
  gap: 8px;

}


.card-title-container {
  height: fit-content;
}


/* HOME SAYFASI URUN KARTLARINDAKI URUNLERIN ISIMLERI */
.card-title {
  color: #0D1217;
  font-family: 'Oswald', sans-serif;
  font-size: 20px;
  font-weight: 200;
  margin: 0px !important;
}

/* HOME SAYFASI URUN KARTI YILDIZLARININ CSS LERI */
.stars {
  color: #FF9505;
  font-size: 20px;
}

.product-desc-container {
  width: fit-content;
  height: fit-content;
  align-items: center;
}

/* HOME SAYFASI ACIKLAMA YAZISI CSS LERI */
.product-desc {
  color: #0D1217;
  font-size: 20px;
  font-weight: 200;
  margin: 0px !important;
  width: 100%;
  text-align: start;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.product-stock-container {
  width: fit-content;
  height: fit-content;
}


/* HOME SAYFASI STOK CSS LERI */
.product-stock {
  color: #0D1217;
  font-family: 'Oswald', sans-serif;
  font-size: 18px;
  font-weight: 200;
  margin: 0px !important;
}

/* HOME SAYFASI FIYAT CSS LERI */
.product-price {
  color: #0D1217;
  font-family: 'Oswald', sans-serif;
  font-size: 24px;
  font-weight: 400;
}

/* HOME CARD ADET YAZISI */
.quantity-box {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}


.quantity-child1 label {
  color: #0D1217;
  font-family: 'Oswald', sans-serif;
  font-size: 20px;
  font-weight: 400;
}

.quantity-child2 {
  width: 40%;
  justify-content: space-between;
  display: flex;
}

.minus-button {
  color: #0D1217;
  font-family: 'Oswald', sans-serif;
  font-size: 24px;
  font-weight: 400;
  width: 100%;
  height: fit-content;
  border: 1px solid #0D1217;
  outline: none;
  box-shadow: none;

}

.number-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.number-container span {
  margin: 0px !important;
  color: #0D1217;
  font-family: 'Oswald', sans-serif;
  font-size: 20px;
  font-weight: 400;
}

.plus-button {
  color: #0D1217;
  font-family: 'Oswald', sans-serif;
  font-size: 24px;
  font-weight: 400;
  width: 100%;
  height: fit-content;
  border: 1px solid #0D1217;
  outline: none;
  box-shadow: none;
}


.homepage-card-buttons {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  gap: 8px;
}

/* HOME CARD SEPET BUTONU */
.sepet-button {
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

.sepet-button:hover {
  background-color: #0661F6;
  transition: background-color 0.4s ease;
}


/* HOME CARD INCELE BUTONU */
.incele-button {
  color: #0D1217;
  font-family: 'Oswald', sans-serif;
  font-size: 20px;
  font-weight: 400;
  width: 100%;
  height: fit-content;
  padding: 8px 0px 8px 0px;
  border: 2px solid #0D1217;
  outline: none;
  box-shadow: none;
}

.incele-button:hover {
  border: 2px solid #0661F6;
  transition: border 0.4s ease;
  color: #0661F6;
  transition: color 0.4s ease;
}


/* ========================= */
/* RESPONSIVE GORUNUMLER */
/* ========================= */


@media (min-width: 992px) and (max-width: 1199px) {

  /*  GRIDI AYARLAYAN KOD  */
  .homepage-products {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    width: 100%;
  }

}

@media (min-width: 576px) and (max-width: 991px) {

  /*  GRIDI AYARLAYAN KOD  */
  .homepage-products {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    width: 100%;
  }
}


@media (min-width: 360px) and (max-width: 600px) {

  /*  GRIDI AYARLAYAN KOD  */
  .homepage-products {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 24px;
    width: 100%;
  }

}
</style>
