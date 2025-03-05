const tbody = document.querySelector("tbody");
const searchBox = document.querySelector(".search-box");
const sortMktCap = document.querySelector(".mktCapSort");
const sortPercentage = document.querySelector(".percentSort");


fetchCrypto();
async function fetchCrypto() {
  try {
    const responseBody = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
    );
    if (!responseBody.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await responseBody.json();

    
    localStorage.setItem("coinData", JSON.stringify(data));
    const capturedData = JSON.parse(localStorage.getItem("coinData"));
 
    loopObject(capturedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    setTimeout(fetchCrypto, 60000); // Retry after 1 minute
  }
}

function loopObject(obj) {
  tbody.innerHTML = "";
  obj.forEach(createRow);
}


function createRow(obj) {
  const row = document.createElement("tr");
  row.id = `${obj.id}`;
  row.classList.add('row');
  row.innerHTML = `<td><img src="${obj.image}" alt="${obj.name}" /> ${obj.name}</td>
                   <td>${obj.symbol.toUpperCase()}</td>
                   <td class="text-right">$${obj.current_price.toFixed(2)}</td>
                   <td class="text-right">$${obj.total_volume.toLocaleString()}</td>
                   <td class="${obj.price_change_percentage_24h >= 0 ? 'td-green' : 'td-red'}">${obj.price_change_percentage_24h.toFixed(2)}%</td>
                   <td>Mkt Cap: $${obj.market_cap.toLocaleString()}</td>`;
  tbody.appendChild(row);
}


searchBox.addEventListener("input", (e) => {
  const enteredText = searchBox.value.toLowerCase();
  const arr = JSON.parse(localStorage.getItem("coinData"));
  let filteredArr = arr.filter((ele) =>
    ele.name.toLowerCase().includes(enteredText) ||
    ele.symbol.toLowerCase().includes(enteredText)
  );
  loopObject(filteredArr);  
});


sortMktCap.addEventListener("click", () => {
  const arr = JSON.parse(localStorage.getItem("coinData"));
  const sorted = arr.sort((a, b) => b.market_cap - a.market_cap); // Descending order
  loopObject(sorted);
});

sortPercentage.addEventListener("click", () => {
  const arr = JSON.parse(localStorage.getItem("coinData"));
  const sorted = arr.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h); // Descending order
  loopObject(sorted);
});
