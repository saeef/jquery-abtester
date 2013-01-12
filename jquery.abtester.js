(function($){
    $.fn.abtester = function(config){
      var currentPattern;
      var now = new Date();
      if(now >= config.period.start && now <= config.period.end){
        var cookieVal = $.cookie(config.cookieName);
        if(cookieVal){
         currentPattern = cookieVal;
        }else{
          var totalProb = 0;
          var propValues = {};
          $.each(config.patterns, function(patternKey, patternOption){
            propValues[patternKey] = {};
            propValues[patternKey].min = totalProb;
            totalProb += patternOption.probability;
            propValues[patternKey].max = totalProb;
          });
          if(totalProb > 0){
            var randVal = Math.random() * totalProb;
            $.each(propValues, function(patternKey, patternMinMax){
              if(randVal >= patternMinMax.min && randVal < patternMinMax.max) {
                currentPattern = patternKey;
                $.cookie(config.cookieName, currentPattern, config.cookieOption);
              }
            });
          }
        }
      }else{
        currentPattern = config.period.outsidePattern;
      }
      $('.abtest').each(function(){
        var targetPatterns = $(this).attr('data-abtest').split(',');
        var matched = false;
        for(var i=0; i < targetPatterns.length; i++){
          if(targetPatterns[i].replace(/^\s+|\s+$/g, '') === currentPattern){
            matched = true;
            $(this).show();
          }
        }
        if(!matched){
          $(this).remove();
        }
      });
      if(config.patterns[currentPattern]){
        config.patterns[currentPattern].callback($(this));
      }
      return $(this);
    };
})(jQuery);
