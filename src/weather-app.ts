import { renderForecasts, addForecast } from './weather-dom';

document.addEventListener('DOMContentLoaded', () => {
  renderForecasts();

  const addForecastBtn = document.getElementById('add-forecast-btn');
  const modal = document.getElementById('modal') as HTMLDivElement;
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input') as HTMLInputElement;

  addForecastBtn?.addEventListener('click', () => {
    modal?.classList.add('is-active');
  });

  modal?.querySelector('.modal-close')?.addEventListener('click', () => {
    modal.classList.remove('is-active');
  });

  
  searchBtn?.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
      const isSuccess = await addForecast(query);

      if (isSuccess) {
        modal?.classList.remove('is-active');
        searchInput.value = '';
      } else {
        showErrorMessage('Unable to fetch weather data. Please check the city name or coordinates.');
      }
    } else {
      showErrorMessage('Please enter a valid city, ZIP code, or coordinates.');
    }
  });
});

function showErrorMessage(message: string) {
  const errorMessage = document.createElement('div');
  errorMessage.classList.add('notification', 'is-danger');
  errorMessage.textContent = message;

  const container = document.querySelector('.container');
  if (container) {
    container.prepend(errorMessage);
    setTimeout(() => errorMessage.remove(), 5000);
  }
}