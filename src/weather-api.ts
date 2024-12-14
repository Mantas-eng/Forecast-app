import axios from 'axios';

const API_KEY = '779f709fc538656256ce3269e3007277';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

interface WeatherData {
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
    main: string;
    icon: string;
  }[];
}

export async function fetchWeather(city: string, country: string): Promise<WeatherData | null> {
  try {
    const response = await axios.get(`${BASE_URL}?q=${city},${country}&appid=${API_KEY}&units=metric`);

    if (response.data && response.data.cod === 200) {
      return {
        id: response.data.id.toString(),
        name: response.data.name,
        sys: response.data.sys,
        main: response.data.main,
        wind: response.data.wind,
        weather: response.data.weather,
      };
    } else {
      throw new Error(response.data.message || 'Error fetching weather data.');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}
