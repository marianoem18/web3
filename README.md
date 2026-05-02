# 🔐 Web3 Access Control DApp

Aplicación descentralizada (DApp) que implementa un sistema de control de acceso basado en blockchain utilizando smart contracts y autenticación mediante wallet.

---

## 🚀 Demo

web3-mu-amber.vercel.app

---

## 🧠 Descripción

Este proyecto permite gestionar accesos de usuarios mediante direcciones de wallet en una red blockchain.

Un administrador (owner del contrato) puede autorizar o revocar permisos, mientras que los usuarios pueden verificar su estado de acceso en tiempo real.

---

## ⚙️ Tecnologías utilizadas

* **Solidity** → desarrollo del smart contract
* **Hardhat** → entorno de desarrollo y testing
* **React** → frontend de la aplicación
* **Ethers.js** → interacción con blockchain
* **Tailwind CSS** → diseño y UI
* **MetaMask** → autenticación de usuarios

---

## 🔐 Funcionalidades

* Conexión de wallet mediante MetaMask
* Autorización de usuarios (solo admin)
* Revocación de permisos
* Verificación de estado de acceso
* Control de roles (owner vs usuario)
* Interfaz moderna y responsive

---

## 🧩 Arquitectura

```
Usuario (MetaMask)
        ↓
Frontend (React + Ethers)
        ↓
Smart Contract (Solidity)
        ↓
Blockchain (Hardhat / Testnet)
```

---

## 🧪 Entorno de desarrollo

Este proyecto fue desarrollado utilizando una blockchain local con Hardhat.

### Ejecutar localmente:

```bash
# backend
npx hardhat node

# deploy contrato
npx hardhat run scripts/deploy.js --network localhost

# frontend
cd frontend
npm start
```

---

## 🌐 Posibles casos de uso

* Control de acceso en aplicaciones SaaS
* Sistemas de membresía (ej: gimnasios)
* Comunidades privadas
* Whitelists en proyectos Web3

---

## 📌 Mejoras futuras

* Deploy en testnet (Sepolia)
* Persistencia de datos off-chain
* Sistema de autenticación sin transacción (firma)
* UI/UX avanzada
* Dashboard administrativo

---

## 👨‍💻 Autor

Desarrollado por Mariano

---

## 📄 Licencia

MIT
