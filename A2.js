function getRandomQuote() {
    fetch("https://zenquotes.io/api/quotes/[your_key]")
        .then(response => response.json())
        .then(data => {

            const quote = data[0].q;
            const author = data[0].a;

            document.getElementById("quote").textContent = `"${quote}" — ${author}`;
        })
}

function loadTopStocks() {
    fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => b.no_of_comments - a.no_of_comments);

            const top5Stocks = data.slice(0, 5);

            const table = document.getElementById('topStock');

            top5Stocks.forEach(stock => {
                const row = table.insertRow(-1);

                const tickerCell = row.insertCell(0);
                const commentCountCell = row.insertCell(1);
                const sentimentCell = row.insertCell(2);

                const yahooFinanceLink = `https://finance.yahoo.com/quote/${stock.ticker}`;
                tickerCell.innerHTML = `<a href="${yahooFinanceLink}" target="_blank">${stock.ticker}</a>`;
                commentCountCell.textContent = stock.no_of_comments;

                if (stock.sentiment.toLowerCase() === 'bullish') {
                    sentimentCell.innerHTML =
                        '<img class="sent-display" src="https://cdn2.iconfinder.com/data/icons/stock-investment-flat-gradient/64/25_bullish_uptrend_animal_stocks_finance_graph_investing_investment_finance_business-512.png" alt="bullish-icon"></img>';
                } else {
                    sentimentCell.innerHTML =
                        '<img class="sent-display" src="https://cdn1.iconfinder.com/data/icons/stock-investment-outline-1/64/24_bearish_downtrend_animal_stocks_finance_graph_investing_investment_finance_business-512.png" alt="bearish-icon"></img>';
                }
            });
        })
}

function findStock() {
    const stockName = document.getElementById('stock_name').value.toUpperCase();
    const numDays = document.getElementById('time_choice').value;

    const currentDate = new Date();
    const formattedCurrentDate = formatDate(currentDate);

    currentDate.setDate(currentDate.getDate() - parseInt(numDays));
    const startDate = formatDate(currentDate);

    const apiKey = 'Jdk8iWNSOkuiDU9nDJh0z8g864dn4J_e';

    fetch(`https://api.polygon.io/v2/aggs/ticker/${stockName}/range/1/day/${startDate}/${formattedCurrentDate}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data);
            const dates = data.results.map(result => new Date(result.t));

            const newDates = formatEPOCH(dates);
            const prices = data.results.map(result => result.c);

            makeChart(newDates, prices);
        })
}

function makeChart(dates, prices) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Stock Price',
                data: prices,
                borderColor: 'blue',
                borderWidth: 1
            }]
        }
    });
    return chart;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}


function formatEPOCH(dates) {
    return dates.map(timestamp => {
        const currentDate = new Date(timestamp);

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    });
}



function getDogs() {
    fetch('https://dog.ceo/api/breeds/image/random/10')
        .then(response => response.json())
        .then(data => {
            const sliderContainer = document.querySelector('[data-simple-slider]');

            data.message.forEach(image => {
                const img = document.createElement('img');
                img.src = image;
                sliderContainer.appendChild(img);
            });

            simpleslider.getSlider();

            createBreedButtons();
        })
}

function createBreedButtons() {
    fetch('https://dogapi.dog/api/v2/breeds/')
        .then(response => response.json())
        .then(data => {

            data.data.forEach(breed => {
                const breedId = breed.id;
                const breedName = breed.attributes.name;
                const breedButtonsContainer = document.getElementById('breed-buttons');

                // Create breed buttons
                const button = document.createElement('button');
                button.textContent = breedName;
                button.classList.add('dog-buttons');
                button.addEventListener('click', () => {
                    getBreedDescription(breedId);
                });
                breedButtonsContainer.appendChild(button);
            })
        })
}

function loadDescription(breedName) {
    fetch('https://dogapi.dog/api/v2/breeds/')
        .then(response => response.json())
        .then(data => {
            const breed = data.data.find(breed => breed.attributes.name.toLowerCase() === breedName.toLowerCase());
            const breedId = breed.id;

            getBreedDescription(breedId);

        })
}


function getBreedDescription(breedId) {
    fetch(`https://dogapi.dog/api/v2/breeds/${breedId}`)
        .then(response => response.json())
        .then(data => {

            const breedInfoContainer = document.getElementById('breed-info');

            breedInfoContainer.style.display = 'block';

            const attributes = data.data.attributes;

            breedInfoContainer.innerHTML = `
                <h2>${attributes.name}</h2>
                <p>Description: ${attributes.description}</p>
                <p>Min Life: ${attributes.life.min} years</p>
                <p>Max Life: ${attributes.life.max} years</p>
            `;
        })
}

function sayHello() {
    alert('Hello, World!')
}
window.addEventListener("load", getRandomQuote);
window.addEventListener("load", loadTopStocks);
window.addEventListener('load', getDogs);
window.addEventListener("sayHello")

