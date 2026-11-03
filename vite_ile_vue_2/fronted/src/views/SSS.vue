<template>

  <section class="faq-header">
    <h1> SIKÇA SORULAN SORULAR </h1>
    <p class="faq-subtitle">Merak ettiğin soruların cevaplarını bul.</p>
  </section>

  <!-- !YENI SORU CEVAP KISMI -->
  <div class="faq-container">
    <div class="accordion accordion-flush" id="one">
      <div class="accordion-item">
        <h2 class="accordion-header" id="flush-headingOne">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
            1. Antrenmanım için doğru ekipmanı nasıl seçebilirim? </button>
        </h2>
        <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne"
          data-bs-parent="#accordionFlushExample">
          <div class="accordion-body">İhtiyacınıza, antrenman türünüze ve kullanım amacınıza göre ürünlerimizi
            inceleyerek
            size en uygun ekipmanı seçebilirsiniz.</div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="two">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
            2. Ürünleriniz günlük kullanım için de uygun mu? </button>
        </h2>
        <div id="flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo"
          data-bs-parent="#accordionFlushExample">
          <div class="accordion-body">Evet. Birçok ürünümüz yalnızca antrenman sırasında değil, günlük sportif
            yaşamınızda
            da rahatlıkla kullanılabilir.</div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header" id="three">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
            3. Yeni başlayan biri STRYVE'den hangi ürünlerle başlamalı?
          </button>
        </h2>
        <div id="flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-headingThree"
          data-bs-parent="#accordionFlushExample">
          <div class="accordion-body">Temel antrenman ekipmanları, spora yeni başlayanlar için iyi bir başlangıç
            noktasıdır. İhtiyacınız arttıkça ekipmanlarınızı da geliştirebilirsiniz.</div>
        </div>
      </div>

      <div class="accordion-item">
        <h2 class="accordion-header" id="four">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
            4. Aldığım ürünün kullanım alanını nasıl öğrenebilirim? </button>
        </h2>
        <div id="flush-collapseFour" class="accordion-collapse collapse" aria-labelledby="flush-headingFour"
          data-bs-parent="#accordionFlushExample">
          <div class="accordion-body">Her ürünün sayfasında kullanım amacı ve öne çıkan özellikleri hakkında gerekli
            bilgilere ulaşabilirsiniz.</div>
        </div>
      </div>


      <div class="accordion-item">
        <h2 class="accordion-header" id="five">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#flush-collapseFive" aria-expanded="false" aria-controls="flush-collapseFive">
            5. STRYVE'yi diğer spor mağazalarından farklı kılan nedir? </button>
        </h2>
        <div id="flush-collapseFive" class="accordion-collapse collapse" aria-labelledby="flush-headingFive"
          data-bs-parent="#accordionFlushExample">
          <div class="accordion-body">STRYVE, sporu yalnızca bir aktivite olarak değil, daha güçlü ve aktif bir yaşam
            tarzının parçası olarak görür. Bu anlayışla ürünlerimizi seçiyoruz.</div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
/* FAQ başlığının konumu */
.faq-header {
  background-color: #ecebf0;
  padding: 24px 0px;

}

/* FAQ başlığının görünümü */
.faq-header h1 {
  color: #0D1217;
  font-size: 36px;
  font-family: 'Oswald', sans-serif;
  font-weight: 400;
  text-align: center;
}

.faq-header p {
  color: #0D1217;
  font-size: 16px;
  font-family: 'Oswald', sans-serif;
  font-weight: 400;
  text-align: center;

}

/* Soru alanını ortalar ve masaüstünde genişliğini sınırlar */
.faq-container {
  width: 100vw;
  height: fit-content;
  padding-top: 24px;
  display: flex;
  justify-content: center;
}

.accordion-flush {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 50%;
}


/* Soru kutularının görünümü */
.accordion-item {
  border-radius: 12px;
  overflow: hidden;
}


/* Soruların görünümü */
.accordion-button {
  background-color: #0b0b0f;
  color: #f5f5f5;
  font-size: 20px;
  font-family: 'Helvetica', sans-serif;
  font-weight: 200;
  text-align: left;
  width: 100%;
  padding: 24px 28px;
  transition: 0.3s;
}

/* Mouse üzerine geldiğinde */
.accordion-button:hover {
  background-color: #0661F6;
  text-shadow: 0 0 8px #0661F6(127, 255, 0, 0.35);
}

/* Mavi focus efektini kaldırır */
.accordion-button:focus {
  box-shadow: inset 4px 0 0 #0661F6;
}

/* Ok işareti */
.accordion-button::after {
  filter: invert(1);
}

/* Cevap bölümü */
.accordion-body {
  background-color: #0D1217;
  color: #f5f5f5;
  font-size: 20px;
  font-family: 'Helvetica', sans-serif;
  font-weight: 200;
  text-align: left;
  padding: 22px 28px;
}

@media (min-width: 576px) and (max-width: 991px) {
  .accordion-flush {
    width: 90%;
  }

}


@media (max-width: 480px) {

  .accordion-flush {
    width: 90%;
  }
}
</style>
