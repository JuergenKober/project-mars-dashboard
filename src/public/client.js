let storeIM = Immutable.Map({
    user: Immutable.Map({
        name: 'connoisseur of the multiverse',
    }),
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    active_rover: '',
    rover_manifest: '',
    rover_images: '',
    last_photo_taken: '',
    recent_images: [],
})

function updateStoreIM(state, newState) {
    storeIM = state.merge(newState);
    render(root, storeIM);
}

// add our markup to the page
const root = document.getElementById('root');

root.addEventListener("click", function(e) {
	// e.target is the clicked element
  if (e.target && e.target.matches("div.rover_tile")) {
    getRoverData(e.target.id, storeIM);
    //updateStoreIM(storeIM, {active_rover: e.target.id});
  }
  else if (e.target && e.target.matches("div.rover_tile h5")) {
    getRoverData(e.target.parentElement.id, storeIM);
    //updateStoreIM(storeIM, {active_rover: e.target.parentElement.id});
  }
  else if (e.target && e.target.matches("div.rover_tile img")) {
    getRoverData(e.target.parentElement.id, storeIM);
    //updateStoreIM(storeIM, {active_rover: e.target.parentElement.id});
  }
});

const render = async (root, state) => {
    root.innerHTML = App(state, renderListElements, renderImageElements);
}

// create content
const App = (state, renderList, renderImage) => {
    let { rovers, apod, active_rover } = state.toJS();

    renderList('Name', 'John');

    return `
        ${Header(state)}
        ${Main(state, renderList, renderImage)}
        ${Footer()}
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, storeIM)
})

/*****************************************************************
*** components to be displayed in the browser
*****************************************************************/
const Main = (state, renderListElements, renderImageElements) => {
  const {
    user,
    apod,
    active_rover,
    rover_manifest,
    rover_images,
    last_photo_taken,
    recent_images
  } = state.toJS();

  if (active_rover === '') {
    return `
      <section class="manifest-area" id="manifest">
        <h3 class="section-title">Welcome, connoisseur of the multiverse!</h3>
        <p>The <a href="https://en.wikipedia.org/wiki/Mars_rover" target="_wikiWin">
        Wikipedia Mars Rover page</a> tells us "a Mars rover is a motor vehicle
        that travels across the surface of the planet Mars upon arrival. Rovers
        have several advantages over stationary landers: they examine more territory,
        they can be directed to interesting features, they can place themselves in
        sunny positions to weather winter months, and they can advance the knowledge
        of how to perform very remote robotic vehicle control."</p>
        <p>&nbsp;</p>
        <p>The NASA Open API is designed to collect image data gathered by NASA's
        Curiosity, Opportunity, and Spirit rovers on Mars and make it more easily
        available to other developers, educators, and citizen scientists. This
        API is maintained by
        <a href="https://github.com/chrisccerami/mars-photo-api" target="_gitWin">
          Chris Cerami
        </a>.</p>
        <p>&nbsp;</p>
        <p>Click on an image to learn more about a Rover's mission.</p>
      </section>
    `
  } else if (rover_manifest !== '') {
      const rover_data = rover_manifest.manifest.photo_manifest;
      const status = rover_data.status.charAt(0).toUpperCase() + rover_data.status.substring(1);
      const data_labels = ['Launch Date', 'Landing Date', 'Status' ];
      const data_items = [rover_data.launch_date, rover_data.landing_date, status ]

      const list_elements = data_labels.map((elem, i) => renderListElements(elem, data_items[i]));
      const image_elements = recent_images.map((elem, i) => renderImageElements(elem));

      return `
        <section class="manifest-area" id="manifest">
          <h3 class="section-title">Rover ${rover_data.name}</h3>
          <ul class="manifest-content">
            ${list_elements.join('')}
          </ul>
        </section>
        <section class="images-area" id="images">
          <h3 class="section-title">Most recent photos taken on ${last_photo_taken}</h3>
          <div class="container">
            <div class="grid">
              ${image_elements.join('')}
            </div>
          </div>
        </section>
      `
  }
}

const Header = (state) => {
  let { rovers, active_rover } = state.toJS();
  let rover_element = '';

  const rover_elements = rovers.map(item => {
    return (`<div class="rover_tile cell box-flex" id="${item}">
        <img src="assets/images/${item}.jpg" class="responsive-image" />
        <h5 class="box-caption">${item}</h5>
      </div>`);
  });

  return `
    <header>
      <h2>Mars Exploration Rovers</h2>
      <nav>
        <li>Click on an image to learn more</li>
      </nav>
    </header>
    <section class="rover-area">
      <div class="rover-img"></div>
      <div class="container">
        <div class="grid">
          ${rover_elements.join('')}
          </div>
        </div>
      </section>
  `;
}

const Footer = () => {
  return `
    <footer>
      <p>
        All data retrieved from the the NASA API portal. This website is one of the most popular websites across all federal agencies. The objective of this site is to make NASA data, including imagery, eminently accessible to application developers. The api.nasa.gov catalog is growing. The full documentation for this API can be found in the <a href="https://github.com/nasa/apod-api">APOD API Github repository</a>.
      </p>
    </footer>
  `
}

/*****************************************************************
*** Example of a pure function that renders infomation
*** example from starter code
*****************************************************************/
const Greeting = (name) => {
  if (name) {
    return `
      <h1>Welcome, ${name}!</h1>
    `
  }
  return `
    <h1>Hello!</h1>
  `
}

/*****************************************************************
*** Example of a pure function that renders infomation
*** requested from the backend
*** came with starter code
*****************************************************************/
const ImageOfTheDay = (state) => {
    const { apod } = state.toJS();
    // If image does not already exist, or it is not from today
    // request it again
    if (apod) {
      const today = new Date()
      const photodate = new Date(apod.date)
      if (apod.date === today.getDate() ) {
          getImageOfTheDay(state)
      }
      // check if the photo of the day is actually type video!
      if (apod.media_type === "video") {
          return (`
              <p>See today's featured video <a href="${apod.url}">here</a></p>
              <p>${apod.title}</p>
              <p>${apod.explanation}</p>
          `)
      } else {
          return (`
              <img src="${apod.image.url}" height="350px" width="100%" />
              <p>${apod.image.explanation}</p>
          `)
      }
    }
    return (`
        <p>Sorry, we couldn't get any data today !</p>
    `)
}

/*****************************************************************
*** API calls
*****************************************************************/
/*****************************************************************
*** Example API call to get image of the day
*****************************************************************/
const getImageOfTheDay = (state) => {
    let { apod } = state.toJS();
    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStoreIM(state, { apod }));
}

/*****************************************************************
*** API call to get all data for a given rover and storeIM it
*** in the storeIM of the app
*****************************************************************/
const getRoverData = async (active_rover, state) => {
  const manifest = await getRoverManifestData(active_rover);
  console.log('manifest 2', manifest);
  const earth_date = getLastPhotoTaken(manifest.manifest.photo_manifest.photos);
  const images = await getRoverImages(active_rover, earth_date);

  const photos = (images.rover_photos.photos.length > 6) ?
    images.rover_photos.photos.slice(0,6) :
    images.rover_photos.photos;

  const recent_images = photos.map((elem, i) => elem.img_src);

  updateStoreIM(state, {
    active_rover: active_rover,
    apod: manifest,
    rover_manifest: manifest,
    rover_images: images,
    last_photo_taken: earth_date,
    recent_images: recent_images
  });
}

/*****************************************************************
*** API call to get the data of the manifest for a given rover
*****************************************************************/
const getRoverManifestData = async (active_rover) => {
    const response = await fetch(`http://localhost:3000/manifest/${active_rover}`, {});
    const manifest = await response.json();
    console.log('manifest 1', manifest);
    return manifest;
}

/*****************************************************************
*** API call to get the data of the images for a given rover
*****************************************************************/
const getRoverImages = async (rover_name, earth_date) => {
  const response = await fetch(`http://localhost:3000/rover_photos/${rover_name}/${earth_date}`, {});
  const images = await response.json();
  console.log('images 1', images);
  return images;
}

/*****************************************************************
*** mother's little helpers
*****************************************************************/
const getLastPhotoTaken = (photos) => {
  return photos.splice([photos.length-1])[0].earth_date;
}

const renderListElements = (label, item) => {
  return (`
    <li>
      <p>${label}: ${item}</p>
    </li>
  `);
}

const renderImageElements = (img_src) => {
  return (`<div class="cell box-flex">
    <img src="${img_src}" class="responsive-image" />
  </div>`);
}
