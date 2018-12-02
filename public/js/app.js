$(document).ready(function () {
    $('#w3-table').DataTable();
    $('#coursera-table').DataTable();
    $('#medium-table').DataTable();
});

var swiper = new Swiper('.swiper-container', {
    pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true,
    },
    autoplay: {
        delay: 4000,
    }
});