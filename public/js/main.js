$(document).ready(function () {
    $(".modal").modal();
    $('#w3-table').DataTable();
    $('#coursera-table').DataTable();
    $('#medium-table').DataTable();
    $('#code-cademy-table').DataTable();
    $('#learn-table').DataTable();
    $('#videos-table').DataTable();
});

var swiper = new Swiper('.swiper-container', {
    pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true,
    },
    autoplay: {
        delay: 5000,
    }
});