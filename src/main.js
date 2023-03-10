// Crearem les constats que ens ajudaran mes endevant 
const searchInput = document.querySelector('.search input');
const cityName = document.createElement('h1');
const Info = document.querySelector('.info');
const botHours = document.querySelector('.bot-hours');
const botInfo = document.querySelector('.bot-info');
const slideRight = document.querySelector('.slide-right');
const icon = document.createElement('img');

// Afageix-ho unas classes per pdoer editar des del JS mes comodament
cityName.classList.add('name');
icon.classList.add('icon');
searchInput.value = "Olot"

// Aquest addeventListener es el que ens ajudar a buscar tot, basicament es un addEventListener amb un IF el cual s'encarrega de mapajar l'enter, en cas de clicar
// Enter fara tot lo que estigui dins
searchInput.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        // API-KEY 
        const apiKey = 'aba6ff9d6de967d5eac6fd79114693cc';
        // Agafem el que escribim dins del input com a ciudad

        const city = searchInput.value;

        // En aquest fetch basicament el que es fa es agafar el temps d'avull
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                // Bloc de codi amb el que concatenem la informacio i la mostrem a la pagina
                cityName.innerText = data.name + ', ' + data.sys.country;
                const temp = Math.round(data.main.temp);
                Info.innerHTML = `<h1 class="tmp">${temp} °C<h1>`;
                const iconCode = data.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png?color=ffffff`;
                icon.setAttribute('src', iconUrl);
                Info.appendChild(cityName);
                Info.appendChild(icon);
            })
            .catch(error => console.log(error) ||  alert("Ingresa una ciudad o pueblo valido") );

        // Aquest fetch s'encarrega de buscar i mostrar la previsio de cada 3h i la previsio dels 5 dias de la semana.
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                // Reiniciem el divisor per cada busqueda que es fagui per poder afaguir mes coses
                botHours.innerHTML = "";

                const forecasts = data.list.filter((_forecast, index) => index % 8 === 0);
                // Bloc de codi que ens ajuda a mostrar-ho tot dins del divisor
                forecasts.forEach(forecast => {
                    const temp = Math.round(forecast.main.temp);
                    const iconCode = forecast.weather[0].icon;
                    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png?color=#ffffff`;
                    const timestamp = new Date(forecast.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const forecastElement = document.createElement('div');
                    forecastElement.classList.add('time-hour');
                    forecastElement.innerHTML = `
                        <h3 class="time">${timestamp}</h3>
                        <img class="icon" src="${iconUrl}" alt="${forecast.weather[0].description}">
                        <h3 class="temp">${temp} °C</h3>
                    `;
                    botHours.appendChild(forecastElement);
                });
                
                // Reiniciem el divisor
                slideRight.innerHTML = "";
                const dailyForecasts = data.list.filter((_forecast, index) => index % 8 === 0);
                // Bloc de codi on s'hafagueix tot lo de la semana
                dailyForecasts.forEach(forecast => {
                    const weekday = new Date(forecast.dt_txt).toLocaleDateString([], { weekday: 'long' });
                    const tempMin = Math.round(forecast.main.temp_min);
                    const tempMax = Math.round(forecast.main.temp_max);
                    const iconCode = forecast.weather[0].icon;
                    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
                    const description = forecast.weather[0].description;

                    const forecastElement = document.createElement('div');
                    forecastElement.classList.add('Prevision-semana');
                    forecastElement.innerHTML = `
            <h3 class="weekday">${weekday}</h3>
            <img class="icon" src="${iconUrl}" alt="${description}">
            <h3 class="temp"><span class="temp-min">${tempMin} °C</span>/<span class="temp-max">${tempMax} °C</span></h3>
          `;
                    slideRight.appendChild(forecastElement);
                    // Fem un callback per cridar la funcio del grafic
                    const humidityData = data.list.filter((_forecast, index) => index % 8 === 0);
                    showHumidityChart(humidityData);
                });
            })
            .catch(error => console.error(error));


            // Funcio que ens crea el grafic d'humetat amb la llibreria CHART.js
        function showHumidityChart(humidityData) {
            const labels = humidityData.map(data => new Date(data.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            const humidityValues = humidityData.map(data => data.main.humidity);

            const chartData = {
                labels,
                datasets: [{
                    label: 'Humedad',
                    data: humidityValues,
                    borderColor: ' #ffe7b3',
                    backgroundColor: 'transparent',
                    pointBackgroundColor: '#ffcc66',
                    pointBorderColor: '#4c6ef5',
                    pointHoverBackgroundColor: '#4c6ef5',
                    pointHoverBorderColor: '#4c6ef5'
                }]
            };

            const chartConfig = {
                type: 'line',
                data: chartData,
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            ticks: {
                                fontColor: '#FFFFFF'
                            },
                            gridLines: {
                                color: '#FFFFFF33'
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                fontColor: '#FFFFFF'
                            },
                            gridLines: {
                                color: '#FFFFFF'
                            }
                        }]
                    }
                }
            };

            const chartCanvas = document.createElement('canvas');
            chartCanvas.width = 00;
            chartCanvas.height = 200;
            const chartContext = chartCanvas.getContext('2d');

            new Chart(chartContext, chartConfig);

            botInfo.innerHTML = "";
            botInfo.appendChild(chartCanvas);
        }

    }
})