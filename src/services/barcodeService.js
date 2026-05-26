// Barcode Generator and Product Label Printing Service

export const BarcodeService = {
  generateBarcode: (productId) => {
    // Simple barcode generation using Code 128 algorithm
    const barcodeValue = productId.toString();
    let barcode = '';
    
    // Code 128 character set
    const code128 = {
      '0': '11011001100', '1': '11001101100', '2': '11001100110', '3': '10010011000',
      '4': '10010001100', '5': '10001001100', '6': '10011001000', '7': '10011000100',
      '8': '10001100100', '9': '11001001000', 'A': '11001000100', 'B': '11000100100',
      'C': '10110011100', 'D': '10011011100', 'E': '10011001110', 'F': '10111001100',
      'G': '10011101100', 'H': '10011100110', 'I': '11001110010', 'J': '11001011100',
      'K': '11001001110', 'L': '11011100100', 'M': '11001110100', 'N': '11101101110',
      'O': '11101001100', 'P': '11100101100', 'Q': '11100100110', 'R': '11101100100',
      'S': '11100110100', 'T': '11100110010', 'U': '11011011000', 'V': '11011000110',
      'W': '11000110110', 'X': '10100011000', 'Y': '10001011000', 'Z': '10001000110',
      '-': '10110001000', '.': '10001101000', ' ': '10001000100', '$': '10110010100',
      '/': '10110010010', '+': '10000110100', '%': '10000110010', '*': '11001010010',
    };

    // Convert each character to barcode pattern
    for (let char of barcodeValue.toUpperCase()) {
      if (code128[char]) {
        barcode += code128[char];
      }
    }

    return {
      value: barcodeValue,
      pattern: barcode,
      svg: BarcodeService.generateBarcodeSVG(barcodeValue),
    };
  },

  generateBarcodeSVG: (value, width = 200, height = 50) => {
    const barcode = BarcodeService.generateBarcode(value);
    const barWidth = width / barcode.pattern.length;
    
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="100%" height="100%" fill="white"/>`;
    
    let x = 0;
    for (let char of barcode.pattern) {
      if (char === '1') {
        svg += `<rect x="${x}" y="0" width="${barWidth}" height="${height}" fill="black"/>`;
      }
      x += barWidth;
    }
    
    // Add text below barcode
    svg += `<text x="${width / 2}" y="${height - 5}" text-anchor="middle" font-family="Arial" font-size="12">${value}</text>`;
    svg += '</svg>';
    
    return svg;
  },

  generateProductLabel: (product, quantity = 1) => {
    const barcode = BarcodeService.generateBarcode(product._id);
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Product Label - ${product.productName}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 10px; }
    .label { 
      width: 300px; 
      height: 200px; 
      border: 2px solid #000; 
      padding: 15px; 
      margin: 10px;
      page-break-after: always;
    }
    .product-name { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
    .product-price { font-size: 18px; font-weight: bold; color: #e74c3c; margin-bottom: 10px; }
    .product-info { font-size: 12px; margin-bottom: 10px; }
    .barcode-container { text-align: center; margin-top: 10px; }
    .barcode-svg { width: 200px; height: 50px; }
    .quantity { font-size: 14px; font-weight: bold; margin-top: 10px; }
  </style>
</head>
<body>
  ${Array(quantity).fill(0).map(() => `
    <div class="label">
      <div class="product-name">${product.productName}</div>
      <div class="product-price">${product.price} BDT</div>
      <div class="product-info">
        Category: ${product.category}<br>
        Color: ${product.color || 'N/A'}<br>
        Stock: ${product.stock}
      </div>
      <div class="barcode-container">
        ${barcode.svg}
      </div>
      <div class="quantity">ID: ${product._id}</div>
    </div>
  `).join('')}
</body>
</html>
    `;
  },

  printProductLabel: (product, quantity = 1) => {
    const labelHTML = BarcodeService.generateProductLabel(product, quantity);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(labelHTML);
    printWindow.document.close();
    printWindow.print();
  },

  downloadProductLabel: (product, quantity = 1) => {
    const labelHTML = BarcodeService.generateProductLabel(product, quantity);
    const blob = new Blob([labelHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `label-${product._id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  generateQRCode: (data) => {
    // Simple QR code placeholder - in production use a library like qrcode.react
    return `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="white"/>
        <rect x="10" y="10" width="30" height="30" fill="black"/>
        <rect x="60" y="10" width="30" height="30" fill="black"/>
        <rect x="10" y="60" width="30" height="30" fill="black"/>
        <rect x="50" y="50" width="10" height="10" fill="black"/>
        <rect x="70" y="70" width="10" height="10" fill="black"/>
        <rect x="50" y="70" width="10" height="10" fill="black"/>
        <rect x="70" y="50" width="10" height="10" fill="black"/>
      </svg>
    `;
  },
};
