const API_BASE_URL = 'http://127.0.0.1:3000';

const urlParams = new URLSearchParams(window.location.search);
const hotelId = urlParams.get('id');

let hotelImages = [];     
let currentImageIndex = 0; 

function buildHotelImageUrl(fileName) {
    if (!fileName) {
        return 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=75';
    }
    return fileName.startsWith('http')
        ? fileName
        : `${API_BASE_URL}/uploads/hotels/${fileName}`;
}

/* ================= GALLERY ẢNH LỚN GIỮA ================= */

function renderGallery() {
    const mainImageEl = document.getElementById('galleryMainImage');
    const dotsEl = document.getElementById('galleryDots');

    if (!mainImageEl) return;

    if (hotelImages.length === 0) {
        mainImageEl.style.backgroundImage = `url('${buildHotelImageUrl(null)}')`;
        dotsEl.innerHTML = '';
        return;
    }

    mainImageEl.style.backgroundImage = `url('${buildHotelImageUrl(hotelImages[currentImageIndex].image_url)}')`;

    dotsEl.innerHTML = hotelImages.map((_, i) =>
        `<span class="dot ${i === currentImageIndex ? 'active' : ''}" data-index="${i}"></span>`
    ).join('');

    dotsEl.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', () => {
            currentImageIndex = parseInt(dot.dataset.index, 10);
            renderGallery();
        });
    });
}

function goToPrevImage() {
    if (hotelImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + hotelImages.length) % hotelImages.length;
    renderGallery();
}

function goToNextImage() {
    if (hotelImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % hotelImages.length;
    renderGallery();
}

/* ================= MÔ TẢ ================= */

function renderDescription(hotel) {
    document.getElementById('hotelHeading').textContent = `${hotel.name}`;
    document.getElementById('hotelName').textContent = hotel.name;
    document.getElementById('hotelDesc').textContent = hotel.description || 'Chưa có mô tả cho khách sạn này.';
}

/* ================= TIỆN NGHI ================= */

function renderAmenities(amenities = []) {
    const list = document.getElementById('amenitiesList');

    if (amenities.length === 0) {
        list.innerHTML = '<li>Chưa cập nhật tiện nghi.</li>';
        return;
    }

    list.innerHTML = amenities.map(a => `
        <li>
            <i class="${a.icon || 'fa-solid fa-check'}"></i>
            ${a.name}
        </li>
    `).join('');
}

/* ================= BẢN ĐỒ THEO ADDRESS ================= */

function renderMap(hotel) {
    const frame = document.getElementById('hotelMapFrame');
    const link = document.getElementById('hotelMapLink');

    const fullAddress = [hotel.address, hotel.city, hotel.country]
        .filter(Boolean)
        .join(', ');

    if (!fullAddress) {
        frame.src = '';
        link.href = '#';
        return;
    }

    const query = encodeURIComponent(fullAddress);
    frame.src = `https://www.google.com/maps?q=${query}&output=embed`;
    link.href = `https://www.google.com/maps?q=${query}`;
}

/* ================= LỰA CHỌN PHÒNG ================= */

function buildRoomImageUrl(fileName) {
    if (!fileName) {
        return 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=75';
    }
    return fileName.startsWith('http')
        ? fileName
        : `${API_BASE_URL}/uploads/rooms/${fileName}`;
}

function renderRooms(rooms = []) {
    const grid = document.getElementById('roomGrid');

    if (rooms.length === 0) {
        grid.innerHTML = '<p>Khách sạn hiện chưa có phòng nào.</p>';
        return;
    }

    grid.innerHTML = rooms.map(room => {
        const price = Number(room.price || 0).toLocaleString('vi-VN');
        const sizeInfo = room.area ? `${room.area}m²` : '';
        const bedInfo = room.bed_count ? `${room.bed_count} giường` : '';
        const capacityInfo = room.capacity ? `Tối đa ${room.capacity} khách` : '';

        const firstImage = room.RoomImages && room.RoomImages.length > 0
            ? room.RoomImages[0].image_url
            : null;
        const imageUrl = buildRoomImageUrl(firstImage);

        return `
            <div class="room-card" data-room-id="${room.id}">
                <div class="room-card-img" style="background-image:url('${imageUrl}')"></div>
                <div class="room-card-body">
                    <h4 class="room-name">${room.name}</h4>
                    <ul class="room-info">
                        ${sizeInfo ? `<li>${sizeInfo}</li>` : ''}
                        ${bedInfo ? `<li>${bedInfo}</li>` : ''}
                        ${capacityInfo ? `<li>${capacityInfo}</li>` : ''}
                    </ul>
                    <div class="room-price">${price} VND<span>/đêm</span></div>
                    <div class="room-actions">
                        <button class="btn btn-outline" data-action="view" data-room-id="${room.id}">Xem thêm</button>
                        <button class="btn btn-primary" data-action="add" data-room-id="${room.id}">Thêm vào giỏ</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/* ================= ĐÁNH GIÁ ================= */

function renderReviews(reviews = []) {
    const listEl = document.getElementById('reviewList');
    const averageEl = document.getElementById('reviewAverage');

    if (reviews.length === 0) {
        averageEl.innerHTML = 'Chưa có đánh giá';
        listEl.innerHTML = '';
        return;
    }

    const avgRating = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length;
    const fullStars = Math.round(avgRating);
    averageEl.innerHTML = Array.from({ length: 5 }, (_, i) =>
        `<i class="fa-solid fa-star" style="opacity:${i < fullStars ? 1 : 0.3}"></i>`
    ).join('');

    // Lưu ý: model Review hiện chưa join sang User trong getHotelById,
    // nên tạm hiển thị "Khách hàng" — cần include { model: db.User } ở backend
    // nếu muốn hiện tên thật và avatar của người đánh giá.
    listEl.innerHTML = reviews.map(review => `
        <li class="review-item">
            <div class="review-avatar" style="background-color:#1c2b3a;"></div>
            <div class="review-content">
                <div class="review-head">
                    <span class="review-name">${review.User?.full_name || 'Khách hàng'}</span>
                    <span class="review-score">${review.rating}<i class="fa-solid fa-star"></i></span>
                </div>
                <p class="review-text">${review.comment || ''}</p>
            </div>
        </li>
    `).join('');
}

/* ================= BOX ĐẶT PHÒNG (chỉ UI, chưa nối logic tính tiền) ================= */

function renderBookingOptions() {
    const guestSelect = document.getElementById('guestCount');
    guestSelect.innerHTML = [1, 2, 3, 4, 5, 6].map(n =>
        `<option value="${n}">${n} khách</option>`
    ).join('');

    document.getElementById('breakfastOption').innerHTML = `
        <option value="yes">Có bao gồm bữa sáng?</option>
        <option value="no">Không bao gồm bữa sáng</option>
    `;

    document.getElementById('transferOption').innerHTML = `
        <option value="yes">Có dịch vụ đưa đón?</option>
        <option value="no">Không dịch vụ đưa đón</option>
    `;
}

/* ================= LOAD DỮ LIỆU KHÁCH SẠN ================= */

async function loadHotelDetail() {
    if (!hotelId) {
        console.error('Thiếu tham số id trên URL (?id=...)');
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
        if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);

        const result = await res.json();
        const hotel = result.data;

        if (!hotel) {
            document.getElementById('hotelHeading').textContent = 'Không tìm thấy khách sạn';
            return;
        }

        hotelImages = hotel.HotelImages || [];
        currentImageIndex = 0;

        renderDescription(hotel);
        renderGallery();
        renderAmenities(hotel.Amenities);
        renderMap(hotel);
        renderRooms(hotel.Rooms);
        renderReviews(hotel.Reviews);

    } catch (error) {
        console.error('Không thể tải thông tin khách sạn:', error);
        document.getElementById('hotelHeading').textContent = 'Không thể tải thông tin khách sạn';
    }
}

/* ================= GẮN SỰ KIỆN ================= */

document.addEventListener('DOMContentLoaded', () => {
    renderBookingOptions();
    loadHotelDetail();

    document.getElementById('galleryPrev').addEventListener('click', goToPrevImage);
    document.getElementById('galleryNext').addEventListener('click', goToNextImage);

    document.getElementById('checkoutBtn').addEventListener('click', () => {
        console.warn('Chưa nối API thanh toán — cần endpoint tạo booking + payment.');
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        window.history.back();
    });
});