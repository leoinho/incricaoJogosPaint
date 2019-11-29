var CARD_CONTAINER = document.getElementsByClassName("card-container")[0];

var ref = firebase.database().ref("inscrito/");
var ref2 = firebase.storage().ref("arquivos");

var uid = firebase
  .database()
  .ref()
  .push().key;

var stringInput = document.getElementById("string-input");
var foto = "";

stringInput.onchange = function(event) {
  var arquivo = event.target.files[0];

  const reader = new FileReader();
  reader.readAsDataURL(arquivo);
  reader.onload = () => {
    const base64 = reader.result.split("base64,")[1];

    ref2
      .child(uid)
      .putString(base64, "base64", { contentType: "image/png" })
      .then(snapshot => {
        ref2
          .child(uid)
          .getDownloadURL()
          .then(url => {
            console.log("string para dowload", url);
            foto = url;
          });
      });
  };
};

function criarCard() {
  var nome = document.getElementById("nome");
  var select = document.getElementById("select");
  var equipamento = "";

  console.log("nome", nome.value);
  if (nome.value == "") {
    swal({ title: "Seu nome é obrigatório!!" });
    return false;
  } else if (select.value == "") {
    swal({ title: "Nos diga seu equipamento!!" });
    return false;
  } else if (foto == "") {
    swal({ title: "Selecione sua foto!!" });
    return false;
  }

  console.log("select.value " + select.value);
  switch (select.value) {
    case "1":
      var equipamento = "Equipamento completo";
      break;
    case "2":
      var equipamento = "Equipamento completo e bolinhas";
      break;
    case "3":
      var equipamento = "Somente máscara";
      break;
    case "4":
      var equipamento = "Somente máscara e bolinhas";
      break;
    case "5":
      var equipamento = "Bolinhas próprias";
      break;
    case "6":
      var equipamento = "Nenhuma das alternativas anteriores";
      break;
  }

  var card = {
    nome: nome.value,
    equipamento: equipamento,
    imagem: foto
  };

  console.log("card " + JSON.stringify(card));
  document.getElementById("nome").value = "";
  document.getElementById("select").value = "";
  swal({
    title: "Inscrição aceita!!",
    icon: "success"
  });
  ref.push(card);
}

function deletar(id) {
  ref
    .child(id)
    .remove()
    .then(() => {
      var card = document.getElementById(id);
      card.remove();
    });
}

function curtir(id) {
  var card = document.getElementById(id);
  var count = card.getElementsByClassName("count-number")[0];
  var countNumber = +count.innerText; // o sinal de + converte o texto para number
  countNumber = countNumber + 1;

  ref
    .child(id + "/curtidas")
    .set(countNumber)
    .then(() => {
      count.innerText = countNumber;
    });
}

function descurtir(id) {
  var card = document.getElementById(id);
  var count = card.getElementsByClassName("count-number")[0];
  var countNumber = +count.innerText; // o sinal de + converte o texto para number

  if (countNumber > 0) {
    countNumber = countNumber - 1;

    ref
      .child(id)
      .update({ curtidas: countNumber })
      .then(() => {
        count.innerText = countNumber;
      });
  }
}

document.addEventListener("DOMContentLoaded", function() {
  ref.on("child_added", snapshot => {
    adicionaCardATela(snapshot.val(), snapshot.key);
  });
});

function adicionaCardATela(informacao, id) {
  const html = `
  <div class="card-containerJS">
    <p><b>Nome :</b> ${informacao.nome}</p>
    <p><b>Equipamento :</b> ${informacao.equipamento}</p>
    <img src="${informacao.imagem}" alt="">
  </div>

  `;
  $(".card-container").append(html);
}
