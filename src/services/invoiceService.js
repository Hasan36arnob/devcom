// Invoice Generation and PDF Export Service

export const InvoiceService = {
  generateInvoiceNumber: (orderId) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}${day}-${random}`;
  },

  generateInvoiceData: (order) => {
    return {
      invoiceNumber: order.invoiceNumber || InvoiceService.generateInvoiceNumber(order._id),
      orderId: order._id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      orderDate: new Date(order.createdAt).toLocaleDateString(),
      items: order.items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      })),
      subtotal: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      shippingCost: order.shippingCost || 0,
      discount: order.discount || 0,
      tax: order.tax || 0,
      total: order.total,
      paymentMethod: order.paymentMethod || 'COD',
      paymentStatus: order.paymentStatus || 'Pending',
      orderStatus: order.status,
    };
  },

  generateHTMLInvoice: (invoiceData) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoiceData.invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .invoice-container { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #333; }
    .invoice-details { text-align: right; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #333; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f5f5f5; }
    .totals { text-align: right; }
    .total-row { font-weight: bold; font-size: 16px; }
    .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div class="logo">Your Store Name</div>
      <div class="invoice-details">
        <h2>INVOICE</h2>
        <p>Invoice #: ${invoiceData.invoiceNumber}</p>
        <p>Date: ${invoiceData.orderDate}</p>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Bill To:</div>
      <p><strong>${invoiceData.customerName}</strong></p>
      <p>${invoiceData.customerEmail}</p>
      <p>${invoiceData.customerPhone}</p>
      <p>${invoiceData.customerAddress}</p>
    </div>

    <div class="section">
      <div class="section-title">Order Details:</div>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceData.items.map(item => `
            <tr>
              <td>${item.productName}</td>
              <td>${item.quantity}</td>
              <td>${item.price.toFixed(2)} BDT</td>
              <td>${item.subtotal.toFixed(2)} BDT</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="section totals">
      <p>Subtotal: ${invoiceData.subtotal.toFixed(2)} BDT</p>
      <p>Shipping: ${invoiceData.shippingCost.toFixed(2)} BDT</p>
      <p>Discount: -${invoiceData.discount.toFixed(2)} BDT</p>
      <p>Tax: ${invoiceData.tax.toFixed(2)} BDT</p>
      <p class="total-row">Total: ${invoiceData.total.toFixed(2)} BDT</p>
    </div>

    <div class="section">
      <div class="section-title">Payment Information:</div>
      <p>Payment Method: ${invoiceData.paymentMethod}</p>
      <p>Payment Status: ${invoiceData.paymentStatus}</p>
      <p>Order Status: ${invoiceData.orderStatus}</p>
    </div>

    <div class="footer">
      <p>Thank you for your business!</p>
      <p>For any queries, please contact us at support@yourstore.com</p>
    </div>
  </div>
</body>
</html>
    `;
  },

  downloadInvoice: (order) => {
    const invoiceData = InvoiceService.generateInvoiceData(order);
    const htmlContent = InvoiceService.generateHTMLInvoice(invoiceData);
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoiceData.invoiceNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  printInvoice: (order) => {
    const invoiceData = InvoiceService.generateInvoiceData(order);
    const htmlContent = InvoiceService.generateHTMLInvoice(invoiceData);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  },
};
