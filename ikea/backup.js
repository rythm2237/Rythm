// Assuming your JSON file is named "productList.json"

// Fetch the JSON file
fetch('productList.json')
  .then(response => response.json())
  .then(data => {
    // Store the JSON data in a variable for later use
    const productList = data;

    // Attach an event listener to the file input button
    document.getElementById('fileInput').addEventListener('change', function(e) {
      const file = e.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          const products = convertExcelDataToJSON(jsonData, productList);
          const packagingResults = calculatePackagingTypes(products);

          displayResults(packagingResults);
        };

        reader.readAsArrayBuffer(file);
      }
    });
  })
  .catch(error => {
    // Handle any errors that occur during the fetch
    console.error('Error loading JSON file:', error);
  });

  document.getElementById('calculateBtn').addEventListener('click', handleCalculate);

  function handleCalculate() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
        const products = convertExcelDataToJSON(jsonData);
        const packagingResults = calculatePackagingTypes(products);
  
        displayResults(packagingResults);
      };
  
      reader.readAsArrayBuffer(file);
    }
  }
  
  function convertExcelDataToJSON(data) {
    const headers = data[0];
    const products = [];
  
    for (let i = 1; i < data.length; i++) {
      const product = {};
  
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        const value = data[i][j];
        product[header] = value;
      }
  
      products.push(product);
    }
  
    return products;
  }
  
  // Rest of the code...
  
 // Constants for packaging types
const PACKAGING_MPP260 = "MPP260";
const PACKAGING_MPP200 = "MPP200";
const PACKAGING_EURO_PALLET = "Euro Pallet";
const PACKAGING_MIX_PALLET = "Trolley";

// Mapping of packaging types to their size
const PACKAGING_SIZE = {
  [PACKAGING_MPP260]: { length: 260, width: 71 },
  [PACKAGING_MPP200]: { length: 200, width: 71 },
  [PACKAGING_EURO_PALLET]: { length: 120, width: 80 },
};

// Calculate the type of packaging for each order
function calculatePackagingTypes(products) {
  const packagingResults = [];

  const groupedOrders = groupOrdersByISellNumber(products);

  for (const isellNumber in groupedOrders) {
    const orderProducts = groupedOrders[isellNumber];
    const totalWeight = calculateTotalWeight(orderProducts);
    const totalQuantity = calculateTotalQuantity(orderProducts);

    let packagingType = PACKAGING_MIX_PALLET;

    if (
      hasProductWithLengthMoreThan2000(orderProducts) ||
      totalWeight > 35 ||
      orderProducts.length > 3
    ) {
      if (totalWeight > 100) {
        packagingType = PACKAGING_MPP260;
      } else {
        packagingType = PACKAGING_MPP200;
      }
    } else if (totalWeight > 70) {
      packagingType = PACKAGING_EURO_PALLET;
    }

    packagingResults.push({
      isellNumber: isellNumber,
      top: packagingType,
      totalWeight: totalWeight,
      orderQuantity: totalQuantity,
    });
  }

  return packagingResults;
}

// Helper function to group products by ISellNumber
function groupOrdersByISellNumber(products) {
  const groupedOrders = {};

  products.forEach((product) => {
    const isellNumber = product.ISELL_ORDER_NUMBER;

    if (groupedOrders[isellNumber]) {
      groupedOrders[isellNumber].push(product);
    } else {
      groupedOrders[isellNumber] = [product];
    }
  });

  return groupedOrders;
}

// Helper function to calculate the total weight of products in an order
function calculateTotalWeight(products) {
  let totalWeight = 0;

  products.forEach((product) => {
    const weight = product.weight;
    const orderQuantity = product.ORDER_QTY;
    totalWeight += weight * orderQuantity;
  });

  return totalWeight;
}

// Helper function to calculate the total quantity of products in an order
function calculateTotalQuantity(products) {
  let totalQuantity = 0;

  products.forEach((product) => {
    const orderQuantity = product.ORDER_QTY;
    totalQuantity += orderQuantity;
  });

  return totalQuantity;
}

// Helper function to check if any product has length more than 2000
function hasProductWithLengthMoreThan2000(products) {
  return products.some((product) => product.length > 2000);
}

// Display the results in a table
function displayResults(packagingResults) {
  const tableBody = document.getElementById("resultsTableBody");
  tableBody.innerHTML = "";

  packagingResults.forEach((result) => {
    const row = document.createElement("tr");
    const isellNumberCell = document.createElement("td");
    const topCell = document.createElement("td");
    const totalWeightCell = document.createElement("td");
    const orderQuantityCell = document.createElement("td");

    isellNumberCell.innerHTML = result.isellNumber;
    topCell.innerHTML = result.top;
    totalWeightCell.innerHTML = result.totalWeight;
    orderQuantityCell.innerHTML = result.orderQuantity;

    row.appendChild(isellNumberCell);
    row.appendChild(topCell);
    row.appendChild(totalWeightCell);
    row.appendChild(orderQuantityCell);

    tableBody.appendChild(row);
  });
}

// Event listener for the calculate button
document.getElementById("calculateBtn").addEventListener("click", handleCalculate);

function handleCalculate() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const data = JSON.parse(e.target.result);
      const packagingResults = calculatePackagingTypes(data);
      displayResults(packagingResults);
    };

    reader.readAsText(file);
  }
}
