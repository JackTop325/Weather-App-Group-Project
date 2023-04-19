function App() {
  return (
    <div>
    {/* <!-- Header --> */}
    <header className="navbar has-background-link">
      <div className="navbar-brand">
        <a className="navbar-item">
          <img src="images/logo.png" alt="Logo" />
        </a>
        <a className="navbar-item">
          <h1 className="title is-4 has-text-white">OTU Weather</h1>
        </a>
      </div>
    </header>

    {/* <!-- Search Bar --> */}
    <section className="section">
      <div className="container">
        <form>
          <div className="field has-addons">
            <div className="control is-expanded">
              <input
                id="city"
                className="input"
                type="text"
                placeholder="Search for city..."
                autoComplete="off"
              />
            </div>
            <div className="control">
              <button id="search" className="button is-link">Search</button>
            </div>
          </div>
        </form>
      </div>
    </section>

    <main className="section scrollable-section">
      <div className="container">
        <div className="columns">
          {/* <!-- Left column for options --> */}
          <div className="column is-2">
            <div className="box">
              <h2 className="title is-5">Options</h2>
              <label className="checkbox">
                <input id="toggle" type="checkbox" />
                Search in Fahrenheit
              </label>
              <label className="checkbox">
                <input id="advanced-toggle" type="checkbox" />
                Show Advanced Information
              </label>
            </div>

            <div className="box">
              <h2 className="title is-5">Favourite Locations</h2>
              <div id="favourite-list"></div>
            </div>
          </div>

          {/* <!-- Middle column for main forecast --> */}
          <div className="column is-8">
            <div className="box">
              <h1 className="title is-10" id="city-name"></h1>

              <div className="weather-info mb-4">
                <img id="weather-icon" src="" width="50" height="50" />
                <h2 className="title is-8" id="current-temperature"></h2>
              </div>
              <h3 id="precipitation-percentage"></h3>
              <h3 id="humidity"></h3>
              <h3 id="windspeed"></h3>
              <div id="advanced-info" className="advanced-info is-hidden">
                <h3 id="cloud-cover"></h3>
                <h3 id="dewpoint"></h3>
                <h3 id="uv-index"></h3>
              </div>

              <div className="level-right mt-4">
                <div className="level-item">
                  <button className="button is-link" id="add-fav">Add to Favourites</button>
                </div>
                <div className="level-item">
                  <button className="button is-link" id="rmv-fav">Remove from Favourites</button>
                </div>
              </div>
            </div>

            <div className="box">
              <h2 className="title is-5">Today's Forecast</h2>
              <div id="forecast-container"></div>
            </div>
            <div id="temperature-chart"></div>
          </div>

          {/* <!-- Right column for 7-day forecast --> */}
          <div className="column is-2 right">
            <div className="box">
              <h2 className="title is-5">7-Day Forecast</h2>
              <div id="seven-day-forecast"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
    {/* <!-- Footer --> */}
    <footer className="footer">
      <div className="content has-text-centered">
        <p><strong>OTU Weather</strong> All rights reserved.</p>
        <p>
          <a href="https://www.facebook.com/ontariotechu" target="_blank" rel="noopener noreferrer"> Facebook</a> |
          <a href="https://twitter.com/ontariotech_u" target="_blank" rel="noopener noreferrer"> Twitter</a> |
          <a href="https://www.instagram.com/ontariotechu/" target="_blank" rel="noopener noreferrer"> Instagram</a>
        </p>
      </div>
    </footer>
  </div>
  );
}

export default App;
