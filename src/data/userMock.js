// src/data/usersMock.js

let users = [];

// Carrega usuários do localStorage ao inicializar
if (typeof window !== 'undefined') { // Garante que está no navegador
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    users = JSON.parse(storedUsers);
  }
}

export const getUsers = () => {
  return users;
};

export const registerUser = (newUser) => {
  const existingUser = users.find(user => user.email === newUser.email);
  if (existingUser) {
    throw new Error('Este e-mail já está em uso. Por favor, use outro.');
  }

  newUser.id = Date.now();
  users.push(newUser);

  if (typeof window !== 'undefined') {
    localStorage.setItem('users', JSON.stringify(users));
  }
  return newUser;
};