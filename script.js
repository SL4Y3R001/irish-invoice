document.getElementById('invoiceDate').valueAsDate = new Date();

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    if (tabName === 'preview') {
        generateInvoicePreview();
    }
}

function addLineItem() {
    const container = document.getElementById('lineItems');
    const itemCount = container.children.length + 1;
    const newItem = document.createElement('div');
    newItem.className = 'line-item';
    newItem.innerHTML = `
        <div class="line-item-header">
            <span>Item ${itemCount}</span>
            <button type="button" class="btn-remove" onclick="removeLineItem(this)">Remove</button>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Description *</label>
                <input type="text" class="description" required placeholder="Product description">
            </div>
            <div class="form-group">
                <label>HS Code</label>
                <input type="text" class="hsCode" placeholder="e.g., 6204.62.00">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Quantity *</label>
                <input type="number" class="quantity" required value="1" min="1" onchange="calculateTotals()">
            </div>
            <div class="form-group">
                <label>Unit</label>
                <input type="text" class="unit" placeholder="e.g., PCS, KG, M" value="PCS">
            </div>
            <div class="form-group">
                <label>Unit Price *</label>
                <input type="number" class="unitPrice" required step="0.01" onchange="calculateTotals()" placeholder="0.00">
            </div>
            <div class="form-group">
                <label>Total</label>
                <input type="number" class="lineTotal" readonly step="0.01">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Country of Origin</label>
                <input type="text" class="originCountry" placeholder="e.g., United States">
            </div>
            <div class="form-group">
                <label>Weight (kg)</label>
                <input type="number" class="weight" step="0.01" placeholder="0.00">
            </div>
        </div>
    `;
    container.appendChild(newItem);
}

function removeLineItem(button) {
    const container = document.getElementById('lineItems');
    if (container.children.length > 1) {
        button.closest('.line-item').remove();
        calculateTotals();
    } else {
        alert('You must have at least one line item.');
    }
}

function calculateTotals() {
    const lineItems = document.querySelectorAll('.line-item');
    let subtotal = 0;
    lineItems.forEach(item => {
        const quantity = parseFloat(item.querySelector('.quantity').value) || 0;
        const unitPrice = parseFloat(item.querySelector('.unitPrice').value) || 0;
        const lineTotal = quantity * unitPrice;
        item.querySelector('.lineTotal').value = lineTotal.toFixed(2);
        subtotal += lineTotal;
    });
    document.getElementById('subtotal').value = subtotal.toFixed(2);
    const insurancePercent = parseFloat(document.getElementById('insurancePercent').value) || 0;
    const insuranceAmount = (subtotal * insurancePercent) / 100;
    document.getElementById('insuranceAmount').value = insuranceAmount.toFixed(2);
    const shipping = parseFloat(document.getElementById('shipping').value) || 0;
    const otherCharges = parseFloat(document.getElementById('otherCharges').value) || 0;
    const totalValue = subtotal + insuranceAmount + shipping + otherCharges;
    document.getElementById('totalValue').value = totalValue.toFixed(2);
}

function updateCurrency() {}

function clearForm() {
    if (confirm('Are you sure you want to clear the entire form?')) {
        document.getElementById('invoiceForm').reset();
        document.getElementById('invoiceDate').valueAsDate = new Date();
        const container = document.getElementById('lineItems');
        container.innerHTML = `
            <div class="line-item">
                <div class="line-item-header">
                    <span>Item 1</span>
                    <button type="button" class="btn-remove" onclick="removeLineItem(this)">Remove</button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Description *</label>
                        <input type="text" class="description" required placeholder="Product description">
                    </div>
                    <div class="form-group">
                        <label>HS Code</label>
                        <input type="text" class="hsCode" placeholder="e.g., 6204.62.00">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Quantity *</label>
                        <input type="number" class="quantity" required value="1" min="1" onchange="calculateTotals()">
                    </div>
                    <div class="form-group">
                        <label>Unit</label>
                        <input type="text" class="unit" placeholder="e.g., PCS, KG, M" value="PCS">
                    </div>
                    <div class="form-group">
                        <label>Unit Price *</label>
                        <input type="number" class="unitPrice" required step="0.01" onchange="calculateTotals()" placeholder="0.00">
                    </div>
                    <div class="form-group">
                        <label>Total</label>
                        <input type="number" class="lineTotal" readonly step="0.01">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Country of Origin</label>
                        <input type="text" class="originCountry" placeholder="e.g., United States">
                    </div>
                    <div class="form-group">
                        <label>Weight (kg)</label>
                        <input type="number" class="weight" step="0.01" placeholder="0.00">
                    </div>
                </div>
            </div>
        `;
        calculateTotals();
    }
}

function generateInvoicePreview() {
    const form = document.getElementById('invoiceForm');
    if (!form.checkValidity()) {
        alert('Please fill in all required fields marked with *');
        return;
    }
    const invoiceNum = document.getElementById('invoiceNum').value;
    const invoiceDate = document.getElementById('invoiceDate').value;
    const currency = document.getElementById('currency').value;
    const shipperCompany = document.getElementById('shipperCompany').value;
    const shipperAddress = document.getElementById('shipperAddress').value;
    const shipperCity = document.getElementById('shipperCity').value;
    const shipperState = document.getElementById('shipperState').value;
    const shipperZip = document.getElementById('shipperZip').value;
    const shipperCountry = document.getElementById('shipperCountry').value;
    const consigneeCompany = document.getElementById('consigneeCompany').value;
    const consigneeAddress = document.getElementById('consigneeAddress').value;
    const consigneeCity = document.getElementById('consigneeCity').value;
    const consigneeCounty = document.getElementById('consigneeCounty').value;
    const consigneeZip = document.getElementById('consigneeZip').value;
    const consigneeVAT = document.getElementById('consigneeVAT').value;
    const subtotal = document.getElementById('subtotal').value;
    const insuranceAmount = document.getElementById('insuranceAmount').value;
    const shipping = document.getElementById('shipping').value;
    const otherCharges = document.getElementById('otherCharges').value;
    const totalValue = document.getElementById('totalValue').value;
    const incoterms = document.getElementById('incoterms').value;
    const notes = document.getElementById('notes').value;
    const lineItems = document.querySelectorAll('.line-item');
    let itemsHTML = '';
    let totalWeight = 0;
    lineItems.forEach((item, index) => {
        const description = item.querySelector('.description').value;
        const hsCode = item.querySelector('.hsCode').value;
        const quantity = item.querySelector('.quantity').value;
        const unit = item.querySelector('.unit').value;
        const unitPrice = item.querySelector('.unitPrice').value;
        const lineTotal = item.querySelector('.lineTotal').value;
        const weight = parseFloat(item.querySelector('.weight').value) || 0;
        totalWeight += weight;
        itemsHTML += `<tr><td>${index + 1}</td><td>${description}</td><td>${hsCode || 'N/A'}</td><td>${quantity}</td><td>${unit}</td><td>${currency} ${parseFloat(unitPrice).toFixed(2)}</td><td>${currency} ${parseFloat(lineTotal).toFixed(2)}</td></tr>`;
    });
    const preview = `
        <div class="invoice-header">
            <div class="invoice-title">COMMERCIAL INVOICE</div>
            <div class="invoice-meta">
                <div class="invoice-meta-item"><label>Invoice No:</label><div>${invoiceNum}</div></div>
                <div class="invoice-meta-item"><label>Invoice Date:</label><div>${new Date(invoiceDate).toLocaleDateString()}</div></div>
                <div class="invoice-meta-item"><label>Currency:</label><div>${currency}</div></div>
            </div>
        </div>
        <div class="invoice-addresses">
            <div class="address-block">
                <h3>From (Shipper)</h3>
                <strong>${shipperCompany}</strong><br>${shipperAddress}<br>${shipperCity}, ${shipperState} ${shipperZip}<br>${shipperCountry}
            </div>
            <div class="address-block">
                <h3>To (Consignee - Ireland)</h3>
                <strong>${consigneeCompany}</strong><br>${consigneeVAT ? 'VAT: ' + consigneeVAT + '<br>' : ''}${consigneeAddress}<br>${consigneeCity}, ${consigneeCounty} ${consigneeZip}<br>Ireland
            </div>
        </div>
        <div class="invoice-items">
            <table class="invoice-table">
                <thead><tr><th>No.</th><th>Description of Goods</th><th>HS Code</th><th>Qty</th><th>Unit</th><th>Unit Price</th><th>Amount</th></tr></thead>
                <tbody>${itemsHTML}</tbody>
            </table>
        </div>
        <div class="invoice-totals">
            <div class="totals-box">
                <div><span>Subtotal:</span><span>${currency} ${parseFloat(subtotal).toFixed(2)}</span></div>
                <div><span>Insurance:</span><span>${currency} ${parseFloat(insuranceAmount).toFixed(2)}</span></div>
                <div><span>Shipping:</span><span>${currency} ${parseFloat(shipping).toFixed(2)}</span></div>
                <div><span>Other Charges:</span><span>${currency} ${parseFloat(otherCharges).toFixed(2)}</span></div>
                <div><span>TOTAL DECLARED VALUE:</span><span>${currency} ${parseFloat(totalValue).toFixed(2)}</span></div>
            </div>
        </div>
        <div style="margin-top: 20px; font-size: 0.9em;">
            <p><strong>Total Weight:</strong> ${totalWeight.toFixed(2)} kg</p>
            <p><strong>Terms of Trade (Incoterms):</strong> ${incoterms}</p>
            ${notes ? `<p><strong>Special Instructions:</strong><br>${notes}</p>` : ''}
        </div>
        <div class="declaration">
            We hereby certify that the particulars given above are correct and complete. The value shown represents the true invoiced value for the above goods and is not affected by any agreement or understanding with respect to the subsequent use, sale or re-export of the goods.
        </div>
    `;
    document.getElementById('invoicePreview').innerHTML = preview;
}

function printInvoice() {
    window.print();
}

function downloadPDF() {
    alert('PDF export requires a library like jsPDF. For now, use Print > Save as PDF in your browser.');
    window.print();
}

function downloadExcel() {
    const invoiceNum = document.getElementById('invoiceNum').value;
    const filename = `Commercial-Invoice-${invoiceNum}.xlsx`;
    let csv = 'COMMERCIAL INVOICE\n\n';
    csv += `Invoice No.,${document.getElementById('invoiceNum').value}\n`;
    csv += `Invoice Date,${document.getElementById('invoiceDate').value}\n`;
    csv += `Currency,${document.getElementById('currency').value}\n\n`;
    csv += 'FROM (SHIPPER)\n';
    csv += `Company,${document.getElementById('shipperCompany').value}\n`;
    csv += `Address,${document.getElementById('shipperAddress').value}\n`;
    csv += `City,${document.getElementById('shipperCity').value}\n`;
    csv += `Country,${document.getElementById('shipperCountry').value}\n\n`;
    csv += 'TO (CONSIGNEE - IRELAND)\n';
    csv += `Company,${document.getElementById('consigneeCompany').value}\n`;
    csv += `VAT Number,${document.getElementById('consigneeVAT').value}\n`;
    csv += `Address,${document.getElementById('consigneeAddress').value}\n`;
    csv += `City,${document.getElementById('consigneeCity').value}\n\n`;
    csv += 'LINE ITEMS\n';
    csv += 'Description,HS Code,Quantity,Unit,Unit Price,Total\n';
    const lineItems = document.querySelectorAll('.line-item');
    lineItems.forEach(item => {
        const description = item.querySelector('.description').value;
        const hsCode = item.querySelector('.hsCode').value;
        const quantity = item.querySelector('.quantity').value;
        const unit = item.querySelector('.unit').value;
        const unitPrice = item.querySelector('.unitPrice').value;
        const lineTotal = item.querySelector('.lineTotal').value;
        csv += `"${description}",${hsCode},${quantity},${unit},${unitPrice},${lineTotal}\n`;
    });
    csv += '\nTOTALS\n';
    csv += `Subtotal,${document.getElementById('subtotal').value}\n`;
    csv += `Insurance,${document.getElementById('insuranceAmount').value}\n`;
    csv += `Shipping,${document.getElementById('shipping').value}\n`;
    csv += `Other Charges,${document.getElementById('otherCharges').value}\n`;
    csv += `Total Value,${document.getElementById('totalValue').value}\n`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}

function loadTemplate(templateType) {
    const templates = {
        clothing: {
            shipperCompany: 'Sample Apparel Co.',
            shipperCountry: 'Vietnam',
            consigneeCompany: 'Irish Fashion Retailer Ltd.',
            consigneeVAT: 'IE1234567X',
            items: [{description: 'Cotton T-Shirts', hsCode: '6109.10.00', quantity: 100, unit: 'PCS', unitPrice: 5.50}]
        },
        electronics: {
            shipperCompany: 'Tech Exports Ltd.',
            shipperCountry: 'China',
            consigneeCompany: 'Irish Electronics Distributor',
            consigneeVAT: 'IE9876543X',
            items: [{description: 'USB-C Cables', hsCode: '8544.30.00', quantity: 500, unit: 'PCS', unitPrice: 2.00}]
        },
        machinery: {
            shipperCompany: 'Industrial Parts Co.',
            shipperCountry: 'Germany',
            consigneeCompany: 'Irish Manufacturing Ltd.',
            consigneeVAT: 'IE5555555X',
            items: [{description: 'Hydraulic Pump', hsCode: '8412.21.00', quantity: 5, unit: 'PCS', unitPrice: 450.00}]
        },
        samples: {
            shipperCompany: 'Trade Samples Co.',
            shipperCountry: 'United States',
            consigneeCompany: 'Irish Buyer Company',
            consigneeVAT: 'IE3333333X',
            items: [{description: 'Product Samples - No Commercial Value', hsCode: '9999.99.99', quantity: 10, unit: 'SET', unitPrice: 0.01}]
        }
    };
    const template = templates[templateType];
    document.getElementById('shipperCompany').value = template.shipperCompany;
    document.getElementById('shipperCountry').value = template.shipperCountry;
    document.getElementById('consigneeCompany').value = template.consigneeCompany;
    document.getElementById('consigneeVAT').value = template.consigneeVAT;
    const container = document.getElementById('lineItems');
    container.innerHTML = '';
    template.items.forEach((item, index) => {
        const lineItemHTML = `
            <div class="line-item">
                <div class="line-item-header">
                    <span>Item ${index + 1}</span>
                    <button type="button" class="btn-remove" onclick="removeLineItem(this)">Remove</button>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Description *</label>
                        <input type="text" class="description" required value="${item.description}">
                    </div>
                    <div class="form-group">
                        <label>HS Code</label>
                        <input type="text" class="hsCode" value="${item.hsCode}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Quantity *</label>
                        <input type="number" class="quantity" required value="${item.quantity}" min="1" onchange="calculateTotals()">
                    </div>
                    <div class="form-group">
                        <label>Unit</label>
                        <input type="text" class="unit" value="${item.unit}">
                    </div>
                    <div class="form-group">
                        <label>Unit Price *</label>
                        <input type="number" class="unitPrice" required step="0.01" value="${item.unitPrice}" onchange="calculateTotals()">
                    </div>
                    <div class="form-group">
                        <label>Total</label>
                        <input type="number" class="lineTotal" readonly step="0.01">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Country of Origin</label>
                        <input type="text" class="originCountry" placeholder="e.g., United States">
                    </div>
                    <div class="form-group">
                        <label>Weight (kg)</label>
                        <input type="number" class="weight" step="0.01" placeholder="0.00">
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += lineItemHTML;
    });
    calculateTotals();
    alert(`✅ Template loaded: ${templateType}`);
}