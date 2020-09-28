const users = {};

// Join user

function userJoim(id, userName, room) {
  const user = { id, userName, room };
  users.push(user);

  return user;
}

// Get current User
function getCurrentUSer(id){
return users.find(user => userid ===id)
}

module.exports = {userJoin , getCurrentUSer};