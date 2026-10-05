export async function downloadHtmlAsPdf(
  htmlContent: string,
  filename: string,
  options: { landscape?: boolean; width?: number; height?: number } = {}
) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.top = "-10000px";
  iframe.style.left = "-10000px";
  iframe.style.width = options.width ? `${options.width}px` : (options.landscape ? "1123px" : "800px");
  iframe.style.height = options.height ? `${options.height}px` : (options.landscape ? "794px" : "1131px");
  iframe.style.border = "none";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) throw new Error("Could not access iframe document");

    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    // Give Tailwind CDN and webfonts a moment to settle
    await new Promise((resolve) => setTimeout(resolve, 500));

    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const targetElement = iframeDoc.body;
    const canvas = await html2canvas(targetElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: options.width || (options.landscape ? 1123 : 800),
      windowHeight: options.height || (options.landscape ? 794 : 1131),
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    const pdf = new jsPDF({
      orientation: options.landscape ? "landscape" : "portrait",
      unit: "pt",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Scale canvas into the PDF page while preserving aspect ratio
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const renderWidth = imgWidth * ratio;
    const renderHeight = imgHeight * ratio;
    const xOffset = (pdfWidth - renderWidth) / 2;
    const yOffset = (pdfHeight - renderHeight) / 2;

    pdf.addImage(imgData, "JPEG", xOffset, yOffset, renderWidth, renderHeight);
    pdf.save(filename);
  } finally {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }
}
