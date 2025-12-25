function login() {
  fetch("api/login.php", {
    method: "POST",
    body: JSON.stringify({
      user: user.value,
      pass: pass.value
    })
  })
  .then(r => r.json())
  .then(res => {
    if (res.success) {
      location.reload(); // 🔥 el servidor ahora entrega el panel
    } else {
      document.getElementById("login-error").textContent =
        "Usuario o contraseña incorrectos";
    }
  });
}
