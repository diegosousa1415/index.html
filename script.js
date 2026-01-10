// Captura o ?ref= da URL
const params = new URLSearchParams(window.location.search);
const refCode = params.get("ref");

if (refCode) {
  document.getElementById("ref").value = refCode;
}

document.getElementById("formCadastro").addEventListener("submit", function(e) {
  e.preventDefault();

  const affiliateCode = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  const link =
    window.location.origin +
    window.location.pathname +
    "?ref=" +
    affiliateCode;

  alert(
    "Cadastro criado!\n\n" +
    "Seu código de afiliado:\n" +
    affiliateCode +
    "\n\nSeu link:\n" +
    link
  );
});
