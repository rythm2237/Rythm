// Global variables
let productList;
let uploadedFileData;
let mergedData;

// Function to load the product list from JSON file
function loadProductList() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "productList.json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error("Failed to load the product list."));
        }
      }
    };
    xhr.send();
  });
}

// Function to convert Excel file to JSON
function convertExcelToJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      resolve(jsonData);
    };
    reader.onerror = function() {
      reject(new Error("Failed to read the file."));
    };
    reader.readAsArrayBuffer(file);
  });
}

// Function to merge the data and calculate the required information
function mergeAndCalculate() {
  mergedData = {};

  uploadedFileData.forEach(uploadedProduct => {
    const isellOrderNumber = uploadedProduct.ISELL_ORDER_NUMBER;
    const product = productList.find(p => p.itemNo === isellOrderNumber);

    if (product) {
      const { ARTICLE_NUMBER, ORDERED_QTY } = uploadedProduct;
      const { length, width, height, weight } = product;

      if (!mergedData[isellOrderNumber]) {
        mergedData[isellOrderNumber] = {
          itemNo: isellOrderNumber,
          length: length,
          width: width,
          height: height,
          weight: weight * ORDERED_QTY,
          ORDER_QTY: ORDERED_QTY
        };
      } else {
        mergedData[isellOrderNumber].weight += weight * ORDERED_QTY;
      }

      if (length > mergedData[isellOrderNumber].length) {
        mergedData[isellOrderNumber].length = length;
      }
    }
  });
}



// Function to display the table with the calculated information
function displayTable() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  Object.values(mergedData).forEach(order => {
    const { itemNo, weight, length } = order;

    const row = document.createElement("tr");
    const isellNumberCell = document.createElement("td");
    const totalWeightCell = document.createElement("td");
    const longestProductCell = document.createElement("td");
    const heaviestProductCell = document.createElement("td");

    isellNumberCell.textContent = itemNo;
    totalWeightCell.textContent = weight;
    longestProductCell.textContent = length;

    // Find the heaviest product in the order
    let heaviestProduct = null;
    for (const product of productList) {
      if (product.itemNo === itemNo) {
        if (!heaviestProduct || product.weight > heaviestProduct.weight) {
          heaviestProduct = product;
        }
      }
    }

    if (heaviestProduct) {
      heaviestProductCell.textContent = heaviestProduct.weight;
    } else {
      heaviestProductCell.textContent = "-";
    }

    row.appendChild(isellNumberCell);
    row.appendChild(totalWeightCell);
    row.appendChild(longestProductCell);
    row.appendChild(heaviestProductCell);
    tableBody.appendChild(row);
  });
}

// Function to handle the "Upload & Calculate" button click event
function convertAndCalculate() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file.");
    return;
  }

  convertExcelToJson(file)
    .then(jsonData => {
      uploadedFileData = jsonData;
      mergeAndCalculate();
      displayTable();
    })
    .catch(error => {
      console.error(error);
      alert("Failed to convert the file to JSON.");
    });
}

// Function to handle the "Show Table" button click event
function showTable() {
  if (!mergedData) {
    alert("Please upload a file and calculate the data first.");
    return;
  }

  displayTable();
}

// Load the product list and start the application
loadProductList()
  .then(data => {
    productList = data;
  })
  .catch(error => {
    console.error(error);
    alert("Failed to load the product list.");
  });
