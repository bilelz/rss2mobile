var myScroll;
var carousselNbItems = 7;
var paramCaroussel = "&caroussel=";

function loaded() {
	myScroll = new iScroll('wrapper', {
		snap: true,
		momentum: false,
		hScrollbar: false,
		onScrollEnd: function () {
			document.querySelector('#indicator > li.active').className = '';
			document.querySelector('#indicator > li:nth-child(' + (this.currPageX+1) + ')').className = 'active';
		}
	 });
}

$(document).ready(function() {
	var rss = "http://feeds.feedburner.com/bilelz";
	var rsscaroussel = "http://feeds.feedburner.com/bilelz";

	if(document.location.search != ""){
		if(document.location.search.indexOf("&caroussel=")!=-1){
			var idx = document.location.search.indexOf(paramCaroussel);
			rss = document.location.search.substring(1,idx);
			rsscaroussel = document.location.search.substring(idx+paramCaroussel.length, document.location.search.length);
			
		}else{
			rss = document.location.search.slice(1);
			rsscaroussel = rss;
		}
		
		
	}

	$.ajax({
		url : document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=100&callback=?&q=' + encodeURIComponent(rss),
		dataType : 'json',
		success : function(data) {

			var tmpl = $("#items-tmpl").html(), html = "";
			var pagestmpl = $("#pages-tmpl").html(), pageshtml = "";
			var carousseltmpl = $("#caroussel-tmpl").html(), carousselhtml = "";

			$("#items, #pages, #caroussel").empty();
			
			var feed = data.responseData.feed;
			/* set id & only one thunbmail*/
			
			formatRss(feed);
			
			if(rss != rsscaroussel){
				$.ajax({
					url : document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=100&callback=?&q=' + encodeURIComponent(rsscaroussel),
					dataType : 'json',
					success : function(data2) {
	
						var carousseltmpl = $("#caroussel-tmpl").html(), carousselhtml = "";		
						
						
						var feedCaroussel = data2.responseData.feed;
						
						formatRss(feedCaroussel);
						carousselhtml = Mustache.render(carousseltmpl, feedCaroussel);
						$('#caroussel').html("").append(carousselhtml);
						
						loaded();
						
						/* target-pages for caroussel'links */
						pageshtml = Mustache.render(pagestmpl, feedCaroussel);
						$('body').append(pageshtml);
						$('.pages:not(.ui-page)').page();
					}
				});
			}
			
			
			document.title = "RSS - " + feed.title;
			$("h1:first").text(feed.title);
			$("#description").text(feed.description);
			$("#website").attr("href",feed.link).find(".ui-btn-text").text(feed.link.replace("http://www.","").replace("http://",""));

			html = Mustache.render(tmpl, feed);
			pageshtml = Mustache.render(pagestmpl, feed);
			
			carousselhtml = Mustache.render(carousseltmpl, feed);

			$('#items').html("").append(html).listview('refresh');
			
			$('body').append(pageshtml);
			$('.pages').page();
			
			$('#caroussel').html("").append(carousselhtml);
			loaded();			
		}
		
				
		
		
	});
	
	myScroll = new iScroll('wrapper', {
		snap: true,
		momentum: false,
		hScrollbar: false,
		onScrollEnd: function () {
			document.querySelector('#indicator > li.active').className = '';
			document.querySelector('#indicator > li:nth-child(' + (this.currPageX+1) + ')').className = 'active';
		}
	 });
});


/* set unique-id & only one thunbmail/post*/
function formatRss(_rss){
	for(i=0;i<_rss.entries.length;i++){
		_rss.entries[i].index = "i"+escape(_rss.entries[i].link).replace(/%/ig,"-").replace(/\//ig,"-").replace(/\./ig,"-");
		
		
		
		if(_rss.entries[i].mediaGroups != undefined && _rss.entries[i].mediaGroups.length>0 && _rss.entries[i].mediaGroups[0].contents.length>0){
			_rss.entries[i].mediaGroups[0].contents = _rss.entries[i].mediaGroups[0].contents[0];
		}
		
		if(_rss.entries[i].mediaGroups == undefined){
			
			/* find the first image on the article if no-enclosure  */
			if($("<div></div>").html(_rss.entries[i].content).find("img:first").size()!=0){
			
				var imgsrc = $("<div></div>").html(_rss.entries[i].content).find("img:first").attr("src");
				var img = new Object();
	
					img = {	contents: [{
										url: imgsrc,
										medium: "image",
										title: imgsrc
								}]
							};				

				_rss.entries[i].mediaGroups = img;
				
				/*console.log("img:first="+imgsrc);*/
			}else{
				/*console.log("no image");*/
			}
		}
		
		
		/* boolean for print only $carousselNbItems on the caroussel */
		if(i<carousselNbItems){
			_rss.entries[i].incaroussel = true;
		}
		
	}
}
