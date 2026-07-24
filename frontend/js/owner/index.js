const API_BASE_URL = 'http://127.0.0.1:3000';

/* ============ ĐỊA ĐIỂM PHỔ BIẾN ============ */

function buildDestinationImageUrl(dest) {
    if (!dest.thumbnail) {
        return 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=70';
    }
    return dest.thumbnail.startsWith('http')
        ? dest.thumbnail
        : `${API_BASE_URL}/uploads/destinations/${dest.thumbnail}`;
}

function renderDestinationCard(dest) {
    const location = [dest.city, dest.country].filter(Boolean).join(', ');
    const description = dest.description
        ? (dest.description.length > 90 ? dest.description.slice(0, 90) + '…' : dest.description)
        : '';

    return `
        <div class="dest-card" data-id="${dest.id}">
            <div class="thumb" style="background-image:url('${buildDestinationImageUrl(dest)}')">
                <div class="dinfo">
                    <div class="dname">${dest.name}</div>
                    <div class="dmeta"><i class="fa-solid fa-location-dot fa-xs"></i> ${location}</div>
                    <div class="ddesc">${description}</div>
                </div>
            </div>
        </div>
    `;
}

async function loadPopularDestinations() {
    const container = document.getElementById('dests');
    if (!container) return;

    try {
        const res = await fetch(`${API_BASE_URL}/api/destinations?limit=10`);
        if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);

        const result = await res.json();
        const destinations = result.data || [];

        if (destinations.length === 0) {
            container.innerHTML = '<p>Chưa có địa điểm nào để hiển thị.</p>';
            return;
        }

        container.innerHTML = destinations.map(renderDestinationCard).join('');

        container.querySelectorAll('.dest-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                window.location.href = `destination_detail.html?id=${id}`;
            });
        });

    } catch (error) {
        console.error('Không thể tải danh sách địa điểm:', error);
        container.innerHTML = '<p>Không thể tải danh sách địa điểm. Vui lòng thử lại sau.</p>';
    }
}

/* ============ KHÁCH SẠN NỔI BẬT ============ */

function buildHotelImageUrl(hotel) {
    if (!hotel.thumbnail) {
        return 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=70';
    }
    return hotel.thumbnail.startsWith('http')
        ? hotel.thumbnail
        : `${API_BASE_URL}/uploads/hotels/${hotel.thumbnail}`;
}

function renderHotelCard(hotel) {
    const description = hotel.description
        ? (hotel.description.length > 90 ? hotel.description.slice(0, 90) + '…' : hotel.description)
        : '';
    const rating = hotel.star_rating ? hotel.star_rating.toFixed(1) : '—';

    return `
        <div class="hotel-card" data-id="${hotel.id}">
            <div class="thumb" style="background-image:url('${buildHotelImageUrl(hotel)}')">
                <div class="stars"><i class="fa-solid fa-star fa-xs"></i> ${rating}</div>
            </div>
            <div class="card-body">
                <div class="hname">${hotel.name}</div>
                <div class="hdesc">${description}</div>
            </div>
        </div>
    `;
}

async function loadFeaturedHotels() {
    const container = document.getElementById('hotels');
    if (!container) return;

    try {
        const res = await fetch(`${API_BASE_URL}/api/hotels?limit=10`);
        if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);

        const result = await res.json();
        const hotels = result.data || [];

        if (hotels.length === 0) {
            container.innerHTML = '<p>Chưa có khách sạn nào để hiển thị.</p>';
            return;
        }

        container.innerHTML = hotels.map(renderHotelCard).join('');

        container.querySelectorAll('.hotel-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                window.location.href = `hotel_detail.html?id=${id}`;
            });
        });

    } catch (error) {
        console.error('Không thể tải danh sách khách sạn:', error);
        container.innerHTML = '<p>Không thể tải danh sách khách sạn. Vui lòng thử lại sau.</p>';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    loadPopularDestinations();
    loadFeaturedHotels();
});