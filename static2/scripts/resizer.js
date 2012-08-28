$(document).ready(function() {
    
    $(".fiveStars").textfill();
     // $(".fiveStars").fontfit()
});

(function($) {
    $.fn.textfill = function(maxFontSizePx, minFontSizePx, element) {
        maxFontSizePx = parseInt(maxFontSizePx, 10);
        minFontSizePx = parseInt(minFontSizePx, 10);
        if (maxFontSizePx > 0 && minFontSizePx > maxFontSizePx) {
            minFontSizePx = maxFontSizePx;
        }
        element = typeof(element) == "string" ? element : "span";
        return this.each(function(){
            var ourText = $(element, this),
                parent = ourText.parent(),
                maxHeight = parent.height(),
                maxWidth = parent.width(),
                fontSize = parseInt(ourText.css("fontSize"), 10),
                multiplier = maxWidth/ourText.width(),
                newSize = (fontSize*(multiplier-0.1));
            if (maxFontSizePx > 0 && newSize > maxFontSizePx) {
                newSize = maxFontSizePx;
            } else if(minFontSizePx > 0 && newSize < minFontSizePx) {
                newSize = minFontSizePx;
            }
            ourText.css("fontSize",newSize);  
        }); 
    };  
})(jQuery);