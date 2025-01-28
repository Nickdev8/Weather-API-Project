const apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=52.3808&longitude=4.6368&hourly=temperature_2m,weather_code,surface_temperature&daily=weather_code,sunrise,sunset,rain_sum&timezone=Europe%2FLondon&forecast_days=1&models=knmi_seamless';

async function fetchWeatherData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function displayWeatherData(data) {
    const ctx = document.getElementById('weatherChart').getContext('2d');

    const hourlyData = data.hourly;
    const labels = hourlyData.time.map(time => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const temperatures = hourlyData.temperature_2m;

    const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                borderColor: darkMode ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)',
                backgroundColor: darkMode ? 'rgba(255, 99, 132, 0.2)' : 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true, // Ensure the aspect ratio is maintained
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time',
                        color: darkMode ? '#f4f4f4' : '#333'
                    },
                    ticks: {
                        color: darkMode ? '#f4f4f4' : '#333'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                        color: darkMode ? '#f4f4f4' : '#333'
                    },
                    ticks: {
                        color: darkMode ? '#f4f4f4' : '#333'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: darkMode ? '#f4f4f4' : '#333'
                    }
                }
            }
        }
    });

    // Display additional weather information
    const weatherCode = data.daily.weather_code[0];
    document.getElementById('weatherCode').textContent = weatherCode;
    document.getElementById('weatherCode').style.color = getWeatherCodeColor(weatherCode);
    document.getElementById('sunrise').textContent = new Date(data.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('sunset').textContent = new Date(data.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('rainSum').textContent = `${data.daily.rain_sum[0]} mm`;
}

function getWeatherCodeColor(code) {
    const minCode = 0;
    const maxCode = 99;
    const percentage = (code - minCode) / (maxCode - minCode);
    const red = Math.min(255, Math.max(40, Math.floor(255 * percentage)));
    const green = Math.min(255, Math.max(40, Math.floor(255 * (1 - percentage))));
    return `rgb(${red}, ${green}, 40)`;
}

function copyApiUrl() {
    const apiUrlInput = document.getElementById('apiUrl');
    apiUrlInput.select();
    apiUrlInput.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand('copy');
    alert('API URL copied to clipboard');
}

document.addEventListener('DOMContentLoaded', fetchWeatherData);