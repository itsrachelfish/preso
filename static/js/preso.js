var socket;
var average;
var offsets = [];

/**
 * StyleFix 1.0.3 & PrefixFree 1.0.7
 * @author Lea Verou
 * MIT license
 */
(function(){function t(e,t){return[].slice.call((t||document).querySelectorAll(e))}if(!window.addEventListener)return;var e=window.StyleFix={link:function(t){try{if(t.rel!=="stylesheet"||t.hasAttribute("data-noprefix"))return}catch(n){return}var r=t.href||t.getAttribute("data-href"),i=r.replace(/[^\/]+$/,""),s=(/^[a-z]{3,10}:/.exec(i)||[""])[0],o=(/^[a-z]{3,10}:\/\/[^\/]+/.exec(i)||[""])[0],u=/^([^?]*)\??/.exec(r)[1],a=t.parentNode,f=new XMLHttpRequest,l;f.onreadystatechange=function(){f.readyState===4&&l()};l=function(){var n=f.responseText;if(n&&t.parentNode&&(!f.status||f.status<400||f.status>600)){n=e.fix(n,!0,t);if(i){n=n.replace(/url\(\s*?((?:"|')?)(.+?)\1\s*?\)/gi,function(e,t,n){return/^([a-z]{3,10}:|#)/i.test(n)?e:/^\/\//.test(n)?'url("'+s+n+'")':/^\//.test(n)?'url("'+o+n+'")':/^\?/.test(n)?'url("'+u+n+'")':'url("'+i+n+'")'});var r=i.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g,"\\$1");n=n.replace(RegExp("\\b(behavior:\\s*?url\\('?\"?)"+r,"gi"),"$1")}var l=document.createElement("style");l.textContent=n;l.media=t.media;l.disabled=t.disabled;l.setAttribute("data-href",t.getAttribute("href"));a.insertBefore(l,t);a.removeChild(t);l.media=t.media}};try{f.open("GET",r);f.send(null)}catch(n){if(typeof XDomainRequest!="undefined"){f=new XDomainRequest;f.onerror=f.onprogress=function(){};f.onload=l;f.open("GET",r);f.send(null)}}t.setAttribute("data-inprogress","")},styleElement:function(t){if(t.hasAttribute("data-noprefix"))return;var n=t.disabled;t.textContent=e.fix(t.textContent,!0,t);t.disabled=n},styleAttribute:function(t){var n=t.getAttribute("style");n=e.fix(n,!1,t);t.setAttribute("style",n)},process:function(){t('link[rel="stylesheet"]:not([data-inprogress])').forEach(StyleFix.link);t("style").forEach(StyleFix.styleElement);t("[style]").forEach(StyleFix.styleAttribute)},register:function(t,n){(e.fixers=e.fixers||[]).splice(n===undefined?e.fixers.length:n,0,t)},fix:function(t,n,r){for(var i=0;i<e.fixers.length;i++)t=e.fixers[i](t,n,r)||t;return t},camelCase:function(e){return e.replace(/-([a-z])/g,function(e,t){return t.toUpperCase()}).replace("-","")},deCamelCase:function(e){return e.replace(/[A-Z]/g,function(e){return"-"+e.toLowerCase()})}};(function(){setTimeout(function(){t('link[rel="stylesheet"]').forEach(StyleFix.link)},10);document.addEventListener("DOMContentLoaded",StyleFix.process,!1)})()})();(function(e){function t(e,t,r,i,s){e=n[e];if(e.length){var o=RegExp(t+"("+e.join("|")+")"+r,"gi");s=s.replace(o,i)}return s}if(!window.StyleFix||!window.getComputedStyle)return;var n=window.PrefixFree={prefixCSS:function(e,r,i){var s=n.prefix;n.functions.indexOf("linear-gradient")>-1&&(e=e.replace(/(\s|:|,)(repeating-)?linear-gradient\(\s*(-?\d*\.?\d*)deg/ig,function(e,t,n,r){return t+(n||"")+"linear-gradient("+(90-r)+"deg"}));e=t("functions","(\\s|:|,)","\\s*\\(","$1"+s+"$2(",e);e=t("keywords","(\\s|:)","(\\s|;|\\}|$)","$1"+s+"$2$3",e);e=t("properties","(^|\\{|\\s|;)","\\s*:","$1"+s+"$2:",e);if(n.properties.length){var o=RegExp("\\b("+n.properties.join("|")+")(?!:)","gi");e=t("valueProperties","\\b",":(.+?);",function(e){return e.replace(o,s+"$1")},e)}if(r){e=t("selectors","","\\b",n.prefixSelector,e);e=t("atrules","@","\\b","@"+s+"$1",e)}e=e.replace(RegExp("-"+s,"g"),"-");e=e.replace(/-\*-(?=[a-z]+)/gi,n.prefix);return e},property:function(e){return(n.properties.indexOf(e)?n.prefix:"")+e},value:function(e,r){e=t("functions","(^|\\s|,)","\\s*\\(","$1"+n.prefix+"$2(",e);e=t("keywords","(^|\\s)","(\\s|$)","$1"+n.prefix+"$2$3",e);return e},prefixSelector:function(e){return e.replace(/^:{1,2}/,function(e){return e+n.prefix})},prefixProperty:function(e,t){var r=n.prefix+e;return t?StyleFix.camelCase(r):r}};(function(){var e={},t=[],r={},i=getComputedStyle(document.documentElement,null),s=document.createElement("div").style,o=function(n){if(n.charAt(0)==="-"){t.push(n);var r=n.split("-"),i=r[1];e[i]=++e[i]||1;while(r.length>3){r.pop();var s=r.join("-");u(s)&&t.indexOf(s)===-1&&t.push(s)}}},u=function(e){return StyleFix.camelCase(e)in s};if(i.length>0)for(var a=0;a<i.length;a++)o(i[a]);else for(var f in i)o(StyleFix.deCamelCase(f));var l={uses:0};for(var c in e){var h=e[c];l.uses<h&&(l={prefix:c,uses:h})}n.prefix="-"+l.prefix+"-";n.Prefix=StyleFix.camelCase(n.prefix);n.properties=[];for(var a=0;a<t.length;a++){var f=t[a];if(f.indexOf(n.prefix)===0){var p=f.slice(n.prefix.length);u(p)||n.properties.push(p)}}n.Prefix=="Ms"&&!("transform"in s)&&!("MsTransform"in s)&&"msTransform"in s&&n.properties.push("transform","transform-origin");n.properties.sort()})();(function(){function i(e,t){r[t]="";r[t]=e;return!!r[t]}var e={"linear-gradient":{property:"backgroundImage",params:"red, teal"},calc:{property:"width",params:"1px + 5%"},element:{property:"backgroundImage",params:"#foo"},"cross-fade":{property:"backgroundImage",params:"url(a.png), url(b.png), 50%"}};e["repeating-linear-gradient"]=e["repeating-radial-gradient"]=e["radial-gradient"]=e["linear-gradient"];var t={initial:"color","zoom-in":"cursor","zoom-out":"cursor",box:"display",flexbox:"display","inline-flexbox":"display",flex:"display","inline-flex":"display",grid:"display","inline-grid":"display","min-content":"width"};n.functions=[];n.keywords=[];var r=document.createElement("div").style;for(var s in e){var o=e[s],u=o.property,a=s+"("+o.params+")";!i(a,u)&&i(n.prefix+a,u)&&n.functions.push(s)}for(var f in t){var u=t[f];!i(f,u)&&i(n.prefix+f,u)&&n.keywords.push(f)}})();(function(){function s(e){i.textContent=e+"{}";return!!i.sheet.cssRules.length}var t={":read-only":null,":read-write":null,":any-link":null,"::selection":null},r={keyframes:"name",viewport:null,document:'regexp(".")'};n.selectors=[];n.atrules=[];var i=e.appendChild(document.createElement("style"));for(var o in t){var u=o+(t[o]?"("+t[o]+")":"");!s(u)&&s(n.prefixSelector(u))&&n.selectors.push(o)}for(var a in r){var u=a+" "+(r[a]||"");!s("@"+u)&&s("@"+n.prefix+u)&&n.atrules.push(a)}e.removeChild(i)})();n.valueProperties=["transition","transition-property"];e.className+=" "+n.prefix;StyleFix.register(n.prefixCSS)})(document.documentElement);

$(document).ready(function()
{
    $('.splash').on('click', function()
    {
        $('.magic audio').get(0).play();
        $('.magic audio').get(0).pause();
        $('.splash').fadeOut();
    });
    
    socket = io.connect(window.location.hostname + ':1337');

    socket.on('time', function(time)
    {
        var clientTime = new Date().getTime();
        average = time.serverTime - clientTime;
        offsets.push(average);
    });

    socket.on('debug', function(output)
    {
        console.log(output);
    });

    socket.on('abort', function()
    {
        $('.magic audio').get(0).pause();
        $('.magic audio').get(0).currentTime = 0;
    });

    socket.on('status', function(status)
    {
        $('.footer .status a').text(status.message);
    });
       
    socket.on('users', function(users)
    {
        $('.footer .users a').text('Users: '+users.count);
    });

    socket.on('ping', function(ping)
    {
        if(typeof ping.last != "undefined")
        {
            $('.footer .ping a').text('Ping: '+ping.last.toFixed(1)+'ms');
        }

        var clientTime = new Date().getTime();
        offsets.unshift(ping.ping - clientTime);
        offsets = offsets.slice(0, 10);

        var total = 0;
        for(var i = 0; i < offsets.length; i++)
        {
            total += offsets[i];
        }

        average = total / offsets.length;
        
        ping.pong = new Date().getTime();
        socket.emit('pong', ping);
    });

    socket.on('slide', function(slide)
    {
        var date = new Date();
        date.setTime(date.getTime() + average);

        var timeout = slide.time - date.getTime();
        if(timeout < 0) timeout = 0;
        
        setTimeout(function()
        {
            $('.slide').each(function()
            {
                if($(this).index('.slide') <= slide.number)
                {
                    if($(this).prop('tagName').toLowerCase() == "article")
                    {
                        var aIndex = $(this).index("article.slide");
                        var sIndex = $("article.slide").eq(aIndex+1).index('.slide');

                        if(sIndex >= slide.number || sIndex == -1)
                        {
                            $(this).siblings().hide().removeClass('slide-show').addClass('slide-hide');
                            $(this).stop().fadeIn().removeClass('slide-hide').addClass('slide-show');
                        }
                    }
                    else
                    {
                        if($(this).find('svg').length && $(this).hasClass('slide-hide'))
                        {
                            var cascade = 100;

                            $(this).find('path').each(function()
                            {
                                $(this).css({opacity: 0}).delay(cascade).animate({opacity: 1});
                                cascade += 25;
                            });
                        }

                        $(this).fadeIn().removeClass('slide-hide').addClass('slide-show');
                    }
                }
                else
                {
                    $(this).fadeOut().removeClass('slide-show').addClass('slide-hide');
                }
            });

            if($('.magic').index('.slide') == slide.number + 1)
            {
                socket.emit('incoming-magic');
            }
            else if($('.magic').index('.slide') == slide.number)
            {
                $('.magic audio').get(0).volume = 1;
                $('.magic audio').get(0).play();
                //document.getElementById('magic').play();
            }
            else if($('.magic').index('.slide') == slide.number - 1)
            {
                $('.magic audio').animate({volume: 0.2}, 5000);
            }
            else if($('.magic').index('.slide') >= slide.number)
            {
                $('.magic audio').get(0).pause();
                $('.magic audio').get(0).currentTime = 0;
            }

            $(window).trigger('resize');
        }, timeout);
    });

    socket.on('show', function(show)
    {
        $(show.selector).fadeIn();
    });

    var viewport = {width: 0, height: 0};

    // Fun UI stuff
    $(window).on('resize', function()
    {
        $('body').width(window.innerWidth);
        $('body').height(window.innerHeight);

        $('.slides').height($('body').height() - $('nav').height());
        $('.title-box').height($('body').height() - $('nav').height());

        $('.slide-wrap').each(function()
        {
            if(!$(this).hasClass('title-box'))
                $(this).removeAttr('style');
            
            if($(this).height() < $(this).find('.slide-inner').height())
            {
                var fontSize = parseInt($(this).css('font-size'));
                for(var size = fontSize; size > 0; size--)
                {
                    $(this).css('font-size', size);

                     if($(this).height() > $(this).find('.slide-inner').height())
                        break;
                } 
            }
        });
        
        $('.title svg').css({
            left: $('.slides').width() / 2 - $('.title svg').width() / 2,
            top: $('.slides').height() / 2 - $('.title svg').height() / 2
        });

        viewport.width = window.innerWidth;
        viewport.height = window.innerHeight;
    });

    $(window).trigger('resize');

    $('body').on('click', '.next', function()
    {
        socket.emit('action', {name: 'next'});
    });

    $('body').on('click', '.prev', function()
    {
        socket.emit('action', {name: 'previous'});
    });
    
    var titleInterval = setInterval(function()
    {
        var first = $('title').text().substr(0, 1);
        var title = $('title').text().substr(1);

        $('title').html(title + first);

        if(window.innerWidth != viewport.width || window.innerHeight != viewport.height)
            $(window).trigger('resize');
    }, 220);
});
