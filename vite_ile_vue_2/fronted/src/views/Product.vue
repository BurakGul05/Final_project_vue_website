<template>

      <div class="page-container">


            <div class="filter-box">
                  <div class="left-filter-items">

                        <div class="filter-item">
                              <label>Ürün Adı:</label>
                              <input type="text" v-model="productName" placeholder="Ürün adı ara...">
                        </div>

                        <div class="filter-item">
                              <label>Minimum Fiyat:</label>
                              <input type="number" min="1" v-model="minPrice" placeholder="Min. fiyat">
                        </div>

                        <div class="filter-item">
                              <label>Maksimum Fiyat:</label>
                              <input type="number" min="1" v-model="maxPrice" placeholder="Max. fiyat">
                        </div>

                  </div>


                  <div class="filter-buttons">
                        <button @click="filterProducts" class="filter-button">Filtrele</button>
                        <button @click="clearFilters" class="clear-button">Temizle</button>
                  </div>

            </div>

            <div v-if="filteredProducts.length > 0" class="filter-result">
                  {{ filteredProducts.length }} ürün bulundu
            </div>

            <div v-if="filteredProducts.length === 0" class="filter-result">
                  Aradığınız kriterlere uygun ürün bulunamadı.
            </div>

            <div class="row">
                  <div class="col-4" v-for="product in filteredProducts">

                        <div class="card product-card" :id="'product-' + product.p_id">

                              <div class="product-image">

                                    <img :src="`${baseUrl}/uploads/${product.p_images}`" :alt="product.p_name">
                              </div>

                              <div class="card-body">
                                    <div class="card-title-container">

                                          <h5 class="card-title">
                                                {{ product.p_name }}
                                          </h5>
                                    </div>

                                    <div class="stars">
                                          ★★★★★
                                    </div>

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

                                    <p class="product-price">
                                          {{ product.p_price }}₺
                                    </p>

                                    <div v-if="product.p_stock" class="quantity-box">

                                          <div class="quantity-child1">
                                                <label>Adet:</label>
                                          </div>

                                          <div class="quantity-child2">

                                                <button class="minus-button"
                                                      @click="product.quantity > 1 ? product.quantity-- : null">
                                                      -
                                                </button>

                                                <div class="number-container">
                                                      <span>{{ product.quantity || 1 }}</span>
                                                </div>


                                                <button class="plus-button"
                                                      @click="product.quantity < product.p_stock ? product.quantity++ : null">
                                                      +
                                                </button>

                                          </div>

                                    </div>

                                    <button v-if="product.p_stock" @click="addCart(product.p_id)" class="sepet-button"
                                          type="submit">
                                          Sepete Ekle
                                    </button>

                                    <button v-else class="btn btn-secondary" disabled>
                                          Stok Yok!
                                    </button>

                              </div>

                        </div>

                  </div>

            </div>

      </div>

</template>


<script>
export default {
      inject: ['sepet'],
      data() {
            return {
                  products: [],

                  productName: "",
                  minPrice: "",
                  maxPrice: "",
                  filterApplied: false,

                  baseUrl: "http://localhost:3001",
            }

      },
      mounted() {
            this.getProducts();
      },
      watch: {
            '$route.query.search': {
                  immediate: true,
                  handler(value) {
                        this.productName = value || "";
                        this.filterApplied = !!value;

                        this.$nextTick(() => {
                              this.scrollToSelectedProduct();
                        });
                  }
            },

            '$route.query.id'() {
                  this.$nextTick(() => {
                        this.scrollToSelectedProduct();
                  });
            }

      },
      computed:
      {
            filteredProducts() {

                  if (!this.filterApplied) {
                        return this.products;
                  }

                  const filtered = this.products.filter(product => {

                        const searchText = this.productName
                              .trim()
                              .toLocaleLowerCase("tr-TR");

                        const nameMatch = (product.p_name || "")
                              .toLocaleLowerCase("tr-TR")
                              .includes(searchText);

                        const descMatch = (product.p_desc || "")
                              .toLocaleLowerCase("tr-TR")
                              .includes(searchText);

                        const minPriceMatch = this.minPrice === "" ||
                              Number(product.p_price) >= Number(this.minPrice);

                        const maxPriceMatch = this.maxPrice === "" ||
                              Number(product.p_price) <= Number(this.maxPrice);

                        return (nameMatch || descMatch) &&
                              minPriceMatch &&
                              maxPriceMatch;
                  });

                  return filtered.sort((a, b) =>
                        Number(a.p_price) - Number(b.p_price)
                  );
            }
      },

      methods: {

            filterProducts() {
                  this.filterApplied = true;
            },

            clearFilters() {
                  this.productName = "";
                  this.minPrice = "";
                  this.maxPrice = "";
                  this.filterApplied = false;
            },

            async getProducts() {
                  try {
                        const res = await fetch(`${this.baseUrl}/api/productPage`);

                        if (!res.ok) {
                              throw new Error("Products endpoint hatasi");
                        }

                        this.products = await res.json();

                        this.products.forEach(product => {
                              product.quantity = 1;
                        });
                        this.$nextTick(() => {
                              this.scrollToSelectedProduct();
                        });

                  } catch (e) {
                        console.log(e.message);
                  }
            },

            addCart(id) {
                  const product = this.products.find(product => product.p_id == id);
                  product.quantity = product.quantity || 1;

                  this.sepet.push(product);

                  alert("Sepete Eklendi");


            },

            //NAVBAR ICIN EKLENEN KISIM
            scrollToSelectedProduct() {
                  const productId = this.$route.query.id;

                  if (!productId) {
                        return;
                  }

                  this.$nextTick(() => {
                        const productElement = document.getElementById(
                              `product-${productId}`
                        );

                        if (productElement) {
                              productElement.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center"
                              });
                        }
                  });
            }
      }
};
</script>

<style scoped>
/* Sayfanın sağından ve solundan iç boşluk bırakır. */
.page-container {
      padding: 0px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
}

.row {
      display: flex;
      flex-wrap: wrap;
      row-gap: 24px;
}

/* !PRODUCT CARDLAR ICIN EKLENEN CSSLER */
.product-card {
      background-color: #F0EFEB;
      width: 100%;
      height: fit-content;
      border-radius: 0px !important;
      border: none;
      outline: none;
      box-shadow: none;
      padding-bottom: 24px;
}

.product-image {
      width: 100%;
      height: 240px;
      padding: 8px;
      overflow: hidden;
      display: flex;
      justify-content: center;

}

.product-image img {
      width: fit-content;
      height: 100%;
      object-fit: cover;
      object-position: top;
}

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


/* URUNLERI ARAMAK ICIN FILTRELEME KISMINA EKLENEN CSS LER */
.filter-box {
      width: 90%;
      margin-top: 50px;
      padding: 20px 25px;
      background-color: #F0EFEB;
      border-radius: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: flex-end;
      
}

.filter-item label {
      display: block;
      margin-bottom: 7px;
      font-size: 13px;
      font-weight: 600;
      color: #333;  
}

.filter-item input {
      width: 100%;
      height: 42px;
      padding: 0 12px;
      border: 1px solid #ddd;
      border-radius: 7px;
      outline: none;
      font-size: 14px;
}

.filter-item input:focus {
      border-color: #0d6efd;
      box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.1);
}

.left-filter-items {
      display: flex;
      width: 100%;
      justify-content: center;
      align-items: center;
}


.filter-buttons {
      display: flex;
      gap: 8px;
      width: 30%;
}

.filter-button {
      background-color: #0D1217;
      color: #F5F5F5;
      font-family: 'Oswald', sans-serif;
      font-size: 18px;
      font-weight: 400;
      width: 100%;
      height: fit-content;
      padding: 8px 0px 8px 0px;
      border: 2px solid #0D1217;
      outline: none;
      box-shadow: none;
}

.clear-button {
      color: #0D1217;
      font-family: 'Oswald', sans-serif;
      font-size: 18px;
      font-weight: 400;
      width: 100%;
      height: fit-content;
      padding: 8px 0px 8px 0px;
      border: 2px solid #0D1217;
      outline: none;
      box-shadow: none;

}

.clear-button:hover {
      background-color: #e9e9e9;
}

/* FILTRELEME ICIN CSS */
.filter-result {
      text-align: center;
      margin-top: 15px;
      margin-bottom: 10px;
      font-weight: 200;
      color: #0D1217;
}




/* STRYVE - RESPONSIVE: SADECE GEREKLI EKRANLAR */

/* Tablet ve kucuk dizustu */
@media screen and (min-width: 577px) and (max-width: 992px) {

      .page-container {
            padding: 0px 0px 0px 24px !important;
      }

      .filter-box {
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            gap: 24px;
      }


      .left-filter-items{
            display: flex;
            flex-direction: column;
      }

      .filter-item{
            width: 100%;
      }

      .filter-buttons{
            width: 100%;

      }

      .row>.col-4 {
            width: 50%;
      }
}

/* Telefon */
@media screen and (max-width: 576px) {

      .page-container {
            padding: 0px 0px 0px 24px !important;
      }

      .filter-box {
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            gap: 24px;
      }


      .left-filter-items{
            display: flex;
            flex-direction: column;
      }

      .filter-item{
            width: 100%;
      }

      .filter-buttons{
            width: 100%;

      }

      .row>.col-4 {
            width: 50%;
      }
}

/* Cok kucuk telefonlar */
@media screen and (max-width: 376px) {

      .filter-box {
            width: 96%;
            padding: 12px;
            margin-top: 80px;
      }

      .row>.col-4 {
            width: 100%;
      }
}

@media screen and (max-width: 360px) {

      .page-container {
            padding: 0px 0px 0px 24px !important;
      }

      .filter-box {
            margin-top: 80px;
      }
}
</style>
