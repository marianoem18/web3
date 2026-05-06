# 🔐 Web3 Access Control DApp

Aplicación descentralizada (DApp) que permite gestionar permisos de acceso en la blockchain mediante un smart contract.
Incluye un panel administrativo y conexión de wallets compatible con desktop y mobile.

---

## 🚀 Demo

👉 Deploy: web3-mu-amber.vercel.app

---

## 🧠 Descripción

Este proyecto implementa un sistema de control de acceso on-chain donde:

- Un **owner (administrador)** puede autorizar o revocar direcciones
- Los usuarios pueden consultar su estado en la blockchain
- Toda la lógica crítica se ejecuta en un **smart contract**

La app está diseñada como una DApp completa, incluyendo:

- Contrato inteligente
- Frontend Web3
- Integración con wallets reales

---

## 🛠️ Tecnologías utilizadas

### Frontend

- React
- TailwindCSS
- Ethers.js
- Web3Modal (WalletConnect)

### Blockchain

- Solidity
- Hardhat
- Red: Sepolia (testnet)

### Deploy

- Vercel

---

## 🔗 Funcionalidades

### 👑 Panel de administrador

- Autorizar direcciones
- Revocar acceso
- Validación de permisos (solo owner)

### 👤 Usuario

- Conectar wallet (MetaMask / WalletConnect)
- Consultar estado de autorización

---

## 🔐 Smart Contract

Funciones principales:

```solidity
function authorize(address user)
function revoke(address user)
function isAuthorized(address user) view returns (bool)
function owner() view returns (address)
```

📍 Contrato deployado en Sepolia:
`0x99844e61B1BDBfBE21bE86A553c94DdEd0177f14`

---

## 📦 Instalación local

```bash
git clone https://github.com/marianoem18/web3.git
cd web3/frontend
npm install
npm start
```

---

## ⚙️ Configuración

El proyecto utiliza WalletConnect mediante Web3Modal.

Para usar tu propio Project ID:

1. Crear cuenta en WalletConnect Cloud
2. Reemplazar:

```js
const projectId = "TU_PROJECT_ID";
```

---

## 📱 Compatibilidad

- ✅ Desktop (MetaMask)
- ✅ Mobile (WalletConnect)
- ❌ No depende de Hardhat local (deploy real en testnet)

---

## 🧪 Testing

El contrato fue probado en entorno local con Hardhat y luego deployado en testnet para validación real.

---

## 🎯 Objetivo del proyecto

Este proyecto fue desarrollado como parte de mi formación como programador, con el objetivo de:

- Comprender el flujo completo de una DApp
- Integrar smart contracts con frontend
- Manejar conexión de wallets en distintos entornos
- Resolver problemas reales de deploy Web3

---

## 🧠 Aprendizajes clave

- Integración de Ethers v6 con frontend
- Uso de WalletConnect para mobile
- Deploy de contratos en testnet
- Manejo de estados asincrónicos en Web3
- Resolución de errores en producción (Vercel + ESLint)

---

## 📄 Licencia

MIT

---

## 👨‍💻 Autor

**Mariano González**
Técnico Universitario en Programación

GitHub: https://github.com/marianoem18
