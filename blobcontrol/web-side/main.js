
socket = io.connect("http://" + ipAddress, {port: 8081, rememberTransport: false});
console.log('oi');
var init = false;
socket.on('connect', function() {
    // sends to socket.io server the host/port of oscServer
    // and oscClient
    socket.emit('config',
        {
            server: {
                port: 3343,
                host: ipAddress
            },
            client: {
                port: 3344,
                host: ipAddress
            }
        }
    );
    console.log(socket.socket.sessionid);
    socket.emit('message', '/create cube|' + socket.socket.sessionid);
    init = true;
});

socket.on('message', function(obj) {
    var status = document.getElementById("status");
    status.innerHTML = obj[0];
    console.log(obj);
});
var degtorad = Math.PI / 180; // Degree-to-Radian conversion

var currentAccel = {
    x: 0,
    y: 0,
    z: 0
};
var kFilteringFactor = 0.1;
function getAccelerationWithoutGravity(acceleration) {
    var netAcceleration = {};
    // Use a basic low-pass filter to keep only the gravity component of each axis.
    currentAccel.x = (acceleration.x * kFilteringFactor) + (currentAccel.x * (1.0 - kFilteringFactor));
    currentAccel.y = (acceleration.y * kFilteringFactor) + (currentAccel.y * (1.0 - kFilteringFactor));
    currentAccel.z = (acceleration.z * kFilteringFactor) + (currentAccel.z * (1.0 - kFilteringFactor));
    netAcceleration.x = (acceleration.x - currentAccel.x).toFixed(1);
    netAcceleration.y = (acceleration.y - currentAccel.y).toFixed(1);
    netAcceleration.z = (acceleration.z - currentAccel.z).toFixed(1);
    return netAcceleration;
}
//function highPassFilter(acceleration) {
//    //shows a simplified high-pass filter computation with constant effect of gravity.
//    //Getting the instantaneous portion of movement from accelerometer data
//    // Subtract the low-pass value from the current value to get a simplified high-pass filter
//    accelX = acceleration.x - ((acceleration.x * kFilteringFactor) + (accelX * (1.0 - kFilteringFactor)));
//    accelY = acceleration.y - ((acceleration.y * kFilteringFactor) + (accelY * (1.0 - kFilteringFactor)));
//    accelZ = acceleration.z - ((acceleration.z * kFilteringFactor) + (accelZ * (1.0 - kFilteringFactor)));
//}

function getQuaternion(alpha, beta, gamma) {

    var _x = beta ? beta * degtorad : 0; // beta value
    var _y = gamma ? gamma * degtorad : 0; // gamma value
    var _z = alpha ? alpha * degtorad : 0; // alpha value

    var cX = Math.cos(_x / 2);
    var cY = Math.cos(_y / 2);
    var cZ = Math.cos(_z / 2);
    var sX = Math.sin(_x / 2);
    var sY = Math.sin(_y / 2);
    var sZ = Math.sin(_z / 2);

    //
    // ZXY quaternion construction.
    //

    var w = cX * cY * cZ - sX * sY * sZ;
    var x = sX * cY * cZ - cX * sY * sZ;
    var y = cX * sY * cZ + sX * cY * sZ;
    var z = cX * cY * sZ + sX * sY * cZ;

    return [w, x, y, z];

}

gyro.frequency = 40;

var wrapper = document.getElementById('wrapper');

gyro.startTracking(function(o) {
    if (!init)
        return;
    // o.x, o.y, o.z for accelerometer
    // o.alpha, o.beta, o.gamma for gyro
    document.getElementById('accel').innerHTML = "x: " + o.x + "<br>" +
        "y: " + o.y + "<br>" +
        "z: " + o.z + "<br>" +
        "alpha: " + o.alpha + "<br>" +
        "beta: " + o.beta + "<br>" +
        "gamma: " + o.gamma;
    //var q = getQuaternion(o.alpha, o.beta, o.gamma);
    //        socket.emit('message', '/x ' + o.x);
    //        socket.emit('message', '/y ' + o.y);
    //        socket.emit('message', '/z ' + o.z);
    var netAcceleration = getAccelerationWithoutGravity(o);
    socket.emit('message', '/rot ' + o.alpha + "|" + o.beta + "|" + o.gamma + "|" + socket.socket.sessionid);
    socket.emit('message', '/acc ' + netAcceleration.x + "|" + netAcceleration.y + "|" + netAcceleration.z + "|" + socket.socket.sessionid);

    var accel = document.getElementById('accel');
    accel.innerHTML = "x: " + o.x + "<br>" +
        "y: " + o.y + "<br>" +
        "z: " + o.z + "<br>" +
        "netX: " + netAcceleration.x + "<br>" +
        "netY: " + netAcceleration.y + "<br>" +
        "netZ: " + netAcceleration.z + "<br>" +
        "alpha: " + o.alpha + "<br>" +
        "beta: " + o.beta + "<br>" +
        "gamma: " + o.gamma + "<br>";

//    accel.style.webkitTransform = "perspective(500) " +
//        "rotateZ(" + o.alpha + "deg) " +
//        "rotateX(" + o.beta + "deg) " +
//        "rotateY(" + o.gamma + "deg)";
//    accel.style.transform = "perspective(500) " +
//        "rotateZ(" + o.alpha + "deg) " +
//        "rotateX(" + o.beta + "deg) " +
//        "rotateY(" + o.gamma + "deg)";

//                    wrapper.style.backgroundColor = "rgb(" +
//                        Math.abs(o.alpha * 0.7).toFixed(0) + ", " +
//                        Math.abs(o.beta * 0.7).toFixed(0) + ", " +
//                        Math.abs(o.gamma * 0.7).toFixed(0) + ")";
    wrapper.style.backgroundColor = "hsl(" +
        Math.abs(o.alpha).toFixed(0) + ", " +
        "80%, " +
        "65%)";

    //wrapper.style.background = "rgb(255, 0, 0)";
});