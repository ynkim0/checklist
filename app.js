(function () {
  var STORAGE_KEY = "checklist.todos";

  var form = document.getElementById("form");
  var input = document.getElementById("input");
  var listEl = document.getElementById("list");
  var emptyEl = document.getElementById("empty");
  var progressEl = document.getElementById("progress");
  var dateEl = document.getElementById("date");

  var todos = load();

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      /* 저장소를 쓸 수 없어도 화면은 계속 동작 */
    }
  }

  function render() {
    listEl.innerHTML = "";

    todos.forEach(function (todo) {
      var li = document.createElement("li");
      li.className = "item" + (todo.done ? " done" : "");

      var check = document.createElement("input");
      check.type = "checkbox";
      check.checked = todo.done;
      check.setAttribute("aria-label", "완료: " + todo.text);
      check.addEventListener("change", function () {
        todo.done = check.checked;
        save();
        render();
      });

      var text = document.createElement("span");
      text.textContent = todo.text;

      var del = document.createElement("button");
      del.type = "button";
      del.textContent = "\u00d7";
      del.setAttribute("aria-label", "삭제: " + todo.text);
      del.addEventListener("click", function () {
        todos = todos.filter(function (t) { return t.id !== todo.id; });
        save();
        render();
      });

      li.appendChild(check);
      li.appendChild(text);
      li.appendChild(del);
      listEl.appendChild(li);
    });

    var done = todos.filter(function (t) { return t.done; }).length;
    progressEl.textContent = todos.length ? done + "/" + todos.length + " 완료" : "";
    emptyEl.hidden = todos.length > 0;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var value = input.value.trim();
    if (!value) return;
    todos.push({ id: Date.now() + Math.random(), text: value, done: false });
    input.value = "";
    save();
    render();
    input.focus();
  });

  dateEl.textContent = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric", weekday: "long"
  });

  render();
})();
