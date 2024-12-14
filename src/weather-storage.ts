export function saveForecasts(forecasts: any[]) {
  localStorage.setItem('forecasts', JSON.stringify(forecasts));
}

export function getForecasts(): any[] {
  const forecasts = localStorage.getItem('forecasts');
  return forecasts ? JSON.parse(forecasts) : [];
}
