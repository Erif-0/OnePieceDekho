document.addEventListener('DOMContentLoaded', function () {
    const arcs = document.querySelectorAll('.arc-card');
    const totalWatchedEl = document.getElementById('totalWatched');
    const totalEpisodesEl = document.getElementById('totalEpisodes');
    const chartCanvas = document.getElementById('progressChart');
    const watchedEpisodes = JSON.parse(localStorage.getItem('watchedEpisodes') || '{}');

    let totalWatched = 0;
    let totalEpisodes = 0;

    arcs.forEach(arc => {
        const arcSlug = arc.dataset.arcSlug;
        const episodeCount = parseInt(arc.querySelector('p').textContent.split('-')[1]);

        const watched = Object.keys(watchedEpisodes).filter(key => key.startsWith(arcSlug)).length;
        totalWatched += watched;
        totalEpisodes += episodeCount;

        arc.querySelector('button').addEventListener('click', () => {
            const lastWatched = Math.max(...Object.keys(watchedEpisodes)
                .filter(key => key.startsWith(arcSlug))
                .map(key => parseInt(key.split('-')[1])));

            window.location.href = `/arc/${arcSlug}?episode=${lastWatched || 1}`;
        });
    });

    totalWatchedEl.textContent = totalWatched;
    totalEpisodesEl.textContent = totalEpisodes;

    new Chart(chartCanvas, {
        type: 'doughnut',
        data: {
            labels: ['Watched', 'Remaining'],
            datasets: [{
                data: [totalWatched, totalEpisodes - totalWatched],
                backgroundColor: ['#FF4655', 'rgba(255, 255, 255, 0.1)']
            }]
        },
        options: {
            cutout: '75%',
            plugins: { legend: { display: false } }
        }
    });
});
