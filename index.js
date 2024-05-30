const { PDFDocument } = PDFLib;

const createPdfButton = document.querySelector("#create-pdf");
const fillPdfFormButton = document.querySelector("#fill-pdf");
const pdfIframe = document.querySelector("#pdf-iframe");

// Store pdf bytes globally so we don't have to create multiple pdfs
let PDF_BYTES;

/**
 *
 * EVENT HANDLERS
 *
 */

createPdfButton.addEventListener("click", async () => {
  try {
    PDF_BYTES = await handleCreatePdf();
    displayPdfBytesInIframe(pdfIframe, PDF_BYTES);
  } catch (e) {
    alert(`Something went wrong creating pdf! Error : ${e.message}`);
  }
});

fillPdfFormButton.addEventListener("click", async () => {
  try {
    PDF_BYTES = await fillPdfForm(PDF_BYTES);
    displayPdfBytesInIframe(pdfIframe, PDF_BYTES);
  } catch (e) {
    alert(`Something went wrong editing pdf! Error : ${e.message}`);
  }
});

/**
 *
 * MAIN FUNCTIONS
 *
 */

/**
 * Displays PDF bytes in Iframe via Blob URL
 */
function displayPdfBytesInIframe(iframeElement, pdfBytes) {
  if (!pdfBytes) {
    return;
  }
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  iframeElement.src = URL.createObjectURL(blob);
}

/**
 * Fills our pdf form and returns new bytes
 */
async function fillPdfForm(pdfBytes) {
  if (!pdfBytes) {
    alert("PDF has not been created! Please create PDF first!");
    return;
  }

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  const superheroField = form.getTextField("favorite.superhero");
  const rocketRadioGroup = form.getRadioGroup("favorite.rocket");
  const exiaField = form.getCheckBox("gundam.exia");
  const dynamesField = form.getCheckBox("gundam.dynames");
  const planetsDropDown = form.getDropdown("favorite.planet");
  const favoritePersonOptionList = form.getOptionList("favorite.person");

  superheroField.setText("One Punch Man");
  rocketRadioGroup.select("Saturn IV");
  exiaField.check();
  dynamesField.check();
  planetsDropDown.select("Pluto");
  favoritePersonOptionList.select("Ada Lovelace");

  return await pdfDoc.save();
}

/**
 * Generates PDF and returns bytes
 */
async function handleCreatePdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([550, 750]);
  const form = pdfDoc.getForm();

  page.drawText("Enter your favorite superhero:", { x: 50, y: 700, size: 20 });

  const superheroField = form.createTextField("favorite.superhero");
  superheroField.addToPage(page, { x: 55, y: 640 });

  page.drawText("Select your favorite rocket:", { x: 50, y: 600, size: 20 });
  page.drawText("Falcon Heavy", { x: 120, y: 560, size: 18 });
  page.drawText("Saturn IV", { x: 120, y: 500, size: 18 });
  page.drawText("Delta IV Heavy", { x: 340, y: 560, size: 18 });
  page.drawText("Space Launch System", { x: 340, y: 500, size: 18 });

  const rocketField = form.createRadioGroup("favorite.rocket");
  rocketField.addOptionToPage("Falcon Heavy", page, { x: 55, y: 540 });
  rocketField.addOptionToPage("Saturn IV", page, { x: 55, y: 480 });
  rocketField.addOptionToPage("Delta IV Heavy", page, { x: 275, y: 540 });
  rocketField.addOptionToPage("Space Launch System", page, { x: 275, y: 480 });

  page.drawText("Select your favorite gundams:", { x: 50, y: 440, size: 20 });
  page.drawText("Exia", { x: 120, y: 400, size: 18 });
  page.drawText("Kyrios", { x: 120, y: 340, size: 18 });
  page.drawText("Virtue", { x: 340, y: 400, size: 18 });
  page.drawText("Dynames", { x: 340, y: 340, size: 18 });

  const exiaField = form.createCheckBox("gundam.exia");
  const kyriosField = form.createCheckBox("gundam.kyrios");
  const virtueField = form.createCheckBox("gundam.virtue");
  const dynamesField = form.createCheckBox("gundam.dynames");
  exiaField.addToPage(page, { x: 55, y: 380 });
  kyriosField.addToPage(page, { x: 55, y: 320 });
  virtueField.addToPage(page, { x: 275, y: 380 });
  dynamesField.addToPage(page, { x: 275, y: 320 });

  page.drawText("Select your favorite planet*:", { x: 50, y: 280, size: 20 });

  const planetsField = form.createDropdown("favorite.planet");
  planetsField.addOptions(["Venus", "Earth", "Mars", "Pluto"]);
  planetsField.addToPage(page, { x: 55, y: 220 });

  page.drawText("Select your favorite person:", { x: 50, y: 180, size: 18 });
  const personField = form.createOptionList("favorite.person");
  personField.addOptions(["Julius Caesar", "Ada Lovelace", "Cleopatra", "Aaron Burr", "Mark Antony"]);
  personField.addToPage(page, { x: 55, y: 70 });

  // Just saying...
  page.drawText(`* Pluto should be a planet too!`, { x: 15, y: 15, size: 15 });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  return await pdfDoc.save();
}
