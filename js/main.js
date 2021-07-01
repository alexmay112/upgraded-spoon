const logo = document.querySelector(".logo");
const faqBlock = document.querySelector(".faq");
const btnFaq = document.querySelector(".faq__btn");
const btnClose = document.querySelector(".faq__close");
const choiceBlock = document.querySelector(".choice");
const btnChoice = document.querySelectorAll(".choice__item");
const choiceNext = document.querySelector(".choice__btn");
const definitionBlock = document.querySelector(".definition");
const form = document.querySelector(".form");
const formImg = document.querySelector(".form__img");
const inputsForm = document.querySelectorAll(".form__input");
const inputsFormNumber = document.querySelectorAll(".form__input--number");
const inputsFormText = document.querySelector(".form__input--text");
const inputHeight = document.querySelector("input[name=height]");
const inputWeight = document.querySelector("input[name=weight]");
const inputName = document.querySelector("input[name=name]");
const btnForm = document.querySelector(".form__btn");
const definitionText = document.querySelector(".definition__text");
const btnDefinition = document.querySelector(".definition__btn");
const rangeWeight = document.querySelector(".range-weight");
const rangeHeight = document.querySelector(".range-height");
const breedWeight = document.querySelector(".breed-weight");
const breedHeight = document.querySelector(".breed-height");
const resultBlock = document.querySelector(".result");
const resultTitle = document.querySelector(".result__name");
const resultBreed = document.querySelectorAll(".result__breed");
const resultImg = document.querySelector(".result__img");
const resultDownload = document.querySelector(".result__download");
const resetBtn = document.querySelector(".result__reset");
const rangeRegexp = /^(\d+)-(\d+)$/;
let data = [];
let choiceArr = [];
let choice = "";
let fileName = "";
let nickname = "";
let defaultItem = {};
let heightLow, heightHi, weightLow, weightHi;

// Поиск минимального и макс значения в массиве
function getMinOfArray(numArray) {
  return Math.min.apply(null, numArray);
}

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

// Обработка клика на кнопку FAQ
btnFaq.addEventListener("click", function () {
  this.disabled = true;
  faqBlock.style.display = "block";
});

// Закрытие окна FAQ
function closeFAQ() {
  btnFaq.disabled = false;
  faqBlock.style.display = "none";
}

// Обработка клика на крестик FAQ
btnClose.addEventListener("click", closeFAQ);

// Проверка и установка выбранного типа животного
function checkChoice(buttons) {
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].classList.contains("active")) {
      return true
    }
  }
}

function setChoice() {
  choice = document.querySelector(".choice__item.active").dataset.choice;
}

// Получение содержимого json
function readTextFile(file, callback) {
  const rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status === 200) {
      callback(rawFile.responseText);
    }
  }
  rawFile.send(null);
}

// Загрузка картинки
function getFileUrl(url) {
  const linkUrl = document.createElement("a");
  linkUrl.download = nickname + ".jpg";
  linkUrl.href = url;
  if (window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1) {
    linkUrl.target = "_blank";
  }
  document.body.appendChild(linkUrl);
  linkUrl.click();
  document.body.removeChild(linkUrl);
  delete linkUrl;
}

// Сброс всех параметров до первоначальных / Начать все заново
function reset() {
  for (let i = 0; i < btnChoice.length; i++) {
    btnChoice[i].classList.remove("active");
  }
  for (let i = 0; i < inputsForm.length; i++) {
    inputsForm[i].classList.remove("valid", "invalid");
  }

  choiceArr = [];
  form.reset();
  choiceNext.disabled = true;
  btnForm.disabled = true;
  btnForm.classList.remove("form__btn--not-last");
  choiceBlock.style.display = "block";
  definitionBlock.style.display = "none";
  definitionText.style.display = "none";
  btnDefinition.disabled = true;
  resultBlock.style.display = "none";
}

// Обработка ввода данных для поля Рост 
inputHeight.addEventListener("input", function () {
  this.value = this.value.replace(/\D/, "");
  this.value = this.value.replace(/^0/, "");

  heightLow = +rangeHeight.textContent.replace(rangeRegexp, "$1");
  heightHi = +rangeHeight.textContent.replace(rangeRegexp, "$2");

  if (this.value < heightLow || this.value > heightHi || this.value === "") {
    this.classList.remove("valid");
    this.classList.add("invalid");
  } else {
    this.classList.remove("invalid");
    this.classList.add("valid");
  }
  checkForm();
});

// обработка события ввода данных для поля Вес 
inputWeight.addEventListener("input", function () {
  this.value = this.value.replace(/\D/, "");
  this.value = this.value.replace(/^0/, "");

  weightLow = +rangeWeight.textContent.replace(rangeRegexp, "$1");
  weightHi = +rangeWeight.textContent.replace(rangeRegexp, "$2");

  if (this.value < weightLow || this.value > weightHi || this.value === "") {
    this.classList.remove("valid");
    this.classList.add("invalid");
  } else {
    this.classList.remove("invalid");
    this.classList.add("valid");
  }
  checkForm();
})

// обработка события ввода данных для поля Имя
inputsFormText.addEventListener("input", function () {
  this.value = this.value.replace(/^\s+/, "");

  if (this.value === "" || this.value.match(/^.$/)) {
    this.classList.remove("valid");
    this.classList.add("invalid");
  } else {
    this.classList.remove("invalid");
    this.classList.add("valid");
  }
  checkForm();
})

// Валидация формы и активация/деактивация кнопки "Определить питомца по параметрам"
function checkForm() {
  if (inputHeight.value < heightLow || inputHeight.value > heightHi || inputHeight.value === "" ||
    inputWeight.value < weightLow || inputWeight.value > weightHi || inputWeight.value === "" ||
    !inputsFormText.value.match(/.{2,}/)
  ) {
    btnForm.disabled = true;
  } else {
    btnForm.disabled = false;
  }
}

// Обработка клика на кнопку выбора типа животного,
// активация/деактивация кнопки "Продолжить"
for (let i = 0; i < btnChoice.length; i++) {
  btnChoice[i].addEventListener("click", function () {
    for (let j = 0; j < btnChoice.length; j++) {
      btnChoice[j].classList.remove("active");
    }
    this.classList.add("active");
    setChoice();
    if (checkChoice(btnChoice)) {
      choiceNext.disabled = false;
    }
  })
};

// Обработка клика на кнопку "Скачать фотографию"
resultDownload.addEventListener("click", function () {
  getFileUrl(fileName);
});

// Парсинг (преобразование) данных файла json в JS-объект
readTextFile("js/data.json", function (text) {
  data = JSON.parse(text);
  console.log(data);
});

// Обработка клика по кнопке "Продолжить"
choiceNext.addEventListener("click", function () {
  setChoice();

  function getChoice(callback) {
    callback(choice);
  }

  function setAttr(src) {
    formImg.setAttribute('class', "form__img form__img--" + src);
    formImg.setAttribute('src', "img/" + src + ".svg");
  }

  getChoice(setAttr);

  for (let i = 0; i < data.length; i++) {
    if (data[i].kind === choice) {
      choiceArr.push(data[i]);
    }
  }

  const choiceArrWeight = [];
  const choiceArrHeight = [];

  for (let i = 0; i < choiceArr.length; i++) {
    if (choiceArr[i].weight && choiceArr[i].height) {
      const weightLow = +choiceArr[i].weight.replace(rangeRegexp, "$1");
      const weightHi = +choiceArr[i].weight.replace(rangeRegexp, "$2");
      choiceArrWeight.push(weightLow, weightHi);

      const heightLow = +choiceArr[i].height.replace(rangeRegexp, "$1");
      const heightHi = +choiceArr[i].height.replace(rangeRegexp, "$2");
      choiceArrHeight.push(heightLow, heightHi);
    }
  }
  weightRange = getMinOfArray(choiceArrWeight) + "-" + getMaxOfArray(choiceArrWeight);
  heightRange = getMinOfArray(choiceArrHeight) + "-" + getMaxOfArray(choiceArrHeight);
  rangeWeight.textContent = weightRange;
  rangeHeight.textContent = heightRange;

  choiceBlock.style.display = "none";
  definitionBlock.style.display = "block";
})

// Поиск породы по введенным данным
function searchItem() {
  for (let j = 0; j < choiceArr.length; j++) {
    if (!choiceArr[j].height && !choiceArr[j].weight) {
      defaultItem = choiceArr[j];
    }
  }

  for (let i = 0; i < choiceArr.length; i++) {
    const heightRange = choiceArr[i].height;
    const weightRange = choiceArr[i].weight;
    if (heightRange && weightRange) {
      const heightLow = +heightRange.replace(rangeRegexp, "$1");
      const heightHi = +heightRange.replace(rangeRegexp, "$2");
      const weightLow = +weightRange.replace(rangeRegexp, "$1");
      const weightHi = +weightRange.replace(rangeRegexp, "$2");

      if (+inputHeight.value >= heightLow && +inputHeight.value < heightHi &&
        +inputWeight.value >= weightLow && +inputWeight.value < weightHi) {
        breedHeight.textContent = choiceArr[i].height;
        breedWeight.textContent = choiceArr[i].weight;
        btnForm.classList.add("form__btn--not-last");
        definitionText.style.display = "block";
        for (let k = 0; k < resultBreed.length; k++) {
          resultBreed[k].textContent = choiceArr[i].breed;
        }
        resultImg.setAttribute("src", "img/" + choiceArr[i].file + ".jpg");
        fileName = "img/" + choiceArr[i].file + ".jpg";
        return true
      } else {
        breedHeight.textContent = rangeHeight.textContent;
        breedWeight.textContent = rangeWeight.textContent;
        btnForm.classList.add("form__btn--not-last");
        definitionText.style.display = "block";
        for (let k = 0; k < resultBreed.length; k++) {
          resultBreed[k].textContent = defaultItem.breed;
        }
        resultImg.setAttribute("src", "img/" + defaultItem.file + ".jpg");
        fileName = "img/" + defaultItem.file + ".jpg";
      }
    }
  }
}

// Обработка клика по кнопке "Определить питомца по параметрам"
btnForm.addEventListener("click", function (e) {
  e.preventDefault();
  setChoice();
  searchItem();

  nickname = inputName.value;
  resultTitle.textContent = nickname;
  btnDefinition.disabled = false;
});

// Обработка клика по кнопке "Смотреть фотографию"
btnDefinition.addEventListener("click", function () {
  definitionBlock.style.display = "none";
  resultBlock.style.display = "block";
});


// Обработка клика по логотипу
logo.addEventListener("click", function () {
  reset();
  closeFAQ();
});

// Обработка клика по кнопке "Попробовать еще раз"
resetBtn.addEventListener("click", reset);