document.addEventListener("DOMContentLoaded", function () {
  const editables = document.querySelectorAll(".editable");

  editables.forEach((item) => {
    const defaultText = item.textContent;

    item.addEventListener("click", function () {
      this.contentEditable = true;
      this.focus();

      const range = document.createRange();
      range.selectNodeContents(this);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    });

    item.addEventListener("blur", function () {
      this.contentEditable = false;

      if (!this.textContent.trim()) {
        this.textContent = defaultText;
      }

      this.classList.add("saved");
      setTimeout(() => this.classList.remove("saved"), 1500);

      localStorage.setItem(this.className, this.textContent);
    });

    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        this.blur();
      }
    });

    const savedText = localStorage.getItem(item.className);
    if (savedText) {
      item.textContent = savedText;
    }
  });
});

let isGeneratingPDF = false;

async function generatePDF() {
  if (isGeneratingPDF) return;
  isGeneratingPDF = true;

  try {
    const element = document.getElementById("resume");
    const pdfButton = document.getElementById("downloadPdf");

    pdfButton.disabled = true;
    pdfButton.textContent = "Генерация PDF...";

    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: "#FFFFFF",
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);

    pdf.save("resume.pdf");
  } catch (err) {
    console.error("Ошибка генерации PDF:", err);
    alert("Произошла ошибка при генерации PDF");
  } finally {
    const pdfButton = document.getElementById("downloadPdf");
    pdfButton.disabled = false;
    pdfButton.textContent = "Download PDF";
    isGeneratingPDF = false;
  }
}

function init() {
  const pdfButton = document.getElementById("downloadPdf");
  pdfButton.replaceWith(pdfButton.cloneNode(true));

  document.getElementById("downloadPdf").addEventListener("click", generatePDF);

  const editables = document.querySelectorAll(".editable");
}

document.addEventListener("DOMContentLoaded", init);
