import PDFDocument from 'pdfkit'
import bwipjs from 'bwip-js'

function numberToWords(num: number): string {
    const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];

    const numStr = num.toString();
    if (numStr.length > 9) return 'overflow';
    const n = ('000000000' + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return ''; 
    let str = '';
    str += (n[1] != '00') ? (a[Number(n[1])] || b[Number(n[1][0])] + ' ' + a[Number(n[1][1])]) + 'Crore ' : '';
    str += (n[2] != '00') ? (a[Number(n[2])] || b[Number(n[2][0])] + ' ' + a[Number(n[2][1])]) + 'Lakh ' : '';
    str += (n[3] != '00') ? (a[Number(n[3])] || b[Number(n[3][0])] + ' ' + a[Number(n[3][1])]) + 'Thousand ' : '';
    str += (n[4] != '0') ? (a[Number(n[4])] || b[Number(n[4][0])] + ' ' + a[Number(n[4][1])]) + 'Hundred ' : '';
    str += (n[5] != '00') ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[Number(n[5][0])] + ' ' + a[Number(n[5][1])]) : '';
    return str.trim() + ' Rupees Only';
}

export async function generateInvoicePDF(order: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const buffers: Buffer[] = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));

            // Fonts
            const H1 = 14;
            const H2 = 12;
            const H3 = 10;
            const BODY = 9;
            
            // Company Header
            doc.fontSize(H1).font('Helvetica-Bold').text('ACTIVEWELL PHARMA PRIVATE LIMITED', 50, 50);
            doc.fontSize(H1).text('TAX INVOICE', 50, 50, { align: 'right' });
            doc.fontSize(BODY).font('Helvetica').fillColor('#666666').text('0- Saili Kulian, Near Kabir Mandir, Pathankot, Punjab 145001, India', 50, 68);
            doc.text('GSTIN: 03ABECA1029K1Z2', 50, 80);
            
            doc.moveDown(2);
            
            // Line
            doc.moveTo(50, 95).lineTo(545, 95).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
            
            // Details
            const createdDate = new Date(order.created_at).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
            const createdTime = new Date(order.created_at).toLocaleTimeString('en-IN', {
                hour: '2-digit', minute: '2-digit'
            });

            const shortId = order.id.slice(0,8).toUpperCase();
            
            doc.fillColor('#666666').fontSize(BODY).text('Invoice No.', 50, 115);
            doc.fillColor('#000000').font('Helvetica-Bold').text(`INV-${shortId}`, 150, 115);
            
            doc.fillColor('#666666').font('Helvetica').text('Invoice Date', 50, 135);
            doc.fillColor('#000000').font('Helvetica-Bold').text(createdDate, 150, 135);

            doc.fillColor('#666666').font('Helvetica').text('Order No.', 50, 155);
            doc.fillColor('#000000').font('Helvetica-Bold').text(`#${order.id.slice(0,8)}`, 150, 155);

            doc.fillColor('#666666').font('Helvetica').text('Order Date', 50, 175);
            doc.fillColor('#000000').font('Helvetica-Bold').text(`${createdDate}, ${createdTime}`, 150, 175);

            doc.fillColor('#666666').font('Helvetica').text('Payment Mode', 300, 115);
            doc.fillColor('#000000').font('Helvetica-Bold').text('Prepaid', 400, 115);

            // Line
            doc.moveTo(50, 200).lineTo(545, 200).lineWidth(0.5).strokeColor('#e2e8f0').stroke();

            // Addresses
            const addr = order.shipping_address || order.delivery_address || {};
            const customerName = order.profiles?.full_name || addr.name || 'Guest';
            const customerEmail = order.profiles?.email || order.guest_email || addr.email || '';
            const customerPhone = order.profiles?.phone || order.guest_phone || addr.phone || '';

            doc.fillColor('#666666').font('Helvetica-Bold').fontSize(H3).text('BILLED TO', 50, 220);
            doc.fillColor('#000000').font('Helvetica-Bold').text(customerName, 50, 240);
            doc.font('Helvetica').fillColor('#666666').fontSize(BODY);
            
            const addrLines = [
                addr.address_line,
                addr.locality,
                [addr.city, addr.state, addr.pincode].filter(Boolean).join(', '),
                'India',
                customerPhone ? `Phone: ${customerPhone}` : '',
                customerEmail ? `Email: ${customerEmail}` : ''
            ].filter(Boolean);
            
            let currentY = 255;
            addrLines.forEach(line => {
                doc.text(line, 50, currentY);
                currentY += 14;
            });

            doc.fillColor('#666666').font('Helvetica-Bold').fontSize(H3).text('SHIPPED TO', 300, 220);
            doc.fillColor('#000000').font('Helvetica-Bold').text(customerName, 300, 240);
            doc.font('Helvetica').fillColor('#666666').fontSize(BODY);
            
            currentY = 255;
            addrLines.forEach(line => {
                doc.text(line, 300, currentY);
                currentY += 14;
            });

            currentY = Math.max(currentY + 20, 340);
            
            // Table Header Background
            doc.rect(50, currentY, 495, 25).fill('#f8fafc');
            
            doc.fillColor('#475569').font('Helvetica-Bold').fontSize(8);
            doc.text('DESCRIPTION', 60, currentY + 8, { width: 110 });
            doc.text('QTY', 170, currentY + 8, { width: 30, align: 'right' });
            doc.text('UNIT PRICE', 210, currentY + 8, { width: 60, align: 'right' });
            doc.text('DISCOUNT', 280, currentY + 8, { width: 60, align: 'right' });
            doc.text('TAXABLE VALUE', 350, currentY + 8, { width: 75, align: 'right' });
            doc.text('GST', 435, currentY + 8, { width: 45, align: 'right' });
            doc.text('TOTAL', 490, currentY + 8, { width: 50, align: 'right' });

            currentY += 35;
            
            let grandTotal = Number(order.total_amount);
            let shipping = Number(order.shipping_amount) || 0;

            const items = order.order_items || [];
            
            const totalOrderGross = items.reduce((sum: number, it: any) => sum + (Number(it.price_at_purchase) * it.quantity), 0);
            const totalOrderDiscount = Number(order.discount_amount) || 0;
            
            items.forEach((item: any) => {
                const qty = item.quantity;
                const taxInclusiveUnitPrice = Number(item.price_at_purchase);
                const taxInclusiveTotal = taxInclusiveUnitPrice * qty;
                
                const lineDiscount = (totalOrderGross > 0) ? (totalOrderDiscount * (taxInclusiveTotal / totalOrderGross)) : 0;
                
                const unitPriceExGST = taxInclusiveUnitPrice / 1.05;
                const discountExGST = lineDiscount / 1.05;
                const taxableValue = (taxInclusiveTotal - lineDiscount) / 1.05;
                const gst = (taxInclusiveTotal - lineDiscount) - taxableValue;
                const total = taxInclusiveTotal - lineDiscount;

                doc.fillColor('#000000').font('Helvetica').fontSize(BODY);
                doc.text(item.product?.name || 'Item', 60, currentY, { width: 110 });
                
                doc.fillColor('#666666').fontSize(8).text('HSN/SAC: 30049099', 60, currentY + 12);
                
                doc.fillColor('#000000').fontSize(BODY);
                doc.text(qty.toString(), 170, currentY, { width: 30, align: 'right' });
                doc.text(`Rs. ${unitPriceExGST.toFixed(2)}`, 210, currentY, { width: 60, align: 'right' });
                doc.text(`Rs. ${discountExGST.toFixed(2)}`, 280, currentY, { width: 60, align: 'right' });
                doc.text(`Rs. ${taxableValue.toFixed(2)}`, 350, currentY, { width: 75, align: 'right' });
                doc.text(`Rs. ${gst.toFixed(2)}`, 435, currentY, { width: 45, align: 'right' });
                doc.text(`Rs. ${total.toFixed(2)}`, 490, currentY, { width: 50, align: 'right' });

                currentY += 30;
            });

            currentY += 10;
            // Totals Box
            doc.moveTo(300, currentY).lineTo(545, currentY).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
            currentY += 15;

            const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.price_at_purchase) * item.quantity), 0);
            const discount = Number(order.discount_amount) || 0;
            const postDiscountGoods = subtotal - discount;
            const taxableValue = postDiscountGoods / 1.05;
            const totalTax = postDiscountGoods - taxableValue;

            doc.fillColor('#666666').font('Helvetica').text('Subtotal', 300, currentY, { width: 100, align: 'right' });
            doc.fillColor('#000000').text(`Rs. ${subtotal.toFixed(2)}`, 420, currentY, { width: 115, align: 'right' });
            currentY += 15;

            if (discount > 0) {
                doc.fillColor('#666666').font('Helvetica').text('Discount', 300, currentY, { width: 100, align: 'right' });
                doc.fillColor('#16a34a').text(`- Rs. ${discount.toFixed(2)}`, 420, currentY, { width: 115, align: 'right' });
                currentY += 15;
            }

            doc.fillColor('#666666').font('Helvetica').text('Taxable Value', 300, currentY, { width: 100, align: 'right' });
            doc.fillColor('#000000').text(`Rs. ${taxableValue.toFixed(2)}`, 420, currentY, { width: 115, align: 'right' });
            currentY += 15;

            doc.fillColor('#666666').font('Helvetica').text('GST (5%)', 300, currentY, { width: 100, align: 'right' });
            doc.fillColor('#000000').text(`Rs. ${totalTax.toFixed(2)}`, 420, currentY, { width: 115, align: 'right' });
            currentY += 15;

            doc.fillColor('#666666').font('Helvetica').text('Shipping & Handling', 300, currentY, { width: 100, align: 'right' });
            doc.fillColor('#000000').text(`Rs. ${shipping.toFixed(2)}`, 420, currentY, { width: 115, align: 'right' });
            currentY += 25;

            doc.fillColor('#000000').font('Helvetica-Bold').fontSize(H2).text('Grand Total', 300, currentY, { width: 100, align: 'right' });
            doc.text(`Rs. ${grandTotal.toFixed(2)}`, 420, currentY, { width: 115, align: 'right' });
            
            currentY += 25;
            
            doc.fillColor('#666666').font('Helvetica-Oblique').fontSize(BODY).text(`Amount in words: ${numberToWords(Math.round(grandTotal))}`, 50, currentY, { align: 'right' });

            // Footer
            const footerY = currentY + 40;
            doc.moveTo(50, footerY).lineTo(545, footerY).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
            
            doc.fillColor('#000000').font('Helvetica-Bold').fontSize(BODY).text('TERMS & CONDITIONS', 50, footerY + 20);
            doc.fillColor('#666666').font('Helvetica').fontSize(8);
            doc.text('- This is a computer-generated invoice and does not require a physical signature.', 50, footerY + 35);
            doc.text('- Goods once sold are subject to the return/refund policy stated on our website.', 50, footerY + 47);
            doc.text('- For queries related to this order, please contact our support team with the order number above.', 50, footerY + 59);

            doc.moveTo(50, footerY + 80).lineTo(545, footerY + 80).lineWidth(0.5).strokeColor('#e2e8f0').stroke();

            doc.fillColor('#000000').font('Helvetica-Bold').fontSize(BODY).text('IF UNDELIVERED, RETURN TO', 50, footerY + 100);
            doc.fontSize(10).text('Activewell Pharma Private Limited', 50, footerY + 115);
            doc.fillColor('#666666').font('Helvetica').fontSize(9).text('0- Saili Kulian, Near Kabir Mandir, Pathankot,\nPunjab 145001, India', 50, footerY + 130);

            doc.fillColor('#666666').text('For Activewell Pharma Private Limited', 300, footerY + 115, { align: 'right' });
            doc.font('Helvetica-Oblique').text('Authorised Signatory', 300, footerY + 145, { align: 'right' });

            doc.fillColor('#94a3b8').font('Helvetica').fontSize(8).text('This is a system-generated sample invoice.', 50, footerY + 175, { align: 'center' });

            doc.end();
        } catch (e) {
            reject(e);
        }
    });
}

export async function generateLabelPDF(order: any): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const buffers: Buffer[] = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));

            // Header
            doc.fontSize(14).font('Helvetica-Bold').text('activewell pharma', 50, 50);
            doc.fillColor('#666666').font('Helvetica').fontSize(10).text('Package Label', 50, 53, { align: 'right' });
            
            doc.moveTo(50, 75).lineTo(545, 75).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
            
            // Ship To
            doc.fillColor('#666666').font('Helvetica-Bold').fontSize(9).text('SHIP TO', 50, 95);
            
            const addr = order.shipping_address || order.delivery_address || {};
            const customerName = order.profiles?.full_name || addr.name || 'Guest';
            const customerPhone = order.profiles?.phone || order.guest_phone || addr.phone || '';

            doc.fillColor('#000000').fontSize(14).text(customerName, 50, 115);
            
            doc.font('Helvetica').fontSize(10);
            let currentY = 135;
            const addrLines = [
                addr.address_line,
                addr.locality,
                [addr.city, addr.state, addr.pincode].filter(Boolean).join(', '),
                'India',
                customerPhone ? `Phone: ${customerPhone}` : ''
            ].filter(Boolean);
            
            addrLines.forEach(line => {
                doc.text(line, 50, currentY);
                currentY += 15;
            });

            currentY += 25;
            doc.moveTo(50, currentY).lineTo(545, currentY).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
            
            currentY += 20;
            
            // Barcode
            doc.fillColor('#666666').font('Helvetica-Bold').fontSize(9).text('ORDER NUMBER', 50, currentY);
            doc.fillColor('#000000').fontSize(14).text(`#${order.id.slice(0,8)}`, 50, currentY, { align: 'right' });
            
            currentY += 25;
            try {
                const barcodeBuffer = await bwipjs.toBuffer({
                    bcid: 'code128',
                    text: order.id.slice(0,8),
                    scale: 3,
                    height: 10,
                    includetext: true,
                    textxalign: 'center',
                });
                doc.image(barcodeBuffer, 50, currentY, { width: 495, height: 60 });
            } catch (e) {
                console.error('Barcode generation error', e);
            }
            
            currentY += 90;
            doc.moveTo(50, currentY).lineTo(545, currentY).lineWidth(0.5).strokeColor('#e2e8f0').stroke();

            // Items Ordered
            currentY += 20;
            doc.fillColor('#666666').font('Helvetica-Bold').fontSize(9).text('ITEMS ORDERED', 50, currentY);
            
            currentY += 25;
            doc.text('ITEM', 50, currentY);
            doc.text('QTY', 500, currentY, { width: 45, align: 'right' });
            
            currentY += 15;
            doc.moveTo(50, currentY).lineTo(545, currentY).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
            currentY += 15;
            
            const items = order.order_items || [];
            doc.fillColor('#000000').font('Helvetica').fontSize(10);
            
            items.forEach((item: any) => {
                doc.text(item.product?.name || 'Item', 50, currentY);
                doc.text(item.quantity.toString(), 500, currentY, { width: 45, align: 'right' });
                currentY += 20;
            });

            currentY += 20;
            doc.moveTo(50, currentY).lineTo(545, currentY).lineWidth(0.5).strokeColor('#e2e8f0').stroke();

            // Return To
            currentY += 30;
            doc.fillColor('#666666').font('Helvetica-Bold').fontSize(9).text('IF UNDELIVERED, RETURN TO', 50, currentY);
            doc.fillColor('#000000').fontSize(10).text('Activewell Pharma Private Limited', 50, currentY + 15);
            doc.fillColor('#666666').font('Helvetica').fontSize(9).text('0- Saili Kulian, Near Kabir Mandir, Pathankot,\nPunjab 145001, India', 50, currentY + 30);
            
            doc.fillColor('#94a3b8').font('Helvetica').fontSize(8).text('This is a system-generated document. No signature required.', 50, currentY + 60, { align: 'center' });

            doc.end();
        } catch (e) {
            reject(e);
        }
    });
}
