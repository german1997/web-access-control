//crea elemento
const video = document.createElement("video");

//nuestro camvas
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

//div donde llegara nuestro canvas
const btnScanQR = document.getElementById("btn-scan-qr");

//lectura desactivada
let scanning = false;

//funcion para encender la camara
const encenderCamara = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};

//funciones para levantar las funiones de encendido de la camara
function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 100);
  }
}

//apagara la camara
const cerrarCamara = () => {
  video.srcObject.getTracks().forEach((track) => {
    track.stop();
  });
  canvasElement.hidden = true;
  btnScanQR.hidden = false;
};

const activarSonido = () => {
  var audio = document.getElementById('audioScaner');
  audio.play();
}

//callback cuando termina de leer el codigo QR
qrcode.callback = async (respuesta) => {

  const url = new URL(respuesta)
  const searchParams = new URLSearchParams(url.search);
  const rut = searchParams.get('RUN')

  console.log('caca', rut)

  // Solicitud GET (Request).
  const response = await fetch('https://app-access-control-production.up.railway.app/user/'+rut);

  if (response.status == 500) {
    Swal.fire("Error interno");
  }

  if (response.status == 204) {
    Swal.fire({
      title: "Usuario NO registrado",
      icon: "error"
    });
    activarSonido();
    //encenderCamara();    
    cerrarCamara(); 
  }

  if (response.status == 200) {
    Swal.fire({
      title: "Usuario registrado",
      icon: "success"
    });
    activarSonido();
    //encenderCamara();    
    cerrarCamara(); 
  }

};
//evento para mostrar la camara sin el boton 
window.addEventListener('load', (e) => {
  encenderCamara();
})






