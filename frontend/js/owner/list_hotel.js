const API_BASE_URL = 'http://127.0.0.1:3000';

const PAGE_SIZE = 10;
let currentPage = 1;
let currentRatingFilter = 'all';

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
        ? (hotel.description.length > 70 ? hotel.description.slice(0, 70) + '…' : hotel.description)
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

function renderPagination(totalPages) {
    const container = document.getElementById('pagination');
    if (!container) return;

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = `<button ${currentPage === 1 ? 'disabled' : ''} data-page="prev">Trước</button>`;

    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    html += `<button ${currentPage === totalPages ? 'disabled' : ''} data-page="next">Tiếp theo</button>`;

    container.innerHTML = html;

    container.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            if (page === 'prev') currentPage -= 1;
            else if (page === 'next') currentPage += 1;
            else currentPage = parseInt(page, 10);
            loadHotels();
        });
    });
}

async function loadHotels() {
    const grid = document.getElementById('hotelGrid');
    if (!grid) return;

    grid.innerHTML = '<p>Đang tải danh sách khách sạn...</p>';

    try {
        const res = await fetch(`${API_BASE_URL}/api/hotels?limit=${PAGE_SIZE}&page=${currentPage}`);
        if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);

        const result = await res.json();
        let hotels = result.data || [];

        // Lọc theo đánh giá (client-side, vì backend hiện chưa hỗ trợ filter theo star_rating)
        if (currentRatingFilter !== 'all') {
            const minRating = parseInt(currentRatingFilter, 10);
            hotels = hotels.filter(h => h.star_rating >= minRating);
        }

        if (hotels.length === 0) {
            grid.innerHTML = '<p>Không tìm thấy khách sạn phù hợp.</p>';
            renderPagination(0);
            return;
        }

        grid.innerHTML = hotels.map(renderHotelCard).join('');

        grid.querySelectorAll('.hotel-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                window.location.href = `./hotel_detail.html?id=${id}`;
             });
        });

        renderPagination(result.totalPages || 1);

    } catch (error) {
        console.error('Không thể tải danh sách khách sạn:', error);
        grid.innerHTML = '<p>Không thể tải danh sách khách sạn. Vui lòng thử lại sau.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadHotels();

    document.getElementById('filterRating').addEventListener('change', (e) => {
        currentRatingFilter = e.target.value;
        currentPage = 1;
        loadHotels();
    });

    document.getElementById('filterPrice').addEventListener('change', () => {
        console.warn('');
    });
});