const form = document.getElementById("contact-form");
const toast = document.getElementById("contact-toast");
let toastTimeout = null;

function showToast(message, type) {
  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.className = `toast toast--${type}`;
  toast.classList.remove("toast--hidden");

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.add("toast--hidden");
  }, 5000);
}

document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    emailjs.sendForm("service_jzoltcn", "template_djy0y5n", this).then(
      function () {
        showToast("Mensagem enviada com sucesso!", "success");
        form.reset();
      },
      function (error) {
        showToast("Erro ao enviar mensagem. Tente novamente.", "error");
        console.log(error);
      }
    );
  });