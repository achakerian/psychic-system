import PDFParser from "pdf2json";

// Function to read a PDF file and write its content to a text file
function pdfToText(pdfPath: string): void {
  const pdfParser = new PDFParser();

  // Load the PDF file
  pdfParser.loadPDF(pdfPath);

  // Event listener for when PDF parsing is completed
  pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
    let extractedText = "";

    // Loop through each page
    pdfData.formImage.Pages.forEach((page: any) => {
      // Loop through each text object in the page
      page.Texts.forEach((text: any) => {
        // Concatenate decoded text to the extracted text
        extractedText += decodeURIComponent(text.R[0].T) + " ";
      });
    });

    // Write the extracted text to a new text file
    return extractedText;
  });

  // Error handling
  pdfParser.on("pdfParser_dataError", (error: any) => {
    console.error(
      "An error occurred while parsing the PDF:",
      error.parserError
    );
  });
}

const debug = true;
if (debug) {
  const inputPdfPath = "./PDF/example.pdf";
  pdfToText(inputPdfPath);
}
export { pdfToText };
