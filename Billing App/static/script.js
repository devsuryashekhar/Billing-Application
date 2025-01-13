document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-item-btn').addEventListener('click', addItem);
    document.getElementById('calculate-btn').addEventListener('click', calculateTotal);
    document.getElementById('invoice-btn').addEventListener('click', generateInvoice);
    document.getElementById('reset-btn').addEventListener('click', resetForm);
});

function addItem() {
    const itemName = document.getElementById('item-name').value.trim();
    const itemPrice = parseFloat(document.getElementById('item-price').value) || 0;
    const itemQuantity = parseInt(document.getElementById('item-quantity').value) || 0;
    const itemGst = parseFloat(document.getElementById('item-gst').value) || 0;

    if (!itemName || itemPrice <= 0 || itemQuantity <= 0) {
        alert("Please enter valid item details.");
        return;
    }

    const tableBody = document.querySelector('#invoice-table tbody');
    const row = document.createElement('tr');

    const subtotal = itemPrice * itemQuantity;
    const gstAmount = (subtotal * itemGst) / 100;
    const total = subtotal + gstAmount;

    row.innerHTML = `
        <td>${itemName}</td>
        <td>₹${itemPrice.toFixed(2)}</td>
        <td>${itemQuantity}</td>
        <td>${itemGst}%</td>
        <td>₹${total.toFixed(2)}</td>
        <td><button class="remove-item-btn">Remove</button></td>
    `;

    tableBody.appendChild(row);

    row.querySelector('.remove-item-btn').addEventListener('click', () => {
        row.remove();
        calculateTotal();
    });

    document.getElementById('item-name').value = '';
    document.getElementById('item-price').value = '';
    document.getElementById('item-quantity').value = '';
    document.getElementById('item-gst').value = '';
}

function calculateTotal() {
    const rows = document.querySelectorAll('#invoice-table tbody tr');
    let totalAmount = 0;

    rows.forEach(row => {
        const totalCell = row.cells[4].textContent.replace('₹', '');
        totalAmount += parseFloat(totalCell) || 0;
    });

    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
}

function generateInvoice() {
    const customerName = document.getElementById('customer-name').value.trim();
    const invoiceDate = document.getElementById('invoice-date').value;
    const rows = document.querySelectorAll('#invoice-table tbody tr');
    const totalAmount = document.getElementById('total-amount').textContent;

    if (!customerName || !invoiceDate) {
        alert("Please enter customer name and date.");
        return;
    }

    if (rows.length === 0) {
        alert("Please add items to generate an invoice.");
        return;
    }

    const doc = new jspdf.jsPDF();
    doc.setFontSize(14);
    doc.text("Invoice", 10, 10);
    doc.text(`Customer Name: ${customerName}`, 10, 20);
    doc.text(`Date: ${invoiceDate}`, 10, 30);

    let yPosition = 40;
    doc.setFontSize(12);
    rows.forEach(row => {
        const itemName = row.cells[0].textContent;
        const price = row.cells[1].textContent;
        const quantity = row.cells[2].textContent;
        const gst = row.cells[3].textContent;
        const total = row.cells[4].textContent;

        doc.text(`${itemName} - ${price} x ${quantity} + GST(${gst}) = ${total}`, 10, yPosition);
        yPosition += 10;

        if (yPosition > 270) {
            doc.addPage();
            yPosition = 10;
        }
    });

    doc.text(`Total Amount: ₹${totalAmount}`, 10, yPosition + 10);

    doc.save("invoice.pdf");
}

function resetForm() {
    document.querySelector('#invoice-table tbody').innerHTML = '';
    document.getElementById('total-amount').textContent = '0.00';
    document.getElementById('item-name').value = '';
    document.getElementById('item-price').value = '';
    document.getElementById('item-quantity').value = '';
    document.getElementById('item-gst').value = '';
    document.getElementById('customer-name').value = '';
    document.getElementById('invoice-date').value = '';
}
