const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-menu]");
const themeButton = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const themeColor = document.querySelector("[data-theme-color]");
const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");

function closeMenu() {
  if (!menuButton || !menu) return;
  menuButton.setAttribute("aria-expanded", "false");
  menu.classList.remove("is-open");
}

function savedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch (error) {
    return null;
  }
}

function applyTheme(theme, persist = false) {
  const normalizedTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = normalizedTheme;

  if (themeLabel) themeLabel.textContent = normalizedTheme === "dark" ? "Light" : "Dark";
  if (themeButton) {
    themeButton.setAttribute(
      "aria-label",
      normalizedTheme === "dark" ? "Use light mode" : "Use dark mode"
    );
  }
  if (themeColor) themeColor.content = normalizedTheme === "dark" ? "#0d151c" : "#ffffff";

  if (persist) {
    try {
      localStorage.setItem("theme", normalizedTheme);
    } catch (error) {
      // The selected theme still applies for this visit.
    }
  }
}

applyTheme(
  document.documentElement.dataset.theme ||
    savedTheme() ||
    (colorScheme.matches ? "dark" : "light")
);

if (themeButton) {
  themeButton.addEventListener("click", () => {
    const nextTheme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme, true);
  });
}

colorScheme.addEventListener("change", (event) => {
  if (!savedTheme()) applyTheme(event.matches ? "dark" : "light");
});

if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menu.classList.toggle("is-open", !isOpen);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeMenu();
  document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
});

const paperAbstracts = Object.freeze({
  mammoflow:
    "Multiview mammography uses paired craniocaudal and mediolateral oblique views to capture complementary anatomy, but balanced paired datasets remain difficult to obtain. MammoFlow synthesizes anatomically consistent view pairs with a flow-matching model guided by affine alignment and a tissue-distribution consistency objective. The resulting images improve visual quality, satisfy expert review, preserve cross-view tissue relationships, and support stronger downstream classification.",
  care:
    "Large medical vision-language models can reason across images and text, but their end-to-end predictions often lack explicit clinical evidence. CARE separates entity proposal, expert segmentation, grounded reasoning, planning, and answer review into coordinated modules, then aligns the system with verifiable rewards. This evidence-grounded workflow improves medical visual question answering while making predictions more accountable and easier to verify.",
  glam:
    "Mammography interpretation depends on geometric relationships between multiple views, yet many visual-language models process those views independently. GLAM uses imaging geometry to learn local cross-view correspondence together with global and local visual-language alignment. Pretraining on the large EMBED dataset produces stronger transfer across mammography tasks and datasets than prior baselines.",
  mama:
    "Applying contrastive language-image pretraining to mammography is challenging because datasets are limited, images are high resolution, findings are small, and class distributions are imbalanced. MaMA combines multi-view supervision, symmetric local alignment, and parameter-efficient adaptation of a medically pretrained language model. The approach improves performance across multiple tasks and real-world mammography datasets while using a smaller trainable model.",
  sreconv:
    "Biomedical images often have no canonical orientation, while standard convolutional networks do not naturally produce rotation-equivariant features. SRE-Conv introduces an efficient symmetric rotation-equivariant kernel that can be inserted into common CNN backbones. Across the 2D and 3D MedMNISTv2 tasks, it improves classification under rotation while reducing parameter count and memory use.",
  cleft:
    "Medical contrastive language-image learning is constrained by limited datasets, expensive training, and prompts that reduce rich clinical text to simple labels. CLEFT combines pretrained visual and language models with efficient context-aware prompt tuning. The framework improves chest X-ray and mammography results while substantially reducing the number of trainable parameters.",
  siftdbt:
    "Digital breast tomosynthesis provides detailed volumetric breast imaging but creates severe imbalance because suspicious tissue occupies only a small portion of most studies. SIFT-DBT uses view-level contrastive self-supervised initialization, targeted fine-tuning, and patch-level multi-instance learning to preserve spatial detail. The method achieves strong volume-level discrimination on a large clinical evaluation set.",
  foley:
    "A designed soundtrack may intentionally differ from a video's original sound while still matching the visible action. Conditional Foley learns to generate audio for a silent video from a user-provided audiovisual example that specifies the desired sound character. Human and automated evaluations show that the model follows both the input action and the conditioning example.",
  retccl:
    "Retrieving related whole-slide pathology images is difficult because slides are extremely large and diagnostic regions may occupy only a small area. RetCCL combines clustering-guided self-supervised feature learning with patch ranking and aggregation to retrieve similar slides and highlight the regions that support each match. Evaluation across more than 22,000 slides shows substantial gains for anatomical-site, cancer-subtype, and patch retrieval."
});

const bibtexDialog = document.querySelector("#bibtex-dialog");
const bibtexTitle = document.querySelector("[data-bibtex-title]");
const bibtexContent = document.querySelector("[data-bibtex-content]");
const copyButton = document.querySelector("[data-copy-bibtex]");
const copyStatus = document.querySelector("[data-copy-status]");

document.querySelectorAll("[data-bibtex-url]").forEach((trigger) => {
  trigger.addEventListener("click", async () => {
    const publication = trigger.closest(".publication");
    const title = publication?.querySelector("h3")?.textContent.trim() || "Publication";

    if (bibtexTitle) bibtexTitle.textContent = title;
    if (bibtexContent) bibtexContent.textContent = "Loading citation...";
    if (copyStatus) copyStatus.textContent = "";
    if (copyButton) copyButton.textContent = "Copy";
    bibtexDialog?.showModal();

    try {
      const response = await fetch(trigger.dataset.bibtexUrl);
      if (!response.ok) throw new Error("Citation file could not be loaded.");
      const citation = await response.text();
      if (bibtexContent) bibtexContent.textContent = citation.trim();
    } catch (error) {
      if (bibtexContent) {
        bibtexContent.textContent =
          "The citation could not be loaded. Please try again from the hosted website.";
      }
    }
  });
});

async function copyBibtex() {
  const citation = bibtexContent?.textContent || "";
  if (!citation || citation.startsWith("Loading") || citation.startsWith("The citation")) return;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(citation);
    } else {
      const temporary = document.createElement("textarea");
      temporary.value = citation;
      temporary.setAttribute("readonly", "");
      temporary.style.position = "fixed";
      temporary.style.opacity = "0";
      document.body.appendChild(temporary);
      temporary.select();
      document.execCommand("copy");
      temporary.remove();
    }

    if (copyButton) copyButton.textContent = "Copied";
    if (copyStatus) copyStatus.textContent = "Citation copied to clipboard.";
  } catch (error) {
    if (copyStatus) copyStatus.textContent = "Copy failed. Select the citation text to copy it.";
  }
}

copyButton?.addEventListener("click", copyBibtex);

const paperDialog = document.querySelector("#paper-dialog");
const paperDialogTitle = document.querySelector("[data-paper-title]");
const paperDialogImage = document.querySelector("[data-paper-image]");
const paperDialogAbstract = document.querySelector("[data-paper-abstract]");

document.querySelectorAll("[data-paper-detail]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const publication = trigger.closest(".publication");
    const sourceImage = trigger.querySelector("img");
    const title = publication?.querySelector("h3")?.textContent.trim() || "Paper details";
    const abstract = paperAbstracts[trigger.dataset.abstractKey] || "";

    if (paperDialogTitle) paperDialogTitle.textContent = title;
    if (paperDialogImage && sourceImage) {
      paperDialogImage.src = sourceImage.currentSrc || sourceImage.src;
      paperDialogImage.alt = sourceImage.alt;
    }
    if (paperDialogAbstract) paperDialogAbstract.textContent = abstract;
    paperDialog?.showModal();
  });
});

document.querySelectorAll("[data-dialog-close]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog")?.close());
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});
