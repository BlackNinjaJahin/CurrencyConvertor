
const BASE_URL ="https://data.fixer.io/api/latest?access_key=ce9ed42df34f2ee4f8ba49446e3c7dc4";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "BDT") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {  
  let amount = document.querySelector(".amount input");  
  let amtVal = amount.value;  

  // Default to 1 if input is empty or less than 1  
  if (amtVal === "" || amtVal < 1) {  
    amtVal = 1;  
    amount.value = "1";  
  }  

  try {  
    // Fetch latest rates  
    const response = await fetch(BASE_URL);  
    const data = await response.json();  

    // Check if response is successful  
    if (!data.success) {  
      msg.innerText = "Error fetching exchange rates.";  
      return;  
    }  

    // Get rates for the selected currencies  
    const fromRate = data.rates[fromCurr.value];  
    const toRate = data.rates[toCurr.value];  
    
    // Validate rates  
    if (!fromRate || !toRate) {  
      msg.innerText = "Currency not available.";  
      return;  
    }  

    // Calculate final amount  
    let rate = toRate / fromRate; // Exchange impact  
    let finalAmount = amtVal * rate; // Convert value  

    // Update message  
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`; // Show 2 decimal places  
  } catch (error) {  
    msg.innerText = "Error fetching exchange rates. Please try again later.";  
  }  
};  

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
