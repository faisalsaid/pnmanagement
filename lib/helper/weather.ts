export type WeatherData = {
  temperature: number;
  forecast: string;
};

export async function getWeather(
  lat: number,
  lon: number,
): Promise<WeatherData> {
  const res = await fetch(
    `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,
    {
      headers: {
        'User-Agent': 'WeatherPortal/1.0 (your-email@example.com)', // wajib
      },
    },
  );

  if (!res.ok) {
    throw new Error('Gagal mengambil data cuaca');
  }

  const data = await res.json();
  const firstHour = data.properties.timeseries[0];

  return {
    temperature: firstHour.data.instant.details.air_temperature,
    forecast: firstHour.data.next_1_hours?.summary?.symbol_code || 'unknown',
  };
}
