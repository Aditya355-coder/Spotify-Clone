
console.log("hello");
let currentSong = new Audio();
let currfolder;

function secondsToMinutesAndSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00/00"
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`
}
async function getSongs(folder) {
  currfolder = folder;
       

  let a = await fetch(`/${folder}/`)  

  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }
  }
  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songUL.innerHTML = ""
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + ` <li>
  
      <div class="info">
         
          <div> ${song.replaceAll("%20", " ")}</div>
          <div> <img src="img/music.svg" class="invert"> </div>
           
      <div>${folder.split("/").slice(-1)[0].split(".")[0].replaceAll("%20", " ")}</div>
          <div class="playnow">
  
              <img src="img/playsong.svg" class="inherit playto" height="30px">
       </div>
  
      </div>
  </li> `
  }
  // Attach an event listener to each song
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

    })
   
  })
 
  return songs

}
const playMusic = (track, pause = false) => {
  currentSong.src =`/${currfolder}/`+track
  if (!pause) {
    currentSong.play()
    play.src = "play.svg"
  }
  document.querySelector(".SongInfo").innerHTML = decodeURI(track)
  document.querySelector(".SongTime").innerHTML = "00:00/00:00"
}



async function displayAlbums() {
  console.log("displaying albums")
   let a = await fetch(`/songs/`)
  
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let cardContainer = document.querySelector(".cardContainer")
  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-2)[0]
      // Get the metadata of the folder
       let a = await fetch(`/songs/${folder}/info.json`)
    
      let response = await a.json();

      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
  <svg class="play" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
         viewBox="0 0 24 24" id="play">
         <path
             d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z">
         </path>
     </svg>
     <img 
     src="/songs/${folder}/cover.jpg" alt=""
         >
     <h2>${response.title}</h2>
     <p>${response.description}</p>
 
</div> `




    }

  }


  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async (item) => {
      song = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
      playMusic(songs[0])
    })
  })
 
}


async function main() {
 
  await getSongs("songs/Baaghi")
  playMusic(songs[0], true)

    await displayAlbums()


  const listItems = document.querySelectorAll(".songlist li");

  // Convert NodeList to an array using spread syntax
  const listItemArray = [...listItems];

  // Add a click event listener to each list item
  listItemArray.forEach(item => {
    item.addEventListener("click", event => {
      const songTitle = event.currentTarget.querySelector(".info").firstElementChild.innerHTML;
      playMusic(songTitle.trim());
    })
  })


  const play = document.getElementById('playbutton');
  play.addEventListener('click', () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg"
    } else {
      currentSong.pause();
      play.src = "img/play.svg"
    }
  })

  
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".SongTime").innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)}/ 
    ${secondsToMinutesAndSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  })
  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100
  })

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%"
  })

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
  })
  document.querySelector(".back").addEventListener("click", () => {
    currentSong.pause();
    console.log("Previous clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1])
    }
  })
  document.querySelector(".forward").addEventListener("click", () => {
    currentSong.pause();
    console.log("next clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index + 1) >= 0) {
      playMusic(songs[index + 1])
    }
  })
  
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("Setting volume to", e.target.value, "/ 100")
    currentSong.volume = parseInt(e.target.value) / 100
    if (currentSong.volume >0){
        document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
    }
})

// Add event listener to mute the track
document.querySelector(".volume>img").addEventListener("click", e=>{ 
    if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg", "mute.svg")
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg", "volume.svg")
        currentSong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }

})

  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
     play.src ="img/pause.svg"

    })
   
  })
  document.querySelector(".cardContainer").addEventListener("click", e => {
     play.src ="img/pause.svg"

    })
   


}


main()

