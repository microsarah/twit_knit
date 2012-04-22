/*
 * TwitStream - A jQuery plugin for the Twitter Search API
 * Version 1.2
 * http://kjc-designs.com/TwitStream
 * Copyright (c) 2009 Noah Cooper
 * Licensed under the GNU General Public License <http://www.gnu.org/licenses/>
*/

//converting language from tweet?
String.prototype.linkify=function(){
	return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&;\?\/.=]+/g,function(m){
		return m.link(m);
	});
};
String.prototype.linkuser=function(){
	return this.replace(/[@]+[A-Za-z0-9-_]+/g,function(u){
		return u.link("http://twitter.com/"+u.replace("@",""));
	});
};
String.prototype.linktag=function(){
	return this.replace(/[]+[A-Za-z0-9-_]+/,function(t){
		return t;
	});
};

var tweetsArray = new Array;
//New array in which tweets will be stored

//give option to show links or not (choose in HTML)
var showTweetLinks='none';

//----------------set parameters for how often we fetch--------------------------------------------


//set up a for loop
//for(i = 0; i < 5; i++){


//set up a counter
var i = 1;                     //  set your counter to 1

function myLoop () {           //  create a loop function
   setTimeout(function () {    //  call a 3s setTimeout when the loop is called



//----------------start fetch_tweets function--------------------------------------------

//refer to the title (keyword you want to search) as entered in html doc
function fetch_tweets(elem){
	elem=$(elem);
	keyword=escape(elem.attr('title'));
	
//refer to the class (number of tweets to be displayed) as entered in html doc
//pull that # of tweets from the API
	num=elem.attr('class').split(' ').slice(-1);
	var url="http://search.twitter.com/search.json?q="+keyword+"&rpp="+num+"&callback=?";
	$.getJSON(url,function(json){
	
	//convert the time data from the API as specified below
		$(json.results).each(function(){
			var tTime=new Date(Date.parse(this.created_at));
			var cTime=new Date();
			var sinceMin=Math.round((cTime-tTime)/60000);
			if(sinceMin==0){
				var sinceSec=Math.round((cTime-tTime)/1000);
				if(sinceSec<10)
					var since='less than 10 seconds ago';
				else if(sinceSec<20)
					var since='less than 20 seconds ago';
				else
					var since='half a minute ago';
			}
			else if(sinceMin==1){
				var sinceSec=Math.round((cTime-tTime)/1000);
				if(sinceSec==30)
					var since='half a minute ago';
				else if(sinceSec<60)
					var since='less than a minute ago';
				else
					var since='1 minute ago';
			}
			else if(sinceMin<45)
				var since=sinceMin+' minutes ago';
			else if(sinceMin>44&&sinceMin<60)
				var since='about 1 hour ago';
			else if(sinceMin<1440){
				var sinceHr=Math.round(sinceMin/60);
				if(sinceHr==1)
					var since='about 1 hour ago';
				else
					var since='about '+sinceHr+' hours ago';
			}
			else if(sinceMin>1439&&sinceMin<2880)
				var since='1 day ago';
			else{
				var sinceDay=Math.round(sinceMin/1440);
				var since=sinceDay+' days ago';
			}
			
			//user's twitter ID (written below the tweet)
			var tweetBy='<a class="tweet-user" target="_blank" href="http://twitter.com/'+this.from_user+'">@'+this.from_user+'</a>'; 
			
			//display timestamp (written below the tweet)
			//<span class="tweet-time">'+since+'</span>';
			
			//reply option (written below the tweet)
			if(showTweetLinks.indexOf('reply')!=-1)
				tweetBy=tweetBy+' &middot; <a class="tweet-reply" target="_blank" href="http://twitter.com/?status=@'+this.from_user+' &in_reply_to_status_id='+this.id+'&in_reply_to='+this.from_user+'">Reply</a>';
			
			//view tweet option (written below the tweet)
			if(showTweetLinks.indexOf('view')!=-1)
				tweetBy=tweetBy+' &middot; <a class="tweet-view" target="_blank" href="http://twitter.com/'+this.from_user+'/statuses/'+this.id+'">View Tweet</a>';
			
			//RT option (written below the tweet)	
			if(showTweetLinks.indexOf('rt')!=-1)
				tweetBy=tweetBy+' &middot; <a class="tweet-rt" target="_blank" href="http://twitter.com/?status=RT @'+this.from_user+' '+escape(this.text.replace(/&quot;/g,'"'))+'&in_reply_to_status_id='+this.id+'&in_reply_to='+this.from_user+'">RT</a>';
			
			//image display
			var tweet='<div class="tweet"><div class="tweet-right"><p class="text">'+this.text.linkify().linkuser().linktag().replace(/<a/g,'<a target="_blank"')+'<br />'+tweetBy+'</p></div><br style="clear: both;" /></div>';
			tweetsArray.push(tweet);
			console.log(tweet);
			//Pushing the new tweet into the array
			//elem.append(tweet);
			
			
		});
	});
	
	var latestTweet = tweetsArray.length -1;
	var newTweet = tweetsArray[latestTweet];
	document.getElementById('tweetRain').innerHTML=newTweet;
	//Looks through the HTML for a div with the ID 'tweetRain' and then between the div tags, removed existing content between the div tags and adds the content of the latest tweet.
	return(false);
}

//if showTweetLinks is marked 'all' on HTML doc
//then display the reply, view & RT functions as above
$(function(){
	showTweetLinks=showTweetLinks.toLowerCase();
	if(showTweetLinks.indexOf('all')!=-1)
		showTweetLinks='reply,view,rt';
	$('.twitStream').each(function(){
		fetch_tweets(this);
	});
});

//----------------end fetch_tweets function--------------------------------------------



//end the counter
//}


      i++;                     //  increment the counter
      if (i > 0) {            //  if the counter < 10, call the loop function
         myLoop();             //  ..  again which will trigger another 
      }                        //  ..  setTimeout()
   }, 2000)
}

myLoop();                      //  start the loop