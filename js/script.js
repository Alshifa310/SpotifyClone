console.log("Lets begain")
let currentSong = new Audio()
let songs
let currFolder

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
//Get songs name from the folder and show to the playlist
async function getSongs(folder) {
    currFolder = folder;
    try {
        let a = await fetch(`${folder}/`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");
        songs = [];
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split(`${folder}/`)[1]);
            }
        }
        console.log(response);
        console.log(songs);

        // Show in playlist
        let songUL = document.querySelector(".songPlaylist").getElementsByTagName("ul")[0];
        songUL.innerHTML = " ";
        for (const song of songs) {
            songUL.innerHTML += `<li class="flex round"><img class="invert img-size" width="34" src="/img/music.svg" alt="">
            <div class="info">
                <div> ${song.replaceAll("%20", " ")} </div>
                <div>Alshifa</div>
            </div>
            <div class="playnow flex">
                <img class="invert img-size" src="/img/play.svg" alt="">
            </div>
        </li>`;
        }

        // Attach an event listener to each song
        Array.from(document.querySelector(".songPlaylist").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element => {
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
                console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
            });
        });

        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}

const playMusic = (track, pause = false) => {
    currentSong.src = `${currFolder}/` + track

    if (!pause) {
        currentSong.play()
        play.src = "/img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        let e = array[index];
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML += `<div data-folder="${folder}" class="card round">
            <div class="play">
                <img src="/img/play.svg " alt="Play Button" class="circle">
            </div>
            <img src="/songs/${folder}/cover.jpg" alt=""
                class="round">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
        </div>`
        }

    }
     // Load the playlist whenever card is clicked
     Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`/songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })

}
async function main() {
   await getSongs("/songs/Angry_mood")
   playMusic(songs[0],true)

    await displayAlbums()

    //Attatch an event listener to play,pause 
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "/img/pause.svg"
        }

        else {
            currentSong.pause()
            play.src = "/img/play.svg"
        }
    })

    //Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    //Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //Add an event listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector("volume>img").src.replace("mute.svg", "volume.svg")
        }

    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })

    //Listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circlebar").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add event listener to seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circlebar").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"

    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //gpt
    document.addEventListener("DOMContentLoaded", () => {
        const closeButton = document.querySelector(".close");
        const leftElement = document.querySelector(".left");
    
        closeButton.addEventListener("click", () => {
            console.log("Close button clicked");
            leftElement.style.left = "-120%";
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});