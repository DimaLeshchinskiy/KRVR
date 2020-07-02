$(".tab .btn.refreshPorts").click(refreshPorts);
$(".ports").change(setConnection);

$('.tab .counterPWM input[type=range]').on('input', setPWM);
$('.tab .counterFeed input[type=range]').on('input', setFeed);
$('.tab .counterStep input[type=range]').on('input', setStep);

$('.tab .stickyRulerSize').on('input', setStickyRulerSize);

function setStickyRulerSize(){
  val = parseFloat($(this).val());

  if(val.isPositiveNum()){
    config.put("stickyRulerSize", val);
    renderGrid();
  }else{
    clearGrid();
  }
}

function getStickyRulerSize(){
  return config.getByKey("stickyRulerSize");
}

function setPWM(){
  val = $(this).val();
  config.put("pwm", val);
  $(this).closest(".counterPWM").find("label").text("PWM: " + val);
}

function getPWM(){
  return config.getByKey("pwm");
}

function setFeed(){
  val = $(this).val();
  config.put("feed", val);
  $(this).closest(".counterFeed").find("label").text(val + " mm/min");
}

function getFeed(){
  return config.getByKey("feed");
}

function setStep(){
  val = $(this).val() + " mm";
  $(this).closest(".counterStep").find("label").text(val);
}

function getStep(){
  return $('.tab .counterStep label').text().split(" ")[0];
}

function refreshPorts(){
  var myselect = document.getElementsByClassName("ports")[0];
  serial.getPorts().then(ports => {

    myselect.innerHTML = "";

    var option = document.createElement("option");
    option.innerHTML = "Port is not selected";
    option.setAttribute("value", 0);

    myselect.appendChild(option);

    for(let i = 1; i <= ports.length; i++){
      option = document.createElement("option");
      option.innerHTML = ports[i - 1].path;
      option.setAttribute("value", i);

      myselect.appendChild(option);
    }

    if(ports.length == 1){
      myselect.value = 1;
      setConnection();
    }

  });

}


function getPort(){
  let port = $(".ports option:checked").text();

  if(port != "Port is not selected"){
    return port;
  }else{
    showMsg("Warning", "Port is not selected");
    return false;
  }
}


function setConnection(){
  port = getPort();
  if(port){
    serial.close().then(() => {

      serial.getConnection(port)

    });
  }
  else{
    serial.close();
  }
}



$(".switch.darkmode").find("input").change(function() {
  if (this.checked) {//dark
    config.put("darkmode", true);
    document.documentElement.style.setProperty('--bg', '#484848');
    document.documentElement.style.setProperty('--bgSide', '#212121');
    document.documentElement.style.setProperty('--bgHead', '#424141');
    document.documentElement.style.setProperty('--bgContent', '#212121');
    document.documentElement.style.setProperty('--txt', '#d4cdcd');
  } else {//white
    config.put("darkmode", false);
    document.documentElement.style.setProperty('--bg', '#ececec');
    document.documentElement.style.setProperty('--bgSide', '#FFFFFF');
    document.documentElement.style.setProperty('--bgHead', '#e5e5e5');
    document.documentElement.style.setProperty('--bgContent', '#FFFFFF');
    document.documentElement.style.setProperty('--txt', '#000000');
  }
});

$(".switch.stickyRuler").find("input").change(function() {

  let field = $(".stickyRulerSize");

  if (this.checked) {//sticky
    config.put("stickyRuler", true);
    field.prop('disabled', false);
    if(getStickyRulerSize().isPositiveNum()){
      renderGrid();
    }else{
      clearGrid();
    }
  } else {//not sticky
    config.put("stickyRuler", false);
    field.prop('disabled', true);
    clearGrid();
  }
});
