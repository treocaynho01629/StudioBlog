import './youtubeembed.css';

export default function YoutubeEmbed({ video }) {
  if (video) {
    return (
      <div className="video-responsive">
        <iframe
          loading="lazy"
          width="853"
          height="480"
          src={`https://www.youtube.com/embed/${video.videoId}`}
          srcDoc={`
          <style>
            * {
              padding: 0;
              margin: 0;
              overflow: hidden;
            }

            body, html {
              height: 100%;
            }

            img, svg {
              position: absolute;
              width: 100%;
              top: 0;
              bottom: 0;
              margin: auto;
            }

            p {
              position: absolute;
              width: 100%;
              top: 0;
              font-size: 22px;
              font-weight: 450;
              padding: 20px 15px;
              font-family: 'Roboto', sans-serif;
              color: white;
              background-color: rgba(0, 0, 0, 0.5);
              transition: all 0.25s ease-in-out;
            }

            svg {
              filter: drop-shadow(1px 1px 10px hsl(0, 0%, 100%));
              transition: all 0.25s ease-in-out;
            }    

            body:hover svg {
              filter: drop-shadow(1px 1px 10px hsl(0, 0%, 76.86274509803923%));
              transform: scale(1.2);
            }  

            body:hover p {
              padding-left: 30px;
              background-color: rgba(0, 0, 0, 0.7);
            } 
          </style>
          <a href='https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1'/>
            <img loading='lazy' src='${video.thumbnail}' alt='${video.title}'/>
            <p>${video.title}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="red" class="bi bi-youtube" viewBox="0 0 16 16"> <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/> </svg>
          </a>
          `}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={video.title}
        />
      </div>
    )
  }
}
