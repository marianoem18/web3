async function main() {
    const AccessControl = await ethers.getContractFactory("AccessControl");
    
    const contract = await AccessControl.deploy();

    await contract.waitForDeployment(); // 👈 cambio acá

    console.log("Contrato deployado en:", await contract.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});