import fs from 'fs';
import pdfParse from 'pdf-parse';

// read PDF from file and return txt
async function pdfToText(pdfPath: string, outputPath: string): Promise<void> {
    try {
        // Read the PDF file as a buffer
        const dataBuffer = fs.readFileSync(pdfPath);

        // Parse the PDF to extract text
        const pdfData = await pdfParse(dataBuffer);

        // Write the extracted text to a new text file
        fs.writeFileSync(outputPath, pdfData.text);

        console.log(`PDF content has been written to ${outputPath}`);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Example usage
const inputPdfPath = './PDFs/example.pdf';   // Replace with your PDF file path
const outputTxtPath = 'output.txt';   // Desired output text file path

pdfToText(inputPdfPath, outputTxtPath);
