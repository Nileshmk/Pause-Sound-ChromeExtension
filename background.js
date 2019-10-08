function play_toggle(command) {
  chrome.tabs.query({'url':'https://www.hungama.com/*'}, function(tabs){
    if (tabs.length === 0) {
        return;
    }
    var tabId = tabs[0].id;
    if (typeof command.length === "undefined" || command === "play_toggle"){
    chrome.tabs.executeScript(tabId,
      {'code':
      "document.querySelector('#ha_btnPlay').click()"});
    } else if (command === "prev"){
      chrome.tabs.executeScript(tabId,
        {'code':
        "document.querySelector('#icon-ic_previous-86').click()"});
    } else if (command ==='next'){
      chrome.tabs.executeScript(tabId,
        {'code':
        "document.querySelector('#icon-ic_next-87').click()"});
    }
  });
}


chrome.browserAction.onClicked.addListener(play_toggle);
chrome.commands.onCommand.addListener(play_toggle);

var auto_paused = false;
var rdio_playing = false;

function set_rdio_playing(){
  chrome.tabs.query({'audible':true,'url':'https://www.hungama.com/*'}, function(tabs){
    rdio_playing = (tabs.length > 0);
    // if rdio is playing, then it isn't paused, so reset the flag. The user
    // could have restarted the play.
    if (rdio_playing)  auto_paused = false;
  });
}

// check if more than one tab is making noise, if so, pause rdio.
function check_cacophony(){
  set_rdio_playing();
  chrome.tabs.query({"audible":true}, function(tabs){
    // if rdio was paused by this extension
    if (tabs.length === 0 && auto_paused){
      play_toggle("play_toggle");
      auto_paused_cause_other_playing = false;
      console.log('play started by extension');
    } else if (tabs.length > 1 && rdio_playing) {
      play_toggle("play_toggle");
      auto_paused = true;
      console.log("paused by extension");
    }
  });
}

window.setInterval(check_cacophony,3000);
