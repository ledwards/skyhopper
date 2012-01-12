var Skyhopper = {
};

(function($) {
  $(document).ready(function(){
    $(".card").draggable({
      start: function(event, ui) {
                $(this).css('cursor', 'move');
                $(".ui-draggable").css('z-index', 0);
                $(this).css('z-index', 1);
              },

      stop: function(event, ui) {
              $(this).css('cursor', 'default');
            }
    });
  });
})(jQuery);
