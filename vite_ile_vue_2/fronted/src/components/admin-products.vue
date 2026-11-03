<template>

      <div class="table-main">

            <div class="table-header">
                  <h3>Ürünler</h3>

                  <button type="button" class="urunekle-button" data-bs-toggle="modal" data-bs-target="#addproduct">
                        Ürün Ekle
                  </button>

            </div>

            <div class="admin-product-table">

                  <table class=" table table-striped">
                        <thead>
                              <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">AD:</th>
                                    <th scope="col">STOK:</th>
                                    <th scope="col">FİYAT:</th>
                                    <th scope="col">KDV'Lİ FİYAT:</th>
                                    <th scope="col">AÇIKLAMA:</th>
                                    <th scope="col">İŞLEM:</th>
                                    <th>ANA SAYFA:</th>
                              </tr>
                        </thead>
                        <tbody>
                              <tr v-for="product, index in products">
                                    <!--! index + 1 ile ürünün listedeki sırasını gösteriyoruz.-->
                                    <!-- ! p_id veritabanındaki gerçek ürün kimliğidir ve değiştirilmez. -->
                                    <th scope="row">{{ index + 1 }}</th>
                                    <td><input class="form-control" type="text" v-model="product.p_name"> </td>
                                    <td><input class="form-control" type="number" min="0" v-model="product.p_stock">
                                    </td>
                                    <td><input class="form-control" type="text" v-model="product.p_price"> </td>
                                    <td>{{ product.p_price * 1.2 }} </td>
                                    <td><textarea class="form-control" type="text " v-model="product.p_desc"></textarea>
                                    </td>
                                    <td>
                                          <div class="text-nowrap">
                                                <button
                                                      @click="updateProduct(product.p_id, product.p_name, product.p_stock, product.p_price, product.p_desc)"
                                                      class="btn-sm btn btn-outline-primary">Kaydet</button>

                                                <button style="margin-left: 10px;" class="btn-sm btn btn-outline-danger"
                                                      @click="deleteProduct(product.p_id)">Sil</button>

                                          </div>
                                    </td>

                                    <!-- ANA SAYFA BÖLÜMÜ BUTONLARI -->
                                    <td>
                                          <div v-for="section in homepageSections" :key="section.value"
                                                class="d-flex flex-column gap-2 mb-2">

                                                <button v-if="!homepageProductFor(product.p_id, section.value)"
                                                      type="button" class="btn btn-sm btn-outline-primary"
                                                      @click="addHomepageProduct(product.p_id, section.value)">
                                                      {{ section.label }} Ekle
                                                </button>

                                                <button v-else type="button" class="btn btn-sm btn-outline-danger"
                                                      @click="removeHomepageProduct(homepageProductFor(product.p_id, section.value).homepage_id)">
                                                      {{ section.label }} Kaldır
                                                </button>

                                          </div>
                                    </td>

                              </tr>
                        </tbody>
                  </table>

            </div>

      </div>

      <!--! ürün ekle modal'ı -->
      <div class="modal fade" id="addproduct" tabindex="-1">
            <div class="modal-dialog">
                  <div class="modal-content">
                        <div class="modal-header">
                              <h1 class="modal-title fs-5" id="exampleModalLabel">Ürün Ekle</h1>
                              <button type="button" class="btn-close " data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <!--! Ürün ekleme Formu  -->
                        <form @submit.prevent="addProduct()">
                              <div class="modal-body">

                                    <div class="row">
                                          <div class="col-12 mb-3">
                                                <label class="form-label">Ürün Adı:</label>
                                                <input type="text" class="form-control" v-model="newProduct[0].p_name"
                                                      required>
                                          </div>
                                          <div class="col-6">
                                                <label class="form-label">Stok:</label>
                                                <input type="number" class="form-control" min="0"
                                                      v-model="newProduct[0].p_stock" required>
                                          </div>
                                          <div class="col-6">
                                                <label class="form-label">Fiyat:</label>
                                                <input type="text" class="form-control"
                                                      v-model.number="newProduct[0].p_price"
                                                      pattern="[0-9]+([.][0-9]{1,2})?" required>
                                          </div>

                                          <div class="col-12 mt-3">
                                                <label class="form-label ">Ürün Açıklaması:</label>
                                                <textarea class="form-control" v-model="newProduct[0].p_desc" required>
                                                </textarea>
                                          </div>

                                          <label>Resim</label>
                                          <input class="form-control mb-2 mt-2" type="file" name="file"
                                                @change="newProduct[0].p_image = $event.target.files[0]">




                                    </div>
                              </div>
                              <div class="modal-footer">
                                    <button class="btn btn-dark w-100" type="submit">Ürün Ekle</button>
                                    <label> {{ productMessage }} </label>
                                    <!--! Sayfa ilk açıldığında ekranda hiçbir şey görünmez, çünkü productMessage'ın değeri nulldır. -->

                              </div>
                        </form>
                  </div>
            </div>
      </div>

</template>

<script>

export default {
      inject: ['showToast'],
      data() {
            return {
                  newProduct: [
                        { p_name: "", p_stock: 0, p_price: 0, p_desc: "", p_image: null }
                  ],
                  products: [],
                  productMessage: null,
                  baseUrl: "http://localhost:3001",

                  // Ana sayfa ürünlerini tutar
                  homepageProducts: [],

                  // Ana sayfadaki iki bölüm
                  homepageSections: [
                        { value: "discounted", label: "İndirimli Ürünler" },
                        { value: "featured", label: "Öne Çıkan Ürünler" }
                  ]






            };
      },
      mounted() {
            this.getProducts();
            this.getHomepageProducts();

      },

      unmounted() {

      },

      watch: {
      },
      computed: {
      },
      methods: {
            //GET-URUNLERI CEKTIK
            async getProducts() {
                  let token = sessionStorage.getItem("token");

                  if (!token) {
                        return;
                  }

                  let res = await fetch(`${this.baseUrl}/api/products/0`, {
                        headers: {
                              "Authorization": `Bearer ${token}`
                        }
                  });

                  // Token süresi dolduysa yeni access token al.
                  if (res.status === 401) {
                        const refreshRes = await fetch(`${this.baseUrl}/api/refresh`, {
                              method: "POST",
                              credentials: "include"
                        });

                        // Refresh token da geçersizse giriş yapman gerekir.
                        if (!refreshRes.ok) {
                              return;
                        }

                        const refreshData = await refreshRes.json();
                        token = refreshData.token;

                        sessionStorage.setItem("token", token);

                        // Ürünleri yeni access token ile tekrar getir.
                        res = await fetch(`${this.baseUrl}/api/products/0`, {
                              headers: {
                                    "Authorization": `Bearer ${token}`
                              }
                        });
                  }

                  if (!res.ok) {
                        console.error("Ürünler alınamadı:", res.status);
                        return;
                  }

                  this.products = await res.json();
            },



            //INDIRIMLI URUNLER ICIN
            async getHomepageProducts() {
                  try {
                        const res = await fetch(`${this.baseUrl}/api/homepage-products`);

                        if (!res.ok) {
                              throw new Error("Ana sayfa ürünleri getirilemedi.");
                        }

                        this.homepageProducts = await res.json();

                        console.log("Ana sayfa ürünleri:", this.homepageProducts);
                  } catch (e) {
                        console.log("Ana sayfa ürünlerini getirme hatası:", e.message);
                  }
            },


            //INDIRIMLI URUNLER ICIN EKLENEN KISIM
            homepageProductFor(productId, sectionType) {
                  return this.homepageProducts.find(item =>
                        Number(item.p_id) === Number(productId) &&
                        item.section_type === sectionType
                  );
            },


            //INDIRIMLI URUNLER
            async addHomepageProduct(productId, sectionType) {
                  try {

                        const res = await this.homepageRequest(
                              `${this.baseUrl}/api/homepage-products`,
                              {
                                    method: "POST",
                                    headers: {
                                          "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                          product_id: productId,
                                          section_type: sectionType
                                    })
                              }
                        );

                        const data = await res.json();

                        if (!res.ok) {
                              throw new Error(data.error || "Ürün bölüme eklenemedi.");
                        }

                        this.showToast(data.message, "success");

                        await this.getHomepageProducts();

                  } catch (e) {
                        this.showToast(e.message, "error");
                        console.log("Ana sayfaya ürün ekleme hatası:", e.message);
                  }
            },



            //INDIRIMLI URUNLERE EKLEMELER
            async removeHomepageProduct(homepageId) {
                  try {

                        const res = await this.homepageRequest(
                              `${this.baseUrl}/api/homepage-products/${homepageId}`,
                              {
                                    method: "DELETE"
                              }
                        );

                        const data = await res.json();

                        if (!res.ok) {
                              throw new Error(data.error || "Ürün bölümden kaldırılamadı.");
                        }

                        this.showToast(data.message, "success");

                        await this.getHomepageProducts();

                  } catch (e) {
                        this.showToast(e.message, "error");
                        console.log("Ana sayfadan ürün kaldırma hatası:", e.message);
                  }
            },





            // TOKEN SÜRESİ DOLUNCA YENİLEME
            async homepageRequest(url, options) {
                  const token = sessionStorage.getItem("token");

                  if (!token) {
                        throw new Error("Giriş yapmanız gerekiyor.");
                  }

                  const requestOptions = {
                        ...options,
                        headers: {
                              ...options.headers,
                              "Authorization": `Bearer ${token}`
                        }
                  };

                  let res = await fetch(url, requestOptions);

                  // Token hâlâ geçerliyse normal şekilde devam et
                  if (res.status !== 401) {
                        return res;
                  }

                  // Token geçersizse yenisini iste
                  const refreshRes = await fetch(
                        `${this.baseUrl}/api/refresh`,
                        {
                              method: "POST",
                              credentials: "include"
                        }
                  );

                  const refreshData = await refreshRes.json();

                  if (!refreshRes.ok || !refreshData.token) {
                        sessionStorage.removeItem("token");
                        throw new Error(
                              "Oturum yenilenemedi. Lütfen tekrar giriş yapın."
                        );
                  }

                  // Yeni token'ı kaydet
                  sessionStorage.setItem("token", refreshData.token);

                  // İlk isteği yeni token ile tekrar gönder
                  requestOptions.headers.Authorization =
                        `Bearer ${refreshData.token}`;

                  res = await fetch(url, requestOptions);

                  return res;
            },

            async addProduct() {
                  try {
                        const token = sessionStorage.getItem("token");

                        if (!token) {
                              throw new Error("Giriş tokenı bulunamadı.");
                        }

                        const formData = new FormData();

                        formData.append("name", this.newProduct[0].p_name);
                        formData.append("stock", this.newProduct[0].p_stock);
                        formData.append("price", this.newProduct[0].p_price);
                        formData.append("desc", this.newProduct[0].p_desc);

                        if (this.newProduct[0].p_image) {
                              formData.append("file", this.newProduct[0].p_image);
                        }

                        // Ürün ekleme isteğini token yenileme metodundan gönderir.
                        const res = await this.homepageRequest(`${this.baseUrl}/api/products`, {
                              method: "POST",
                              body: formData
                        });

                        const data = await res.json();

                        if (!res.ok) {
                              throw new Error(data.error || "Ürün eklenemedi.");
                        }

                        this.productMessage = data.message;

                        await this.getProducts();

                        this.newProduct[0].p_name = "";
                        this.newProduct[0].p_stock = 0;
                        this.newProduct[0].p_price = 0;
                        this.newProduct[0].p_desc = "";
                        this.newProduct[0].p_image = null;

                  } catch (e) {
                        this.productMessage = e.message;
                        console.log("Ürün ekleme hatası:", e.message);
                  }
            },

            // PUT- Urun Guncelleme
            async updateProduct(p_id, p_name, p_stock, p_price, p_desc) {
                  try {
                        // Güncelleme isteğini token yenileme metodundan gönderir.
                        const res = await this.homepageRequest(
                              `${this.baseUrl}/api/products/${p_id}`,
                              {
                                    method: "PUT",
                                    headers: {
                                          "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                          name: p_name,
                                          stock: p_stock,
                                          price: p_price,
                                          desc: p_desc
                                    })
                              }
                        );

                        // Sunucu hata döndürürse işlemi durdurur.
                        if (!res.ok) {
                              const data = await res.json();
                              throw new Error(data.error || "Ürün güncellenemedi.");
                        }

                        // Sunucudan gelen başarılı cevabı okur.
                        const data = await res.json();

                        // Başarılı işlemde bildirim gösterir.
                        if (data) {
                              this.showToast("Ürün başarıyla güncellendi!", "edit");
                        }

                        // Güncellemeden sonra ürün listesini yeniler.
                        await this.getProducts();

                  } catch (e) {
                        // Hata oluşursa konsola yazar.
                        console.log(e.message);
                  }
            },

            //DELETE URUN SIL
            async deleteProduct(p_id) {
                  try {
                        // Silme isteğini token yenileme metodundan gönderir.
                        const res = await this.homepageRequest(
                              `${this.baseUrl}/api/products/${p_id}`,
                              {
                                    method: "DELETE"
                              }
                        );

                        // Sunucu hata döndürürse işlemi durdurur.
                        if (!res.ok) {
                              const data = await res.json();
                              throw new Error(data.error || "Ürün silinemedi.");
                        }

                        // Sunucudan gelen başarılı cevabı okur.
                        const data = await res.json();

                        // Başarılı işlemde bildirim gösterir.
                        if (data) {
                              this.showToast("Ürün başarıyla silindi!", "error");
                        }

                        // Silme işleminden sonra ürün listesini yeniler.
                        await this.getProducts();

                  } catch (e) {
                        // Hata oluşursa konsola yazar.
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
      padding: 8px 0px 8px 0px;
}

.table-header>h3 {
      font-family: 'Oswald', sans-serif;
      font-size: 24px;
      font-weight: 400;
      color: #0D1217;
}

/* KULLANICI EKLE BUTONU(MODALIN) */
.table-header>.urunekle-button {
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

.admin-product-table {
      height: 100%;
      overflow-y: scroll;
      overflow-x: auto;
}

.admin-product-table>.table {
      margin-left: 0px !important;
      border-radius: 0px !important;
      margin-top: 0px;
      height: 100%;
      width: 100%;
}

/* TABLONUN GENEL KONUMU */
table {
      margin-top: -15px;
      margin-left: 20px;
      width: calc(100% - 40px);
}

/* TABLO BAŞLIKLARI */
table th {
      text-align: center;
      vertical-align: middle;
      white-space: nowrap;
}

/* TABLO İÇERİĞİ */
table td {
      text-align: center;
      vertical-align: middle;
}

/* ÜRÜN ADI INPUT'U */
table td:nth-child(2) input {
      min-width: 180px;
}

/* STOK INPUT'U */
table td:nth-child(3) input {
      width: 90px;
      margin: auto;
}

/* FİYAT INPUT'U */
table td:nth-child(4) input {
      width: 110px;
      margin: auto;
}

/* KDV'Lİ FİYAT */
table td:nth-child(5) {
      min-width: 120px;
      white-space: nowrap;
}

/* AÇIKLAMA ALANI */
table td:nth-child(6) textarea {
      width: 220px;
      min-height: 70px;
      resize: vertical;
      margin: auto;
}

/* GÜNCELLE - SİL ALANI */
table td:nth-child(7) {
      min-width: 170px;
      white-space: nowrap;
}

/* ÜRÜN EKLE BUTONU */
button[data-bs-target="#addproduct"] {
      margin-right: 20px;
      margin-bottom: 10px;
      padding: 7px 18px;
      border-radius: 8px;
}

/* BAŞLIK */
h3 {
      margin-top: 0;
}

/* ÜRÜN EKLE MODALINDAKİ INPUTLAR */
.modal .form-control {
      border-radius: 7px;
}

/* MODALDAKİ ÜRÜN EKLE BUTONU */
.modal-footer .btn-success {
      border-radius: 8px;
}

/* GÜNCELLE - SİL ALANI */
table td:nth-child(7) {
      min-width: 170px;
      white-space: nowrap;
}

/* ANA SAYFA BÖLÜMÜ ALANI */
table td:nth-child(8) {
      min-width: 190px;
      vertical-align: middle;
}

table td:nth-child(8) button {
      white-space: normal;
}



/* Yalnızca telefon ekranlarında responsive düzenlemeleri uygular. */
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



      /* Ürün ekle butonunun sağ boşluğunu telefon ekranına uyarlar. */
      button[data-bs-target="#addproduct"] {
            margin-right: 0;
            margin-bottom: 10px;
      }

      /* Tablo hücrelerinin içerik yüzünden gereksiz yere daralmasını önler. */
      .admin-product-table th,
      .admin-product-table td {
            white-space: nowrap;
            vertical-align: middle;
      }

      /* Açıklama alanının mobil tabloda aşırı büyümesini önler. */
      .admin-product-table td:nth-child(6) textarea {
            width: 180px;
            max-width: none;
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
