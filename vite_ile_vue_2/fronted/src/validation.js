export function validateFirstName(firstName) {

      if (firstName.length < 2) {
            return "Ad Bilgisi Hatalı!";
      }

      return "";
}

export function validateLastName(lastName) {

      if (lastName.length < 2) {
            return "Soyad Bilgisi Hatalı!";
      }

      return "";
}

export function validateEmail(email) {

      if (!email.includes("@") || !email.includes(".")) {
            return "E-Mail Bilgisi Hatalı!";
      }

      return "";
}

export function validatePhone(phone) {

      if (!/^[0-9]{10}$/.test(phone)) {
            return "Telefon Bilgisi Hatalı!";
      }

      return "";
}

export function validatePassword(pass) {

      if (pass.length < 6) {
            return "Parola Bilgisi Hatalı!";
      }

      return "";
}

export function validateRepeatPassword(pass, repeatPass) {

      if (pass !== repeatPass) {
            return "Parolalar Eşleşmiyor!";
      }
      return "";
}

export function validateCheck(check) {

      if (!check) {
            return "Lütfen Kutucuğu Onaylayınız!";
      }

      return "";
}
export function validateTC(TC) {

      if (!/^[0-9]{11}$/.test(TC)) {
            return "T.C. Kimlik No Bilgisi Hatalı!";
      }

      return "";
}
export function validateAddress(address) {

      if (address.length < 5) {
            return "Adres Bilgisi Hatalı!";
      }

      return "";
}
export function validateZip(zip) {

      if (!/^[0-9]{5}$/.test(zip)) {
            return "Posta Kodu Bilgisi Hatalı!";
      }

      return "";
}
export function validateCardName(name) {

      if (name.length < 2) {
            return "Kart Sahibi Bilgisi Hatalı!";
      }

      return "";
}
export function validateCardNumber(number) {

      if (!/^[0-9]{16}$/.test(number)) {
            return "Kart Numarası Bilgisi Hatalı!";
      }

      return "";
}
export function validateCardExp(exp) {

      if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(exp)) {
            return "Son Kullanma Tarihi Hatalı!";
      }

      return "";
}
export function validateCVV(cvv) {

      if (!/^[0-9]{3}$/.test(cvv)) {
            return "CVV Bilgisi Hatalı!";
      }

      return "";
}





