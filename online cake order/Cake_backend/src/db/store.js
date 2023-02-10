$("#drop").on('change', function() {
    var value = $(this).val();
    if (value) {
      $(".page").hide();
      $("#Page" + value).show();
    }
  });