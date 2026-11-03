<template>

    <!--! ABOUT İÇERİK -->
    <section class="hakkimizda-container">


        <div class="about-intro">


            <span class="isim">01 — HİKAYEMİZ</span>

            <h1 class="h1-text">
                DAHA GÜÇLÜ İNSANLARA İNANIYORUZ.
            </h1>

            <p class="p-text">
                Stryve, spor tutkusunu kaliteli ekipmanlarla buluşturmak için oluşturuldu.
            </p>

        </div>

        <div class="metin-kutusu">
            <h1 class="h1-text">HAKKIMIZDA</h1>
            <p class="p-text">
                Spor bizim için sadece hareket etmek değil, kendini her gün biraz daha ileri taşımaktır.

                STRYVE, spor tutkusunu kaliteli ve işlevsel ürünlerle buluşturmak için yola çıktı. Antrenman
                yaparken
                ihtiyaç duyduğun ekipmanları tek bir yerde bulabilmen ve hedeflerine giden yolda kendini daha güçlü
                hissetmen için çalışıyoruz.

                İster spora yeni başlıyor ol, ister uzun zamandır antrenman yapıyor ol; önemli olan kendi hedefinin
                peşinden gitmek ve vazgeçmemek.

                STRYVE olarak, bu yolculukta sana eşlik etmek için buradayız. </p>
        </div>

        <div class="neden-strive">

            <h1 class="h1-text">NEDEN STRYVE?</h1>

            <p class="p-text">
                Hedeflerine ulaşırken ihtiyacın olan ekipmanları
                tek bir yerde keşfet.
            </p>
        </div>

        <div class="istatistikler">

            <div class="istatistik">
                <span class="number">+50</span>
                <span class="isim">Spor Ürünü</span>

            </div>

            <div class="istatistik">
                <span class="number">+100</span>
                <span class="isim">Mutlu Kullanıcı</span>
            </div>

            <div class="istatistik">
                <span class="number">7/24</span>
                <span class="isim">Online Alışveriş</span>
            </div>

        </div>



    </section>

</template>

<style scoped>
.hakkimizda-container {
    display: flex;
    flex-direction: column;
    padding: 50px 24px 0px 24px;
    margin-top: 0px ;
    height: 100vh;
    justify-content: start;
    gap: 32px;
}

.about-intro {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 24px;
}


.h1-text {
    color: #0D1217;
    font-size: 36px;
    font-family: 'Oswald', sans-serif;
    font-weight: 400;
    text-align: left;

}

.p-text {
    color: #0D1217;
    font-size: 16px;
    font-family: 'Helvetica', sans-serif;
    font-weight: 200;
}


.istatistikler {
    display: flex;
    justify-content: space-between;
    width: 60vw;

}

.istatistik {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.number {
    color: #0D1217;
    font-size: 24px;
    font-family: 'Oswald', sans-serif;
    font-weight: 400;
}

.isim {
    color: #0D1217;
    font-size: 16px;
    font-family: 'Helvetica', sans-serif;
    font-weight: 200;

}

 @media (min-width:1280px) {
    .hakkimizda-container {
        width:70vw;
    }
 }

</style>