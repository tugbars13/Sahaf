// Favori Kitaplar Yönetimi
let favoriteBooks = JSON.parse(localStorage.getItem("favoriteBooks")) || [];

function toggleFavorite(bookId, button) {
  const index = favoriteBooks.indexOf(bookId);
  if (index === -1) {
    favoriteBooks.push(bookId);
    button.classList.add("active");
    showNotification("Kitap favorilere eklendi!");
  } else {
    favoriteBooks.splice(index, 1);
    button.classList.remove("active");
    showNotification("Kitap favorilerden çıkarıldı!");
  }
  localStorage.setItem("favoriteBooks", JSON.stringify(favoriteBooks));
  updateFavoriteCount();
}

// Bildirim Sistemi
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Favori Sayısı Güncelleme
function updateFavoriteCount() {
  const favoriteCount = document.querySelector(".favorite-count");
  if (favoriteCount) {
    favoriteCount.textContent = favoriteBooks.length;
  }
}

// Sepet Yönetimi
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(bookId, title, price) {
  const existingItem = cart.find((item) => item.id === bookId);
  if (existingItem) {
    showNotification("Bu kitap zaten sepetinizde!", "warning");
    return;
  }

  cart.push({ id: bookId, title, price, quantity: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showNotification("Kitap sepete eklendi!");
}

function updateCartCount() {
  const cartCount = document.querySelector(".cart-count");
  if (cartCount) {
    cartCount.textContent = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }
}

// Sayfa Yüklendiğinde
document.addEventListener("DOMContentLoaded", () => {
  // Favori butonlarını güncelle
  const favoriteButtons = document.querySelectorAll(".favorite-btn");
  favoriteButtons.forEach((button) => {
    const bookId = button.dataset.bookId;
    if (favoriteBooks.includes(bookId)) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => toggleFavorite(bookId, button));
  });

  // Sepet sayısını güncelle
  updateCartCount();
  updateFavoriteCount();

  // Satın al butonlarını güncelle
  const buyButtons = document.querySelectorAll(".buy-btn");
  buyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const bookId = button.dataset.bookId;
      const title = button.dataset.title;
      const price = button.dataset.price;
      addToCart(bookId, title, price);
    });
  });

  // Takas butonlarını güncelle
  const exchangeButtons = document.querySelectorAll(".exchange-btn");
  exchangeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const bookId = button.dataset.bookId;
      showExchangeModal(bookId);
    });
  });

  // Arama fonksiyonunu güncelle
  const searchForm = document.querySelector(".search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const searchInput = searchForm.querySelector("input");
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `explore.html?search=${encodeURIComponent(
          query
        )}`;
      }
    });
  }

  // Filtreleri güncelle
  const filterForm = document.querySelector(".filters-form");
  if (filterForm) {
    filterForm.addEventListener("change", () => {
      const formData = new FormData(filterForm);
      const params = new URLSearchParams(formData);
      window.location.href = `explore.html?${params.toString()}`;
    });
  }
});

// Takas Modalı
function showExchangeModal(bookId) {
  const modal = document.createElement("div");
  modal.className = "exchange-modal";
  modal.innerHTML = `
        <div class="modal-content">
            <h3>Takas Teklifi Gönder</h3>
            <form id="exchangeForm">
                <div class="form-group">
                    <label>Teklif Edeceğiniz Kitap</label>
                    <input type="text" required placeholder="Kitap adı">
                </div>
                <div class="form-group">
                    <label>Kitabın Durumu</label>
                    <select required>
                        <option value="">Seçiniz</option>
                        <option value="new">Yeni</option>
                        <option value="like-new">Az Kullanılmış</option>
                        <option value="used">İkinci El</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Mesajınız</label>
                    <textarea required placeholder="Satıcıya iletmek istediğiniz mesaj..."></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="cancel-btn">İptal</button>
                    <button type="submit" class="submit-btn">Teklif Gönder</button>
                </div>
            </form>
        </div>
    `;

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add("show"), 100);

  // Modal kapatma
  const cancelBtn = modal.querySelector(".cancel-btn");
  cancelBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    setTimeout(() => modal.remove(), 300);
  });

  // Form gönderme
  const form = modal.querySelector("#exchangeForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showNotification("Takas teklifiniz gönderildi!");
    modal.classList.remove("show");
    setTimeout(() => modal.remove(), 300);
  });
}

// URL parametrelerini işle
function handleUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const search = params.get("search");
  const category = params.get("category");
  const priceMin = params.get("priceMin");
  const priceMax = params.get("priceMax");
  const location = params.get("location");
  const type = params.get("type");

  // Arama sonuçlarını filtrele
  if (search) {
    const searchInput = document.querySelector(".search-input");
    if (searchInput) {
      searchInput.value = search;
    }
    filterBooks(search);
  }

  // Filtreleri uygula
  if (category) {
    const categoryCheckbox = document.querySelector(
      `input[name="category"][value="${category}"]`
    );
    if (categoryCheckbox) {
      categoryCheckbox.checked = true;
    }
  }

  if (priceMin) {
    const priceMinInput = document.querySelector('input[name="priceMin"]');
    if (priceMinInput) {
      priceMinInput.value = priceMin;
    }
  }

  if (priceMax) {
    const priceMaxInput = document.querySelector('input[name="priceMax"]');
    if (priceMaxInput) {
      priceMaxInput.value = priceMax;
    }
  }

  if (location) {
    const locationInput = document.querySelector('input[name="location"]');
    if (locationInput) {
      locationInput.value = location;
    }
  }

  if (type) {
    const typeRadio = document.querySelector(
      `input[name="type"][value="${type}"]`
    );
    if (typeRadio) {
      typeRadio.checked = true;
    }
  }
}

// Kitapları filtrele
function filterBooks(search) {
  const books = document.querySelectorAll(".book-card");
  const searchLower = search.toLowerCase();

  books.forEach((book) => {
    const title = book.querySelector("h3").textContent.toLowerCase();
    const author = book.querySelector(".author").textContent.toLowerCase();

    if (title.includes(searchLower) || author.includes(searchLower)) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  });
}

// Sayfa yüklendiğinde URL parametrelerini işle
document.addEventListener("DOMContentLoaded", handleUrlParams);

// Giriş/Kayıt Modal Fonksiyonları
function showLoginModal() {
  const modal = document.getElementById("loginModal");
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeLoginModal() {
  const modal = document.getElementById("loginModal");
  modal.classList.remove("show");
  document.body.style.overflow = "";
}

function showRegisterModal() {
  const modal = document.getElementById("registerModal");
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeRegisterModal() {
  const modal = document.getElementById("registerModal");
  modal.classList.remove("show");
  document.body.style.overflow = "";
}

// Modal dışına tıklandığında kapatma
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.classList.remove("show");
    document.body.style.overflow = "";
  }
});

// ESC tuşu ile modal kapatma
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      modal.classList.remove("show");
    });
    document.body.style.overflow = "";
  }
});

// Form gönderimi
document.querySelector(".login-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.querySelector(".remember-me input").checked;

  // Burada giriş işlemleri yapılacak
  console.log("Giriş yapılıyor:", { email, password, rememberMe });
  showNotification("Giriş başarılı!", "success");
  closeLoginModal();
});

document.querySelector(".register-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    showNotification("Şifreler eşleşmiyor!", "error");
    return;
  }

  // Burada kayıt işlemleri yapılacak
  console.log("Kayıt yapılıyor:", { name, email, password });
  showNotification("Kayıt başarılı!", "success");
  closeRegisterModal();
});

// Sosyal medya girişi
document.querySelector(".google-btn")?.addEventListener("click", () => {
  // Google girişi işlemleri
  console.log("Google ile giriş yapılıyor...");
});

document.querySelector(".facebook-btn")?.addEventListener("click", () => {
  // Facebook girişi işlemleri
  console.log("Facebook ile giriş yapılıyor...");
});
