// Получение элемента canvas из DOM
const canvas = document.getElementById("canvas");

// Получение контекста рисования 2D
const ctx = canvas.getContext("2d");

// Получение элементов управления из DOM
const shapeSelect = document.getElementById("shape");
const colorInput = document.getElementById("color");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const radiusInput = document.getElementById("radius");
const undoButton = document.getElementById("undo");
const clearButton = document.getElementById("clear");
const ellipseWidth = document.getElementById("ellipseWidth");
const ellipseHeight = document.getElementById("ellipseHeight");
const triangleSideLength = document.getElementById("triangleSideLength");
const arcRadius = document.getElementById("arcRadius");
const rectangleOptions = document.getElementById("rectangleOptions");
const circleOptions = document.getElementById("circleOptions");
const ellipseOptions = document.getElementById("ellipseOptions");
const triangleOptions = document.getElementById("triangleOptions");
const arcOptions = document.getElementById("arcOptions");

// Массив для хранения данных о фигурах
let shapes = [];

// Восстановление ранее сохраненных фигур при загрузке страницы
if (localStorage.getItem("shapes")) {
  shapes = JSON.parse(localStorage.getItem("shapes"));
  redrawShapes();
}

// Обработчик события клика на холсте
canvas.addEventListener("click", function (event) {
  // Получение выбранной формы и цвета
  const shapeType = shapeSelect.value;
  const color = colorInput.value;
  let shape; // Переменная для хранения информации о новой фигуре
  let width, height, radius; // Переменные для хранения параметров фигур

  // Проверяем, если выбрана опция "Delete", то удаляем фигуры при клике на них
  if (shapeType === "delete") {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    // Проверяем, попал ли клик внутрь какой-либо фигуры
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];

      switch (shape.type) {
        case "circle":
          // Проверяем, попал ли клик внутрь круга
          if (isInsideCircle(mouseX, mouseY, shape)) {
            shapes.splice(i, 1); // Удаляем фигуру из массива
            localStorage.setItem("shapes", JSON.stringify(shapes)); // Обновляем локальное хранилище
            redrawShapes(); // Перерисовываем все фигуры
            return; // Выходим из цикла, чтобы не проверять остальные фигуры
          }
          break;
        case "rectangle":
          // Проверяем, попал ли клик внутрь прямоугольника
          if (isInsideRectangle(mouseX, mouseY, shape)) {
            shapes.splice(i, 1); // Удаляем фигуру из массива
            localStorage.setItem("shapes", JSON.stringify(shapes)); // Обновляем локальное хранилище
            redrawShapes(); // Перерисовываем все фигуры
            return; // Выходим из цикла, чтобы не проверять остальные фигуры
          }
          break;
          case "ellipse":
            // Проверяем, попал ли клик внутрь эллипса
            if (isInsideEllipse(mouseX, mouseY, shape)) {
              shapes.splice(i, 1); // Удаляем фигуру из массива
              localStorage.setItem("shapes", JSON.stringify(shapes)); // Обновляем локальное хранилище
              redrawShapes(); // Перерисовываем все фигуры
              return; // Выходим из цикла, чтобы не проверять остальные фигуры
            }
            break;
          case "triangle":
            // Проверяем, попал ли клик внутрь треугольника
            if (isInsideTriangle(mouseX, mouseY, shape)) {
              shapes.splice(i, 1); // Удаляем фигуру из массива
              localStorage.setItem("shapes", JSON.stringify(shapes)); // Обновляем локальное хранилище
              redrawShapes(); // Перерисовываем все фигуры
              return; // Выходим из цикла, чтобы не проверять остальные фигуры
            }
            break;
          case "arc":
            // Проверяем, попал ли клик внутрь дуги
            if (isInsideArc(mouseX, mouseY, shape)) {
              shapes.splice(i, 1); // Удаляем фигуру из массива
              localStorage.setItem("shapes", JSON.stringify(shapes)); // Обновляем локальное хранилище
              redrawShapes(); // Перерисовываем все фигуры
              return; // Выходим из цикла, чтобы не проверять остальные фигуры
            }
            break;
          default:
            return;         
      }
    }
  }

  // Создание фигуры в зависимости от выбранной формы
  switch (shapeType) {
    case "circle":
      radius = parseInt(radiusInput.value);
      shape = { type: shapeType, color, x: event.offsetX, y: event.offsetY, radius };
      break;
    case "rectangle":
      width = parseInt(widthInput.value);
      height = parseInt(heightInput.value);
      shape = { type: shapeType, color, x: event.offsetX, y: event.offsetY, width, height };
      break;
    case "ellipse":
      width = parseInt(ellipseWidth.value);
      height = parseInt(ellipseHeight.value);
      shape = { type: shapeType, color, x: event.offsetX, y: event.offsetY, width, height };
      break;
    case "triangle":
      width = parseInt(triangleSideLength.value);
      height = (Math.sqrt(3) / 2) * width;
      ctx.beginPath();
      ctx.moveTo(event.offsetX, event.offsetY - height / 2);
      ctx.lineTo(event.offsetX + width / 2, event.offsetY + height / 2);
      ctx.lineTo(event.offsetX - width / 2, event.offsetY + height / 2);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      shape = { type: shapeType, color, x: event.offsetX, y: event.offsetY, sideLength: width };
      break;
    case "arc":
      radius = parseInt(arcRadius.value);
      ctx.beginPath();
      ctx.arc(event.offsetX, event.offsetY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.stroke();
      shape = { type: shapeType, color, x: event.offsetX, y: event.offsetY, radius };
      break;
    default:
      return;
  }
  // Добавление фигуры в массив и сохранение в локальное хранилище
  shapes.push(shape);
  localStorage.setItem("shapes", JSON.stringify(shapes));
  // Перерисовка всех фигур на холсте
  redrawShapes();
});

// Обработчик события нажатия кнопки "Отмена"
undoButton.addEventListener("click", function () {
  shapes.pop(); // Удаление последней фигуры из массива
  localStorage.setItem("shapes", JSON.stringify(shapes)); // Обновление данных в локальном хранилище
  redrawShapes(); // Перерисовка всех фигур на холсте
});

// Обработчик события нажатия кнопки "Очистить"
clearButton.addEventListener("click", function () {
  shapes = [];  // Очистка массива фигур
  localStorage.removeItem("shapes"); // Удаление данных из локального хранилища
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка холста
});

// Обработчик события изменения выбора формы
shapeSelect.addEventListener("change", function () {
  const selectedShape = shapeSelect.value; // Получение выбранной формы
  const allOptions = [ // Массив всех блоков опций
    rectangleOptions,
    circleOptions,
    ellipseOptions,
    triangleOptions,
    arcOptions,
  ];
  // Скрытие всех блоков опций
  allOptions.forEach((option) => {
    option.style.display = "none";
  });

  // Отображение блока опций соответствующей выбранной формы
  switch (selectedShape) {
    case "circle":
      circleOptions.style.display = "block";
      break;
    case "rectangle":
      rectangleOptions.style.display = "block";
      break;
    case "ellipse":
      ellipseOptions.style.display = "block";
      break;
    case "triangle":
      triangleOptions.style.display = "block";
      break;
    case "arc":
      arcOptions.style.display = "block";
      break;
    default:
      return;
  }
});

// Функция для перерисовки всех фигур на холсте
function redrawShapes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes.forEach(shape => {
    ctx.fillStyle = shape.color;
    switch (shape.type) {
      case "circle":
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "rectangle":
        ctx.fillRect(shape.x - shape.width / 2, shape.y - shape.height / 2, shape.width, shape.height);
        break;
      case "ellipse":
        ctx.beginPath();
        ctx.ellipse(shape.x, shape.y, shape.width / 2, shape.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "triangle":
        const sideLength = shape.sideLength;
        const height = (Math.sqrt(3) / 2) * sideLength;
        ctx.beginPath();
        ctx.moveTo(shape.x, shape.y - height / 2);
        ctx.lineTo(shape.x + sideLength / 2, shape.y + height / 2);
        ctx.lineTo(shape.x - sideLength / 2, shape.y + height / 2);
        ctx.closePath();
        ctx.fill();
        break;
      case "arc":
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI);
        ctx.strokeStyle = shape.color;
        ctx.stroke();
        break;
      default:
        return;
    }
  });
}

// Функция для определения, находится ли точка внутри круга
function isInsideCircle(x, y, shape) {
  const distanceSquared = (x - shape.x) ** 2 + (y - shape.y) ** 2;
  return distanceSquared <= shape.radius ** 2;
}

// Функция для определения, находится ли точка внутри прямоугольника
function isInsideRectangle(x, y, shape) {
  const leftX = shape.x - shape.width / 2;
  const rightX = shape.x + shape.width / 2;
  const topY = shape.y - shape.height / 2;
  const bottomY = shape.y + shape.height / 2;

  return x >= leftX && x <= rightX && y >= topY && y <= bottomY;
}

// Функция для определения, находится ли точка внутри эллипса
function isInsideEllipse(mouseX, mouseY, shape) {
  const x = shape.x; // координата центра эллипса по X
  const y = shape.y; // координата центра эллипса по Y
  const radiusX = shape.width / 2; // радиус эллипса по X
  const radiusY = shape.height / 2; // радиус эллипса по Y

  // Формула для проверки попадания точки внутрь эллипса
  const deltaX = (mouseX - x) / radiusX;
  const deltaY = (mouseY - y) / radiusY;
  return deltaX * deltaX + deltaY * deltaY <= 1;
}

// Функция для определения, находится ли точка внутри треугольника
function isInsideTriangle(mouseX, mouseY, shape) {
  // Получаем координаты вершин треугольника
  const x1 = shape.x;
  const y1 = shape.y - (Math.sqrt(3) / 2) * shape.sideLength / 2;
  const x2 = shape.x - shape.sideLength / 2;
  const y2 = shape.y + (Math.sqrt(3) / 2) * shape.sideLength / 2;
  const x3 = shape.x + shape.sideLength / 2;
  const y3 = shape.y + (Math.sqrt(3) / 2) * shape.sideLength / 2;

  // Проверяем, лежит ли точка внутри треугольника с помощью метода барицентрических координат
  const b1 = ((y2 - y3)*(mouseX - x3) + (x3 - x2)*(mouseY - y3)) / ((y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3));
  const b2 = ((y3 - y1)*(mouseX - x3) + (x1 - x3)*(mouseY - y3)) / ((y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3));
  const b3 = 1 - b1 - b2;

  // Точка находится внутри треугольника, если все b1, b2 и b3 находятся в диапазоне [0, 1]
  return (b1 >= 0 && b1 <= 1 && b2 >= 0 && b2 <= 1 && b3 >= 0 && b3 <= 1);
}

// Функция для определения, находится ли точка внутри дуги
function isInsideArc(mouseX, mouseY, shape) {
  const dx = mouseX - shape.x;
  const dy = mouseY - shape.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Точка находится внутри дуги, если расстояние до центра меньше радиуса
  return distance <= shape.radius;
}