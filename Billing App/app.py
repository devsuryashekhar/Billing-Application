from flask import Flask, render_template, request, send_file
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4

app = Flask(__name__)

# Route to render the main page
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_invoice', methods=['POST'])
def generate_invoice():
    item_name = request.form.get('item-name')
    price = float(request.form.get('price'))
    quantity = int(request.form.get('quantity'))
    gst_rate = float(request.form.get('gst'))

    subtotal = price * quantity
    cgst = (subtotal * gst_rate / 2) / 100
    sgst = (subtotal * gst_rate / 2) / 100
    total_gst = cgst + sgst
    final_amount = subtotal + total_gst

    pdf_filename = 'invoice.pdf'
    pdf_path = f'./{pdf_filename}'
    c = canvas.Canvas(pdf_path, pagesize=A4)

    # Header Styling
    c.setFillColor(colors.green)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(200, 800, "Invoice Summary")

    # Details Section
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 12)
    y = 750
    details = [
        ("Item Name:", item_name),
        ("Price:", f"₹{price:.2f}"),
        ("Quantity:", quantity),
        ("Subtotal:", f"₹{subtotal:.2f}"),
        ("CGST:", f"₹{cgst:.2f}"),
        ("SGST:", f"₹{sgst:.2f}"),
        ("Total GST:", f"₹{total_gst:.2f}"),
        ("Final Amount:", f"₹{final_amount:.2f}")
    ]

    for label, value in details:
        c.setFont("Helvetica-Bold", 11)
        c.setFillColor(colors.blue)
        c.drawString(100, y, label)
        c.setFont("Helvetica", 11)
        c.setFillColor(colors.black)
        c.drawString(200, y, str(value))
        y -= 20

    # Footer
    c.setFont("Helvetica-Oblique", 10)
    c.setFillColor(colors.gray)
    c.drawString(200, 100, "Thank you for your shopping! Visit Again..")
    c.drawString(200, 85, f"Generated on: {request.form.get('date', '')}")

    c.showPage()
    c.save()

    return send_file(pdf_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
