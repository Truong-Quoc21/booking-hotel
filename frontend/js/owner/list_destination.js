const API_BASE_URL = 'http://127.0.0.1:3000';

const PAGE_SIZE = 10;
let currentPage = 1;
let currentCityFilter = 'all';

const knownCities = new Set();

function buildDestinationImageUrl(destination) {
    if (!destination.thumbnail) {
        return 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=70';
    }
    return destination.thumbnail.startsWith('http')
        ? destination.thumbnail
        : `${API_BASE_URL}/uploads/destinations/${destination.thumbnail}`;
}

function renderDestinationCard(destination) {
    const description = destination.description
        ? (destination.description.length > 70 ? destination.description.slice(0, 70) + '…' : destination.description)
        : '';
    const location = [destination.city, destination.country].filter(Boolean).join(', ');

    return `
        <div class="destination-card" data-id="${destination.id}">
            <div class="thumb" style="background-image:url('${buildDestinationImageUrl(destination)}')">
                <div class="stars"><i class="fa-solid fa-location-dot fa-xs"></i> ${destination.city || '—'}</div>
            </div>
            <div class="card-body">
                <div class="dname">${destination.name}</div>
                <div class="dlocation">${location}</div>
                <div class="ddesc">${description}</div>
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
            loadDestinations();
        });
    });
}

function populateCityFilter(destinations) {
    const select = document.getElementById('filterRegion');
    if (!select) return;

    let hasNewCity = false;
    destinations.forEach(d => {
        if (d.city && !knownCities.has(d.city)) {
            knownCities.add(d.city);
            hasNewCity = true;
        }
    });

    if (!hasNewCity) return;

    const currentValue = select.value;
    const sortedCities = Array.from(knownCities).sort((a, b) => a.localeCompare(b, 'vi'));

    select.innerHTML = `
        <option value="all">Tất cả</option>
        ${sortedCities.map(city => `<option value="${city}">${city}</option>`).join('')}
    `;
    select.value = currentValue || 'all';
}

async function loadDestinations() {
    const grid = document.getElementById('destinationGrid');
    if (!grid) return;

    grid.innerHTML = '<p>Đang tải danh sách địa điểm...</p>';

    try {
        const params = new URLSearchParams({
            limit: PAGE_SIZE,
            page: currentPage
        });

        if (currentCityFilter !== 'all') {
            params.set('search', currentCityFilter);
        }

        const res = await fetch(`${API_BASE_URL}/api/destinations?${params.toString()}`);
        if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);

        const result = await res.json();
        const destinations = result.data || [];

        populateCityFilter(destinations);

        if (destinations.length === 0) {
            grid.innerHTML = '<p>Không tìm thấy địa điểm phù hợp.</p>';
            renderPagination(0);
            return;
        }

        grid.innerHTML = destinations.map(renderDestinationCard).join('');

        grid.querySelectorAll('.destination-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                window.location.href = `./destination_detail.html?id=${id}`;
            });
        });

        renderPagination(result.totalPages || 1);

    } catch (error) {
        console.error('Không thể tải danh sách địa điểm:', error);
        grid.innerHTML = '<p>Không thể tải danh sách địa điểm. Vui lòng thử lại sau.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadDestinations();

    document.getElementById('filterRegion').addEventListener('change', (e) => {
        currentCityFilter = e.target.value;
        currentPage = 1;
        loadDestinations();
    });
});