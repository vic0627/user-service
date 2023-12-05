export default async (msg, ms = 3000) => {
  const body = $("body");

  if ($id("foolproof")) {
    await unmount($id("foolproof"));
  }

  const fp = document.createElement("div");

  const name = "foolproof";
  fp.classList.add(name);
  fp.id = name;

  fp.innerHTML = `
    <h4>Warning</h4>
    <div class="foolproof-msg-box">
      <p class="foolproof-msg">${msg}</p>
    </div>
    <div class="foolproof-confirm-btn" id="foolproof-confirm-btn"></div>
  `;

  body.appendChild(fp);

  $delay(() => {
    fp.classList.add("mount");
  });

  async function unmount(e) {
    e.classList.remove("mount");
    $id("foolproof-confirm-btn").removeEventListener("click", () => unmount(e));
    await $delay(() => {
      body.removeChild(e);
    }, 350);
  }

  $id("foolproof-confirm-btn").addEventListener("click", () => unmount(fp));

  $delay(() => {
    if (!fp) return;
    unmount(fp);
  }, ms);
};
