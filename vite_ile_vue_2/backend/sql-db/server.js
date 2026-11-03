require("dotenv").config();//env dosyamizi import ettik
const crypto = require("crypto");
const express = require("express");
const cors = require("cors");

const multer = require("multer");
const fs = require("fs");

const upload = multer({ storage: multer.memoryStorage() });





const { validateEmail, validateName, validateSurname, validateTel } = require("../validation");
const app = express();

app.use(cors({
      origin: "http://localhost:5173",
      credentials: true
}));



const db = require("./db");//db .js dosyamizi import ettik
app.use(express.json());
app.use("/uploads", express.static("./uploads"));


function base64Url(value) {
      return Buffer.from(value).toString("base64url");
}

function createToken(userId) {
      const header = base64Url(JSON.stringify({ //Tokenın türünü ve hangi algoritmayla imzalandığını belirtir.
            alg: "HS256",
            typ: "JWT"
      }));

      const payload = base64Url(JSON.stringify({ //Tokenın içerisinde taşınan bilgileri içerir.
            sub: String(userId),
            exp: Math.floor(Date.now() / 1000) + 60
      }));

      const signature = crypto //Header ve payload bölümlerinin gizli anahtarla imzalanması sonucunda oluşur.
            .createHmac("sha256", process.env.JWT_SECRET)
            .update(`${header}.${payload}`)
            .digest("base64url");

      return `${header}.${payload}.${signature}`;
}



function createRefreshToken(userId) {
      const header = base64Url(JSON.stringify({
            alg: "HS256",
            typ: "JWT"
      }));

      const payload = base64Url(JSON.stringify({
            sub: String(userId),
            tokenType: "refresh",
            exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
      }));

      const signature = crypto
            .createHmac("sha256", process.env.JWT_SECRET)
            .update(`${header}.${payload}`)
            .digest("base64url");

      return `${header}.${payload}.${signature}`;
}




//JWT YAPISI ICIN EKLENDI
function verifyToken(token, tokenType = "access") {
      try {
            const parts = token.split(".");

            if (parts.length !== 3) {
                  return null;
            }

            const [header, payload, signature] = parts;

            const expectedSignature = crypto
                  .createHmac("sha256", process.env.JWT_SECRET)
                  .update(`${header}.${payload}`)
                  .digest("base64url");

            const signatureBuffer = Buffer.from(signature);
            const expectedBuffer = Buffer.from(expectedSignature);

            if (
                  signatureBuffer.length !== expectedBuffer.length ||
                  !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
            ) {
                  return null;
            }

            const decodedPayload = JSON.parse(
                  Buffer.from(payload, "base64url").toString("utf8")
            );

            if (
                  !decodedPayload.sub ||
                  !decodedPayload.exp ||
                  decodedPayload.exp <= Math.floor(Date.now() / 1000) ||
                  (decodedPayload.tokenType || "access") !== tokenType
            ) {
                  return null;
            }

            return decodedPayload;

      } catch (err) {
            return null;
      }
}


//JWT YAPISI EKLENEN API
app.get("/api/me", async (req, res) => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                  error: "Token bulunamadı."
            });
      }

      const token = authHeader.split(" ")[1];
      const decodedToken = verifyToken(token);

      if (!decodedToken) {
            return res.status(401).json({
                  error: "Token geçersiz veya süresi dolmuş."
            });
      }

      try {
            const [rows] = await db.query(
                  "SELECT u_id, u_role, u_firstName, u_lastName FROM users WHERE u_id = ?", [decodedToken.sub]
            );

            if (rows.length === 0) {
                  return res.status(401).json({
                        error: "Kullanıcı bulunamadı."
                  });
            }

            return res.status(200).json(rows[0]);

      } catch (err) {
            return res.status(500).json({
                  error: "Kullanıcı bilgileri alınamadı."
            });
      }
});
















//* BU KISIM SQL ILE BAGLANTIYI SAGLAYAN EN SON BULUNMASI GEREKEN BACKEND SORGULARI. YANI BURADA MYSQL ILE ADMIN PRODUCT.VUE SAYFAM BAGLANTILI OLDU

//!? ADMIN PRODUCTS KISMI
//! PRODUCTS LISTELE -GET- sql sorgu Select
app.get("/api/products/:id", async (req, res) => {
      try {
            //Token kontrolünü de ekledik
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                  return res.status(401).json({
                        error: "Token bulunamadı."
                  });
            }

            const token = authHeader.split(" ")[1];
            const decodedToken = verifyToken(token);

            if (!decodedToken) {
                  return res.status(401).json({
                        error: "Token geçersiz veya süresi dolmuş."
                  });
            }

            const userId = Number(decodedToken.sub);

            // Giriş yapan kullanıcının rolünü kontrol et
            //kullanıcının rolünü veritabanından alıyor
            const [users] = await db.query(
                  "SELECT u_role FROM users WHERE u_id = ?",
                  [userId]
            );

            if (users.length === 0) {
                  return res.status(401).json({
                        error: "Kullanıcı bulunamadı."
                  });
            }

            let rows;

            if (Number(users[0].u_role) === 1) {
                  // Admin: bütün kullanıcıların ürünleri
                  [rows] = await db.query(
                        "SELECT * FROM products ORDER BY p_id ASC"
                  );
            } else {
                  // Normal kullanıcı: yalnızca kendi ürünleri
                  [rows] = await db.query(
                        "SELECT * FROM products WHERE u_id = ? ORDER BY p_id ASC",
                        [userId]
                  );
            }

            return res.status(200).json(rows);

      } catch (err) {
            console.log("ÜRÜN LİSTELEME HATASI:", err);
            res.status(500).json({
                  error: "Ürünler getirilemedi."
            });
      }
});



//!   PRODUCTS EKLE -POST-  sql sorgu insert into
app.post("/api/products", upload.single("file"), async (req, res) => {
      try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                  return res.status(401).json({
                        error: "Token bulunamadı."
                  });
            }

            const token = authHeader.split(" ")[1];
            const decodedToken = verifyToken(token);

            if (!decodedToken) {
                  return res.status(401).json({
                        error: "Token geçersiz veya süresi dolmuş."
                  });
            }

            const userId = Number(decodedToken.sub);

            if (!Number.isInteger(userId) || userId <= 0) {
                  return res.status(401).json({
                        error: "Geçersiz kullanıcı."
                  });
            }

            const { name, stock, price, desc } = req.body;

            if (
                  !name?.trim() ||
                  stock === undefined ||
                  stock === "" ||
                  price === undefined ||
                  price === "" ||
                  !desc?.trim()
            ) {
                  return res.status(400).json({
                        error: "Hatalı ürün bilgisi."
                  });
            }

            if (!req.file) {
                  return res.status(400).json({
                        error: "Resim seçilmedi."
                  });
            }

            const [result] = await db.query(
                  "INSERT INTO products (p_name, p_desc, p_images, p_stock, p_price, p_disc, p_active, u_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                  [
                        name.trim(),
                        desc.trim(),
                        req.file.originalname,
                        stock,
                        price,
                        price,
                        1,
                        userId
                  ]
            );

            const productId = result.insertId;
            const folderPath = `./uploads/${productId}`;

            fs.mkdirSync(folderPath, { recursive: true });

            const fileName = req.file.originalname;
            const filePath = `${folderPath}/${fileName}`;

            fs.writeFileSync(filePath, req.file.buffer);

            await db.query(
                  "UPDATE products SET p_images = ? WHERE p_id = ?",
                  [`${productId}/${fileName}`, productId]
            );

            res.status(201).json({
                  message: `${name} adlı ürün eklendi.`,
                  productId
            });

      } catch (err) {
            console.log("ÜRÜN EKLEME HATASI:", err);
            res.status(500).json({ error: err.message });
      }
});



//! PRODUCTS GÜNCELLE -PUT- sql sorgu update set yapisi
app.put("/api/products/:id", async (req, res) => {
      try {
            const id = Number(req.params.id);
            const { name, stock, price, desc } = req.body;

            if (isNaN(id)) {
                  return res.status(400).json({ error: "Geçersiz ID" });
            }
            if (!name || !stock || !price || !desc) {
                  return res.status(400).json({ error: "hatali veri geldi" });

            }

            const [result] = await db.query(
                  "UPDATE products SET p_name=?,p_stock=?,p_price=?,p_desc=? WHERE p_id=?",
                  [name.trim(), stock, price, desc, id]
            );

            res.status(200).json(name + " adlı ürün güncellendi");
      }
      catch (err) {
            res.status(500).json({ error: err.message });
      }
});
//! PRODUCTS SİL-DELETE- sql sorgu: delete 

app.delete("/api/products/:id", async (req, res) => {
      try {
            const id = Number(req.params.id);

            const folderPath = `./uploads/${id}`;

            if (fs.existsSync(folderPath)) {
                  fs.rmSync(folderPath, { recursive: true, force: true });
            }

            const [result] = await db.query("DELETE FROM products WHERE p_id=?", [id]);

            res.status(200).json("Urun silindi");

      } catch (err) {
            res.status(500).json({ error: err.message });
      }
});



//!? ADMIN  MESSAGES KISMI
//!     MESSAGES LISTELE -GET- SQL sorgu Select
app.get("/api/messages", async (req, res) => {
      try {
            const [rows] = await db.query("SELECT * FROM messages ORDER BY m_id ASC");
            res.status(200).json(rows);
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
});
//! MESSAGES GÜNCELLE-put sql sorgu: update set yapisi
app.put("/api/messages/:id", async (req, res) => {
      try {
            const id = Number(req.params.id);
            const { status } = req.body;

            if (isNaN(id)) return res.status(400).json({ error: "Geçersiz ID" });
            if (!status) return res.status(400).json({ error: "hatali veri geldi" });

            const [result] = await db.query(
                  "UPDATE messages SET m_status=?  WHERE m_id=?",
                  [status, id]
            );

            res.status(200).json(" mesaj durumu guncellendi");
      } catch (err) {
            res.status(500).json({ error: "Sunucu hatası" });
      }
});
//! MESSAGES SİL-delete sql sorgu: delete 
app.delete("/api/messages/:id", async (req, res) => {
      try {
            const id = Number(req.params.id);
            const [result] = await db.query("DELETE FROM messages WHERE m_id=?", [id]);
            res.status(200).json("Mesaj silindi");

      } catch (err) {
            res.status(500).json({ error: err.message });
      }
});







//!? ADMIN  USERS KISMI
//!     USERS LISTELE -GET- SQL sorgu Select
app.get("/api/users", async (req, res) => {
      try {
            const [rows] = await db.query("SELECT * FROM users ORDER BY u_id ASC");
            res.status(200).json(rows);
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
});
//!   USERS EKLE -POST- SQl insert into
app.post("/api/users", async (req, res) => {
      try {
            const { firstName, lastName, email, phone, pass, birthdate, role } = req.body;
            if (!firstName || !lastName || !email || !phone || !pass || !birthdate) return res.status(400).json({ error: "hatali veri geldi" });
            const [result] = await db.query(

                  "INSERT INTO users (u_firstName,u_lastName,u_email,u_phone,u_pass,u_birthdate,u_role) VALUES (?,?,?,?,?,?,?)",
                  [firstName.trim(), lastName.trim(), email.trim(), phone, pass, birthdate, role]
            );
            res.status(201).json(firstName + "  " + lastName + " Adli Kullanici Eklendi ");
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
});
//! USERS GÜNCELLE-put sql sorgu: update set yapisi
app.put("/api/users/:id", async (req, res) => {
      try {
            const id = Number(req.params.id);
            const { firstName, lastName, email, phone, pass, role } = req.body;

            if (isNaN(id)) return res.status(400).json({ error: "Geçersiz ID" });
            if (!firstName || !lastName || !email || !phone || !pass) return res.status(400).json({ error: "hatali veri geldi" });

            const [result] = await db.query(
                  "UPDATE users SET u_firstName=?,u_lastName=?,u_email=?,u_phone=?,u_pass=?,u_role=?  WHERE u_id=?",
                  [firstName.trim(), lastName.trim(), email.trim(), phone, pass, role, id]
            );


            // if (result.affectedRows === 0) {
            //       return res.status(404).json({ error: "Güncellenecek urun  bulunamadı." });
            // }
            // const [rows] = await db.query("SELECT * FROM products WHERE p_id=?", [id]);


            res.status(200).json("Kisi Bilgisi Guncellendi");
      } catch (err) {
            res.status(500).json({ error: "Sunucu hatası" });
      }
});
//! MESSAGES SİL-delete sql sorgu: delete 
app.delete("/api/users/:id", async (req, res) => {
      try {
            const id = Number(req.params.id);
            const [result] = await db.query("DELETE FROM users WHERE u_id=?", [id]);
            res.status(200).json({ message: "Kullanici silindi" });

      } catch (err) {
            res.status(500).json({ error: err.message });
      }
});




//!? ADMIN  ORDERS KISMI
//!     ORDERS LISTELE -GET- SQL sorgu Select
app.get("/api/orders", async (req, res) => {
      try {
            const [rows] = await db.query("SELECT * FROM orders ORDER BY o_id DESC");
            res.status(200).json(rows);
      } catch (err) {
            res.status(500).json({ error: err.message });
      } const name = new type(arguments);
});


//! SATIN ALINAN -KULLANICI YONETIM PANELI- SIPARISI GETIREN API
app.get("/api/my-purchases/:userId", async (req, res) => {
      try {
            const userId = req.params.userId;

            const [rows] = await db.query(
                  "SELECT * FROM orders WHERE u_id = ? ORDER BY o_id DESC",
                  [userId]
            );

            res.status(200).json(rows);
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
});

//! SATTIKLARIM -KULLANICI YONETIM PANELI- BUTONU ILE CALISAN API ISTEGI
app.get("/api/my-sales/:userId", async (req, res) => {
      try {
            const userId = req.params.userId;

            const [rows] = await db.query(
                  `SELECT DISTINCT orders.*
       FROM orders
       INNER JOIN products
       ON FIND_IN_SET(products.p_id, orders.o_pids)
       WHERE products.u_id = ? 
       ORDER BY orders.o_id DESC`,
                  [userId]
            );

            res.status(200).json(rows);
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
});





//!   ORDERS EKLE -POST- SQl insert into
app.post("/api/orders", async (req, res) => {
      try {
            const { sepet, order, amount, userId } = req.body;
            if (!sepet || !order || !amount || !userId) {
                  return res.status(400).json({ error: "hatali veri geldi" });
            }

            const o_no = Date.now().toString();

            const o_products = sepet.map(urun => urun.p_name).join(",");
            const o_pids = sepet.map(urun => urun.p_id).join(",");
            const o_person = order[0].firstName + " " + order[0].lastName;
            const o_address = order[0].address + " / " + order[0].state + " " + order[0].country + " " + order[0].zip;
            const o_amount = amount;
            const o_status = "Hazırlanıyor";


            for (const urun of sepet) {
                  const [stock] = await db.query(
                        "SELECT p_stock FROM products WHERE p_id=?",
                        [urun.p_id]
                  );

                  if (stock.length === 0 || stock[0].p_stock < urun.quantity) {
                        return res.status(400).json({ error: "Yeterli stok yok" });
                  }
            }


            const [result] = await db.query(
                  "INSERT INTO orders (u_id,o_no,o_products,o_pids,o_person,o_address,o_amount,o_status) VALUES (?,?,?,?,?,?,?,?)",
                  [userId, o_no.trim(), o_products.trim(), o_pids, o_person, o_address, o_amount, o_status]
            );


            for (const urun of sepet) {
                  await db.query(
                        "UPDATE products SET p_stock = p_stock - ? WHERE p_id=?",
                        [urun.quantity, urun.p_id]
                  );
            }




            res.status(201).json(o_no + "  " + " Urun Eklendi ");
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
});
//! ORDERS GÜNCELLE-put sql sorgu: update set yapisi
app.put("/api/orders/:id", async (req, res) => {
      try {
            const id = Number(req.params.id);
            const { status } = req.body;

            if (isNaN(id)) return res.status(400).json({ error: "Geçersiz ID" });
            if (!status) return res.status(400).json({ error: "hatali veri geldi" });

            const [result] = await db.query(
                  "UPDATE orders SET o_status=? WHERE o_id=?",
                  [status, id]
            );


            // if (result.affectedRows === 0) {
            //       return res.status(404).json({ error: "Güncellenecek urun  bulunamadı." });
            // }
            // const [rows] = await db.query("SELECT * FROM products WHERE p_id=?", [id]);


            res.status(200).json("Siparis Guncellendi");
      } catch (err) {
            res.status(500).json({ error: "Sunucu hatası" });
      }
});
//! ORDERS SİL-delete sql sorgu: delete 
app.delete("/api/orders/:id", async (req, res) => {
      try {
            const id = Number(req.params.id);
            const [result] = await db.query("DELETE FROM orders WHERE o_id=?", [id]);
            res.status(200).json({ message: "Urun silindi" });

      } catch (err) {
            res.status(500).json({ error: err.message });
      }
});





//!-----------------------------------------------------------------------------------------------------------------


//?CONTACT MESSAGE -POST- SQL SORGUSU INSERT INTO
//! CONTACT - MESAJ EKLE - POST - SQL SORGU INSERT INTO
app.post("/api/contact", async (req, res) => {
      try {
            const { firstName, lastName, email, phone, subject, message } = req.body;
            if (!firstName || !lastName || !email || !phone || !subject || !message) return res.status(400).json({ error: "hatali veri geldi" });
            const [result] = await db.query(

                  "INSERT INTO messages (m_firstName,m_lastName,m_email,m_phone,m_subject,m_message,m_status) VALUES (?,?,?,?,?,?,?)",
                  [firstName.trim(), lastName.trim(), email.trim(), phone, subject, message.trim(), 0]
            );
            res.status(201).json(" Mesaj Gonderildi ");
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
});

//!--------------------------------------------------------------------------------------------------------------
//? PRODUCT SAYFASI -ALL PRODUCTS- LISTELE -GET- SQL SORGU:SELECT
app.get("/api/productPage", async (req, res) => {
      try {

            const [rows] = await db.query("SELECT * FROM products WHERE p_active=1 ORDER BY p_id ASC");//tüm ürünleri yolla
            res.status(200).json(rows);
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
});



//! ID BUL HOCANIN EKLEDIGI KISIM
// app.get("/api/idbul", async (req, res) => {
//   const { jwt } = req.body;
//   try {
//     const [rows] = await db.query("SELECT u_id FROM users WHERE u_jwt=?",[jwt]);//tüm ürünleri yolla
//     res.status(200).json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });











//?REGISTER -POST- SQL SORGUSU: INSERT INTO
//! REGISTER - KULLANICI KAYIT - POST - SQL SORGU INSERT INTO
app.post("/api/register", async (req, res) => {
      try {
            const { firstName, lastName, email, phone, pass, birthdate } = req.body;
            if (!firstName || !lastName || !email || !pass || !phone || !birthdate) return res.status(400).json({ error: "hatali veri geldi" });
            const [result] = await db.query(

                  "INSERT INTO users (u_firstName,u_lastName,u_email,u_phone,u_pass,u_birthdate,u_role) VALUES (?,?,?,?,?,?,?)",
                  [firstName.trim(), lastName.trim(), email.trim(), phone, pass, birthdate, 0]
            );
            res.status(201).json(" Kayit Basarili ");
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
});




//JWT ICIN EKLENEN KISIM
app.post("/api/refresh", async (req, res) => {
      const refreshToken = req.headers.cookie
            ?.split("; ")
            .find(cookie => cookie.startsWith("refreshToken="))
            ?.split("=")[1];

      if (!refreshToken) {
            return res.status(401).json({
                  error: "Yenileme tokenı bulunamadı."
            });
      }

      const decodedToken = verifyToken(refreshToken, "refresh");

      if (!decodedToken) {
            res.clearCookie("refreshToken", {
                  httpOnly: true,
                  secure: false,
                  sameSite: "lax",
                  path: "/api/refresh"
            });

            return res.status(401).json({
                  error: "Yenileme tokenı geçersiz veya süresi dolmuş."
            });
      }

      try {
            const [rows] = await db.query(
                  "SELECT u_id FROM users WHERE u_id = ?",
                  [decodedToken.sub]
            );

            if (rows.length === 0) {
                  res.clearCookie("refreshToken", {
                        httpOnly: true,
                        secure: false,
                        sameSite: "lax",
                        path: "/api/refresh"
                  });

                  return res.status(401).json({
                        error: "Kullanıcı bulunamadı."
                  });
            }

            const token = createToken(rows[0].u_id);

            return res.status(200).json({ token });

      } catch (err) {
            return res.status(500).json({
                  error: err.message
            });
      }
});



//?LOGIN -GET- SQL SORGUSU: SELECT  -JWT YAPISI ICIN GUNCELLENDI-
app.post("/api/login", async (req, res) => {
      const { email, pass } = req.body;
      try {
            const [rows] = await db.query(
                  "SELECT u_id, u_role, u_firstName FROM users WHERE u_email=? AND u_pass=?",
                  [email, pass]
            );

            if (rows.length === 0) {
                  return res.status(401).json({
                        error: "Giriş Başarısız"
                  });
            }


            const token = createToken(rows[0].u_id);
            const refreshToken = createRefreshToken(rows[0].u_id);

            res.cookie("refreshToken", refreshToken, {
                  httpOnly: true,
                  secure: false,
                  sameSite: "lax",
                  maxAge: 7 * 24 * 60 * 60 * 1000,
                  path: "/api/refresh"
            });

            rows[0].token = token;
            return res.status(200).json(rows);


      } catch (err) {
            return res.status(500).json({
                  error: err.message
            });
      }
});





//? ADMINPAGE- USERNAME
app.post("/api/getUsername", async (req, res) => {
      const { id } = req.body;

      try {
            const [rows] = await db.query("SELECT u_firstName, u_lastName FROM users WHERE u_id=?", [id]); if (rows) {

                  return res.status(200).json(rows[0].u_firstName + " " + rows[0].u_lastName);
            }
            else {
                  return res.status(404).json({ error: "Kullanici Bulunamadi" })
            }
      } catch (err) {
            res.status(500).json({ error: err.message });
      } const name = new type(arguments);
});







//! KAYITLI ADRESLER - KULLANICI ADRESLERİ

// KULLANICININ ADRESLERİNİ LİSTELE
app.get("/api/addresses/:userId", async (req, res) => {
      try {
            const userId = Number(req.params.userId);

            if (!Number.isInteger(userId) || userId <= 0) {
                  return res.status(400).json({ error: "Geçersiz kullanıcı ID" });
            }

            const [rows] = await db.query(
                  "SELECT * FROM user_addresses WHERE u_id=? ORDER BY address_id DESC",
                  [userId]
            );

            res.status(200).json(rows);
      } catch (err) {
            console.log("ADRES LİSTELEME HATASI:", err);
            res.status(500).json({ error: "Adresler alınamadı" });
      }
});




// YENİ ADRES KAYDET
app.post("/api/addresses", async (req, res) => {
      try {
            const {
                  userId,
                  address_title,
                  first_name,
                  last_name,
                  email,
                  phone,
                  address,
                  country,
                  state,
                  zip
            } = req.body;

            if (
                  !Number.isInteger(Number(userId)) ||
                  Number(userId) <= 0 ||
                  !address_title ||
                  !first_name || //ALANLAR DOLUYOR MU DOLMUYOR MU KONTROL EDILIYOR
                  !last_name ||
                  !email ||
                  !phone ||
                  !address ||
                  !country ||
                  !state
            ) {
                  return res.status(400).json({
                        error: "Zorunlu adres bilgilerini doldurun"
                  });
            }

            const [result] = await db.query(
                  `INSERT INTO user_addresses 
            (u_id, address_title, first_name, last_name, email,
            phone, address, country, state, zip)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                        Number(userId),
                        address_title.trim(),
                        first_name.trim(),
                        last_name.trim(),
                        email.trim(),
                        phone.trim(),
                        address.trim(),
                        country.trim(),
                        state.trim(),
                        zip || null
                  ]
            );

            res.status(201).json({
                  message: "Adres başarıyla kaydedildi",
                  address_id: result.insertId
            });
      } catch (err) {
            console.log("ADRES KAYDETME HATASI:", err);
            res.status(500).json({ error: "Adres kaydedilemedi" });
      }
});






// ANA SAYFA: İNDİRİMLİ VE ÖNE ÇIKAN ÜRÜNLERİ LİSTELE
app.get("/api/homepage-products", async (req, res) => {
      try {
            const [rows] = await db.query(`
                  SELECT
                        hp.id AS homepage_id,
                        hp.section_type,
                        hp.display_order,
                        p.*
                  FROM homepage_products hp
                  INNER JOIN products p ON hp.product_id = p.p_id
                  WHERE p.p_active = 1
                  ORDER BY hp.section_type, hp.display_order ASC
            `);

            res.status(200).json(rows);
      } catch (err) {
            console.error("Ana sayfa ürünleri listeleme hatası:", err);
            res.status(500).json({
                  error: "Ana sayfa ürünleri alınamadı."
            });
      }
});


// ADMIN KONTROLÜ
async function checkHomepageAdmin(req, res, next) {
      try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                  return res.status(401).json({
                        error: "Giriş yapmanız gerekiyor."
                  });
            }

            const token = authHeader.split(" ")[1];
            const payload = verifyToken(token);

            if (!payload) {
                  return res.status(401).json({
                        error: "Oturumunuz geçersiz veya süresi dolmuş."
                  });
            }

            const [results] = await db.query(
                  "SELECT u_role FROM users WHERE u_id = ?",
                  [payload.sub]
            );

            if (!results.length || Number(results[0].u_role) !== 1) {
                  return res.status(403).json({
                        error: "Bu işlem için admin yetkisi gerekiyor."
                  });
            }

            next();
      } catch (err) {
            console.error("Admin kontrol hatası:", err);
            return res.status(500).json({
                  error: "Yetki kontrolü yapılamadı."
            });
      }
}


// ADMIN: ÜRÜNÜ ANA SAYFA BÖLÜMÜNE EKLE
app.post("/api/homepage-products", checkHomepageAdmin, async (req, res) => {
      try {
            const { product_id, section_type } = req.body;

            if (
                  !Number.isInteger(Number(product_id)) ||
                  Number(product_id) <= 0 ||
                  !["discounted", "featured"].includes(section_type)
            ) {
                  return res.status(400).json({
                        error: "Ürün veya bölüm bilgisi geçersiz."
                  });
            }

            const [products] = await db.query(
                  "SELECT p_id FROM products WHERE p_id = ? AND p_active = 1",
                  [Number(product_id)]
            );

            if (!products.length) {
                  return res.status(404).json({
                        error: "Aktif ürün bulunamadı."
                  });
            }

            const [countResult] = await db.query(
                  "SELECT COUNT(*) AS total FROM homepage_products WHERE section_type = ?",
                  [section_type]
            );

            if (Number(countResult[0].total) >= 5) {
                  return res.status(400).json({
                        error: "Bu bölümde en fazla 5 ürün olabilir."
                  });
            }

            const [result] = await db.query(
                  `INSERT INTO homepage_products
                  (product_id, section_type, display_order)
                  VALUES (?, ?, ?)`,
                  [
                        Number(product_id),
                        section_type,
                        Number(countResult[0].total) + 1
                  ]
            );

            return res.status(201).json({
                  message: "Ürün ana sayfa bölümüne eklendi.",
                  id: result.insertId
            });

      } catch (err) {
            if (err.code === "ER_DUP_ENTRY") {
                  return res.status(409).json({
                        error: "Bu ürün zaten bu bölümde bulunuyor."
                  });
            }

            console.error("Ana sayfaya ürün ekleme hatası:", err);
            return res.status(500).json({
                  error: "Ürün bölüme eklenemedi."
            });
      }
});


// ADMIN: ÜRÜNÜ YALNIZCA ANA SAYFA BÖLÜMÜNDEN KALDIR
app.delete("/api/homepage-products/:id", checkHomepageAdmin, async (req, res) => {
      try {
            const homepageId = Number(req.params.id);

            if (!Number.isInteger(homepageId) || homepageId <= 0) {
                  return res.status(400).json({
                        error: "Bölüm kayıt numarası geçersiz."
                  });
            }

            const [result] = await db.query(
                  "DELETE FROM homepage_products WHERE id = ?",
                  [homepageId]
            );

            if (result.affectedRows === 0) {
                  return res.status(404).json({
                        error: "Bölüm kaydı bulunamadı."
                  });
            }

            return res.status(200).json({
                  message: "Ürün yalnızca ana sayfa bölümünden kaldırıldı."
            });

      } catch (err) {
            console.error("Ana sayfadan ürün kaldırma hatası:", err);
            return res.status(500).json({
                  error: "Ürün bölümden kaldırılamadı."
            });
      }
});























const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Backend:http://localhost:${PORT}`));
