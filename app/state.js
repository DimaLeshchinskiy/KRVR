var position = [0, 0, 0] //x,y,z

exports.getPosition = () => {return position};
exports.getX = () => {return position[0]};
exports.getY = () => {return position[1]};
exports.getZ = () => {return position[2]};

exports.setPosition = (newPosition) => {position = newPosition};
exports.setX = (newX) => {position[0] = newX};
exports.setY = (newY) => {position[1] = newY};
exports.setZ = (newZ) => {position[2] = newZ};

exports.addX = (addX) => {position[0] += addX};
exports.addY = (addY) => {position[1] += addY};
exports.adZ = (addZ) => {position[2] += addZ};

exports.print = () => {console.log(position)};
