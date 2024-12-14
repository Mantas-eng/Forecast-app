import { saveForecasts, getForecasts } from './weather-storage'; 
import { fetchWeather } from './weather-api'; 

interface Forecast {
  id: string;
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  weather: { 
    description: string;
    icon: string;
  }[];
}

let forecasts: Forecast[] = getForecasts();
const pageSize = 10;
let currentPage = 1;

export function renderForecasts(filteredForecasts: Forecast[] = forecasts) {
  const container = document.getElementById('forecasts-list');
  if (!container) return;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;
  const forecastsPage = filteredForecasts.slice(startIndex, endIndex);

  container.innerHTML = forecastsPage
    .map((forecast: Forecast) => {
      const weather = forecast.weather && forecast.weather[0]; 
      const iconUrl = weather ? `http://openweathermap.org/img/wn/${weather.icon}@2x.png` : '';
      const description = weather ? weather.description : 'No description available';

      return `
        <div class="weather-box">
          <div class="overlay">
            <div class="left-section">
              <div class="weather-info">
                <img src="${iconUrl}" alt="${description}" title="${description}" />
                <p>${description}</p>
              </div>
              <h2 class="city-name">${forecast.name}, ${forecast.sys.country}</h2>
              <p>Temperature: ${Math.round(forecast.main.temp)}°C</p>
            </div>
            <div class="temp-details">
              <p>Humidity: ${forecast.main.humidity}%</p>
              <p>Wind Speed: ${forecast.wind.speed} m/s</p>
              <p>Pressure: ${forecast.main.pressure} hPa</p>
              <p>Sunrise: ${new Date(forecast.sys.sunrise * 1000).toLocaleTimeString()}</p>
              <p>Sunset: ${new Date(forecast.sys.sunset * 1000).toLocaleTimeString()}</p>
            </div>
            <button class="button is-danger" data-id="${forecast.id}">Remove</button>
          </div>
        </div>
      `;
    })
    .join('');

  // Add event listeners to remove buttons
  const removeButtons = container.querySelectorAll('button[data-id]');
  removeButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const forecastId = (event.target as HTMLButtonElement).getAttribute('data-id');
      if (forecastId) {
        removeForecast(forecastId); 
      }
    });
  });

  renderPagination(filteredForecasts); 
}

function renderPagination(filteredForecasts: Forecast[] = forecasts) {
  const paginationContainer = document.getElementById('pagination');
  if (!paginationContainer) return;

  const totalPages = Math.ceil(filteredForecasts.length / pageSize);

  paginationContainer.innerHTML = `
     <div class="pagination">
      <button class="pagination-previous" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(1)">First</button>
      <button class="pagination-previous" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">Previous</button>
      <span class="pagination-ellipsis">&hellip;</span>
      <button class="pagination-next" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Next</button>
      <button class="pagination-next" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${totalPages})">Last</button>
    </div>
  `;
}

function changePage(pageNumber: number) {
  if (pageNumber < 1 || pageNumber > Math.ceil(forecasts.length / pageSize)) return;
  currentPage = pageNumber;
  renderForecasts();
}

export async function addForecast(query: string): Promise<boolean> {
  try {
    const [city, country] = query.split(',').map(s => s.trim());
    const countryCode = country;
    const data = await fetchWeather(city, countryCode);

    if (data) {
      const exists = forecasts.some(forecast => forecast.name === data.name && forecast.sys.country === data.sys.country);
      if (exists) {
        showMessage('Forecast for this city already exists.', true);
        return false;  
      }

      forecasts.push(data); 
      saveForecasts(forecasts); 
      renderForecasts(); 
      return true; 
    } else {
      return false; 
    }
  } catch (error) {
    return false;
  }
}

// Function to remove a forecast
export function removeForecast(id: string) {
  const index = forecasts.findIndex((forecast) => forecast.id === id);
  if (index > -1) {
    forecasts.splice(index, 1);  
    saveForecasts(forecasts);  
    renderForecasts();  
    showMessage('Forecast removed successfully!');  
  }
}

function showMessage(message: string, isError: boolean = false) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('notification', isError ? 'is-danger' : 'is-success');
  messageElement.textContent = message;

  const container = document.querySelector('.container');
  if (container) {
    container.prepend(messageElement);
    setTimeout(() => messageElement.remove(), 3000);
  }
}

export function searchForecasts(query: string) {
  const filteredForecasts = forecasts.filter(forecast => forecast.name.toLowerCase().includes(query.toLowerCase()));
  renderForecasts(filteredForecasts);
}

const searchButton = document.getElementById('main-search-btn');
if (searchButton) {
  searchButton.addEventListener('click', () => {
    const searchInput = document.getElementById('main-search-input') as HTMLInputElement;
    if (searchInput) {
      const query = searchInput.value.trim();
      searchForecasts(query);  
    }
  });
}
