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
	var rss = "http://www.al-kanz.org/feed/rss/";
	var rsscaroussel = "http://www.al-kanz.org/category/a-la-une/rss";

	if(document.location.search != ""){
		if(document.location.search.indexOf("&caroussel=")!=-1){
			var idx = document.location.search.indexOf(paramCaroussel);
			rss = document.location.search.substring(1,idx);
			rsscaroussel = document.location.search.substring(idx+paramCaroussel.length, document.location.search.length);
			
		}else{
			rss = document.location.search.slice(1);
			rsscaroussel = rss;
		}
		console.log(rss);
		console.log(rsscaroussel);
		
	}

	$.ajax({
		url : document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=100&callback=?&q=' + encodeURIComponent(rss),
		dataType : 'json',
		success : function(data) {
			console.log(data.responseData.feed);

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
						console.log(data2.responseData.feed);
	
						var carousseltmpl = $("#caroussel-tmpl").html(), carousselhtml = "";		
						
						
						var feedCaroussel = data2.responseData.feed;
						/* set id & only one thunbmail*/
						formatRss(feedCaroussel);
						carousselhtml = Mustache.render(carousseltmpl, feedCaroussel);
						$('#caroussel').html("").append(carousselhtml);
						
						loaded();
					}
				});
			}
			
			
			document.title = "RSS - " + feed.title;
			$("h1:first").text(feed.title);
			$("#description").text(feed.description);
			$("#website").attr("href",feed.link).text(feed.link);

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


	/*	 
	 $.ajax({
		type : "GET",
		url : "rss.xml", // proxy.php
		dataType : "xml",
		success : function(xml) {
			console.log(xml);

			var tmpl = $("#itemsphp-tmpl").html(), html = "";
			var pagestmpl = $("#pages-tmpl").html(), pageshtml = "";

			$("#items, #pageshtml").empty();

			$(xml).find('item').each(function(i) {
				var $item = $(this);
				var o_new = new Object();

				o_new = {
					title : $item.find('title').text(),
					link : $item.find('link').text(),
					pubDate : $item.find('pubDate').text(),
					description : $item.find('description').text(),
					content : $item.find('content').text(),
					comments : $item.find('commentscount').text(),
					enclosure : $item.find('enclosure').text().replace(/.jpg/ig,"-150x81.jpg").replace(/.png/ig,"-150x81.png"),
					guid: "p" + $item.find('guid').text().replace("http://www.al-kanz.org/?p=","")
				};

				html += Mustache.render(tmpl, o_new);
				pageshtml += Mustache.render(pagestmpl, o_new);

			});

			$('#items').html("").append(html).listview('refresh');
			//$('#pages').html("").append(pageshtml);
			$('body').append(pageshtml);
			
			$('.pages').page();			
			
		},
		error : function(data) {
			console.log(data);
		}
	});
	
	*/

});

function formatRss(_rss){
	for(i=0;i<_rss.entries.length;i++){
		_rss.entries[i].index = i;
		if(_rss.entries[i].mediaGroups != undefined && _rss.entries[i].mediaGroups.length>0 && _rss.entries[i].mediaGroups[0].contents.length>0){
			_rss.entries[i].mediaGroups[0].contents = _rss.entries[i].mediaGroups[0].contents[0];
		}
		
		if(i<carousselNbItems){
			_rss.entries[i].incaroussel = true;
		}
		
	}
}
